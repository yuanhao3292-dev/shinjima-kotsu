// 运行 061: 添加兵庫医大专属咨询服务套餐
require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('========================================');
  console.log('运行 061: 添加兵庫医大专属咨询服务套餐');
  console.log('========================================');

  // 1. 获取现有 cancer packages 的 stripe_price_id
  console.log('\n📌 获取现有 cancer packages 的 stripe_price_id...');
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

  if (!cancerInitial?.stripe_price_id || !cancerRemote?.stripe_price_id) {
    console.error('❌ 未找到 cancer packages 的 stripe_price_id');
    console.log('  cancer-initial:', cancerInitial);
    console.log('  cancer-remote:', cancerRemote);
    process.exit(1);
  }

  console.log('  ✓ cancer-initial stripe_price_id:', cancerInitial.stripe_price_id);
  console.log('  ✓ cancer-remote stripe_price_id:', cancerRemote.stripe_price_id);

  // 2. 插入/更新兵庫医大前期咨询
  console.log('\n📌 插入兵庫医大前期咨询套餐...');
  const { data: d1, error: e1 } = await supabase
    .from('medical_packages')
    .upsert({
      slug: 'hyogo-initial-consultation',
      name_zh_tw: '兵庫醫大 - 前期諮詢服務',
      name_ja: '兵庫医大 - 初期相談サービス',
      description_zh_tw: '資料翻譯、兵庫醫大諮詢、治療方案初步評估',
      price_jpy: 221000,
      stripe_price_id: cancerInitial.stripe_price_id,
      category: 'cancer_treatment',
      is_active: true,
      display_order: 110,
    }, { onConflict: 'slug' })
    .select();

  if (e1) {
    console.error('  ❌ 失败:', e1.message);
  } else {
    console.log('  ✓ 成功:', d1?.[0]?.id);
  }

  // 3. 插入/更新兵庫医大远程会诊
  console.log('\n📌 插入兵庫医大远程会诊套餐...');
  const { data: d2, error: e2 } = await supabase
    .from('medical_packages')
    .upsert({
      slug: 'hyogo-remote-consultation',
      name_zh_tw: '兵庫醫大 - 遠程會診服務',
      name_ja: '兵庫医大 - 遠隔診療サービス',
      description_zh_tw: '與兵庫醫大專科醫生遠程視頻會診、討論治療方案、費用概算',
      price_jpy: 243000,
      stripe_price_id: cancerRemote.stripe_price_id,
      category: 'cancer_treatment',
      is_active: true,
      display_order: 111,
    }, { onConflict: 'slug' })
    .select();

  if (e2) {
    console.error('  ❌ 失败:', e2.message);
  } else {
    console.log('  ✓ 成功:', d2?.[0]?.id);
  }

  console.log('\n✅ 迁移完成!');
}

runMigration().catch(console.error);
