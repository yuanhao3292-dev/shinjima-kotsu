require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  // 1. 检查最近订单
  console.log('=== 最近10条订单 ===');
  const { data: orders, error: ordErr } = await supabase
    .from('orders')
    .select('id, package_id, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  if (ordErr) {
    console.log('Error:', ordErr.message);
  } else if (orders.length === 0) {
    console.log('没有订单');
  } else {
    orders.forEach(o => console.log(o.id, o.package_id, o.status, o.created_at));
  }

  // 2. 检查 orders 表列名
  console.log('\n=== orders 表列名 ===');
  const { data: sampleOrder } = await supabase.from('orders').select('*').limit(1);
  if (sampleOrder && sampleOrder.length > 0) {
    console.log(Object.keys(sampleOrder[0]).join(', '));
  } else {
    console.log('orders 表为空');
  }

  // 3. 检查 2/23 之后的订单
  console.log('\n=== 2/23 之后的订单 ===');
  const { data: recentOrders, error: recentErr } = await supabase
    .from('orders')
    .select('id, package_id, created_at')
    .gte('created_at', '2026-02-23T00:00:00')
    .limit(5);
  if (recentErr) {
    console.log('Error:', recentErr.message);
  } else if (recentOrders.length === 0) {
    console.log('没有');
  } else {
    recentOrders.forEach(o => console.log(o.id, o.package_id, o.created_at));
  }

  // 4. 检查当前 medical_packages 的 ID
  console.log('\n=== 当前 medical_packages IDs ===');
  const { data: pkgs } = await supabase
    .from('medical_packages')
    .select('id, name_zh');
  if (pkgs) {
    pkgs.forEach(p => console.log(p.id, p.name_zh));
  }
})();
