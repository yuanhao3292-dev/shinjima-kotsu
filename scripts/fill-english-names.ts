/**
 * Fill missing English names for JTB hospitals using AI translation.
 * Batches 10 hospitals per API call to minimize token usage.
 *
 * Usage: npx tsx scripts/fill-english-names.ts
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.production.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

const BATCH_SIZE = 15;

async function translateBatch(hospitals: { id: string; name_ja: string }[]): Promise<Record<string, string>> {
  const nameList = hospitals.map((h, i) => `${i + 1}. ${h.name_ja}`).join('\n');

  const response = await openai.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: `Translate these Japanese hospital/clinic names to English. Rules:
- Use the official English name if widely known (e.g. 慶應義塾大学病院 → Keio University Hospital)
- For clinics: 〇〇クリニック → 〇〇 Clinic
- 医療法人/医療法人社団/etc. = omit the corporate prefix, keep the meaningful name
- 大学病院 → University Hospital, 総合病院 → General Hospital
- Keep brand names in romaji (e.g. BIANCA, LUX, NEO)
- 健診センター → Health Screening Center, 人間ドック → not needed in name
- Keep it concise and natural

Return JSON object mapping the number to the English name.
Example: {"1": "Tokyo General Hospital", "2": "Sakura Clinic"}

${nameList}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 1500,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return {};

  const parsed = JSON.parse(content) as Record<string, string>;
  const result: Record<string, string> = {};
  for (let i = 0; i < hospitals.length; i++) {
    const enName = parsed[String(i + 1)];
    if (enName) result[hospitals[i].id] = enName;
  }
  return result;
}

(async () => {
  // Get hospitals without English names
  const { data: hospitals, error } = await supabase
    .from('jtb_hospitals')
    .select('id, name_ja, name_en')
    .eq('is_active', true);

  if (error) {
    console.error('DB error:', error);
    process.exit(1);
  }

  const missing = hospitals!.filter(h => !h.name_en || !h.name_en.trim());
  console.log(`Total: ${hospitals!.length} | Missing English name: ${missing.length}\n`);

  if (missing.length === 0) {
    console.log('All hospitals have English names.');
    return;
  }

  let updated = 0;
  let errors = 0;

  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(missing.length / BATCH_SIZE)} (${batch.length} hospitals)...`);

    try {
      const translations = await translateBatch(batch);

      for (const [id, enName] of Object.entries(translations)) {
        const { error: updateErr } = await supabase
          .from('jtb_hospitals')
          .update({ name_en: enName })
          .eq('id', id);

        if (updateErr) {
          console.error(`  ERROR: ${enName}:`, updateErr);
          errors++;
        } else {
          const ja = batch.find(h => h.id === id)?.name_ja;
          console.log(`  ✓ ${ja} → ${enName}`);
          updated++;
        }
      }
    } catch (err) {
      console.error(`  Batch failed:`, err);
      errors++;
    }

    // Rate limit
    if (i + BATCH_SIZE < missing.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Remaining: ${missing.length - updated}`);
})();
