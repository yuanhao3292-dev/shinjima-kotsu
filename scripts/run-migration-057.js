// 运行 057-venue-pricing-fields 迁移
// 添加店铺价格信息字段
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function execSQL(label, sql) {
  console.log(`\n📌 ${label}`);
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.log(`  ⚠ RPC exec_sql 失败: ${error.message}`);
    console.log(`  尝试备用方案...`);
    return false;
  }
  console.log(`  ✓ 成功`);
  return true;
}

async function runMigration() {
  console.log('========================================');
  console.log('运行 057-venue-pricing-fields 迁移');
  console.log('========================================\n');

  // Step 1: 添加 business_hours 列
  const step1 = await execSQL(
    'Step 1: 添加 business_hours 列',
    `ALTER TABLE venues ADD COLUMN IF NOT EXISTS business_hours TEXT;`
  );

  // Step 2: 添加 closed_days 列
  const step2 = await execSQL(
    'Step 2: 添加 closed_days 列',
    `ALTER TABLE venues ADD COLUMN IF NOT EXISTS closed_days TEXT;`
  );

  // Step 3: 添加 service_charge 列
  const step3 = await execSQL(
    'Step 3: 添加 service_charge 列',
    `ALTER TABLE venues ADD COLUMN IF NOT EXISTS service_charge TEXT;`
  );

  // Step 4: 添加 pricing_info 列 (JSONB)
  const step4 = await execSQL(
    'Step 4: 添加 pricing_info 列 (JSONB)',
    `ALTER TABLE venues ADD COLUMN IF NOT EXISTS pricing_info JSONB;`
  );

  // Step 5: 添加 remarks 列
  const step5 = await execSQL(
    'Step 5: 添加 remarks 列',
    `ALTER TABLE venues ADD COLUMN IF NOT EXISTS remarks TEXT;`
  );

  // Step 6: 添加注释
  const step6 = await execSQL(
    'Step 6: 添加列注释',
    `COMMENT ON COLUMN venues.business_hours IS '営業時間';
     COMMENT ON COLUMN venues.closed_days IS '定休日';
     COMMENT ON COLUMN venues.service_charge IS 'サービス料';
     COMMENT ON COLUMN venues.pricing_info IS '詳細料金情報 (JSON)';
     COMMENT ON COLUMN venues.remarks IS '備考';`
  );

  // 检查结果
  const allSteps = [step1, step2, step3, step4, step5, step6];
  const failedCount = allSteps.filter(s => !s).length;

  if (failedCount > 0) {
    console.log('\n========================================');
    console.log(`⚠ ${failedCount} 个步骤失败（可能是 exec_sql RPC 不存在）`);
    console.log('请在 Supabase Dashboard → SQL Editor 中手动执行:');
    console.log('scripts/migrations/057-venue-pricing-fields.sql');
    console.log('========================================');
  } else {
    console.log('\n========================================');
    console.log('✅ 迁移 057 全部完成！');
    console.log('========================================');
  }

  // 验证
  console.log('\n📊 验证结果:');
  const { data: venues, error: venuesErr } = await supabase
    .from('venues')
    .select('id, name, business_hours, closed_days, service_charge, pricing_info')
    .limit(3);

  if (venuesErr) {
    console.log(`  ⚠ 查询失败: ${venuesErr.message}`);
  } else {
    console.log(`  ✓ 新字段已添加，示例数据:`);
    venues.forEach(v => {
      console.log(`    ${v.name} | 营业: ${v.business_hours || 'null'} | 定休: ${v.closed_days || 'null'}`);
    });
  }
}

runMigration().catch(err => {
  console.error('迁移失败:', err);
  process.exit(1);
});
