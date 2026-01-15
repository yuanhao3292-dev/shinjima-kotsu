/**
 * Migration 033: AI Health Screening Tables
 * 为 AI 健康筛查功能创建数据库表
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcpcjfqxxtxlbtvbjduk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ 缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量');
  console.log('\n使用方法: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/run-migration-033-health-screening.mjs');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('开始运行 Migration 033: AI 健康筛查表...\n');

  try {
    // Step 1: 创建 health_screenings 表
    console.log('Step 1: 创建 health_screenings 表...');
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS health_screenings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          user_email TEXT NOT NULL,
          status TEXT DEFAULT 'in_progress',
          answers JSONB DEFAULT '[]'::jsonb,
          analysis_result JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          completed_at TIMESTAMPTZ,
          CONSTRAINT fk_health_screening_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
        );
      `
    });

    if (error1) {
      // 如果 exec_sql 不存在，尝试直接通过 REST API
      console.log('  exec_sql RPC 不可用，尝试手动运行 SQL...');
      console.log('  请在 Supabase SQL Editor 中运行以下 SQL:\n');
      printSQL();
      return;
    }
    console.log('  ✅ health_screenings 表创建成功\n');

    // Step 2: 创建 screening_usage 表
    console.log('Step 2: 创建 screening_usage 表...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS screening_usage (
          user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          free_remaining INTEGER DEFAULT 3,
          total_used INTEGER DEFAULT 0,
          last_used_at TIMESTAMPTZ,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    console.log('  ✅ screening_usage 表创建成功\n');

    // Step 3: 创建索引
    console.log('Step 3: 创建索引...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_health_screenings_user_id ON health_screenings(user_id);
        CREATE INDEX IF NOT EXISTS idx_health_screenings_status ON health_screenings(status);
        CREATE INDEX IF NOT EXISTS idx_health_screenings_created_at ON health_screenings(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_health_screenings_user_email ON health_screenings(user_email);
      `
    });
    console.log('  ✅ 索引创建成功\n');

    // Step 4: 启用 RLS
    console.log('Step 4: 启用 RLS...');
    await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE health_screenings ENABLE ROW LEVEL SECURITY;
        ALTER TABLE screening_usage ENABLE ROW LEVEL SECURITY;
      `
    });
    console.log('  ✅ RLS 已启用\n');

    // Step 5: 创建 RLS 策略
    console.log('Step 5: 创建 RLS 策略...');
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Users can view own screenings" ON health_screenings;
        CREATE POLICY "Users can view own screenings" ON health_screenings
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can insert own screenings" ON health_screenings;
        CREATE POLICY "Users can insert own screenings" ON health_screenings
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update own screenings" ON health_screenings;
        CREATE POLICY "Users can update own screenings" ON health_screenings
          FOR UPDATE USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can view own usage" ON screening_usage;
        CREATE POLICY "Users can view own usage" ON screening_usage
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can insert own usage" ON screening_usage;
        CREATE POLICY "Users can insert own usage" ON screening_usage
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update own usage" ON screening_usage;
        CREATE POLICY "Users can update own usage" ON screening_usage
          FOR UPDATE USING (auth.uid() = user_id);
      `
    });
    console.log('  ✅ RLS 策略创建成功\n');

    // Step 6: 授予权限
    console.log('Step 6: 授予权限...');
    await supabase.rpc('exec_sql', {
      sql: `
        GRANT ALL ON health_screenings TO authenticated;
        GRANT ALL ON screening_usage TO authenticated;
      `
    });
    console.log('  ✅ 权限已授予\n');

    console.log('✅ Migration 033 完成！');

  } catch (error) {
    console.error('❌ Migration 失败:', error.message);
    console.log('\n请在 Supabase SQL Editor 中手动运行以下 SQL:');
    console.log('https://supabase.com/dashboard/project/fcpcjfqxxtxlbtvbjduk/sql/new\n');
    printSQL();
  }
}

function printSQL() {
  console.log(`
-- Migration 033: AI Health Screening Tables
-- 在 Supabase SQL Editor 中运行此 SQL

-- 1. 创建 health_screenings 表
CREATE TABLE IF NOT EXISTS health_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress',
  answers JSONB DEFAULT '[]'::jsonb,
  analysis_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT fk_health_screening_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. 创建 screening_usage 表
CREATE TABLE IF NOT EXISTS screening_usage (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  free_remaining INTEGER DEFAULT 3,
  total_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_health_screenings_user_id ON health_screenings(user_id);
CREATE INDEX IF NOT EXISTS idx_health_screenings_status ON health_screenings(status);
CREATE INDEX IF NOT EXISTS idx_health_screenings_created_at ON health_screenings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_screenings_user_email ON health_screenings(user_email);

-- 4. 启用 RLS
ALTER TABLE health_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_usage ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略 - health_screenings
DROP POLICY IF EXISTS "Users can view own screenings" ON health_screenings;
CREATE POLICY "Users can view own screenings" ON health_screenings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own screenings" ON health_screenings;
CREATE POLICY "Users can insert own screenings" ON health_screenings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own screenings" ON health_screenings;
CREATE POLICY "Users can update own screenings" ON health_screenings
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. 创建 RLS 策略 - screening_usage
DROP POLICY IF EXISTS "Users can view own usage" ON screening_usage;
CREATE POLICY "Users can view own usage" ON screening_usage
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own usage" ON screening_usage;
CREATE POLICY "Users can insert own usage" ON screening_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own usage" ON screening_usage;
CREATE POLICY "Users can update own usage" ON screening_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- 7. 授予权限
GRANT ALL ON health_screenings TO authenticated;
GRANT ALL ON screening_usage TO authenticated;

-- 8. 为现有用户初始化 usage 记录
INSERT INTO screening_usage (user_id, free_remaining, total_used)
SELECT id, 3, 0 FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
`);
}

runMigration();
