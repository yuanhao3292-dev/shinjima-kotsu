// 修复 Stripe price IDs：在 Stripe 中创建真实的价格对象，然后更新数据库
require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 需要修复的套餐列表
const PACKAGES_TO_FIX = [
  { slug: 'cancer-initial-consultation', priceJpy: 221000, name: '癌症治療 - 前期諮詢服務 (Cancer Initial Consultation)' },
  { slug: 'cancer-remote-consultation', priceJpy: 243000, name: '癌症治療 - 遠程會診服務 (Cancer Remote Consultation)' },
];

async function fixStripePrices() {
  console.log('========================================');
  console.log('修复 Stripe Price IDs');
  console.log('========================================');

  // 先检查当前 Stripe 模式
  try {
    const balance = await stripe.balance.retrieve();
    console.log('\n✓ Stripe 连接成功, 模式:', balance.livemode ? 'LIVE' : 'TEST');
  } catch (err) {
    console.error('✗ Stripe 连接失败:', err.message);
    process.exit(1);
  }

  for (const pkg of PACKAGES_TO_FIX) {
    console.log(`\n📌 处理: ${pkg.slug} (¥${pkg.priceJpy.toLocaleString()})`);

    // 1. 先在 Stripe 中搜索是否已有同名产品
    let product;
    const existingProducts = await stripe.products.search({
      query: `name:"${pkg.name}"`,
    });

    if (existingProducts.data.length > 0) {
      product = existingProducts.data[0];
      console.log(`  ✓ 已有产品: ${product.id}`);
    } else {
      // 创建新产品
      product = await stripe.products.create({
        name: pkg.name,
        metadata: { slug: pkg.slug },
      });
      console.log(`  ✓ 新产品创建: ${product.id}`);
    }

    // 2. 创建价格（Stripe 价格不可变，每次创建新的）
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: pkg.priceJpy,
      currency: 'jpy',
      metadata: { slug: pkg.slug },
    });
    console.log(`  ✓ 新价格创建: ${price.id}`);

    // 3. 更新数据库
    const { error } = await supabase
      .from('medical_packages')
      .update({ stripe_price_id: price.id })
      .eq('slug', pkg.slug);

    if (error) {
      console.error(`  ✗ 数据库更新失败: ${error.message}`);
    } else {
      console.log(`  ✓ 数据库已更新`);
    }
  }

  // 4. 兵庫医大套餐复用 cancer 的 price_id
  console.log('\n📌 同步兵庫医大套餐的 stripe_price_id...');

  const { data: cancerInitial } = await supabase
    .from('medical_packages')
    .select('stripe_price_id')
    .eq('slug', 'cancer-initial-consultation')
    .single();

  const { data: cancerRemote } = await supabase
    .from('medical_packages')
    .select('stripe_price_id')
    .eq('slug', 'cancer-remote-consultation')
    .single();

  if (cancerInitial?.stripe_price_id) {
    const { error } = await supabase
      .from('medical_packages')
      .update({ stripe_price_id: cancerInitial.stripe_price_id })
      .eq('slug', 'hyogo-initial-consultation');
    console.log(error ? `  ✗ hyogo-initial: ${error.message}` : `  ✓ hyogo-initial → ${cancerInitial.stripe_price_id}`);
  }

  if (cancerRemote?.stripe_price_id) {
    const { error } = await supabase
      .from('medical_packages')
      .update({ stripe_price_id: cancerRemote.stripe_price_id })
      .eq('slug', 'hyogo-remote-consultation');
    console.log(error ? `  ✗ hyogo-remote: ${error.message}` : `  ✓ hyogo-remote → ${cancerRemote.stripe_price_id}`);
  }

  // 5. 验证所有套餐
  console.log('\n📌 验证结果...');
  const { data: allPkgs } = await supabase
    .from('medical_packages')
    .select('slug, stripe_price_id, price_jpy')
    .in('slug', [
      'cancer-initial-consultation', 'cancer-remote-consultation',
      'hyogo-initial-consultation', 'hyogo-remote-consultation',
    ]);

  for (const p of allPkgs || []) {
    console.log(`  ${p.slug}: ${p.stripe_price_id} (¥${p.price_jpy})`);
  }

  console.log('\n✅ 完成！');
}

fixStripePrices().catch(console.error);
