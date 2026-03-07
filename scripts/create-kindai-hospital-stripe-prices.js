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
    slug: 'kindai-hospital-initial-consultation',
    name: '近畿大學醫院 - 前期諮詢服務',
    nameJa: '近畿大学病院 - 初期相談サービス',
    nameEn: 'Kindai Hospital - Initial Consultation',
    description: '病歷資料翻譯、就診適應性評估、診療科室推薦、預約代行、醫療簽證邀請函、住宿交通安排',
    price: 221000,
  },
  {
    slug: 'kindai-hospital-remote-consultation',
    name: '近畿大學醫院 - 遠程會診服務',
    nameJa: '近畿大学病院 - 遠隔診療サービス',
    nameEn: 'Kindai Hospital - Remote Consultation',
    description: '與專科醫師遠程視頻會診（30分鐘）、病情評估與診斷建議、治療方案討論、費用詳細說明',
    price: 243000,
  },
];

async function createStripePrices() {
  console.log('🚀 開始創建近畿大學醫院 Stripe Products & Prices...\n');

  for (const pkg of packages) {
    try {
      console.log(`處理: ${pkg.name}`);

      // 1. 創建 Stripe Product
      const product = await stripe.products.create({
        name: pkg.name,
        description: pkg.description,
        metadata: {
          slug: pkg.slug,
          category: 'comprehensive_medical',
          hospital: 'kindai-hospital',
          name_ja: pkg.nameJa,
          name_en: pkg.nameEn,
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
    .like('slug', 'kindai-hospital-%');

  if (error) {
    console.error('查詢失敗:', error.message);
  } else {
    console.table(data);
  }

  console.log('\n✅ 完成！');
  console.log('\n📝 生成的 Stripe 信息:');
  console.log('請將以下信息記錄到文檔中:\n');
}

createStripePrices();
