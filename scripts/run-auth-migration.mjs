// Run database migration for auth system via Supabase REST API
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const sql = `
-- 1. Add user_id column to medical_orders
ALTER TABLE medical_orders
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Create index
CREATE INDEX IF NOT EXISTS idx_medical_orders_user_id ON medical_orders(user_id);

-- 3. Enable RLS
ALTER TABLE medical_orders ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own orders" ON medical_orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON medical_orders;
DROP POLICY IF EXISTS "Service role full access" ON medical_orders;

-- 5. RLS Policy: Users can view own orders
CREATE POLICY "Users can view own orders" ON medical_orders
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR auth.jwt() ->> 'role' = 'service_role'
  );

-- 6. RLS Policy: Anyone can insert
CREATE POLICY "Anyone can insert orders" ON medical_orders
  FOR INSERT
  WITH CHECK (true);

-- 7. RLS Policy: Service role full access for update/delete
CREATE POLICY "Service role full access" ON medical_orders
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- 8. Auto-link user_id trigger
CREATE OR REPLACE FUNCTION link_order_to_user()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_link_order_to_user ON medical_orders;
CREATE TRIGGER trigger_link_order_to_user
  BEFORE INSERT ON medical_orders
  FOR EACH ROW
  EXECUTE FUNCTION link_order_to_user();
`;

async function runMigration() {
  console.log('Starting auth migration...');
  console.log('Supabase URL:', supabaseUrl);

  // Use Supabase Management API or pg-meta endpoint
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1];
  console.log('Project ref:', projectRef);

  // Try using the query endpoint
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({ sql_query: sql })
  });

  if (!response.ok) {
    const text = await response.text();
    console.log('Direct SQL execution not available via REST API.');
    console.log('Response:', text);
    console.log('\n' + '='.repeat(60));
    console.log('Please run the following SQL in Supabase Dashboard SQL Editor:');
    console.log(`https://supabase.com/dashboard/project/${projectRef}/sql/new`);
    console.log('='.repeat(60) + '\n');
    console.log(sql);
  } else {
    console.log('✓ Migration completed successfully!');
  }
}

runMigration().catch(console.error);
