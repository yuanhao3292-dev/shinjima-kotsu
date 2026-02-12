// 运行 067 迁移：创建 sai_clinic_images 表并填充数据
require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

async function executeSql(sql) {
  // Try multiple endpoints for executing raw SQL
  const endpoints = [
    `${supabaseUrl}/rest/v1/rpc/exec_sql`,
    `${supabaseUrl}/pg/query`,
  ];

  for (const url of endpoints) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'x-connection-encrypted': '1',
        },
        body: JSON.stringify(url.includes('pg/query') ? { query: sql } : { sql_text: sql }),
      });
      if (resp.ok) {
        console.log(`  ✓ SQL executed via ${url.includes('pg') ? 'pg/query' : 'rpc'}`);
        return true;
      }
    } catch (e) {
      // try next endpoint
    }
  }
  return false;
}

async function createTable() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS sai_clinic_images (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      category TEXT NOT NULL,
      src TEXT NOT NULL,
      alt TEXT NOT NULL DEFAULT '',
      label TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      metadata JSONB DEFAULT '{}'::jsonb,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE INDEX IF NOT EXISTS idx_sai_clinic_images_category ON sai_clinic_images(category)`,
    `ALTER TABLE sai_clinic_images ENABLE ROW LEVEL SECURITY`,
    `CREATE POLICY IF NOT EXISTS sai_clinic_images_public_read ON sai_clinic_images FOR SELECT USING (is_active = true)`,
  ];

  let success = true;
  for (const sql of statements) {
    const ok = await executeSql(sql);
    if (!ok) success = false;
  }
  return success;
}

async function seedData() {
  const images = [
    { category: 'hero', src: '/images/sai-clinic/hero-01.jpg', alt: 'SAI CLINIC 大阪梅田 - 院内環境', label: '院内大厅', display_order: 1, metadata: { usage: 'hero_background' } },
    { category: 'hero', src: '/images/sai-clinic/hero-02.jpg', alt: '崔煌植医生施术中', label: '施术中', display_order: 2, metadata: { usage: 'hero_grid' } },
    { category: 'hero', src: '/images/sai-clinic/hero-03.jpg', alt: 'SAI CLINIC 院内', label: '院内', display_order: 3, metadata: { usage: 'hero_grid' } },
    { category: 'hero', src: '/images/sai-clinic/hero-04.jpg', alt: 'SAI CLINIC', label: 'CTA背景', display_order: 4, metadata: { usage: 'cta_background' } },
    { category: 'hero', src: '/images/sai-clinic/hero-05.jpg', alt: 'SAI CLINIC', label: '流程背景', display_order: 5, metadata: { usage: 'flow_background' } },
    { category: 'gallery', src: '/images/sai-clinic/gallery-1.jpg', alt: 'SAI CLINIC 接待大厅', label: '接待大厅', display_order: 1, metadata: {} },
    { category: 'gallery', src: '/images/sai-clinic/gallery-2.jpg', alt: 'SAI CLINIC 候诊区域', label: '候诊区域', display_order: 2, metadata: {} },
    { category: 'gallery', src: '/images/sai-clinic/gallery-3.jpg', alt: 'SAI CLINIC 咨询室', label: '咨询室', display_order: 3, metadata: {} },
    { category: 'gallery', src: '/images/sai-clinic/gallery-4.jpg', alt: 'SAI CLINIC 治疗室', label: '治疗室', display_order: 4, metadata: {} },
    { category: 'gallery', src: '/images/sai-clinic/gallery-5.jpg', alt: 'SAI CLINIC 化妆间', label: '化妆间', display_order: 5, metadata: {} },
    { category: 'gallery', src: '/images/sai-clinic/gallery-6.jpg', alt: 'SAI CLINIC 手术室', label: '手术室', display_order: 6, metadata: {} },
    { category: 'gallery', src: '/images/sai-clinic/gallery-7.jpg', alt: 'SAI CLINIC 恢复室', label: '恢复室', display_order: 7, metadata: {} },
    { category: 'gallery', src: '/images/sai-clinic/gallery-8.jpg', alt: 'SAI CLINIC 入口', label: '诊所入口', display_order: 8, metadata: {} },
    { category: 'gallery', src: '/images/sai-clinic/gallery-9.jpg', alt: 'SAI CLINIC 走廊', label: '诊所走廊', display_order: 9, metadata: {} },
    { category: 'case', src: '/images/sai-clinic/case-40s-01.jpg', alt: '40代女性 糸リフト+ヒアルロン酸', label: '40代女性', display_order: 1, metadata: { title: '40代女性 · 糸リフト+ヒアルロン酸', desc: 'SAI LIFT STANDARD + 法令纹玻尿酸注射。自然的提升效果，法令纹明显改善。' } },
    { category: 'case', src: '/images/sai-clinic/case-50s-01.jpg', alt: '50代女性 糸リフト', label: '50代女性', display_order: 2, metadata: { title: '50代女性 · 糸リフト', desc: 'SAI LIFT PERFECT 全脸线雕提升。显著改善面部松弛，恢复年轻轮廓。' } },
    { category: 'case', src: '/images/sai-clinic/case-50s-02.jpg', alt: '50代女性 糸リフト+脂肪溶解', label: '50代女性', display_order: 3, metadata: { title: '50代女性 · 糸リフト+脂肪溶解', desc: '线雕提升 + 面部吸脂。V脸效果明显，下颚线条更加紧致。' } },
    { category: 'doctor', src: '/images/sai-clinic/doctor.jpg', alt: '崔煌植 院長', label: '院長头像', display_order: 1, metadata: { usage: 'avatar' } },
    { category: 'doctor', src: '/images/sai-clinic/sign.png', alt: '崔煌植 签名', label: '签名', display_order: 2, metadata: { usage: 'signature' } },
    { category: 'doctor', src: '/images/sai-clinic/recommend.jpg', alt: '推薦', label: '推薦头像', display_order: 3, metadata: { usage: 'recommend' } },
    { category: 'feature', src: '/images/sai-clinic/feature-01.jpg', alt: '糸リフト专门诊所', label: '糸リフト专门', display_order: 1, metadata: { title: '糸リフト专门诊所' } },
    { category: 'feature', src: '/images/sai-clinic/about-feature-1.jpg', alt: '韩式美学·日本品质', label: '韩式美学', display_order: 2, metadata: { title: '韩式美学·日本品质' } },
    { category: 'feature', src: '/images/sai-clinic/about-feature-2.jpg', alt: '内外兼修·个性定制', label: '内外兼修', display_order: 3, metadata: { title: '内外兼修·个性定制' } },
    { category: 'concept', src: '/images/sai-clinic/concept-1.jpg', alt: 'SAI CLINIC 施術風景', label: '施术风景', display_order: 1, metadata: {} },
    { category: 'concept', src: '/images/sai-clinic/concept-2.jpg', alt: '抗衰老专门', label: '抗衰老专门', display_order: 2, metadata: {} },
    { category: 'concept', src: '/images/sai-clinic/concept-3.jpg', alt: '韩式美学', label: '韩式美学', display_order: 3, metadata: {} },
    { category: 'concept', src: '/images/sai-clinic/concept-4.jpg', alt: '个性化方案', label: '个性化方案', display_order: 4, metadata: {} },
    { category: 'threadlift', src: '/images/sai-clinic/threadlift-hero.jpg', alt: 'SAI LIFT 糸リフト', label: '糸リフト hero', display_order: 1, metadata: {} },
    { category: 'threadlift', src: '/images/sai-clinic/threadlift-title.jpg', alt: 'SAI LIFT Title', label: '糸リフト标题', display_order: 2, metadata: {} },
    { category: 'other', src: '/images/sai-clinic/logo.svg', alt: 'SAI CLINIC Logo', label: 'Logo', display_order: 1, metadata: {} },
    { category: 'other', src: '/images/sai-clinic/promise-1.jpg', alt: 'Promise 1', label: '承诺1', display_order: 2, metadata: {} },
    { category: 'other', src: '/images/sai-clinic/promise-2.jpg', alt: 'Promise 2', label: '承诺2', display_order: 3, metadata: {} },
    { category: 'other', src: '/images/sai-clinic/promise-3.jpg', alt: 'Promise 3', label: '承诺3', display_order: 4, metadata: {} },
  ];

  // Clear existing
  await supabase.from('sai_clinic_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data, error } = await supabase.from('sai_clinic_images').insert(images).select('id, category');
  if (error) {
    console.error('Insert error:', error.message);
    return false;
  }

  const cats = {};
  data.forEach(r => { cats[r.category] = (cats[r.category] || 0) + 1; });
  console.log(`✅ Inserted ${data.length} images:`);
  Object.entries(cats).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  return true;
}

async function main() {
  console.log('SAI CLINIC Images - Migration 067\n');

  // Step 1: Try to create table
  console.log('Step 1: Creating table...');
  const ok = await createTable();
  if (!ok) {
    console.log('\n⚠️  Cannot create table programmatically.');
    console.log('Please run this SQL in Supabase Dashboard > SQL Editor:\n');
    console.log('--- Copy from supabase/migrations/067_sai_clinic_images.sql ---\n');
    console.log('After creating the table, run: node scripts/run-migration-067.js --seed-only\n');

    if (!process.argv.includes('--seed-only')) {
      process.exit(1);
    }
  }

  // Step 2: Seed
  console.log('\nStep 2: Seeding...');
  const seeded = await seedData();
  if (!seeded) {
    console.log('❌ Failed');
    process.exit(1);
  }

  // Step 3: Verify
  const { data: all } = await supabase.from('sai_clinic_images').select('id').eq('is_active', true);
  console.log(`\n✅ Total in DB: ${all?.length || 0} images`);
}

main().catch(console.error);
