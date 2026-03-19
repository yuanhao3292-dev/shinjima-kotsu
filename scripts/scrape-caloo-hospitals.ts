/**
 * Caloo 医院医学实力数据爬虫
 *
 * 从 caloo.jp 采集 DPC 治療実績（疾患治疗统计）和专门医信息，
 * 更新到 jtb_hospitals 表的 top_treatments / specialist_doctors / caloo_url 字段。
 *
 * 分两阶段：
 * 1. 查找 Caloo 医院 ID（Google 搜索 → 解析结果）
 * 2. 爬取实绩页 + 专门医数据
 *
 * Usage: npx tsx scripts/scrape-caloo-hospitals.ts
 *
 * 支持断点续传：中间结果保存到 data/caloo-mapping.json
 */

import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
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

const MAPPING_PATH = path.resolve(__dirname, '../data/caloo-mapping.json');
const DELAY_SEARCH_MS = 3000;  // Google 搜索间隔
const DELAY_SCRAPE_MS = 2000;  // Caloo 页面爬取间隔
const CALOO_BASE = 'https://caloo.jp';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
};

// ============================================================
// Types
// ============================================================

interface CalooPMapping {
  hospital_id: string;     // Our DB UUID
  name_ja: string;
  caloo_id: string;        // 10-digit Caloo hospital code
  caloo_url: string;       // Full Caloo URL
  status: 'found' | 'not_found' | 'error';
  searched_at: string;
}

interface Treatment {
  disease: string;
  total: number;
  surgery: number;
  non_surgery: number;
  pref_rank: string;
  national_rank: string;
}

interface SpecialistDoctor {
  name: string;
  qualification: string;
}

// ============================================================
// Utils
// ============================================================

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchWithRetry(url: string, retries = 2): Promise<string | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS, redirect: 'follow' });
      if (res.status === 429) {
        console.log(`    Rate limited, waiting ${10 + i * 10}s...`);
        await sleep((10 + i * 10) * 1000);
        continue;
      }
      if (!res.ok) {
        if (i < retries) { await sleep(3000); continue; }
        return null;
      }
      return await res.text();
    } catch (err) {
      if (i < retries) { await sleep(3000); continue; }
      return null;
    }
  }
  return null;
}

// ============================================================
// Phase 1: Find Caloo IDs via Google Search
// ============================================================

function loadMapping(): Record<string, CalooPMapping> {
  if (fs.existsSync(MAPPING_PATH)) {
    return JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf-8'));
  }
  return {};
}

function saveMapping(mapping: Record<string, CalooPMapping>): void {
  const dir = path.dirname(MAPPING_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(MAPPING_PATH, JSON.stringify(mapping, null, 2));
}

/**
 * Search Google for a hospital's Caloo page
 * Returns the Caloo hospital ID (10-digit code) or null
 */
async function searchCalooId(hospitalName: string): Promise<{ calooId: string; calooUrl: string } | null> {
  // Strategy 1: Google search
  const query = encodeURIComponent(`site:caloo.jp/hospitals/detail ${hospitalName}`);
  const googleUrl = `https://www.google.com/search?q=${query}&num=5&hl=ja`;

  const html = await fetchWithRetry(googleUrl);
  if (!html) return null;

  // Parse Google results for Caloo URLs
  const calooPattern = /caloo\.jp\/hospitals\/detail\/(\d{10})/g;
  const matches = [...html.matchAll(calooPattern)];

  if (matches.length === 0) {
    // Strategy 2: Try DuckDuckGo
    return await searchCalooIdDDG(hospitalName);
  }

  // Find the best match - prefer the one with the hospital name in the result
  const calooId = matches[0][1];
  return {
    calooId,
    calooUrl: `${CALOO_BASE}/hospitals/detail/${calooId}`,
  };
}

async function searchCalooIdDDG(hospitalName: string): Promise<{ calooId: string; calooUrl: string } | null> {
  const query = encodeURIComponent(`site:caloo.jp/hospitals/detail ${hospitalName}`);
  const ddgUrl = `https://html.duckduckgo.com/html/?q=${query}`;

  const html = await fetchWithRetry(ddgUrl);
  if (!html) return null;

  const calooPattern = /caloo\.jp\/hospitals\/detail\/(\d{10})/g;
  const matches = [...html.matchAll(calooPattern)];

  if (matches.length === 0) return null;

  const calooId = matches[0][1];
  return {
    calooId,
    calooUrl: `${CALOO_BASE}/hospitals/detail/${calooId}`,
  };
}

async function phase1FindCalooIds(hospitals: Array<{ id: string; name_ja: string }>): Promise<Record<string, CalooPMapping>> {
  console.log('\n=== Phase 1: Finding Caloo Hospital IDs ===\n');

  const mapping = loadMapping();
  let found = 0;
  let notFound = 0;
  let skipped = 0;

  for (let i = 0; i < hospitals.length; i++) {
    const h = hospitals[i];

    // Skip if already searched
    if (mapping[h.id]) {
      if (mapping[h.id].status === 'found') found++;
      else notFound++;
      skipped++;
      continue;
    }

    process.stdout.write(`  [${i + 1}/${hospitals.length}] ${h.name_ja}...`);

    const result = await searchCalooId(h.name_ja);

    if (result) {
      mapping[h.id] = {
        hospital_id: h.id,
        name_ja: h.name_ja,
        caloo_id: result.calooId,
        caloo_url: result.calooUrl,
        status: 'found',
        searched_at: new Date().toISOString(),
      };
      console.log(` → ${result.calooId}`);
      found++;
    } else {
      mapping[h.id] = {
        hospital_id: h.id,
        name_ja: h.name_ja,
        caloo_id: '',
        caloo_url: '',
        status: 'not_found',
        searched_at: new Date().toISOString(),
      };
      console.log(' → NOT FOUND');
      notFound++;
    }

    // Save progress after each search
    saveMapping(mapping);

    // Rate limit
    if (i < hospitals.length - 1 && !mapping[hospitals[i + 1]?.id]) {
      await sleep(DELAY_SEARCH_MS);
    }
  }

  console.log(`\nPhase 1 complete: ${found} found, ${notFound} not found, ${skipped} skipped (cached)`);
  return mapping;
}

// ============================================================
// Phase 2: Scrape DPC Treatment Data
// ============================================================

/**
 * Parse Caloo DPC treatment table.
 *
 * HTML structure (table.hosp-dpc):
 *   <tr class="bbold">
 *     <th rowspan="N">category</th>
 *     <td><a href="/dpc/code/XXX">disease</a></td>
 *     <td>total</td> <td>surgery</td> <td>non_surgery</td>
 *     <td>pref_rank</td> <td>national_rank</td>
 *   </tr>
 *   <tr>                             ← subsequent rows in same category
 *     <td><a>disease</a></td>
 *     <td>total</td> ...
 *   </tr>
 */
function parseTreatments($: cheerio.CheerioAPI): Treatment[] {
  const treatments: Treatment[] = [];

  $('table.hosp-dpc tr').each((_, row) => {
    const $row = $(row);
    // Skip header rows
    if ($row.hasClass('trtop')) return;

    const tds = $row.find('td');
    if (tds.length < 5) return; // need at least disease + total + surgery + non_surgery + 1 rank

    // In "bbold" rows the first child is <th> (category), so <td> indices are the same
    // td[0] = disease link, td[1] = total, td[2] = surgery, td[3] = non_surgery,
    // td[4] = pref rank, td[5] = national rank
    const disease = $(tds[0]).text().trim();
    const totalStr = $(tds[1]).text().replace(/,/g, '').trim();
    const total = parseInt(totalStr, 10);

    if (!disease || isNaN(total) || total === 0) return;

    const parseNum = (el: any) => {
      const t = $(el).text().replace(/,/g, '').trim();
      return t === '-' || t === '' ? 0 : parseInt(t, 10) || 0;
    };

    const surgery = parseNum(tds[2]);
    const nonSurgery = parseNum(tds[3]);

    let prefRank = '';
    let nationalRank = '';
    if (tds.length >= 5) {
      const r = $(tds[4]).text().trim();
      if (r.includes('位')) prefRank = r;
    }
    if (tds.length >= 6) {
      const r = $(tds[5]).text().trim();
      if (r.includes('位')) nationalRank = r;
    }

    treatments.push({ disease, total, surgery, non_surgery: nonSurgery, pref_rank: prefRank, national_rank: nationalRank });
  });

  // Sort by total cases descending, take top 10
  treatments.sort((a, b) => b.total - a.total);
  return treatments.slice(0, 10);
}

async function scrapeTreatments(calooId: string): Promise<Treatment[]> {
  const url = `${CALOO_BASE}/hospitals/detail/${calooId}/achievements`;
  const html = await fetchWithRetry(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  return parseTreatments($);
}

// ============================================================
// Phase 2b: Scrape Specialist Doctors
// ============================================================

/**
 * Parse Caloo specialist doctor data.
 *
 * HTML structure (inside div.hosp-text):
 *   <h5>循環器専門医</h5>
 *   <p>在籍：田中 太郎 医師、佐藤 花子 医師</p>
 *
 * Some entries have descriptions before 在籍：, or annotations like （指導医）.
 * We only care about 専門医 qualifications and doctor names.
 */
function parseSpecialists($: cheerio.CheerioAPI): SpecialistDoctor[] {
  const doctors: SpecialistDoctor[] = [];
  const seen = new Set<string>();

  // Find h5 headers within the specialist section (div.hosp-text)
  $('div.hosp-text h5').each((_, header) => {
    const qualification = $(header).text().trim();
    // Only interested in 専門医 / 認定医 / 技術認定医 qualifications
    if (!qualification.includes('専門医') && !qualification.includes('認定医')) return;

    // The <p> immediately after <h5> contains doctor names
    const nextP = $(header).next('p');
    if (!nextP.length) return;

    // Get text content (handles <br /> tags)
    const content = nextP.text();
    if (!content.includes('在籍')) return;

    // Extract everything after 在籍：(or 在籍: or just 在籍 followed by names)
    const nameSection = content.replace(/[\s\S]*?在籍[：:\s]*/, '').trim();

    // Split by 、 or , and clean up each name
    const names = nameSection
      .split(/[、,\n]/)
      .map(n => n
        .replace(/医師/g, '')
        .replace(/（[^）]*）/g, '')  // remove annotations like （指導医）
        .replace(/\([^)]*\)/g, '')   // remove (annotations)
        .replace(/【[^】]*】/g, '')  // remove 【annotations】
        .trim()
      )
      .filter(n => {
        // Valid Japanese name: 2-10 chars, contains kanji/hiragana
        if (n.length < 2 || n.length > 15) return false;
        if (/[a-zA-Z0-9]/.test(n)) return false; // skip non-name strings
        if (n === '在籍' || n === '在籍：' || n === '在籍:') return false;
        return /[\u4e00-\u9faf\u3040-\u309f]/.test(n); // must have kanji or hiragana
      });

    for (const name of names) {
      const key = `${name}:${qualification}`;
      if (!seen.has(key)) {
        seen.add(key);
        doctors.push({ name, qualification });
      }
    }
  });

  return doctors;
}

async function scrapeSpecialists(calooId: string): Promise<SpecialistDoctor[]> {
  const url = `${CALOO_BASE}/hospitals/detail/${calooId}`;
  const html = await fetchWithRetry(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  return parseSpecialists($);
}

// ============================================================
// Phase 3: Update Database
// ============================================================

async function updateHospital(
  hospitalId: string,
  calooUrl: string,
  treatments: Treatment[],
  specialists: SpecialistDoctor[]
): Promise<boolean> {
  const { error } = await supabase
    .from('jtb_hospitals')
    .update({
      caloo_url: calooUrl,
      top_treatments: treatments,
      specialist_doctors: specialists,
    })
    .eq('id', hospitalId);

  return !error;
}

// ============================================================
// Main
// ============================================================

// ============================================================
// Test mode: verify parsing on a known hospital
// ============================================================

async function testScraping() {
  console.log('=== Test Mode: Scraping 亀田総合病院 (Caloo ID: 1120489250) ===\n');

  // Test treatment parsing
  console.log('--- DPC Treatments ---');
  const treatments = await scrapeTreatments('1120489250');
  if (treatments.length === 0) {
    console.log('WARNING: No treatments parsed! Check HTML structure.');
  } else {
    console.log(`Found ${treatments.length} treatments (top 10):`);
    for (const t of treatments) {
      console.log(`  ${t.disease}: ${t.total}件 (手術${t.surgery}, 非手術${t.non_surgery}) ${t.pref_rank} ${t.national_rank}`);
    }
  }

  await sleep(2000);

  // Test specialist parsing
  console.log('\n--- Specialist Doctors ---');
  const specialists = await scrapeSpecialists('1120489250');
  if (specialists.length === 0) {
    console.log('WARNING: No specialists parsed! Check HTML structure.');
  } else {
    console.log(`Found ${specialists.length} specialists:`);
    // Group by qualification
    const byQual: Record<string, string[]> = {};
    for (const d of specialists) {
      if (!byQual[d.qualification]) byQual[d.qualification] = [];
      byQual[d.qualification].push(d.name);
    }
    for (const [qual, names] of Object.entries(byQual)) {
      console.log(`  ${qual}: ${names.join('、')}`);
    }
  }

  await sleep(2000);

  // Test Google search
  console.log('\n--- Google Search ---');
  const result = await searchCalooId('亀田総合病院');
  if (result) {
    console.log(`Found: ${result.calooId} (${result.calooUrl})`);
    if (result.calooId === '1120489250') {
      console.log('✓ Correct Caloo ID!');
    } else {
      console.log(`✗ Expected 1120489250, got ${result.calooId}`);
    }
  } else {
    console.log('Google search returned no results. Google may be blocking.');
    console.log('Trying DuckDuckGo fallback...');
    const ddgResult = await searchCalooIdDDG('亀田総合病院');
    if (ddgResult) {
      console.log(`DDG found: ${ddgResult.calooId}`);
    } else {
      console.log('DDG also returned no results.');
      console.log('\nSearch is blocked. You may need to:');
      console.log('1. Manually create data/caloo-mapping.json');
      console.log('2. Or run Phase 2 only: npx tsx scripts/scrape-caloo-hospitals.ts --phase2');
    }
  }
}

// ============================================================
// Main
// ============================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--test')) {
    return await testScraping();
  }

  const phase2Only = args.includes('--phase2');

  console.log('=== Caloo Hospital Medical Strength Scraper ===\n');

  // 1. Load hospitals from DB
  const { data: hospitals, error } = await supabase
    .from('jtb_hospitals')
    .select('id, name_ja, category')
    .eq('is_active', true)
    .order('name_ja');

  if (error || !hospitals) {
    console.error('Failed to fetch hospitals:', error?.message);
    process.exit(1);
  }

  console.log(`Loaded ${hospitals.length} active hospitals\n`);

  // Filter: skip aesthetics and stem_cell clinics (unlikely to have DPC data)
  const candidates = hospitals.filter(h =>
    h.category === 'general_hospital' || h.category === 'health_screening'
  );
  const skippedClinics = hospitals.length - candidates.length;
  console.log(`Candidates for Caloo search: ${candidates.length} (skipped ${skippedClinics} aesthetics/stem_cell clinics)\n`);

  // Phase 1: Find Caloo IDs
  let mapping: Record<string, CalooPMapping>;
  if (phase2Only) {
    mapping = loadMapping();
    if (Object.keys(mapping).length === 0) {
      console.error('No mapping file found! Run without --phase2 first, or create data/caloo-mapping.json manually.');
      process.exit(1);
    }
    console.log(`Loaded existing mapping: ${Object.values(mapping).filter(m => m.status === 'found').length} found\n`);
  } else {
    mapping = await phase1FindCalooIds(candidates);
  }

  // Phase 2: Scrape data for found hospitals
  console.log('\n=== Phase 2: Scraping Caloo Data ===\n');

  const foundHospitals = Object.values(mapping).filter(m => m.status === 'found');
  console.log(`Scraping ${foundHospitals.length} hospitals with Caloo pages\n`);

  let scraped = 0;
  let noData = 0;
  let errors = 0;

  for (let i = 0; i < foundHospitals.length; i++) {
    const m = foundHospitals[i];
    process.stdout.write(`  [${i + 1}/${foundHospitals.length}] ${m.name_ja}...`);

    // Scrape treatments
    const treatments = await scrapeTreatments(m.caloo_id);
    await sleep(DELAY_SCRAPE_MS);

    // Scrape specialists
    const specialists = await scrapeSpecialists(m.caloo_id);
    await sleep(DELAY_SCRAPE_MS);

    if (treatments.length === 0 && specialists.length === 0) {
      console.log(' no DPC data');
      await updateHospital(m.hospital_id, m.caloo_url, [], []);
      noData++;
      continue;
    }

    // Update DB
    const ok = await updateHospital(m.hospital_id, m.caloo_url, treatments, specialists);

    if (ok) {
      console.log(` ${treatments.length} treatments, ${specialists.length} specialists`);
      scraped++;
    } else {
      console.log(' DB ERROR');
      errors++;
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Total active hospitals: ${hospitals.length}`);
  console.log(`Skipped (aesthetics/stem_cell): ${skippedClinics}`);
  console.log(`Caloo page found: ${foundHospitals.length}`);
  console.log(`Caloo page not found: ${Object.values(mapping).filter(m => m.status === 'not_found').length}`);
  console.log(`Scraped with data: ${scraped}`);
  console.log(`Scraped but no DPC data: ${noData}`);
  console.log(`Errors: ${errors}`);

  // List not-found hospitals
  const notFound = Object.values(mapping).filter(m => m.status === 'not_found');
  if (notFound.length > 0) {
    console.log('\n=== Not Found on Caloo ===');
    for (const m of notFound) {
      console.log(`  - ${m.name_ja}`);
    }
  }

  // Sample results
  console.log('\n=== Sample Results ===');
  const sampleIds = foundHospitals.slice(0, 3).map(m => m.hospital_id);
  if (sampleIds.length > 0) {
    const { data: samples } = await supabase
      .from('jtb_hospitals')
      .select('name_ja, caloo_url, top_treatments, specialist_doctors')
      .in('id', sampleIds);

    for (const s of (samples || [])) {
      console.log(`\n  ${s.name_ja}`);
      console.log(`    URL: ${s.caloo_url}`);
      const treatments = s.top_treatments as Treatment[];
      if (treatments?.length > 0) {
        console.log(`    Top treatment: ${treatments[0].disease} (${treatments[0].total}件)`);
      }
      const docs = s.specialist_doctors as SpecialistDoctor[];
      if (docs?.length > 0) {
        console.log(`    Specialists: ${docs.length} doctors`);
      }
    }
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
