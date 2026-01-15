// Run database migration for auth system
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runMigration() {
  console.log('Starting auth migration...');
  console.log('Supabase URL:', supabaseUrl);

  const migrations = [
    // 1. Add user_id column
    `ALTER TABLE medical_orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL`,

    // 2. Create index
    `CREATE INDEX IF NOT EXISTS idx_medical_orders_user_id ON medical_orders(user_id)`,

    // 3. Enable RLS
    `ALTER TABLE medical_orders ENABLE ROW LEVEL SECURITY`,

    // 4. Drop existing policies
    `DROP POLICY IF EXISTS "Users can view own orders" ON medical_orders`,
    `DROP POLICY IF EXISTS "Anyone can insert orders" ON medical_orders`,
    `DROP POLICY IF EXISTS "Service role full access" ON medical_orders`,

    // 5. Create select policy
    `CREATE POLICY "Users can view own orders" ON medical_orders FOR SELECT USING (auth.uid() = user_id OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR auth.jwt() ->> 'role' = 'service_role')`,

    // 6. Create insert policy
    `CREATE POLICY "Anyone can insert orders" ON medical_orders FOR INSERT WITH CHECK (true)`,

    // 7. Create service role policy
    `CREATE POLICY "Service role full access" ON medical_orders FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')`,

    // 8. Create trigger function
    `CREATE OR REPLACE FUNCTION link_order_to_user() RETURNS TRIGGER AS $$ BEGIN IF auth.uid() IS NOT NULL THEN NEW.user_id := auth.uid(); END IF; RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER`,

    // 9. Drop existing trigger
    `DROP TRIGGER IF EXISTS trigger_link_order_to_user ON medical_orders`,

    // 10. Create trigger
    `CREATE TRIGGER trigger_link_order_to_user BEFORE INSERT ON medical_orders FOR EACH ROW EXECUTE FUNCTION link_order_to_user()`
  ];

  for (let i = 0; i < migrations.length; i++) {
    const sql = migrations[i];
    console.log(`\n[${i + 1}/${migrations.length}] Executing: ${sql.substring(0, 60)}...`);

    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

    if (error) {
      // Try direct query approach
      const { data, error: directError } = await supabase.from('_exec').select('*').limit(0);
      console.log(`  Note: RPC not available, SQL needs to be run in Supabase Dashboard`);
    } else {
      console.log(`  ✓ Success`);
    }
  }

  console.log('\n\nMigration script completed.');
  console.log('\n⚠️  If RPC errors occurred, please run the SQL directly in Supabase Dashboard:');
  console.log('   https://supabase.com/dashboard/project/fcpcjfqxxtxlbtvbjduk/sql/new');
}

runMigration().catch(console.error);
