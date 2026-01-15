const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createStripeProducts() {
  // 获取没有Stripe产品ID的套餐
  const { data: packages } = await supabase
    .from('medical_packages')
    .select('*')
    .is('stripe_product_id', null)
    .eq('is_active', true);

  if (!packages || packages.length === 0) {
    console.log('All packages already have Stripe products');
    return;
  }

  console.log('Creating Stripe products for ' + packages.length + ' packages...\n');

  for (const pkg of packages) {
    try {
      // 创建 Stripe 产品
      const product = await stripe.products.create({
        name: pkg.name_zh_tw + ' - ' + pkg.name_ja,
        description: pkg.description_zh_tw,
        metadata: {
          slug: pkg.slug,
          category: pkg.category
        }
      });

      // 创建 Stripe 价格
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: pkg.price_jpy,
        currency: 'jpy',
      });

      // 更新数据库
      await supabase
        .from('medical_packages')
        .update({
          stripe_product_id: product.id,
          stripe_price_id: price.id
        })
        .eq('id', pkg.id);

      console.log('✅ Created: ' + pkg.name_zh_tw);
      console.log('   Product ID: ' + product.id);
      console.log('   Price ID: ' + price.id);
      console.log('   Price: ¥' + pkg.price_jpy.toLocaleString() + '\n');
    } catch (error) {
      console.log('❌ Error creating ' + pkg.slug + ':', error.message);
    }
  }

  // 同时更新已存在套餐的价格（如果价格变更）
  console.log('\nUpdating existing Stripe prices...');
  const { data: existingPackages } = await supabase
    .from('medical_packages')
    .select('*')
    .not('stripe_product_id', 'is', null)
    .eq('is_active', true);

  for (const pkg of existingPackages) {
    try {
      // 创建新价格
      const newPrice = await stripe.prices.create({
        product: pkg.stripe_product_id,
        unit_amount: pkg.price_jpy,
        currency: 'jpy',
      });

      // 更新数据库中的价格ID
      await supabase
        .from('medical_packages')
        .update({ stripe_price_id: newPrice.id })
        .eq('id', pkg.id);

      console.log('✅ Updated price for ' + pkg.name_zh_tw + ': ¥' + pkg.price_jpy.toLocaleString());
    } catch (error) {
      console.log('⚠️ Error updating price for ' + pkg.slug + ':', error.message);
    }
  }
}

createStripeProducts();
