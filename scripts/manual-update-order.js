/**
 * 手动更新订单状态为 paid
 * 用于测试 Webhook 功能（在配置真正的 Webhook 之前）
 *
 * 用法: node scripts/manual-update-order.js TIMC2601130002
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateOrderToPaid(orderNumber) {
  if (!orderNumber) {
    console.error('❌ 错误: 请提供订单号');
    console.log('\n用法: node scripts/manual-update-order.js TIMC2601130002');
    process.exit(1);
  }

  console.log(`🔄 正在更新订单 ${orderNumber} 的状态...\n`);

  try {
    // 1. 查找订单
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (findError || !order) {
      console.error(`❌ 找不到订单: ${orderNumber}`);
      process.exit(1);
    }

    console.log('📋 订单信息:');
    console.log(`  订单号: ${order.order_number}`);
    console.log(`  当前状态: ${order.status}`);
    console.log(`  金额: ¥${order.total_amount_jpy.toLocaleString()}`);

    if (order.status === 'paid') {
      console.log('\n⚠️  订单已经是 paid 状态，无需更新');
      return;
    }

    // 2. 更新订单状态
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_intent_id: 'pi_manual_test_' + Date.now(),
        paid_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('❌ 更新失败:', updateError);
      process.exit(1);
    }

    // 3. 创建支付记录
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        stripe_payment_intent_id: 'pi_manual_test_' + Date.now(),
        amount_jpy: order.total_amount_jpy,
        currency: 'jpy',
        status: 'succeeded',
        payment_method: 'card',
        metadata: { manual_test: true }
      });

    if (paymentError) {
      console.warn('⚠️  创建支付记录失败:', paymentError.message);
    }

    console.log('\n✅ 订单状态已更新为 paid!');
    console.log('✅ 支付记录已创建');

    // 4. 验证更新
    const { data: updatedOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    console.log('\n📊 更新后的订单信息:');
    console.log(`  订单号: ${updatedOrder.order_number}`);
    console.log(`  状态: ${updatedOrder.status}`);
    console.log(`  支付时间: ${new Date(updatedOrder.paid_at).toLocaleString('zh-CN')}`);
    console.log(`  Payment Intent ID: ${updatedOrder.payment_intent_id}`);

    console.log('\n🎉 完成！您可以运行以下命令查看所有订单:');
    console.log('   node scripts/check-orders.js\n');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    process.exit(1);
  }
}

// 从命令行参数获取订单号
const orderNumber = process.argv[2];
updateOrderToPaid(orderNumber);
