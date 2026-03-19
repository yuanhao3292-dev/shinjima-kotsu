/**
 * JTB 医院数据入库脚本
 *
 * 读取 data/jtb-hospitals.json，标准化科室名，upsert 到 jtb_hospitals 表。
 * 同时将既有 11 家直营医院从 hospital-knowledge-base.ts 导入。
 *
 * Usage: npx tsx scripts/import-jtb-hospitals.ts
 *
 * 环境变量（.env.local 或 .env.production.local）：
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { inferDepartments, inferCategory } from '../services/aemc/department-mapping';
import {
  HOSPITAL_KNOWLEDGE_BASE,
  DEPARTMENT_ALIASES,
} from '../services/aemc/hospital-knowledge-base';

// Load env
dotenv.config({ path: '.env.production.local' });
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase: SupabaseClient = createClient(supabaseUrl, serviceKey);

// ============================================================
// Types
// ============================================================

interface JTBHospitalRaw {
  jtb_id: number;
  name_ja: string;
  name_en: string;
  url: string;
  detail_url: string;
  address: string;
  postal_code: string;
  prefecture: string;
  region: string;
  access: string;
  genres: string[];
  overview: string;
  website_url: string;
  sales_points: string;
  equipment: string[];
  departments: string[];
  specialties: string[];
  programs: Array<{ name: string; category: string; url: string }>;
  languages: string[];
  certifications: string[];
  scraped_at: string;
}

interface DBRow {
  jtb_id: number | null;
  source: string;
  internal_id: string | null;
  name_ja: string;
  name_en: string;
  name_zh_cn: string;
  name_zh_tw: string;
  region: string;
  prefecture: string;
  address: string;
  postal_code: string;
  category: string;
  departments: string[];
  specialties: string[];
  condition_keywords: string[];
  programs: unknown[];
  equipment: string[];
  has_emergency: boolean;
  bed_count: number;
  features_ja: string[];
  features_en: string[];
  features_zh_cn: string[];
  features_zh_tw: string[];
  suitable_for_ja: string;
  suitable_for_en: string;
  suitable_for_zh_cn: string;
  suitable_for_zh_tw: string;
  location_ja: string;
  location_en: string;
  location_zh_cn: string;
  location_zh_tw: string;
  languages: string[];
  certifications: string[];
  website_url: string;
  priority: number;
  is_active: boolean;
  raw_data: unknown;
}

// ============================================================
// JTB Hospital Import
// ============================================================

/**
 * 从 JTB 日语 specialties 推断 condition_keywords（中文）
 */
function inferConditionKeywords(specialties: string[], overview: string, salesPoints: string): string[] {
  const keywords = new Set<string>();
  const text = `${specialties.join(' ')} ${overview} ${salesPoints}`;

  const kwMap: Record<string, string[]> = {
    'がん|癌|腫瘍|がん検診': ['肿瘤', '癌症'],
    '心臓|循環器|カテーテル': ['心脏', '心血管'],
    '脳|脳卒中|脳梗塞|神経': ['脑', '脑中风', '神经'],
    '整形|脊椎|関節|骨': ['骨折', '关节痛', '腰痛'],
    '消化|胃|内視鏡': ['胃痛', '腹痛', '消化'],
    '呼吸|肺': ['呼吸', '咳嗽'],
    '泌尿|前立腺': ['排尿', '前列腺'],
    '眼|白内障|近視': ['眼睛', '视力'],
    '皮膚': ['皮肤'],
    '糖尿|内分泌': ['糖尿病', '甲状腺'],
    '透析|腎': ['肾脏'],
    '人間ドック|健診|PET': ['体检', '健康诊断'],
    '美容|リフト|脂肪': ['美容', '整形'],
    '幹細胞|再生': ['再生医疗', '干细胞'],
    '免疫|NK': ['免疫治疗'],
    'リハビリ': ['康复'],
    '歯|インプラント': ['牙齿'],
  };

  for (const [pattern, kws] of Object.entries(kwMap)) {
    if (new RegExp(pattern).test(text)) {
      kws.forEach((k) => keywords.add(k));
    }
  }

  return [...keywords];
}

function convertJTBHospital(raw: JTBHospitalRaw): DBRow {
  // Use inferDepartments from department-mapping to get clean departments
  const departments = inferDepartments(
    raw.departments,
    raw.specialties,
    raw.programs,
    raw.overview,
    raw.sales_points
  );

  const category = inferCategory(raw.specialties, raw.genres, raw.programs, raw.overview);
  const conditionKeywords = inferConditionKeywords(raw.specialties, raw.overview, raw.sales_points);

  // Extract features from sales_points (split by 【】sections)
  const featuresJa: string[] = [];
  if (raw.sales_points) {
    const sections = raw.sales_points.split(/【(.+?)】/).filter(Boolean);
    for (let i = 0; i < sections.length; i += 2) {
      const title = sections[i]?.trim();
      const body = sections[i + 1]?.trim();
      if (title && body) {
        featuresJa.push(`${title}: ${body.slice(0, 100)}`);
      } else if (title) {
        featuresJa.push(title.slice(0, 100));
      }
    }
    // If no 【】sections, use first 3 sentences
    if (featuresJa.length === 0) {
      const sentences = raw.sales_points.split(/[。！\n]/).filter((s) => s.trim().length > 10);
      featuresJa.push(...sentences.slice(0, 3).map((s) => s.trim().slice(0, 100)));
    }
  }

  return {
    jtb_id: raw.jtb_id,
    source: 'jtb',
    internal_id: null,
    name_ja: raw.name_ja,
    name_en: raw.name_en || '',
    name_zh_cn: '', // Will be filled by AI translation later if needed
    name_zh_tw: '',
    region: raw.region,
    prefecture: raw.prefecture,
    address: raw.address,
    postal_code: raw.postal_code,
    category,
    departments,
    specialties: raw.specialties,
    condition_keywords: conditionKeywords,
    programs: raw.programs,
    equipment: raw.equipment,
    has_emergency: raw.departments.includes('救急科') || raw.overview.includes('救急'),
    bed_count: 0,
    features_ja: featuresJa.slice(0, 5),
    features_en: [],
    features_zh_cn: [],
    features_zh_tw: [],
    suitable_for_ja: raw.overview.slice(0, 100),
    suitable_for_en: '',
    suitable_for_zh_cn: '',
    suitable_for_zh_tw: '',
    location_ja: `${raw.prefecture}${raw.address ? '' : ''}`,
    location_en: '',
    location_zh_cn: '',
    location_zh_tw: '',
    languages: raw.languages,
    certifications: raw.certifications,
    website_url: raw.website_url,
    priority: 5, // JTB default
    is_active: true,
    raw_data: raw,
  };
}

// ============================================================
// Direct Hospital Import (existing 11 hospitals)
// ============================================================

// I18n data is embedded in hospital-knowledge-base.ts but not exported as a constant
// we reference it through getLocalizedHospitalInfo, but for import we hardcode priority

function convertDirectHospital(h: typeof HOSPITAL_KNOWLEDGE_BASE[0]): DBRow {
  // Get all department aliases to find Japanese names
  const deptAliasReverse: Record<string, string> = {};
  for (const [standard, aliases] of Object.entries(DEPARTMENT_ALIASES)) {
    for (const alias of aliases) {
      deptAliasReverse[alias.toLowerCase()] = standard;
    }
  }

  return {
    jtb_id: null,
    source: 'direct',
    internal_id: h.id,
    name_ja: h.nameJa,
    name_en: h.nameEn || '',
    name_zh_cn: h.name,
    name_zh_tw: h.nameZhTw || '',
    region: inferRegionFromLocation(h.location),
    prefecture: inferPrefectureFromLocation(h.location),
    address: '',
    postal_code: '',
    category: h.category,
    departments: h.departments, // Already in zh-CN standard
    specialties: h.specialties,
    condition_keywords: h.conditionKeywords,
    programs: [],
    equipment: [],
    has_emergency: h.hasEmergency,
    bed_count: h.bedCount,
    features_ja: [],
    features_en: [],
    features_zh_cn: h.features,
    features_zh_tw: [],
    suitable_for_ja: '',
    suitable_for_en: '',
    suitable_for_zh_cn: h.suitableFor,
    suitable_for_zh_tw: '',
    location_ja: '',
    location_en: '',
    location_zh_cn: h.location,
    location_zh_tw: '',
    languages: ['ja', 'zh', 'en'],
    certifications: [],
    website_url: '',
    priority: h.priority,
    is_active: true,
    raw_data: null,
  };
}

function inferRegionFromLocation(location: string): string {
  if (/東京|千代田|秋葉原|表参道/.test(location)) return '関東';
  if (/大阪|兵庫|兵库|西宫|泉佐野|梅田/.test(location)) return '近畿';
  return '不明';
}

function inferPrefectureFromLocation(location: string): string {
  if (/東京/.test(location)) return '東京都';
  if (/大阪/.test(location)) return '大阪府';
  if (/兵庫|兵库/.test(location)) return '兵庫県';
  return '';
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('=== JTB Hospital Import ===\n');

  // 1. Run migration
  console.log('[1/3] Running migration...');
  const migrationSql = fs.readFileSync(
    path.resolve(__dirname, '../supabase/migrations/085_jtb_hospitals.sql'),
    'utf-8'
  );

  // Execute via Supabase SQL API
  const { error: migError } = await supabase.rpc('exec_sql', { sql_text: migrationSql }).maybeSingle();
  if (migError) {
    // Table might already exist — try to continue
    console.warn('  Migration warning (may be already applied):', migError.message);
  } else {
    console.log('  Migration applied successfully');
  }

  // 2. Import JTB hospitals
  console.log('\n[2/3] Importing JTB hospitals...');
  const rawData: JTBHospitalRaw[] = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../data/jtb-hospitals.json'), 'utf-8')
  );

  let jtbSuccess = 0;
  let jtbFailed = 0;
  const BATCH_SIZE = 20;

  for (let i = 0; i < rawData.length; i += BATCH_SIZE) {
    const batch = rawData.slice(i, i + BATCH_SIZE).map(convertJTBHospital);

    const { error } = await supabase
      .from('jtb_hospitals')
      .upsert(batch, { onConflict: 'jtb_id' });

    if (error) {
      console.error(`  Batch ${i}-${i + BATCH_SIZE} failed:`, error.message);
      jtbFailed += batch.length;
    } else {
      jtbSuccess += batch.length;
      process.stdout.write(`  Imported ${jtbSuccess}/${rawData.length}\r`);
    }
  }
  console.log(`  JTB: ${jtbSuccess} success, ${jtbFailed} failed`);

  // 3. Import direct hospitals
  console.log('\n[3/3] Importing direct hospitals...');
  let directSuccess = 0;

  for (const h of HOSPITAL_KNOWLEDGE_BASE) {
    const row = convertDirectHospital(h);

    const { error } = await supabase
      .from('jtb_hospitals')
      .upsert(row, { onConflict: 'internal_id' });

    // internal_id is not a unique constraint yet, use select+insert/update
    if (error) {
      // Try to find existing and update
      const { data: existing } = await supabase
        .from('jtb_hospitals')
        .select('id')
        .eq('internal_id', h.id)
        .maybeSingle();

      if (existing) {
        const { error: updateError } = await supabase
          .from('jtb_hospitals')
          .update(row)
          .eq('id', existing.id);
        if (!updateError) directSuccess++;
        else console.error(`  Failed to update ${h.id}:`, updateError.message);
      } else {
        const { error: insertError } = await supabase
          .from('jtb_hospitals')
          .insert(row);
        if (!insertError) directSuccess++;
        else console.error(`  Failed to insert ${h.id}:`, insertError.message);
      }
    } else {
      directSuccess++;
    }
  }
  console.log(`  Direct: ${directSuccess}/${HOSPITAL_KNOWLEDGE_BASE.length} imported`);

  // 4. Verify
  console.log('\n=== Verification ===');
  const { count: totalCount } = await supabase
    .from('jtb_hospitals')
    .select('*', { count: 'exact', head: true });
  console.log(`Total hospitals in DB: ${totalCount}`);

  const { count: jtbCount } = await supabase
    .from('jtb_hospitals')
    .select('*', { count: 'exact', head: true })
    .eq('source', 'jtb');
  console.log(`  JTB: ${jtbCount}`);

  const { count: directCount } = await supabase
    .from('jtb_hospitals')
    .select('*', { count: 'exact', head: true })
    .eq('source', 'direct');
  console.log(`  Direct: ${directCount}`);

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
