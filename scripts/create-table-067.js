// 通过 Supabase pg-meta API 创建 sai_clinic_images 表
require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function tryCreateTable() {
  const sql = `
CREATE TABLE IF NOT EXISTS sai_clinic_images (
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
);
CREATE INDEX IF NOT EXISTS idx_sai_clinic_images_category ON sai_clinic_images(category);
CREATE INDEX IF NOT EXISTS idx_sai_clinic_images_active ON sai_clinic_images(is_active, category, display_order);
ALTER TABLE sai_clinic_images ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sai_clinic_images' AND policyname = 'sai_clinic_images_public_read') THEN
    CREATE POLICY sai_clinic_images_public_read ON sai_clinic_images FOR SELECT USING (is_active = true);
  END IF;
END $$;
  `.trim();

  // Try pg-meta query endpoint
  const endpoints = [
    { url: `${supabaseUrl}/pg/query`, body: { query: sql } },
    { url: `${supabaseUrl}/rest/v1/rpc/exec_sql`, body: { sql_text: sql } },
  ];

  for (const { url, body } of endpoints) {
    console.log(`Trying ${url}...`);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'x-connection-encrypted': '1',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(body),
      });
      const text = await resp.text();
      console.log(`  Status: ${resp.status}`);
      if (text) console.log(`  Response: ${text.substring(0, 200)}`);
      if (resp.ok || resp.status === 200 || resp.status === 204) {
        console.log('  ✅ Success!');
        return true;
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }

  return false;
}

tryCreateTable().then(ok => {
  if (!ok) {
    console.log('\n❌ Could not create table programmatically.');
    console.log('Please go to Supabase Dashboard > SQL Editor and run:');
    console.log('supabase/migrations/067_sai_clinic_images.sql\n');
    console.log('Then run: node scripts/run-migration-067.js --seed-only');
  }
}).catch(console.error);
