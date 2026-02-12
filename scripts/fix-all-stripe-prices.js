// 为所有 stripe_price_id 无效的套餐创建新的 Stripe 价格
require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 需要修复的 TIMC 健检套餐
const TIMC_PACKAGES = [
  { slug: 'vip-member-course', priceJpy: 1512500, name: 'VIP會員套餐 (VIP Member Course)' },
  { slug: 'premium-cardiac-course', priceJpy: 825000, name: '心臟精密檢查套餐 (Premium Cardiac Course)' },
  { slug: 'select-gastro-colonoscopy', priceJpy: 825000, name: '精選上下消化道套餐 (Select Gastro-Colonoscopy)' },
  { slug: 'select-gastroscopy', priceJpy: 687500, name: '精選胃鏡套餐 (Select Gastroscopy)' },
  { slug: 'basic-checkup', priceJpy: 550000, name: '基礎檢查套餐 (Basic Checkup)' },
  { slug: 'dwibs-cancer-screening', priceJpy: 275000, name: 'DWIBS全身癌篩查 (DWIBS Cancer Screening)' },
];

async function fixAll() {
  console.log('========================================');
  console.log('修复 TIMC 健检套餐 Stripe Price IDs');
  console.log('========================================\n');

  for (const pkg of TIMC_PACKAGES) {
    console.log(`📌 ${pkg.slug} (¥${pkg.priceJpy.toLocaleString()})`);

    // 创建产品
    const product = await stripe.products.create({
      name: pkg.name,
      metadata: { slug: pkg.slug },
    });
    console.log(`  ✓ 产品: ${product.id}`);

    // 创建价格
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: pkg.priceJpy,
      currency: 'jpy',
      metadata: { slug: pkg.slug },
    });
    console.log(`  ✓ 价格: ${price.id}`);

    // 更新数据库
    const { error } = await supabase
      .from('medical_packages')
      .update({ stripe_price_id: price.id })
      .eq('slug', pkg.slug);

    console.log(error ? `  ✗ DB: ${error.message}` : `  ✓ DB 已更新`);
  }

  // 验证
  console.log('\n📌 验证所有套餐...');
  const { data: pkgs } = await supabase
    .from('medical_packages')
    .select('slug, stripe_price_id, price_jpy')
    .eq('is_active', true)
    .order('display_order');

  for (const p of pkgs) {
    try {
      await stripe.prices.retrieve(p.stripe_price_id);
      console.log(`  ✓ ${p.slug}`);
    } catch (err) {
      console.log(`  ✗ ${p.slug}: ${err.message}`);
    }
  }

  console.log('\n✅ 全部完成！');
}

fixAll().catch(console.error);
