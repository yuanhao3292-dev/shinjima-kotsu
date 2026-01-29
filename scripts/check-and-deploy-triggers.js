/**
 * 检查并部署推荐奖励触发器
 *
 * 1. 通过创建临时 RPC 函数检查触发器是否存在
 * 2. 如果不存在，部署完整的触发器
 *
 * 运行: cd /Users/yuanhao/Developer/repos/shinjima-kotsu && node scripts/check-and-deploy-triggers.js
 */

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 从 URL 提取项目 ref
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
console.log(`📡 项目: ${projectRef}\n`);

/**
 * 通过 Supabase REST API 执行 SQL
 * 使用 pg_net 或直接通过 PostgREST RPC
 */
async function executeSql(sql) {
  // 尝试方式1：通过 /pg (Supabase SQL API) - 仅新版本支持
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ sql_query: sql }),
    });

    if (response.ok) {
      return { success: true, data: await response.json() };
    }

    // exec_sql RPC 不存在，尝试创建
    if (response.status === 404) {
      return { success: false, error: 'exec_sql RPC 不存在' };
    }

    const errorData = await response.text();
    return { success: false, error: errorData };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * 通过创建临时检查函数来验证触发器
 */
async function checkTriggersViaFunction() {
  // 首先尝试创建一个检查函数
  const createCheckFn = `
    CREATE OR REPLACE FUNCTION _temp_check_triggers()
    RETURNS TABLE(trigger_name TEXT, event_object_table TEXT) AS $$
    BEGIN
      RETURN QUERY
      SELECT tgname::TEXT, tgrelid::regclass::TEXT
      FROM pg_trigger
      WHERE tgname IN (
        'trigger_calculate_commission',
        'trigger_update_guide_stats',
        'trigger_create_referral_reward'
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  const createResult = await executeSql(createCheckFn);
  if (!createResult.success) {
    return null; // exec_sql 不可用
  }

  // 调用检查函数
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data, error } = await supabase.rpc('_temp_check_triggers');

  // 清理临时函数
  await executeSql('DROP FUNCTION IF EXISTS _temp_check_triggers();');

  if (error) {
    return null;
  }

  return data;
}

/**
 * 部署触发器（通过 exec_sql RPC）
 */
async function deployTriggers() {
  const triggerSQLs = [
    // 1. create_referral_reward 函数（改进版）
    `CREATE OR REPLACE FUNCTION create_referral_reward()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.commission_status = 'calculated'
         AND (OLD.commission_status IS NULL OR OLD.commission_status != 'calculated')
         AND NEW.commission_amount IS NOT NULL
         AND NEW.commission_amount > 0 THEN
        IF NOT EXISTS (
          SELECT 1 FROM referral_rewards WHERE booking_id = NEW.id
        ) THEN
          INSERT INTO referral_rewards (
            referrer_id, referee_id, booking_id,
            reward_rate, reward_amount, reward_type, status
          )
          SELECT
            g.referrer_id, NEW.guide_id, NEW.id,
            0.02, NEW.commission_amount * 0.02, 'commission', 'pending'
          FROM guides g
          WHERE g.id = NEW.guide_id
            AND g.referrer_id IS NOT NULL;
        END IF;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`,

    // 2. 删除旧触发器
    `DROP TRIGGER IF EXISTS trigger_create_referral_reward ON bookings;`,

    // 3. 创建新触发器
    `CREATE TRIGGER trigger_create_referral_reward
      AFTER UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION create_referral_reward();`,

    // 4. 确保索引存在
    `CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer ON referral_rewards(referrer_id);`,
    `CREATE INDEX IF NOT EXISTS idx_referral_rewards_referee ON referral_rewards(referee_id);`,
    `CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON referral_rewards(status);`,
  ];

  let success = 0;
  let failed = 0;

  for (let i = 0; i < triggerSQLs.length; i++) {
    const result = await executeSql(triggerSQLs[i]);
    if (result.success) {
      success++;
      const preview = triggerSQLs[i].substring(0, 50).replace(/\n/g, ' ').trim();
      console.log(`  ✅ [${i + 1}/${triggerSQLs.length}] ${preview}...`);
    } else {
      failed++;
      console.log(`  ❌ [${i + 1}/${triggerSQLs.length}] 失败: ${result.error}`);
    }
  }

  return { success, failed };
}

async function main() {
  console.log('🔍 步骤 1: 检查数据库触发器状态...\n');

  // 尝试通过 RPC 检查
  const triggers = await checkTriggersViaFunction();

  if (triggers !== null) {
    // exec_sql 可用
    console.log('已找到的触发器:');
    const expected = [
      'trigger_calculate_commission',
      'trigger_update_guide_stats',
      'trigger_create_referral_reward'
    ];

    const found = triggers.map(t => t.trigger_name);

    expected.forEach(name => {
      if (found.includes(name)) {
        console.log(`  ✅ ${name}`);
      } else {
        console.log(`  ❌ ${name} — 未找到`);
      }
    });

    const missing = expected.filter(name => !found.includes(name));

    if (missing.length === 0) {
      console.log('\n🎉 所有触发器已存在！无需部署。');
      return;
    }

    console.log(`\n⚠️  缺少 ${missing.length} 个触发器，开始部署...\n`);

    // 部署缺失的触发器
    if (missing.includes('trigger_create_referral_reward')) {
      console.log('🚀 步骤 2: 部署 create_referral_reward 触发器...\n');
      const result = await deployTriggers();
      console.log(`\n结果: ✅ ${result.success} 成功, ❌ ${result.failed} 失败`);
    }

    if (missing.includes('trigger_calculate_commission') || missing.includes('trigger_update_guide_stats')) {
      console.log('\n⚠️  calculate_commission 或 update_guide_stats 触发器也缺失');
      console.log('请在 Supabase SQL Editor 中手动执行 guide-partner-schema.sql 的触发器部分');
    }

  } else {
    // exec_sql 不可用，尝试直接部署
    console.log('ℹ️  exec_sql RPC 不可用，尝试创建...\n');

    // 创建 exec_sql 函数
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 尝试通过 Supabase 的 SQL endpoint
    console.log('尝试通过 REST API 部署触发器...');

    // 直接尝试部署，使用 REST API 的 POST 方法
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    console.log('\n========================================');
    console.log('❌ 无法通过 REST API 直接执行 SQL');
    console.log('========================================\n');
    console.log('请手动在 Supabase SQL Editor 中执行以下操作:');
    console.log('');
    console.log('1. 打开 https://supabase.com/dashboard/project/' + projectRef + '/sql');
    console.log('2. 复制并执行 scripts/migration-referral-rewards-trigger.sql');
    console.log('');
    console.log('或者执行以下 SQL 来检查触发器:');
    console.log('');
    console.log(`SELECT tgname FROM pg_trigger
WHERE tgname IN (
  'trigger_calculate_commission',
  'trigger_update_guide_stats',
  'trigger_create_referral_reward'
);`);
  }
}

main().catch(err => {
  console.error('脚本出错:', err.message);
});
