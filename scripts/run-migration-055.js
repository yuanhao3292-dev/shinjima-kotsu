// 运行 055-commission-waiting-period 迁移
// 由于包含 PL/pgSQL 函数和 DO 块，需要逐步执行
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function execSQL(label, sql) {
  console.log(`\n📌 ${label}`);
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.log(`  ⚠ RPC exec_sql 失败: ${error.message}`);
    console.log(`  尝试备用方案...`);
    return false;
  }
  console.log(`  ✓ 成功`);
  return true;
}

async function runMigration() {
  console.log('========================================');
  console.log('运行 055-commission-waiting-period 迁移');
  console.log('========================================\n');

  // Step 1: 添加 commission_available_at 列
  const step1 = await execSQL(
    'Step 1: 添加 commission_available_at 列',
    `ALTER TABLE whitelabel_orders ADD COLUMN IF NOT EXISTS commission_available_at TIMESTAMPTZ;`
  );

  // Step 2: 更新 CHECK 约束
  const step2 = await execSQL(
    'Step 2: 更新 commission_status CHECK 约束',
    `ALTER TABLE whitelabel_orders DROP CONSTRAINT IF EXISTS whitelabel_orders_commission_status_check;
     ALTER TABLE whitelabel_orders ADD CONSTRAINT whitelabel_orders_commission_status_check
       CHECK (commission_status IN ('pending', 'calculated', 'available', 'paid'));`
  );

  // Step 3: 创建索引
  const step3 = await execSQL(
    'Step 3: 创建索引',
    `CREATE INDEX IF NOT EXISTS idx_whitelabel_orders_commission_available
       ON whitelabel_orders(guide_id, commission_status, commission_available_at);`
  );

  // Step 4: 创建 RPC 函数
  const step4 = await execSQL(
    'Step 4: 创建 release_matured_commissions RPC 函数',
    `CREATE OR REPLACE FUNCTION release_matured_commissions(p_guide_id UUID)
RETURNS JSON AS $$
DECLARE
  v_release_amount NUMERIC;
  v_release_count INT;
BEGIN
  SELECT COALESCE(SUM(commission_amount), 0), COUNT(*)
  INTO v_release_amount, v_release_count
  FROM whitelabel_orders
  WHERE guide_id = p_guide_id
    AND commission_status = 'calculated'
    AND commission_available_at IS NOT NULL
    AND commission_available_at <= NOW();

  IF v_release_amount > 0 THEN
    UPDATE whitelabel_orders
    SET commission_status = 'available',
        updated_at = NOW()
    WHERE guide_id = p_guide_id
      AND commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW();

    UPDATE guides
    SET available_balance = COALESCE(available_balance, 0) + v_release_amount,
        updated_at = NOW()
    WHERE id = p_guide_id;

    RAISE NOTICE 'Released commissions: guide=%, amount=%, count=%', p_guide_id, v_release_amount, v_release_count;
  END IF;

  RETURN json_build_object(
    'released_amount', v_release_amount,
    'released_count', v_release_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`
  );

  // Step 5: 回填已有数据
  const step5 = await execSQL(
    'Step 5: 回填已有数据的 commission_available_at',
    `UPDATE whitelabel_orders
     SET commission_available_at = created_at + INTERVAL '14 days'
     WHERE commission_available_at IS NULL
       AND commission_status IN ('calculated', 'paid');`
  );

  // Step 6: 释放已到期的佣金
  const step6 = await execSQL(
    'Step 6: 释放已到期的佣金',
    `DO $$
DECLARE
  guide_rec RECORD;
  v_release_amount NUMERIC;
BEGIN
  FOR guide_rec IN
    SELECT DISTINCT guide_id
    FROM whitelabel_orders
    WHERE commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW()
  LOOP
    SELECT COALESCE(SUM(commission_amount), 0) INTO v_release_amount
    FROM whitelabel_orders
    WHERE guide_id = guide_rec.guide_id
      AND commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW();

    UPDATE whitelabel_orders
    SET commission_status = 'available',
        updated_at = NOW()
    WHERE guide_id = guide_rec.guide_id
      AND commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW();

    UPDATE guides
    SET available_balance = COALESCE(available_balance, 0) + v_release_amount,
        updated_at = NOW()
    WHERE id = guide_rec.guide_id;

    RAISE NOTICE 'Backfill released: guide=%, amount=%', guide_rec.guide_id, v_release_amount;
  END LOOP;
END;
$$;`
  );

  // Step 7: 添加注释
  const step7 = await execSQL(
    'Step 7: 添加列注释',
    `COMMENT ON COLUMN whitelabel_orders.commission_available_at IS '佣金可提现时间（服务完成日期 + 14天等待期）';`
  );

  // 如果 exec_sql RPC 不可用，提示手动执行
  const allSteps = [step1, step2, step3, step4, step5, step6, step7];
  const failedCount = allSteps.filter(s => !s).length;

  if (failedCount > 0) {
    console.log('\n========================================');
    console.log(`⚠ ${failedCount} 个步骤失败（可能是 exec_sql RPC 不存在）`);
    console.log('请在 Supabase Dashboard → SQL Editor 中手动执行:');
    console.log('scripts/migrations/055-commission-waiting-period.sql');
    console.log('========================================');
  } else {
    console.log('\n========================================');
    console.log('✅ 迁移 055 全部完成！');
    console.log('========================================');
  }

  // 验证
  console.log('\n📊 验证结果:');
  const { data: wlCount, error: wlErr } = await supabase
    .from('whitelabel_orders')
    .select('id, commission_status, commission_available_at', { count: 'exact', head: true });

  if (!wlErr) {
    console.log(`  whitelabel_orders 总数: ${wlCount}`);
  }

  const { data: wlSample } = await supabase
    .from('whitelabel_orders')
    .select('id, commission_amount, commission_status, commission_available_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (wlSample) {
    console.log(`  最近 ${wlSample.length} 条记录:`);
    wlSample.forEach(r => {
      console.log(`    ${r.id.slice(0,8)}... | ¥${r.commission_amount} | ${r.commission_status} | avail: ${r.commission_available_at || 'null'}`);
    });
  }

  const { data: guides } = await supabase
    .from('guides')
    .select('id, name, total_commission, available_balance, total_withdrawn')
    .gt('total_commission', 0)
    .limit(5);

  if (guides) {
    console.log(`\n  导游余额:`);
    guides.forEach(g => {
      console.log(`    ${g.name} | 累计: ¥${g.total_commission} | 可提: ¥${g.available_balance} | 已提: ¥${g.total_withdrawn}`);
    });
  }
}

runMigration().catch(err => {
  console.error('迁移失败:', err);
  process.exit(1);
});
