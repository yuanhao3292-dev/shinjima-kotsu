// Run database migration using Supabase pg-meta API
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const sqlStatements = [
  // 1. Add user_id column
  `ALTER TABLE medical_orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL`,

  // 2. Create index
  `CREATE INDEX IF NOT EXISTS idx_medical_orders_user_id ON medical_orders(user_id)`,

  // 3. Enable RLS
  `ALTER TABLE medical_orders ENABLE ROW LEVEL SECURITY`,

  // 4-6. Drop existing policies
  `DROP POLICY IF EXISTS "Users can view own orders" ON medical_orders`,
  `DROP POLICY IF EXISTS "Anyone can insert orders" ON medical_orders`,
  `DROP POLICY IF EXISTS "Service role full access" ON medical_orders`,

  // 7. Create select policy
  `CREATE POLICY "Users can view own orders" ON medical_orders FOR SELECT USING (auth.uid() = user_id OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR auth.jwt() ->> 'role' = 'service_role')`,

  // 8. Create insert policy
  `CREATE POLICY "Anyone can insert orders" ON medical_orders FOR INSERT WITH CHECK (true)`,

  // 9. Create service role policy
  `CREATE POLICY "Service role full access" ON medical_orders FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')`,

  // 10. Create trigger function
  `CREATE OR REPLACE FUNCTION link_order_to_user() RETURNS TRIGGER AS $$ BEGIN IF auth.uid() IS NOT NULL THEN NEW.user_id := auth.uid(); END IF; RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER`,

  // 11. Drop existing trigger
  `DROP TRIGGER IF EXISTS trigger_link_order_to_user ON medical_orders`,

  // 12. Create trigger
  `CREATE TRIGGER trigger_link_order_to_user BEFORE INSERT ON medical_orders FOR EACH ROW EXECUTE FUNCTION link_order_to_user()`
];

async function runSQL(sql) {
  // Use pg-meta query endpoint
  const response = await fetch(`${supabaseUrl}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({ query: sql })
  });

  return response;
}

async function runMigration() {
  console.log('Starting auth migration...');
  console.log('Project:', projectRef);

  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i];
    console.log(`\n[${i + 1}/${sqlStatements.length}] ${sql.substring(0, 50)}...`);

    const response = await runSQL(sql);

    if (response.ok) {
      console.log('  ✓ Success');
    } else {
      const text = await response.text();
      console.log(`  ✗ Failed: ${text.substring(0, 100)}`);
    }
  }

  console.log('\n✅ Migration completed!');
}

runMigration().catch(console.error);
