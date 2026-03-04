require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const packages = [
  {
    slug: 'osaka-himak-initial-consultation',
    name: '大阪重粒子線中心 - 前期諮詢服務',
    nameEn: 'Osaka HIMAK - Initial Consultation',
    description: '病歷資料翻譯、重粒子線治療適應性評估、治療計劃初步討論、費用概算',
    price: 221000,
  },
  {
    slug: 'osaka-himak-remote-consultation',
    name: '大阪重粒子線中心 - 遠程會診服務',
    nameEn: 'Osaka HIMAK - Remote Consultation',
    description: '與重粒子線治療專家遠程視頻會診、討論治療適應性與方案、費用詳細說明',
    price: 243000,
  },
];

async function createStripePrices() {
  console.log('🚀 開始創建 Osaka HIMAK Stripe Products & Prices...\n');

  for (const pkg of packages) {
    try {
      console.log(`處理: ${pkg.name}`);

      // 1. 創建 Stripe Product
      const product = await stripe.products.create({
        name: pkg.name,
        description: pkg.description,
        metadata: {
          slug: pkg.slug,
          category: 'cancer_treatment',
          clinic: 'osaka-himak',
        },
      });
      console.log(`  ✓ Product 已創建: ${product.id}`);

      // 2. 創建 Stripe Price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: pkg.price,
        currency: 'jpy',
        metadata: {
          slug: pkg.slug,
        },
      });
      console.log(`  ✓ Price 已創建: ${price.id}`);

      // 3. 更新 Supabase medical_packages 表
      const { error } = await supabase
        .from('medical_packages')
        .update({ stripe_price_id: price.id })
        .eq('slug', pkg.slug);

      if (error) {
        console.error(`  ✗ 更新數據庫失敗:`, error.message);
      } else {
        console.log(`  ✓ 數據庫已更新: stripe_price_id = ${price.id}`);
      }

      console.log('');
    } catch (error) {
      console.error(`✗ 處理失敗 ${pkg.slug}:`, error.message);
      console.log('');
    }
  }

  // 4. 驗證結果
  console.log('📊 驗證結果:\n');
  const { data, error } = await supabase
    .from('medical_packages')
    .select('slug, name_zh_tw, price_jpy, stripe_price_id')
    .like('slug', 'osaka-himak-%');

  if (error) {
    console.error('查詢失敗:', error.message);
  } else {
    console.table(data);
  }

  console.log('\n✅ 完成！');
}

createStripePrices();
