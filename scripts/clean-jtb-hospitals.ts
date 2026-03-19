/**
 * AI 清洗 JTB 医院数据（v2 混合方案）
 *
 * - departments: 确定性关键词匹配（从 overview/sales_points/programs 提取）
 * - specialties / condition_keywords / category: AI 提取
 *
 * 注意：raw_data 中的 departments 和 specialties 是网站筛选器选项（所有医院相同），
 * 不是各医院实际数据，已完全忽略。
 *
 * Usage: npx tsx scripts/clean-jtb-hospitals.ts
 */

import * as dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Load env
dotenv.config({ path: '.env.production.local' });
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const openrouterKey = process.env.OPENROUTER_API_KEY as string;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!openrouterKey) {
  console.error('Missing OPENROUTER_API_KEY');
  process.exit(1);
}

const supabase: SupabaseClient = createClient(supabaseUrl, serviceKey);
const openai = new OpenAI({
  apiKey: openrouterKey,
  baseURL: 'https://openrouter.ai/api/v1',
  timeout: 30000,
});

// ============================================================
// 确定性科室推断（关键词匹配）
// ============================================================

/**
 * 日语关键词 → 科室名（zh-CN）映射
 * 仅用于从 overview/sales_points/programs 文本中匹配
 */
const KEYWORD_TO_DEPT: Array<[RegExp, string[]]> = [
  // 内科系
  [/内科|内科的|総合診療/, ['内科']],
  [/消化器|胃腸|胃カメラ|大腸|内視鏡(?!手術)/, ['消化内科']],
  [/呼吸器(?!外科)|肺(?!癌|がん)|喘息|COPD/, ['呼吸内科']],
  [/循環器|心臓(?!外科|手術)|不整脈|心不全|カテーテル/, ['循环内科']],
  [/脳神経内科|神経内科|てんかん|パーキンソン|認知症|神経難病/, ['神经内科']],
  [/腎臓内科|腎臓(?!移植)|透析|人工透析|腎不全/, ['肾脏内科']],
  [/内分泌|糖尿病|甲状腺|代謝/, ['内分泌科']],
  [/血液内科|血液(?!透析)|白血病|リンパ腫/, ['血液内科']],
  [/腫瘍内科|がん薬物|化学療法|抗がん剤/, ['肿瘤科']],

  // 外科系
  [/(?<!消化器|心臓|脳神経|呼吸器|美容|形成)外科|手術室|手術(?!ロボット|支援)/, ['外科']],
  [/消化器外科|肝胆膵|消化管手術/, ['消化外科']],
  [/心臓外科|心臓血管外科|開心術|冠動脈バイパス/, ['心脏外科']],
  [/脳神経外科|脳外科|脳腫瘍手術|脳血管手術/, ['脑神经外科']],
  [/整形外科|骨折|関節|脊椎|脊柱|椎間板|人工関節|スポーツ整形/, ['骨科']],
  [/泌尿器|前立腺|腎結石|尿路/, ['泌尿外科']],
  [/呼吸器外科|胸部外科|肺手術/, ['胸外科']],

  // 専門科
  [/産婦人科|婦人科|産科|出産|分娩|子宮|卵巣/, ['妇产科']],
  [/小児科|小児|新生児|こども/, ['小儿科']],
  [/皮膚科(?!美容)/, ['皮肤科']],
  [/眼科|白内障|緑内障|網膜|近視矯正|レーシック|ICL/, ['眼科']],
  [/耳鼻(?:咽喉)?科|耳鼻|副鼻腔|難聴|めまい/, ['耳鼻喉科']],
  [/放射線科|放射線診断|画像診断(?!センター)|CT|MRI(?!検査)/, ['放射科']],
  [/放射線治療|重粒子線|陽子線|IMRT/, ['放射线治疗科']],
  [/麻酔科|ペインクリニック/, ['麻醉科']],
  [/リハビリ|理学療法|作業療法/, ['康复科']],
  [/救急|救命/, ['急救医疗科']],

  // 特殊
  [/美容外科|美容整形|豊胸|脂肪吸引|糸リフト|フェイスリフト|二重|鼻整形/, ['整形外科']],
  [/美容皮膚科|シミ|しわ|たるみ|ヒアルロン酸|ボトックス|レーザー(?!治療)/, ['美容皮肤科']],
  [/再生医療|幹細胞|PRP|エクソソーム/, ['再生医疗科']],
  [/免疫(?:細胞)?療法|NK細胞|免疫チェック|CAR-T/, ['免疫细胞治疗科']],
  [/健診|人間ドック|健康診断|検診(?!がん)/, ['健康诊断科']],
];

function inferDepartmentsFromText(
  name: string,
  overview: string,
  salesPoints: string,
  programs: Array<{ name: string; category: string }>
): string[] {
  const depts = new Set<string>();

  // Combine all text sources
  const programText = programs.map(p => p.name).join(' ');
  const text = `${name} ${overview} ${salesPoints} ${programText}`;

  for (const [pattern, departments] of KEYWORD_TO_DEPT) {
    if (pattern.test(text)) {
      departments.forEach(d => depts.add(d));
    }
  }

  // If nothing found, infer from hospital name as fallback
  if (depts.size === 0) {
    if (/クリニック|診療所|医院/.test(name)) {
      depts.add('内科'); // Default for clinics
    }
  }

  return [...depts];
}

// ============================================================
// AI Prompt (only for specialties, condition_keywords, category)
// ============================================================

const VALID_CATEGORIES = [
  'general_hospital',
  'health_screening',
  'aesthetics',
  'stem_cell',
];

function buildPrompt(hospital: {
  name_ja: string;
  overview: string;
  sales_points: string;
  programs: Array<{ name: string; category: string }>;
  genres: string[];
}): string {
  return `あなたは日本の医療機関データの専門家です。以下の病院情報から、specialties / condition_keywords / category を抽出してください。

## 病院名
${hospital.name_ja}

## 検査・治療プログラム
${hospital.programs.map(p => p.name).join('\n') || 'なし'}

## ジャンルタグ
${hospital.genres.join('、') || 'なし'}

## 概要
${hospital.overview || 'なし'}

## セールスポイント
${hospital.sales_points || 'なし'}

---

以下の JSON 形式で回答：

{
  "specialties": ["特色1", "特色2"],
  "condition_keywords": ["症状1", "疾患2"],
  "category": "分類",
  "has_emergency": false
}

## ルール

### specialties（中国語簡体字・特色と強み）
この病院が実際に提供している特色的な診療・サービスを3-8個。
具体的に。例："PET-CT精密体检"、"达芬奇机器人手术"、"质子线治疗"、"脊椎微创手术"、"干细胞再生治疗"。
概要・セールスポイント・プログラムに記載されている内容のみ。推測禁止。

### condition_keywords（中国語簡体字・対応可能な症状/疾患）
この病院が治療・検査できる具体的な症状/疾患名を5-15個。
例："肺癌"、"胃癌"、"冠心病"、"脑梗塞"、"糖尿病"、"腰椎间盘突出"。
概要・セールスポイント・プログラムから読み取れるもののみ。

### category
${VALID_CATEGORIES.join(' / ')} から1つ：
- general_hospital：総合病院・専門病院（入院・手術能力あり）
- health_screening：健診・人間ドック主体（検査のみ、治療なし）
- aesthetics：美容主体
- stem_cell：幹細胞・再生医療主体

### has_emergency
「救急」「救急科」「救命」の明示がある場合のみ true。

JSON のみ回答。`;
}

// ============================================================
// AI Call
// ============================================================

interface AIResult {
  specialties: string[];
  condition_keywords: string[];
  category: string;
  has_emergency: boolean;
}

async function extractWithAI(hospital: {
  name_ja: string;
  overview: string;
  sales_points: string;
  programs: Array<{ name: string; category: string }>;
  genres: string[];
}): Promise<AIResult | null> {
  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'user', content: buildPrompt(hospital) },
      ],
      temperature: 0.1,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as AIResult;

    // Validate category
    if (!VALID_CATEGORIES.includes(parsed.category)) {
      parsed.category = 'general_hospital';
    }

    // Ensure arrays
    if (!Array.isArray(parsed.specialties)) parsed.specialties = [];
    if (!Array.isArray(parsed.condition_keywords)) parsed.condition_keywords = [];
    parsed.has_emergency = !!parsed.has_emergency;

    return parsed;
  } catch (err) {
    console.error(`  AI call failed for ${hospital.name_ja}:`, err);
    return null;
  }
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('=== AI Hospital Data Cleaning (v2 Hybrid) ===\n');

  // 1. Fetch all JTB hospitals
  const { data: hospitals, error } = await supabase
    .from('jtb_hospitals')
    .select('id, jtb_id, name_ja, raw_data')
    .eq('source', 'jtb')
    .eq('is_active', true)
    .order('jtb_id');

  if (error || !hospitals) {
    console.error('Failed to fetch hospitals:', error?.message);
    process.exit(1);
  }

  console.log(`Found ${hospitals.length} JTB hospitals to clean\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  // Stats
  const deptCounts: Record<string, number> = {};
  const catCounts: Record<string, number> = {};

  for (let i = 0; i < hospitals.length; i++) {
    const h = hospitals[i];
    const raw = h.raw_data as Record<string, unknown> | null;

    if (!raw) {
      console.log(`  [${i + 1}/${hospitals.length}] ${h.name_ja} — no raw_data, skipping`);
      skipped++;
      continue;
    }

    const overview = (raw.overview as string) || '';
    const salesPoints = (raw.sales_points as string) || '';
    const programs = (raw.programs as Array<{ name: string; category: string }>) || [];
    const genres = (raw.genres as string[]) || [];

    // Step 1: Deterministic department extraction
    const departments = inferDepartmentsFromText(h.name_ja, overview, salesPoints, programs);

    // Step 2: AI extraction for specialties/condition_keywords/category
    process.stdout.write(`  [${i + 1}/${hospitals.length}] ${h.name_ja}...`);

    const aiResult = await extractWithAI({
      name_ja: h.name_ja,
      overview,
      sales_points: salesPoints,
      programs,
      genres,
    });

    if (!aiResult) {
      console.log(' AI FAILED');
      failed++;
      continue;
    }

    // Update DB
    const { error: updateError } = await supabase
      .from('jtb_hospitals')
      .update({
        departments,
        specialties: aiResult.specialties,
        condition_keywords: aiResult.condition_keywords,
        category: aiResult.category,
        has_emergency: aiResult.has_emergency,
      })
      .eq('id', h.id);

    if (updateError) {
      console.log(` DB error: ${updateError.message}`);
      failed++;
    } else {
      console.log(` OK (${departments.length} depts, ${aiResult.specialties.length} specs, ${aiResult.condition_keywords.length} kws, ${aiResult.category})`);
      success++;

      // Track stats
      for (const d of departments) deptCounts[d] = (deptCounts[d] || 0) + 1;
      catCounts[aiResult.category] = (catCounts[aiResult.category] || 0) + 1;
    }

    // Rate limit
    if (i < hospitals.length - 1) {
      await new Promise(r => setTimeout(r, 400));
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Success: ${success} / Failed: ${failed} / Skipped: ${skipped}`);

  console.log('\n=== Category Distribution ===');
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }

  console.log('\n=== Department Frequency ===');
  for (const [dept, count] of Object.entries(deptCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${dept}: ${count}`);
  }

  // Spot-check sample
  console.log('\n=== Sample Results ===');
  const sampleNames = ['中京眼科', 'スマート', 'てんかん', '品川美容', '亀田', '虎の門'];
  const { data: all } = await supabase
    .from('jtb_hospitals')
    .select('name_ja, departments, specialties, condition_keywords, category')
    .eq('source', 'jtb')
    .eq('is_active', true);

  for (const name of sampleNames) {
    const h = (all || []).find(h => h.name_ja.includes(name));
    if (h) {
      console.log(`\n  ${h.name_ja}`);
      console.log(`    depts: ${(h.departments as string[]).join(', ') || '(empty)'}`);
      console.log(`    specs: ${(h.specialties as string[]).join(', ')}`);
      console.log(`    kws: ${(h.condition_keywords as string[]).join(', ')}`);
      console.log(`    cat: ${h.category}`);
    }
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
