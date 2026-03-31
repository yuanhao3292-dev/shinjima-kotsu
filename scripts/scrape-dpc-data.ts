/**
 * 厚生労働省 DPC 公開データ → jtb_hospitals.top_treatments 導入スクリプト
 *
 * MHLW が毎年公開する DPC 統計 Excel（施設概要表 + MDC01-18 疾患別手術別集計）から
 * 各医療機関の主要治療実績を抽出し、DB の jtb_hospitals に書き込む。
 *
 * Usage:
 *   npx tsx scripts/scrape-dpc-data.ts              # 実行（ダウンロード + 解析 + DB更新）
 *   npx tsx scripts/scrape-dpc-data.ts --dry-run     # DB書き込みなし（マッチング結果のみ）
 *   npx tsx scripts/scrape-dpc-data.ts --download     # Excelを強制再ダウンロード
 *   npx tsx scripts/scrape-dpc-data.ts --skip-download # ローカルキャッシュのみ使用
 *
 * 環境変数（.env.local）:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as XLSX from 'xlsx';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.production.local' });
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase: SupabaseClient = createClient(supabaseUrl, serviceKey);

// ============================================================
// Config
// ============================================================

const DATA_DIR = path.resolve(__dirname, '../data/dpc');
const MATCH_REPORT_PATH = path.join(DATA_DIR, 'match-report.json');
const MHLW_BASE = 'https://www.mhlw.go.jp';

// FY2023 (令和5年度) DPC data files
const FACILITY_OVERVIEW_URL = '/content/12404000/001468611.xlsx';
const MDC_URLS: Record<string, string> = {
  MDC01: '/content/12404000/001468899.xlsx',
  MDC02: '/content/12404000/001468903.xlsx',
  MDC03: '/content/12404000/001468905.xlsx',
  MDC04: '/content/12404000/001468906.xlsx',
  MDC05: '/content/12404000/001468908.xlsx',
  MDC06: '/content/12404000/001468909.xlsx',
  MDC07: '/content/12404000/001468911.xlsx',
  MDC08: '/content/12404000/001468912.xlsx',
  MDC09: '/content/12404000/001468913.xlsx',
  MDC10: '/content/12404000/001468914.xlsx',
  MDC11: '/content/12404000/001468916.xlsx',
  MDC12: '/content/12404000/001468918.xlsx',
  MDC13: '/content/12404000/001468920.xlsx',
  MDC14: '/content/12404000/001468922.xlsx',
  MDC15: '/content/12404000/001468924.xlsx',
  MDC16: '/content/12404000/001468926.xlsx',
  MDC18: '/content/12404000/001468927.xlsx',
};

// ============================================================
// Types
// ============================================================

interface Treatment {
  disease: string;
  total: number;
  surgery: number;
  non_surgery: number;
  pref_rank: string;
  national_rank: string;
}

interface FacilityInfo {
  code: string;
  name: string;
  prefecture: string;
  beds: number;
}

interface HospitalTreatmentData {
  facilityCode: string;
  facilityName: string;
  prefecture: string;
  /** All disease records before ranking/trimming */
  rawTreatments: Array<{
    disease: string;
    total: number;
    surgery: number;
    non_surgery: number;
  }>;
}

interface DBHospital {
  id: string;
  name_ja: string;
  prefecture: string;
  category: string;
}

interface MatchResult {
  dbId: string;
  dbName: string;
  dpcCode: string;
  dpcName: string;
  matchType: 'exact' | 'contains' | 'substring';
  treatments: Treatment[];
}

interface MatchReport {
  timestamp: string;
  totalDpcHospitals: number;
  totalDbHospitals: number;
  matched: Array<{ dbName: string; dpcName: string; matchType: string; treatmentCount: number }>;
  unmatched: string[];
}

// ============================================================
// Utils
// ============================================================

function normalize(s: string): string {
  return s
    .replace(/[\s\u3000]+/g, '') // remove all whitespace
    .replace(/[\uff01-\uff5e]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0)) // fullwidth → halfwidth
    .replace(/[（\(][^）\)]*[）\)]/g, '') // remove (parenthetical)
    .replace(/【[^】]*】/g, '') // remove 【brackets】
    .replace(/「[^」]*」/g, '') // remove 「brackets」
    .trim();
}

function longestCommonSubstring(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  let max = 0;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > max) max = dp[i][j];
      }
    }
  }
  return max;
}

async function downloadFile(url: string, dest: string): Promise<void> {
  const fullUrl = url.startsWith('http') ? url : `${MHLW_BASE}${url}`;
  console.log(`  Downloading ${path.basename(dest)}...`);
  const response = await fetch(fullUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${fullUrl}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(dest, buffer);
}

// ============================================================
// Step 1: Download Excel Files
// ============================================================

async function downloadExcelFiles(forceDownload: boolean): Promise<void> {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  // Facility overview
  const facilityPath = path.join(DATA_DIR, 'facility-overview.xlsx');
  if (forceDownload || !fs.existsSync(facilityPath)) {
    await downloadFile(FACILITY_OVERVIEW_URL, facilityPath);
  } else {
    console.log('  facility-overview.xlsx (cached)');
  }

  // MDC files
  for (const [mdc, url] of Object.entries(MDC_URLS)) {
    const filePath = path.join(DATA_DIR, `${mdc.toLowerCase()}.xlsx`);
    if (forceDownload || !fs.existsSync(filePath)) {
      await downloadFile(url, filePath);
      // Small delay to be polite
      await new Promise(r => setTimeout(r, 500));
    } else {
      console.log(`  ${mdc.toLowerCase()}.xlsx (cached)`);
    }
  }
}

// ============================================================
// Step 2: Parse Facility Overview
// ============================================================

// MHLW facility overview structure (FY2023):
// Row 0 = header: 告示番号 | 通番 | 市町村番号 | 都道府県 | 施設名 | 病院類型 | DPC算定病床数 | ...
// Row 1+ = data:  10001    | 10001| 01101      | 北海道   | 札幌医科大学附属病院 | ...

const PREF_NORMALIZE: Record<string, string> = {
  '北海道':'北海道','青森':'青森県','岩手':'岩手県','宮城':'宮城県','秋田':'秋田県',
  '山形':'山形県','福島':'福島県','茨城':'茨城県','栃木':'栃木県','群馬':'群馬県',
  '埼玉':'埼玉県','千葉':'千葉県','東京':'東京都','神奈川':'神奈川県','新潟':'新潟県',
  '富山':'富山県','石川':'石川県','福井':'福井県','山梨':'山梨県','長野':'長野県',
  '岐阜':'岐阜県','静岡':'静岡県','愛知':'愛知県','三重':'三重県','滋賀':'滋賀県',
  '京都':'京都府','大阪':'大阪府','兵庫':'兵庫県','奈良':'奈良県','和歌山':'和歌山県',
  '鳥取':'鳥取県','島根':'島根県','岡山':'岡山県','広島':'広島県','山口':'山口県',
  '徳島':'徳島県','香川':'香川県','愛媛':'愛媛県','高知':'高知県','福岡':'福岡県',
  '佐賀':'佐賀県','長崎':'長崎県','熊本':'熊本県','大分':'大分県','宮崎':'宮崎県',
  '鹿児島':'鹿児島県','沖縄':'沖縄県',
};

function normalizePref(raw: string): string {
  const s = raw.trim();
  return PREF_NORMALIZE[s] || s;
}

function parseFacilityOverview(): Map<string, FacilityInfo> {
  const filePath = path.join(DATA_DIR, 'facility-overview.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const facilities = new Map<string, FacilityInfo>();

  // Detect columns from row 0 header (may have \r\n in names)
  const header = rows[0] || [];
  let codeCol = -1, nameCol = -1, prefCol = -1, bedCol = -1;

  for (let j = 0; j < header.length; j++) {
    const h = String(header[j] || '').replace(/\r?\n/g, '');
    if (h.includes('告示番号')) codeCol = j;
    if (h.includes('施設名')) nameCol = j;
    if (h.includes('都道') && h.includes('府県')) prefCol = j;
    if (h.includes('DPC算定病床数')) bedCol = j;
  }

  if (nameCol < 0) {
    console.error('Could not detect columns in facility overview');
    console.log('  Header:', header.slice(0, 10));
    return facilities;
  }

  console.log(`  Columns: code=${codeCol}, name=${nameCol}, pref=${prefCol}, bed=${bedCol}`);

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const code = String(row[codeCol] || '').trim();
    if (!code || !/^\d{4,}$/.test(code)) continue;

    const name = String(row[nameCol] || '').trim();
    if (!name) continue;

    const pref = prefCol >= 0 ? normalizePref(String(row[prefCol] || '')) : '';
    const beds = bedCol >= 0 ? (parseInt(String(row[bedCol]), 10) || 0) : 0;

    facilities.set(code, { code, name, prefecture: pref, beds });
  }

  console.log(`  Parsed ${facilities.size} facilities`);
  return facilities;
}

// ============================================================
// Step 3: Parse MDC Files (Wide Format)
// ============================================================

// MHLW MDC file structure (FY2023):
// Row 0: DPC codes per disease group in their starting columns (e.g. col3="010010", col15="010020")
// Row 1: Disease names at same columns (e.g. col3="脳腫瘍", col15="くも膜下出血")
// Row 2: Data type markers (件数 for counts, 在院日数 for avg days)
// Row 3: Sub-codes: 99=total, 97=surgery, 97(再掲)=excl transfusion, 01-03=procedures
// Row 4+: Hospital data. Col0=告示番号, Col2=施設名, Col3+=values

interface DiseaseColumn {
  disease: string;
  totalCol: number;     // column index for code "99" under 件数
  surgeryCol: number;   // column index for code "97" under 件数
}

function parseMDCFile(
  mdcName: string,
): Map<string, Array<{ disease: string; total: number; surgery: number; non_surgery: number }>> {
  const filePath = path.join(DATA_DIR, `${mdcName.toLowerCase()}.xlsx`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ${mdcName} file not found, skipping`);
    return new Map();
  }

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (rows.length < 5) {
    console.warn(`  ${mdcName}: Too few rows, skipping`);
    return new Map();
  }

  const diseaseRow = rows[1] || [];  // Disease names
  const typeRow = rows[2] || [];     // 件数 / 在院日数
  const codeRow = rows[3] || [];     // 99, 97, etc.

  // Identify disease columns: find each disease name in row 1,
  // then find its "99" (total) and "97" (surgery) columns under "件数" section
  const diseases: DiseaseColumn[] = [];

  for (let j = 3; j < diseaseRow.length; j++) {
    const diseaseName = diseaseRow[j];
    if (diseaseName == null || String(diseaseName).trim() === '') continue;

    const disease = String(diseaseName).trim();

    // Find the 件数 section for this disease (starts at this column)
    // Row 2 should have "件数" at this column
    if (String(typeRow[j] || '') !== '件数') continue;

    // Within the 件数 section, find code "99" (total) and "97" (surgery)
    let totalCol = -1;
    let surgeryCol = -1;

    // Scan forward from j until we hit 在院日数 or next disease
    for (let k = j; k < codeRow.length; k++) {
      const code = String(codeRow[k] || '').trim();
      const type = String(typeRow[k] || '').trim();

      // Stop if we've entered the 在院日数 section or next disease
      if (type === '在院日数') break;
      if (k > j && diseaseRow[k] != null && String(diseaseRow[k]).trim() !== '') break;

      if (code === '99' && totalCol < 0) totalCol = k;
      else if (code === '97' && surgeryCol < 0) surgeryCol = k;
    }

    if (totalCol >= 0) {
      diseases.push({ disease, totalCol, surgeryCol });
    }
  }

  console.log(`  ${mdcName}: Found ${diseases.length} disease groups`);

  // Parse hospital data (row 4+)
  const hospitalTreatments = new Map<string, Array<{ disease: string; total: number; surgery: number; non_surgery: number }>>();

  const parseNum = (v: any): number => {
    if (v == null) return 0;
    const s = String(v).replace(/,/g, '').trim();
    if (s === '-' || s === '') return 0;
    return parseInt(s, 10) || 0;
  };

  for (let i = 4; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const code = String(row[0] || '').trim(); // 告示番号
    if (!code || !/^\d{4,}$/.test(code)) continue;

    for (const dc of diseases) {
      const total = parseNum(row[dc.totalCol]);
      if (total <= 0) continue;

      const surgery = dc.surgeryCol >= 0 ? parseNum(row[dc.surgeryCol]) : 0;

      if (!hospitalTreatments.has(code)) {
        hospitalTreatments.set(code, []);
      }
      hospitalTreatments.get(code)!.push({
        disease: dc.disease,
        total,
        surgery,
        non_surgery: total - surgery,
      });
    }
  }

  console.log(`  ${mdcName}: Parsed treatments for ${hospitalTreatments.size} hospitals`);
  return hospitalTreatments;
}

// ============================================================
// Step 3b: Aggregate + Rank
// ============================================================

function aggregateAndRank(
  allMdcData: Map<string, Array<{ disease: string; total: number; surgery: number; non_surgery: number }>>[],
  facilities: Map<string, FacilityInfo>
): Map<string, Treatment[]> {
  // Merge all MDC data per hospital
  const merged = new Map<string, Array<{ disease: string; total: number; surgery: number; non_surgery: number }>>();

  for (const mdcData of allMdcData) {
    for (const [code, treatments] of mdcData) {
      if (!merged.has(code)) merged.set(code, []);
      merged.get(code)!.push(...treatments);
    }
  }

  // Build disease → {code → total} for ranking
  const diseaseRankMap = new Map<string, Map<string, { total: number; pref: string }>>();

  for (const [code, treatments] of merged) {
    const facility = facilities.get(code);
    const pref = facility?.prefecture || '';

    for (const t of treatments) {
      if (!diseaseRankMap.has(t.disease)) {
        diseaseRankMap.set(t.disease, new Map());
      }
      const existing = diseaseRankMap.get(t.disease)!.get(code);
      if (!existing || t.total > existing.total) {
        diseaseRankMap.get(t.disease)!.set(code, { total: t.total, pref });
      }
    }
  }

  // Pre-compute rankings for each disease
  const nationalRanks = new Map<string, Map<string, number>>(); // disease → code → rank
  const prefRanks = new Map<string, Map<string, Map<string, number>>>(); // disease → pref → code → rank

  for (const [disease, hospitals] of diseaseRankMap) {
    // National rank
    const sorted = [...hospitals.entries()].sort((a, b) => b[1].total - a[1].total);
    const natRank = new Map<string, number>();
    sorted.forEach(([code], idx) => natRank.set(code, idx + 1));
    nationalRanks.set(disease, natRank);

    // Prefecture rank
    const byPref = new Map<string, Array<[string, number]>>();
    for (const [code, { total, pref }] of hospitals) {
      if (!pref) continue;
      if (!byPref.has(pref)) byPref.set(pref, []);
      byPref.get(pref)!.push([code, total]);
    }
    if (!prefRanks.has(disease)) prefRanks.set(disease, new Map());
    for (const [pref, entries] of byPref) {
      entries.sort((a, b) => b[1] - a[1]);
      const prefRankMap = new Map<string, number>();
      entries.forEach(([code], idx) => prefRankMap.set(code, idx + 1));
      prefRanks.get(disease)!.set(pref, prefRankMap);
    }
  }

  // Build final Treatment[] per hospital (top 10 by total)
  const result = new Map<string, Treatment[]>();

  for (const [code, treatments] of merged) {
    const facility = facilities.get(code);
    const pref = facility?.prefecture || '';

    // Deduplicate by disease name (keep highest total)
    const best = new Map<string, { total: number; surgery: number; non_surgery: number }>();
    for (const t of treatments) {
      const existing = best.get(t.disease);
      if (!existing || t.total > existing.total) {
        best.set(t.disease, { total: t.total, surgery: t.surgery, non_surgery: t.non_surgery });
      }
    }

    // Convert to Treatment[] with ranks
    const ranked: Treatment[] = [];
    for (const [disease, data] of best) {
      const natRank = nationalRanks.get(disease)?.get(code);
      const prefRank = prefRanks.get(disease)?.get(pref)?.get(code);
      const totalHospitals = nationalRanks.get(disease)?.size || 0;

      ranked.push({
        disease,
        total: data.total,
        surgery: data.surgery,
        non_surgery: data.non_surgery,
        national_rank: natRank ? `全国${natRank}位` : '',
        pref_rank: prefRank && pref ? `${pref}${prefRank}位` : '',
      });
    }

    // Sort by total desc, take top 10
    ranked.sort((a, b) => b.total - a.total);
    result.set(code, ranked.slice(0, 10));
  }

  console.log(`\nAggregated treatments for ${result.size} DPC hospitals`);
  return result;
}

// ============================================================
// Step 4: Fuzzy Match
// ============================================================

async function loadDbHospitals(): Promise<DBHospital[]> {
  const { data, error } = await supabase
    .from('jtb_hospitals')
    .select('id, name_ja, prefecture, category')
    .eq('is_active', true);

  if (error) throw new Error(`Supabase query failed: ${error.message}`);
  return (data || []) as DBHospital[];
}

function fuzzyMatchHospitals(
  dpcHospitals: Map<string, Treatment[]>,
  facilities: Map<string, FacilityInfo>,
  dbHospitals: DBHospital[]
): { matches: MatchResult[]; report: MatchReport } {
  const matches: MatchResult[] = [];
  const matchedDbIds = new Set<string>();
  const unmatchedDb: string[] = [];

  // Build normalized name → facility code mapping
  const dpcByNormName = new Map<string, string>();
  const dpcByName = new Map<string, string>();
  for (const [code, info] of facilities) {
    if (!dpcHospitals.has(code)) continue;
    dpcByNormName.set(normalize(info.name), code);
    dpcByName.set(info.name, code);
  }

  // Only match general_hospital category
  const targetHospitals = dbHospitals.filter(h => h.category === 'general_hospital');
  console.log(`\nMatching ${targetHospitals.length} general_hospital entries against ${dpcByNormName.size} DPC hospitals...`);

  for (const dbH of targetHospitals) {
    const dbNorm = normalize(dbH.name_ja);
    let matched = false;

    // Strategy 1: Exact match (after normalization)
    if (dpcByNormName.has(dbNorm)) {
      const code = dpcByNormName.get(dbNorm)!;
      const facility = facilities.get(code)!;
      matches.push({
        dbId: dbH.id,
        dbName: dbH.name_ja,
        dpcCode: code,
        dpcName: facility.name,
        matchType: 'exact',
        treatments: dpcHospitals.get(code)!,
      });
      matchedDbIds.add(dbH.id);
      matched = true;
      continue;
    }

    // Strategy 2: Contains match (DB name contains DPC name or vice versa)
    for (const [dpcNorm, code] of dpcByNormName) {
      if (dbNorm.includes(dpcNorm) || dpcNorm.includes(dbNorm)) {
        // Verify same prefecture if available
        const facility = facilities.get(code)!;
        if (dbH.prefecture && facility.prefecture && dbH.prefecture !== facility.prefecture) continue;

        matches.push({
          dbId: dbH.id,
          dbName: dbH.name_ja,
          dpcCode: code,
          dpcName: facility.name,
          matchType: 'contains',
          treatments: dpcHospitals.get(code)!,
        });
        matchedDbIds.add(dbH.id);
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Strategy 3: Longest common substring (same prefecture, > 60% overlap)
    let bestMatch: { code: string; score: number } | null = null;
    for (const [dpcNorm, code] of dpcByNormName) {
      const facility = facilities.get(code)!;
      // Must be same prefecture
      if (dbH.prefecture && facility.prefecture && dbH.prefecture !== facility.prefecture) continue;

      const lcs = longestCommonSubstring(dbNorm, dpcNorm);
      const shorter = Math.min(dbNorm.length, dpcNorm.length);
      const score = shorter > 0 ? lcs / shorter : 0;

      // Require LCS of at least 5 chars to avoid short-string false positives
      if (score > 0.7 && lcs >= 5 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { code, score };
      }
    }

    if (bestMatch) {
      const code = bestMatch.code;
      const facility = facilities.get(code)!;
      matches.push({
        dbId: dbH.id,
        dbName: dbH.name_ja,
        dpcCode: code,
        dpcName: facility.name,
        matchType: 'substring',
        treatments: dpcHospitals.get(code)!,
      });
      matchedDbIds.add(dbH.id);
    } else {
      unmatchedDb.push(dbH.name_ja);
    }
  }

  const report: MatchReport = {
    timestamp: new Date().toISOString(),
    totalDpcHospitals: dpcByNormName.size,
    totalDbHospitals: targetHospitals.length,
    matched: matches.map(m => ({
      dbName: m.dbName,
      dpcName: m.dpcName,
      matchType: m.matchType,
      treatmentCount: m.treatments.length,
    })),
    unmatched: unmatchedDb,
  };

  return { matches, report };
}

// ============================================================
// Step 5: Update Database
// ============================================================

async function updateDatabase(matches: MatchResult[]): Promise<{ updated: number; skipped: number; failed: number }> {
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const match of matches) {
    if (match.treatments.length === 0) {
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('jtb_hospitals')
      .update({ top_treatments: match.treatments })
      .eq('id', match.dbId);

    if (error) {
      console.error(`  Failed to update ${match.dbName}: ${error.message}`);
      failed++;
    } else {
      updated++;
    }
  }

  return { updated, skipped, failed };
}

// ============================================================
// Main
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const forceDownload = args.includes('--download');
  const skipDownload = args.includes('--skip-download');

  console.log('=== MHLW DPC Data Import ===');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log();

  // Step 1: Download
  if (!skipDownload) {
    console.log('Step 1: Downloading Excel files...');
    await downloadExcelFiles(forceDownload);
    console.log();
  }

  // Step 2: Parse facility overview
  console.log('Step 2: Parsing facility overview...');
  const facilities = parseFacilityOverview();
  if (facilities.size === 0) {
    console.error('No facilities parsed. Check the Excel file format.');
    process.exit(1);
  }
  console.log();

  // Step 3: Parse MDC files
  console.log('Step 3: Parsing MDC files...');
  const allMdcData: Map<string, Array<{ disease: string; total: number; surgery: number; non_surgery: number }>>[] = [];

  for (const mdcName of Object.keys(MDC_URLS)) {
    const mdcData = parseMDCFile(mdcName);
    allMdcData.push(mdcData);
  }

  // Aggregate + rank
  console.log('\nStep 3b: Aggregating and ranking treatments...');
  const dpcHospitals = aggregateAndRank(allMdcData, facilities);

  // Step 4: Fuzzy match
  console.log('\nStep 4: Loading DB hospitals...');
  const dbHospitals = await loadDbHospitals();
  console.log(`  Loaded ${dbHospitals.length} active hospitals from DB`);

  const { matches, report } = fuzzyMatchHospitals(dpcHospitals, facilities, dbHospitals);

  // Save report
  fs.writeFileSync(MATCH_REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\n=== Match Report ===`);
  console.log(`  DPC hospitals with data: ${report.totalDpcHospitals}`);
  console.log(`  DB general_hospitals: ${report.totalDbHospitals}`);
  console.log(`  Matched: ${report.matched.length}`);
  console.log(`    - exact: ${report.matched.filter(m => m.matchType === 'exact').length}`);
  console.log(`    - contains: ${report.matched.filter(m => m.matchType === 'contains').length}`);
  console.log(`    - substring: ${report.matched.filter(m => m.matchType === 'substring').length}`);
  console.log(`  Unmatched: ${report.unmatched.length}`);
  if (report.unmatched.length > 0) {
    console.log(`  Unmatched hospitals:`);
    for (const name of report.unmatched) {
      console.log(`    - ${name}`);
    }
  }
  console.log(`\n  Report saved to: ${MATCH_REPORT_PATH}`);

  // Step 5: Update DB
  if (dryRun) {
    console.log('\n[DRY RUN] Skipping database update.');
    console.log('\nSample matches:');
    for (const m of matches.slice(0, 5)) {
      console.log(`  ${m.dbName} ←→ ${m.dpcName} (${m.matchType})`);
      for (const t of m.treatments.slice(0, 3)) {
        console.log(`    ${t.disease}: ${t.total}件 (手術${t.surgery}) ${t.pref_rank} ${t.national_rank}`);
      }
    }
  } else {
    console.log('\nStep 5: Updating database...');
    const { updated, skipped, failed } = await updateDatabase(matches);
    console.log(`  Updated: ${updated}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Failed: ${failed}`);
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
