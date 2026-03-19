/**
 * Fetch JTB genre/category data from the JTB Medical & Healthcare API
 * and update jtb_hospitals.jtb_genres for each hospital.
 *
 * Usage: npx tsx scripts/update-jtb-genres.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.production.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GENRE_MAP: Record<string, string> = {
  '100': '健診',
  '200': '治療',
  '300': '透析',
  '400': '眼科',
  '500': '歯科',
  '600': '美容',
  '700': '整形外科',
  '800': '粒子線',
  '900': '再生医療',
  '1000': 'コンサルティング',
  '1100': 'その他',
  '1200': '免疫療法',
  '1300': '内科',
  '1400': '外科',
  '1500': '小児科',
  '1600': 'iPS エクソソーム',
  '1700': 'オンライン診療・往診',
};

interface JTBApiItem {
  topics_id: number;
  subject: string;
  ext_col_06: string;
}

interface PageInfo {
  totalCnt: number;
  totalPageCnt: number;
}

async function fetchAllFromJTB(): Promise<JTBApiItem[]> {
  const allItems: JTBApiItem[] = [];
  let page = 1;

  while (true) {
    const url = `https://j-medical-healthcare.com/facility/?data_format=json&pageID=${page}`;
    const res = await fetch(url);
    const data = await res.json();
    const items: JTBApiItem[] = data.topicsList || [];
    if (items.length === 0) break;
    allItems.push(...items);

    const info: PageInfo = data.pageInfo;
    if (page === 1) console.log(`JTB API: ${info.totalCnt} hospitals, ${info.totalPageCnt} pages`);

    if (page >= info.totalPageCnt) break;
    page++;
    await new Promise(r => setTimeout(r, 800));
  }

  return allItems;
}

function parseGenres(extCol06: string): string[] {
  const codes = extCol06
    .split('__RCMS_CONTENT_BOUNDARY__')
    .map(s => s.trim())
    .filter(s => s !== '');
  const genres = codes.map(c => GENRE_MAP[c]).filter(Boolean);
  return [...new Set(genres)]; // deduplicate
}

(async () => {
  console.log('Fetching JTB genre data from API...\n');
  const jtbItems = await fetchAllFromJTB();
  console.log(`\nFetched ${jtbItems.length} hospitals from JTB API\n`);

  // Build jtb_id → genres mapping
  const genresByJtbId: Record<number, { name: string; genres: string[] }> = {};
  for (const item of jtbItems) {
    const genres = parseGenres(item.ext_col_06 || '');
    genresByJtbId[item.topics_id] = { name: item.subject, genres };
  }

  // Get our hospitals from DB
  const { data: hospitals, error } = await supabase
    .from('jtb_hospitals')
    .select('id, jtb_id, name_ja, jtb_genres')
    .eq('source', 'jtb')
    .eq('is_active', true);

  if (error) {
    console.error('DB query error:', error);
    process.exit(1);
  }

  console.log(`DB: ${hospitals!.length} active JTB hospitals\n`);

  let updated = 0;
  let notFound = 0;
  let unchanged = 0;

  for (const h of hospitals!) {
    const mapping = genresByJtbId[h.jtb_id];
    if (!mapping) {
      console.log(`  NOT FOUND on JTB: [${h.jtb_id}] ${h.name_ja}`);
      notFound++;
      continue;
    }

    const currentGenres = (h.jtb_genres || []).sort().join(',');
    const newGenres = mapping.genres.sort().join(',');

    if (currentGenres === newGenres) {
      unchanged++;
      continue;
    }

    const { error: updateErr } = await supabase
      .from('jtb_hospitals')
      .update({ jtb_genres: mapping.genres })
      .eq('id', h.id);

    if (updateErr) {
      console.error(`  ERROR updating ${h.name_ja}:`, updateErr);
    } else {
      console.log(`  ✓ ${h.name_ja}: ${mapping.genres.join(', ')}`);
      updated++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Unchanged: ${unchanged}`);
  console.log(`  Not found on JTB: ${notFound}`);

  // Genre distribution
  console.log(`\n=== Genre distribution (our hospitals) ===`);
  const counts: Record<string, number> = {};
  for (const h of hospitals!) {
    const mapping = genresByJtbId[h.jtb_id];
    if (mapping) {
      for (const g of mapping.genres) {
        counts[g] = (counts[g] || 0) + 1;
      }
    }
  }
  for (const [g, c] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${g}: ${c}`);
  }
})();
