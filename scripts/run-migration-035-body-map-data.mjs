/**
 * Migration 035: Add body_map_data column to health_screenings table
 * 为健康筛查表添加人体图数据列
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcpcjfqxxtxlbtvbjduk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ 缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量');
  console.log('\n使用方法: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/run-migration-035-body-map-data.mjs');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('开始运行 Migration 035: 添加 body_map_data 列...\n');

  try {
    // Step 1: 添加 body_map_data 列
    console.log('Step 1: 添加 body_map_data 列...');
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE health_screenings
        ADD COLUMN IF NOT EXISTS body_map_data JSONB DEFAULT NULL;
      `
    });

    if (error1) {
      console.log('  exec_sql RPC 不可用，请在 Supabase SQL Editor 中手动运行 SQL...');
      console.log('  https://supabase.com/dashboard/project/fcpcjfqxxtxlbtvbjduk/sql/new\n');
      printSQL();
      return;
    }
    console.log('  ✅ body_map_data 列添加成功\n');

    // Step 2: 创建 GIN 索引
    console.log('Step 2: 创建 GIN 索引...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_health_screenings_body_map_data
        ON health_screenings USING GIN (body_map_data);
      `
    });
    console.log('  ✅ GIN 索引创建成功\n');

    // Step 3: 添加注释
    console.log('Step 3: 添加列注释...');
    await supabase.rpc('exec_sql', {
      sql: `
        COMMENT ON COLUMN health_screenings.body_map_data IS '人体图选择数据: {selectedBodyParts, selectedSymptoms, recommendedDepartments, riskLevel}';
      `
    });
    console.log('  ✅ 列注释添加成功\n');

    console.log('✅ Migration 035 完成！');

  } catch (error) {
    console.error('❌ Migration 失败:', error.message);
    console.log('\n请在 Supabase SQL Editor 中手动运行以下 SQL:');
    console.log('https://supabase.com/dashboard/project/fcpcjfqxxtxlbtvbjduk/sql/new\n');
    printSQL();
  }
}

function printSQL() {
  console.log(`
-- Migration 035: Add body_map_data column to health_screenings table
-- 在 Supabase SQL Editor 中运行此 SQL

-- 1. 添加 body_map_data 列
ALTER TABLE health_screenings
ADD COLUMN IF NOT EXISTS body_map_data JSONB DEFAULT NULL;

-- 2. 添加索引以支持 JSONB 查询
CREATE INDEX IF NOT EXISTS idx_health_screenings_body_map_data
ON health_screenings USING GIN (body_map_data);

-- 3. 添加注释
COMMENT ON COLUMN health_screenings.body_map_data IS '人体图选择数据: {selectedBodyParts, selectedSymptoms, recommendedDepartments, riskLevel}';
`);
}

runMigration();
