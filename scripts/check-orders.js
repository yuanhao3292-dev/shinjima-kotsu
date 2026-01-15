/**
 * 查看最新的订单记录
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkOrders() {
  console.log('📊 查询最新订单...\n');

  // 查询订单
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (name, email),
      medical_packages (name_zh_tw, price_jpy)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ 查询失败:', error);
    return;
  }

  if (!orders || orders.length === 0) {
    console.log('📭 暂无订单记录');
    return;
  }

  console.log(`✅ 发现 ${orders.length} 个订单:\n`);
  console.log('='.repeat(80));

  orders.forEach((order, index) => {
    console.log(`\n订单 ${index + 1}:`);
    console.log(`  订单号: ${order.order_number}`);
    console.log(`  客户: ${order.customers?.name} (${order.customers?.email})`);
    console.log(`  套餐: ${order.medical_packages?.name_zh_tw}`);
    console.log(`  金额: ¥${order.total_amount_jpy.toLocaleString()}`);
    console.log(`  状态: ${order.status}`);
    console.log(`  创建时间: ${new Date(order.created_at).toLocaleString('zh-CN')}`);
    console.log(`  Checkout Session: ${order.checkout_session_id || '无'}`);
    console.log(`  Payment Intent: ${order.payment_intent_id || '无'}`);

    if (order.preferred_date) {
      console.log(`  希望体检日期: ${order.preferred_date} ${order.preferred_time || ''}`);
    }

    if (order.notes) {
      console.log(`  备注: ${order.notes}`);
    }
  });

  console.log('\n' + '='.repeat(80));
}

checkOrders();
