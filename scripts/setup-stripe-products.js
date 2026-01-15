/**
 * 在 Stripe 中创建医疗套餐产品和价格
 * 并更新数据库中的 stripe_product_id 和 stripe_price_id
 *
 * 用法: node scripts/setup-stripe-products.js
 */

const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

// 初始化 Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupStripeProducts() {
  console.log('🚀 开始创建 Stripe 产品和价格...\n');

  try {
    // 1. 从数据库获取所有套餐
    const { data: packages, error: fetchError } = await supabase
      .from('medical_packages')
      .select('*')
      .order('price_jpy', { ascending: false });

    if (fetchError) {
      throw new Error(`获取套餐失败: ${fetchError.message}`);
    }

    if (!packages || packages.length === 0) {
      throw new Error('数据库中没有套餐数据');
    }

    console.log(`📦 发现 ${packages.length} 个套餐\n`);

    // 2. 为每个套餐创建 Stripe 产品和价格
    for (const pkg of packages) {
      console.log(`\n处理套餐: ${pkg.name_zh_tw}`);
      console.log(`  价格: ¥${pkg.price_jpy.toLocaleString()}`);

      // 检查是否已经有 Stripe 产品
      if (pkg.stripe_product_id) {
        console.log(`  ⚠️  已存在 Stripe 产品 ID: ${pkg.stripe_product_id}`);
        continue;
      }

      // 创建 Stripe 产品
      console.log('  📝 创建 Stripe 产品...');
      const product = await stripe.products.create({
        name: pkg.name_zh_tw,
        description: pkg.description_zh_tw || `${pkg.name_zh_tw} - TIMC 医疗体检套餐`,
        metadata: {
          package_slug: pkg.slug,
          category: pkg.category,
          supabase_id: pkg.id
        }
      });

      console.log(`  ✅ 产品已创建: ${product.id}`);

      // 创建 Stripe 价格
      console.log('  💰 创建 Stripe 价格...');
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: pkg.price_jpy, // Stripe 以最小货币单位计价（日元）
        currency: 'jpy',
        metadata: {
          package_slug: pkg.slug
        }
      });

      console.log(`  ✅ 价格已创建: ${price.id}`);

      // 更新数据库中的 Stripe ID
      console.log('  🔄 更新数据库...');
      const { error: updateError } = await supabase
        .from('medical_packages')
        .update({
          stripe_product_id: product.id,
          stripe_price_id: price.id
        })
        .eq('id', pkg.id);

      if (updateError) {
        console.error(`  ❌ 数据库更新失败:`, updateError.message);
      } else {
        console.log(`  ✅ 数据库已更新`);
      }

      console.log(`  ✨ 套餐 "${pkg.name_zh_tw}" 设置完成！`);
    }

    // 3. 验证所有套餐都已关联 Stripe
    console.log('\n\n🔍 验证 Stripe 产品关联...\n');
    const { data: verifyPackages } = await supabase
      .from('medical_packages')
      .select('slug, name_zh_tw, price_jpy, stripe_product_id, stripe_price_id')
      .order('price_jpy', { ascending: false });

    console.log('套餐 ID 映射:');
    console.log('─'.repeat(80));
    verifyPackages.forEach(pkg => {
      console.log(`${pkg.name_zh_tw}`);
      console.log(`  Slug: ${pkg.slug}`);
      console.log(`  价格: ¥${pkg.price_jpy.toLocaleString()}`);
      console.log(`  Product ID: ${pkg.stripe_product_id || '❌ 未设置'}`);
      console.log(`  Price ID: ${pkg.stripe_price_id || '❌ 未设置'}`);
      console.log('');
    });

    console.log('🎉 Stripe 产品设置完成！\n');
    console.log('📝 下一步:');
    console.log('  1. 在 Stripe Dashboard 查看产品: https://dashboard.stripe.com/test/products');
    console.log('  2. 配置 Stripe Webhook: https://dashboard.stripe.com/test/webhooks');
    console.log('  3. 开发前端支付页面\n');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    console.error('详细错误:', error);
    process.exit(1);
  }
}

// 运行脚本
setupStripeProducts();
