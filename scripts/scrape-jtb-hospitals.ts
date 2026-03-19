/**
 * JTB 159 家合作医院数据爬虫
 *
 * 爬取 https://j-medical-healthcare.com/facility/ 全部 16 页列表，
 * 逐个访问详情页提取结构化数据，输出到 data/jtb-hospitals.json
 *
 * Usage: npx tsx scripts/scrape-jtb-hospitals.ts
 */

import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://j-medical-healthcare.com';
const LIST_URL = `${BASE_URL}/facility/`;
const TOTAL_PAGES = 16;
const OUTPUT_PATH = path.resolve(__dirname, '../data/jtb-hospitals.json');
const DELAY_MS = 1500; // 请求间隔

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
  programs: JTBProgram[];
  languages: string[];
  certifications: string[];
  scraped_at: string;
}

interface JTBProgram {
  name: string;
  category: string;
  url: string;
}

interface ListItem {
  jtb_id: number;
  name_ja: string;
  detail_url: string;
}

// ============================================================
// Prefecture → Region mapping
// ============================================================

const PREFECTURE_REGION: Record<string, string> = {
  北海道: '北海道',
  青森県: '東北', 岩手県: '東北', 宮城県: '東北', 秋田県: '東北', 山形県: '東北', 福島県: '東北',
  茨城県: '関東', 栃木県: '関東', 群馬県: '関東', 埼玉県: '関東', 千葉県: '関東', 東京都: '関東', 神奈川県: '関東',
  新潟県: '中部', 富山県: '中部', 石川県: '中部', 福井県: '中部', 山梨県: '中部', 長野県: '中部', 岐阜県: '中部', 静岡県: '中部', 愛知県: '中部',
  三重県: '近畿', 滋賀県: '近畿', 京都府: '近畿', 大阪府: '近畿', 兵庫県: '近畿', 奈良県: '近畿', 和歌山県: '近畿',
  鳥取県: '中国', 島根県: '中国', 岡山県: '中国', 広島県: '中国', 山口県: '中国',
  徳島県: '四国', 香川県: '四国', 愛媛県: '四国', 高知県: '四国',
  福岡県: '九州', 佐賀県: '九州', 長崎県: '九州', 熊本県: '九州', 大分県: '九州', 宮崎県: '九州', 鹿児島県: '九州', 沖縄県: '九州',
};

function extractPrefecture(address: string): string {
  // 都道府県 pattern: 東京都, 大阪府, 京都府, 北海道, XXX県
  const match = address.match(/(東京都|北海道|(?:大阪|京都)府|.{2,3}県)/);
  return match ? match[1].trim() : '';
}

function getRegion(prefecture: string): string {
  return PREFECTURE_REGION[prefecture] || '不明';
}

// ============================================================
// HTTP fetch with retry
// ============================================================

async function fetchPage(url: string, retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ja,en;q=0.9',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.text();
    } catch (err) {
      console.warn(`  Retry ${i + 1}/${retries} for ${url}: ${(err as Error).message}`);
      if (i === retries - 1) throw err;
      await sleep(3000);
    }
  }
  throw new Error('Unreachable');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Step 1: Scrape listing pages to get all hospital IDs
// ============================================================

async function scrapeListPage(pageNum: number): Promise<ListItem[]> {
  const url = pageNum === 1 ? LIST_URL : `${LIST_URL}?pageID=${pageNum}`;
  console.log(`[List] Fetching page ${pageNum}/${TOTAL_PAGES}...`);

  const html = await fetchPage(url);
  const $ = cheerio.load(html);
  const items: ListItem[] = [];

  // Find all links to detail pages
  $('a[href*="/facility/detail/id="]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const idMatch = href.match(/id=(\d+)/);
    if (!idMatch) return;

    const jtb_id = parseInt(idMatch[1], 10);
    // Avoid duplicates within same page
    if (items.some((i) => i.jtb_id === jtb_id)) return;

    // Try to get hospital name from the link text or nearby heading
    let name_ja = $(el).text().trim();
    // If the link wraps an image or complex content, try parent
    if (!name_ja || name_ja.length > 200) {
      name_ja = $(el).find('h2, h3, h4, .name, .title').first().text().trim();
    }
    // Clean up whitespace
    name_ja = name_ja.replace(/\s+/g, ' ').trim();

    items.push({
      jtb_id,
      name_ja: name_ja || `Hospital_${jtb_id}`,
      detail_url: `${BASE_URL}/facility/detail/id=${jtb_id}`,
    });
  });

  console.log(`  Found ${items.length} hospitals on page ${pageNum}`);
  return items;
}

async function scrapeAllListPages(): Promise<ListItem[]> {
  const allItems: ListItem[] = [];
  const seenIds = new Set<number>();

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const items = await scrapeListPage(page);
    for (const item of items) {
      if (!seenIds.has(item.jtb_id)) {
        seenIds.add(item.jtb_id);
        allItems.push(item);
      }
    }
    if (page < TOTAL_PAGES) await sleep(DELAY_MS);
  }

  console.log(`\n[List] Total unique hospitals: ${allItems.length}\n`);
  return allItems;
}

// ============================================================
// Step 2: Scrape detail page for each hospital
// ============================================================

async function scrapeDetailPage(item: ListItem): Promise<JTBHospitalRaw> {
  const html = await fetchPage(item.detail_url);
  const $ = cheerio.load(html);

  // ---- Name (from breadcrumb or h1/h2) ----
  let name_ja = '';
  // Try breadcrumb last item
  const breadcrumbItems = $('li, .breadcrumb a, nav a').map((_, el) => $(el).text().trim()).get();
  if (breadcrumbItems.length > 0) {
    name_ja = breadcrumbItems[breadcrumbItems.length - 1];
  }
  // Fallback to page title or h1
  if (!name_ja || name_ja.length > 150) {
    name_ja = $('h1, h2').first().text().trim();
  }
  if (!name_ja) name_ja = item.name_ja;
  name_ja = name_ja.replace(/\s+/g, ' ').trim();

  // ---- Full page text for parsing ----
  const bodyText = $('body').text().replace(/\s+/g, ' ');

  // ---- Address ----
  let address = '';
  let postal_code = '';
  // Look for postal code pattern 〒XXX-XXXX
  const postalMatch = bodyText.match(/〒(\d{3}-?\d{4})\s*([^\n]{5,80})/);
  if (postalMatch) {
    postal_code = postalMatch[1];
    address = `〒${postalMatch[1]} ${postalMatch[2].trim()}`;
  }

  // ---- Prefecture & Region ----
  const prefecture = extractPrefecture(address);
  const region = getRegion(prefecture);

  // ---- Access ----
  let access = '';
  const accessPatterns = [/アクセス[：:]\s*(.{5,200})/i, /((?:駅|バス停).{2,100}(?:分|秒))/];
  for (const pat of accessPatterns) {
    const m = bodyText.match(pat);
    if (m) { access = m[1].trim(); break; }
  }

  // ---- Genres / Categories ----
  const genres: string[] = [];
  $('a[href*="search_ext_col"], .tag, .badge, .category, .genre').each((_, el) => {
    const t = $(el).text().trim();
    if (t && t.length < 30) genres.push(t);
  });
  // Also search for common genre keywords
  const genreKeywords = ['健診', '治療', '再生医療', '先進医療', 'がん', '免疫', 'リハビリ', '歯科', '美容'];
  for (const kw of genreKeywords) {
    if (bodyText.includes(kw) && !genres.includes(kw)) {
      // Only add if appears in a tag-like context
      $('a, span, div').each((_, el) => {
        const t = $(el).text().trim();
        if (t === kw && !genres.includes(kw)) genres.push(kw);
      });
    }
  }

  // ---- Overview (施設概要) ----
  let overview = '';
  const overviewSection = extractSection($, bodyText, ['施設概要', '施設紹介']);
  if (overviewSection) overview = overviewSection.slice(0, 1000);

  // ---- Website URL ----
  let website_url = '';
  $('a[href^="http"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (
      href &&
      !href.includes('j-medical-healthcare.com') &&
      !href.includes('javascript') &&
      !website_url
    ) {
      website_url = href;
    }
  });

  // ---- Sales Points (セールスポイント) ----
  const sales_points = extractSection($, bodyText, ['セールスポイント', '特徴']) || '';

  // ---- Equipment ----
  const equipment: string[] = [];
  const equipKW = ['CT', 'MRI', 'PET', 'マンモグラフィ', 'エコー', '内視鏡', 'ダヴィンチ', 'da Vinci', 'リニアック', 'サイバーナイフ', '重粒子線', '陽子線', 'ガンマナイフ', 'HIFU', 'ロボット'];
  for (const kw of equipKW) {
    if (bodyText.includes(kw) && !equipment.includes(kw)) {
      equipment.push(kw);
    }
  }

  // ---- Departments ----
  const departments: string[] = [];
  const deptKW = [
    '内科', '外科', '整形外科', '眼科', '小児科', '産婦人科', '皮膚科', '泌尿器科',
    '耳鼻咽喉科', '放射線科', '麻酔科', '精神科', 'リハビリテーション科',
    '循環器内科', '消化器内科', '呼吸器内科', '脳神経外科', '心臓血管外科',
    '消化器外科', '呼吸器外科', '形成外科', '歯科', '口腔外科',
    '救急科', '病理診断科', '腫瘍内科', '血液内科', '内分泌科',
    '糖尿病内科', '腎臓内科', '神経内科', '婦人科', '乳腺外科',
    'リウマチ科', 'アレルギー科', '総合診療科', '緩和ケア科',
  ];
  for (const kw of deptKW) {
    if (bodyText.includes(kw) && !departments.includes(kw)) {
      departments.push(kw);
    }
  }

  // ---- Specialties ----
  const specialties: string[] = [];
  const specKW = [
    '人間ドック', '脳ドック', 'がん検診', 'PET検診', '心臓ドック', 'レディースドック',
    '健康診断', '再生医療', '免疫療法', '遺伝子治療', '幹細胞',
    'ロボット手術', '先進医療', '重粒子線治療', '陽子線治療', 'カテーテル治療',
    '内視鏡手術', '腹腔鏡手術', '放射線治療', '化学療法', '透析',
    'リハビリ', '美容', '歯科インプラント', '矯正歯科',
  ];
  for (const kw of specKW) {
    if (bodyText.includes(kw) && !specialties.includes(kw)) {
      specialties.push(kw);
    }
  }

  // ---- Programs ----
  const programs: JTBProgram[] = [];
  $('a[href*="/program/detail/"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const pName = $(el).text().replace(/\s+/g, ' ').trim();
    if (pName && pName.length < 200) {
      // Try to find category badge near the link
      let category = '';
      const parent = $(el).closest('div, li, article');
      parent.find('.tag, .badge, .category, span').each((__, tag) => {
        const t = $(tag).text().trim();
        if (['健診', '治療', '再生医療', '先進医療'].includes(t)) category = t;
      });
      programs.push({
        name: pName,
        category: category || '不明',
        url: href.startsWith('http') ? href : `${BASE_URL}${href}`,
      });
    }
  });

  // ---- Languages ----
  const languages: string[] = ['ja']; // All Japanese hospitals support Japanese
  const langMap: Record<string, string> = {
    '英語': 'en', 'English': 'en',
    '中国語': 'zh', '中文': 'zh', 'Chinese': 'zh',
    '韓国語': 'ko', '한국어': 'ko', 'Korean': 'ko',
    'ベトナム語': 'vi', 'Vietnamese': 'vi',
    'タイ語': 'th',
    'ロシア語': 'ru',
    'フランス語': 'fr',
    'ドイツ語': 'de',
  };
  for (const [kw, code] of Object.entries(langMap)) {
    if (bodyText.includes(kw) && !languages.includes(code)) {
      languages.push(code);
    }
  }

  // ---- Certifications ----
  const certifications: string[] = [];
  const certKW = [
    'JCI', 'ISO', '機能評価', '日本総合健診医学会', '認定', 'がん診療連携拠点',
    '特定機能病院', '地域医療支援病院', '教育病院', '臨床研究中核病院',
    'DPC対象病院',
  ];
  for (const kw of certKW) {
    if (bodyText.includes(kw) && !certifications.includes(kw)) {
      certifications.push(kw);
    }
  }

  // ---- English name (try meta or title) ----
  let name_en = '';
  const titleText = $('title').text();
  // Some pages have English names in meta tags
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  if (/[A-Za-z]{3,}/.test(ogTitle)) name_en = ogTitle;

  return {
    jtb_id: item.jtb_id,
    name_ja: name_ja || item.name_ja,
    name_en,
    url: item.detail_url,
    detail_url: item.detail_url,
    address,
    postal_code,
    prefecture,
    region,
    access,
    genres: [...new Set(genres)],
    overview,
    website_url,
    sales_points: sales_points.slice(0, 2000),
    equipment: [...new Set(equipment)],
    departments: [...new Set(departments)],
    specialties: [...new Set(specialties)],
    programs,
    languages: [...new Set(languages)],
    certifications: [...new Set(certifications)],
    scraped_at: new Date().toISOString(),
  };
}

/**
 * Extract text content after a section header
 */
function extractSection(
  $: cheerio.CheerioAPI,
  bodyText: string,
  headers: string[]
): string | null {
  for (const header of headers) {
    // Try to find in structured elements
    const headerIdx = bodyText.indexOf(header);
    if (headerIdx >= 0) {
      // Get next ~1000 chars after header
      const after = bodyText.slice(headerIdx + header.length, headerIdx + header.length + 1000);
      // Clean up and return until next section header or end
      const cleaned = after
        .replace(/^[：:\s]+/, '')
        .split(/(?:住\s*所|ジャンル|施設概要|ホームページ|セールスポイント|この施設で受けられる)/)[0]
        .trim();
      if (cleaned.length > 5) return cleaned;
    }
  }
  return null;
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('=== JTB Hospital Scraper ===\n');

  // Check for existing data (resume support)
  let existing: JTBHospitalRaw[] = [];
  const existingIds = new Set<number>();

  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
      for (const h of existing) existingIds.add(h.jtb_id);
      console.log(`Found existing data: ${existing.length} hospitals. Will skip already scraped.\n`);
    } catch {
      console.warn('Could not parse existing data, starting fresh.\n');
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Step 1: Get all hospital IDs from listing pages
  const listItems = await scrapeAllListPages();

  // Step 2: Scrape detail pages
  const results: JTBHospitalRaw[] = [...existing];
  let scraped = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];

    if (existingIds.has(item.jtb_id)) {
      skipped++;
      continue;
    }

    console.log(`[Detail ${i + 1}/${listItems.length}] ${item.name_ja} (id=${item.jtb_id})`);

    try {
      const detail = await scrapeDetailPage(item);
      results.push(detail);
      scraped++;

      // Save incrementally every 10 hospitals
      if (scraped % 10 === 0) {
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), 'utf-8');
        console.log(`  [Saved] ${results.length} hospitals total\n`);
      }
    } catch (err) {
      console.error(`  [FAIL] ${item.name_ja}: ${(err as Error).message}`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  // Final save
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), 'utf-8');

  console.log('\n=== Scraping Complete ===');
  console.log(`Total: ${results.length} | New: ${scraped} | Skipped: ${skipped} | Failed: ${failed}`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
