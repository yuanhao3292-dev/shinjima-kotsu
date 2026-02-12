// 为 SAI CLINIC 19 个套餐创建 Stripe 产品和价格
// 运行: node scripts/create-sai-clinic-stripe-prices.js
require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SAI_PACKAGES = [
  // 糸リフト系列
  { slug: 'sai-lift-try', priceJpy: 380000, name: 'SAI LIFT TRY 糸リフト体験 (Thread Lift Trial)' },
  { slug: 'sai-lift-standard', priceJpy: 680000, name: 'SAI LIFT STANDARD 糸リフト標準 (Thread Lift Standard)' },
  { slug: 'sai-lift-perfect', priceJpy: 980000, name: 'SAI LIFT PERFECT 糸リフト完美 (Thread Lift Premium)' },
  // 组合套餐
  { slug: 'sai-nasolabial-set', priceJpy: 378000, name: '法令紋改善套餐 (Nasolabial Fold Treatment Set)' },
  { slug: 'sai-vline-set', priceJpy: 496000, name: 'V臉線條套餐 (V-Line Facial Contouring Set)' },
  { slug: 'sai-neck-set', priceJpy: 378000, name: '頸紋改善套餐 (Neck Wrinkle Treatment Set)' },
  { slug: 'sai-eye-fatigue-set', priceJpy: 378000, name: '眼周疲勞改善套餐 (Eye Fatigue Treatment Set)' },
  // 眼部整形
  { slug: 'sai-double-eyelid', priceJpy: 300000, name: '自然雙眼皮 (Natural Double Eyelid Surgery)' },
  { slug: 'sai-double-eyelid-premium', priceJpy: 580000, name: '精緻雙眼皮6點連續法 (Premium Double Eyelid)' },
  { slug: 'sai-under-eye-reversehamra', priceJpy: 880000, name: '黑眼圈眼袋去除 Reverse Hamra (Under-Eye Treatment)' },
  // 鼻部整形
  { slug: 'sai-nose-thread', priceJpy: 560000, name: '線雕隆鼻8線 (Nose Thread Lift 8 Threads)' },
  { slug: 'sai-nose-implant', priceJpy: 480000, name: '硅膠隆鼻 (Silicone Nose Implant)' },
  // 注射美容
  { slug: 'sai-botox-full-face', priceJpy: 240000, name: 'Allergan全臉肉毒素100單位 (Botox Full Face)' },
  { slug: 'sai-hyaluronic-1cc', priceJpy: 148000, name: '玻尿酸注射 Juvéderm 1cc (Hyaluronic Acid Filler)' },
  { slug: 'sai-skin-rejuvenation', priceJpy: 304000, name: '肌膚再生水光注射 (Skin Rejuvenation Hydro + Stem Cell)' },
  { slug: 'sai-exosome-therapy', priceJpy: 760000, name: '幹細胞外泌體療法 (Exosome Stem Cell Therapy)' },
  // 脂肪手术
  { slug: 'sai-fat-grafting-face', priceJpy: 1760000, name: '全臉脂肪填充 (Full Face Fat Grafting)' },
  { slug: 'sai-liposuction-face', priceJpy: 480000, name: '面部吸脂雙區 (Facial Liposuction 2 Areas)' },
  // 美容内科
  { slug: 'sai-nutrition-perfect', priceJpy: 118000, name: '精密營養分析82項 (Precision Nutrition Analysis)' },
  { slug: 'sai-vitamin-c-drip', priceJpy: 26000, name: '高濃度維C點滴20g (High-Dose Vitamin C IV Drip)' },
];

async function createSaiClinicPrices() {
  console.log('========================================');
  console.log('SAI CLINIC - 创建 Stripe 产品和价格');
  console.log(`共 ${SAI_PACKAGES.length} 个套餐`);
  console.log('========================================\n');

  let successCount = 0;
  let errorCount = 0;

  for (const pkg of SAI_PACKAGES) {
    try {
      console.log(`📌 ${pkg.slug} (¥${pkg.priceJpy.toLocaleString()})`);

      // 创建 Stripe 产品
      const product = await stripe.products.create({
        name: `[SAI CLINIC] ${pkg.name}`,
        metadata: {
          slug: pkg.slug,
          category: 'cosmetic_surgery',
          provider: 'sai_clinic',
        },
      });
      console.log(`  ✓ 产品: ${product.id}`);

      // 创建 Stripe 价格
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
        .update({
          stripe_product_id: product.id,
          stripe_price_id: price.id,
        })
        .eq('slug', pkg.slug);

      if (error) {
        console.log(`  ✗ DB: ${error.message}`);
        errorCount++;
      } else {
        console.log(`  ✓ DB 已更新`);
        successCount++;
      }
      console.log('');
    } catch (err) {
      console.log(`  ✗ 错误: ${err.message}\n`);
      errorCount++;
    }
  }

  // 验证
  console.log('========================================');
  console.log('验证 SAI CLINIC 所有套餐...');
  console.log('========================================\n');

  const { data: pkgs } = await supabase
    .from('medical_packages')
    .select('slug, stripe_price_id, price_jpy')
    .like('slug', 'sai-%')
    .eq('is_active', true)
    .order('display_order');

  if (pkgs) {
    for (const p of pkgs) {
      try {
        await stripe.prices.retrieve(p.stripe_price_id);
        console.log(`  ✓ ${p.slug} → ¥${p.price_jpy.toLocaleString()}`);
      } catch (err) {
        console.log(`  ✗ ${p.slug}: ${err.message}`);
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ 完成: ${successCount} 成功, ${errorCount} 失败`);
  console.log('========================================');
}

createSaiClinicPrices().catch(console.error);
