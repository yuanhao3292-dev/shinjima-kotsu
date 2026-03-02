/**
 * 为所有 medical_packages 创建 Stripe Product + Price 并更新数据库
 * 在 SQL 恢复脚本执行完成后运行此脚本
 *
 * 用法: node scripts/restore-stripe-prices.js
 */
require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function restoreStripePrices() {
  console.log('========================================');
  console.log('恢复所有套餐的 Stripe Product + Price');
  console.log('========================================\n');

  // 获取所有活跃套餐（没有 stripe_price_id 的）
  const { data: packages, error } = await supabase
    .from('medical_packages')
    .select('id, slug, name_zh_tw, name_ja, name_en, price_jpy')
    .eq('is_active', true)
    .is('stripe_price_id', null)
    .order('display_order');

  if (error) {
    console.error('查询失败:', error.message);
    process.exit(1);
  }

  console.log(`需要创建 Stripe 价格的套餐: ${packages.length} 个\n`);

  let success = 0;
  let failed = 0;

  for (const pkg of packages) {
    const displayName = `${pkg.name_zh_tw} (${pkg.name_ja})`;
    console.log(`📌 ${pkg.slug} — ¥${pkg.price_jpy.toLocaleString()}`);
    console.log(`   ${displayName}`);

    try {
      // 创建 Stripe Product
      const product = await stripe.products.create({
        name: displayName,
        metadata: {
          slug: pkg.slug,
          db_id: pkg.id,
        },
      });
      console.log(`   ✓ Product: ${product.id}`);

      // 创建 Stripe Price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: pkg.price_jpy,
        currency: 'jpy',
        metadata: {
          slug: pkg.slug,
        },
      });
      console.log(`   ✓ Price: ${price.id}`);

      // 更新数据库
      const { error: updateError } = await supabase
        .from('medical_packages')
        .update({
          stripe_price_id: price.id,
          stripe_product_id: product.id,
        })
        .eq('id', pkg.id);

      if (updateError) {
        console.log(`   ✗ DB 更新失败: ${updateError.message}`);
        failed++;
      } else {
        console.log(`   ✓ DB 已更新`);
        success++;
      }
    } catch (stripeError) {
      console.log(`   ✗ Stripe 错误: ${stripeError.message}`);
      failed++;
    }

    console.log('');
  }

  // 验证
  console.log('========================================');
  console.log('验证所有套餐...');
  console.log('========================================\n');

  const { data: allPkgs } = await supabase
    .from('medical_packages')
    .select('slug, stripe_price_id, price_jpy, is_active')
    .eq('is_active', true)
    .order('display_order');

  for (const p of allPkgs) {
    if (!p.stripe_price_id) {
      console.log(`✗ ${p.slug} — 无 Stripe Price ID`);
      continue;
    }
    try {
      const stripePrice = await stripe.prices.retrieve(p.stripe_price_id);
      const match = stripePrice.unit_amount === p.price_jpy;
      console.log(`${match ? '✓' : '✗'} ${p.slug} — DB:¥${p.price_jpy} Stripe:¥${stripePrice.unit_amount}`);
    } catch (err) {
      console.log(`✗ ${p.slug} — Stripe 验证失败: ${err.message}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`完成: ${success} 成功, ${failed} 失败`);
  console.log(`========================================`);
}

restoreStripePrices().catch(console.error);
