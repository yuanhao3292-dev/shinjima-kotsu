/**
 * 验证数据库触发器和表状态
 *
 * 运行: cd /Users/yuanhao/Developer/repos/shinjima-kotsu && node scripts/verify-triggers.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function verify() {
  console.log('🔍 开始验证推荐奖励系统数据库状态...\n');

  // 1. 检查 referral_rewards 表是否存在
  console.log('--- 检查 1: referral_rewards 表 ---');
  const { data: rewardsTest, error: rewardsError } = await supabase
    .from('referral_rewards')
    .select('id')
    .limit(1);

  if (rewardsError) {
    console.log('❌ referral_rewards 表不存在或无法访问:', rewardsError.message);
  } else {
    console.log('✅ referral_rewards 表存在，当前记录数:', rewardsTest?.length || 0);
  }

  // 2. 检查 referral_rewards 表完整记录数
  const { count, error: countError } = await supabase
    .from('referral_rewards')
    .select('*', { count: 'exact', head: true });

  if (!countError) {
    console.log(`   总记录数: ${count || 0}`);
  }

  // 3. 检查 guides 表中有 referrer_id 的记录
  console.log('\n--- 检查 2: 推荐关系 ---');
  const { data: guidesWithReferrer, error: guidesError } = await supabase
    .from('guides')
    .select('id, name, referrer_id')
    .not('referrer_id', 'is', null);

  if (guidesError) {
    console.log('❌ 查询失败:', guidesError.message);
  } else {
    console.log(`✅ 有推荐人的导游数量: ${guidesWithReferrer?.length || 0}`);
    if (guidesWithReferrer && guidesWithReferrer.length > 0) {
      guidesWithReferrer.forEach(g => {
        console.log(`   - ${g.name} (referrer_id: ${g.referrer_id})`);
      });
    }
  }

  // 4. 检查已完成的预约（有 commission_amount 的）
  console.log('\n--- 检查 3: 已计算佣金的预约 ---');
  const { data: completedBookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, guide_id, customer_name, commission_amount, commission_status, actual_spend')
    .eq('commission_status', 'calculated')
    .limit(10);

  if (bookingsError) {
    console.log('❌ 查询失败:', bookingsError.message);
  } else {
    console.log(`✅ 已计算佣金的预约数量: ${completedBookings?.length || 0}`);
    if (completedBookings && completedBookings.length > 0) {
      completedBookings.forEach(b => {
        console.log(`   - ${b.customer_name}: 消费 ¥${b.actual_spend}, 佣金 ¥${b.commission_amount}, 状态: ${b.commission_status}`);
      });
    }
  }

  // 5. 间接验证触发器 - 检查是否有 commission_status='calculated' 但 commission_amount IS NULL 的记录
  console.log('\n--- 检查 4: 触发器运行证据 ---');
  const { data: withSpend, error: spendError } = await supabase
    .from('bookings')
    .select('id, actual_spend, commission_amount, commission_status')
    .not('actual_spend', 'is', null)
    .limit(5);

  if (!spendError && withSpend && withSpend.length > 0) {
    const triggerWorking = withSpend.some(b => b.commission_status === 'calculated' && b.commission_amount != null);
    const triggerBroken = withSpend.some(b => b.actual_spend != null && b.commission_status !== 'calculated');

    if (triggerWorking) {
      console.log('✅ calculate_commission 触发器似乎正常（有记录自动计算了佣金）');
    } else if (triggerBroken) {
      console.log('⚠️  有 actual_spend 但 commission_status 未变为 calculated，触发器可能未部署');
    } else {
      console.log('ℹ️  无法确定（数据不足）');
    }

    withSpend.forEach(b => {
      console.log(`   - actual_spend: ¥${b.actual_spend}, commission_amount: ${b.commission_amount ? '¥' + b.commission_amount : 'NULL'}, status: ${b.commission_status}`);
    });
  } else {
    console.log('ℹ️  暂无已填写消费金额的预约，无法间接验证触发器');
  }

  // 6. 检查 referral_rewards 是否有记录（触发器运行证据）
  console.log('\n--- 检查 5: create_referral_reward 触发器证据 ---');
  const { data: rewards, error: rewardsErr } = await supabase
    .from('referral_rewards')
    .select('*')
    .limit(5);

  if (!rewardsErr) {
    if (rewards && rewards.length > 0) {
      console.log('✅ referral_rewards 表有数据，触发器已运行过');
      rewards.forEach(r => {
        console.log(`   - referrer: ${r.referrer_id}, amount: ¥${r.reward_amount}, status: ${r.status}`);
      });
    } else {
      console.log('ℹ️  referral_rewards 表为空（可能触发器未部署，或尚无满足条件的数据）');
    }
  }

  console.log('\n========================================');
  console.log('🏁 验证完成');
  console.log('========================================');
  console.log('\n如果发现触发器未部署，请在 Supabase SQL Editor 中执行:');
  console.log('scripts/migration-referral-rewards-trigger.sql');
}

verify().catch(err => {
  console.error('验证脚本出错:', err.message);
  process.exit(1);
});
