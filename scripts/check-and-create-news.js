// 检查 news 表并创建（如果不存在）
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' }
});

async function checkNews() {
  console.log('檢查 news 表...');
  console.log('Supabase URL:', supabaseUrl);

  // 尝试查询表
  const { data, error } = await supabase
    .from('news')
    .select('id, title')
    .limit(1);

  if (error) {
    console.log('錯誤:', error.message);
    console.log('\n⚠️  news 表不存在或無法訪問');
    console.log('\n請在 Supabase Dashboard 的 SQL Editor 中運行以下 SQL:');
    console.log('-------------------------------------------');
    console.log(`
-- 创建新闻表
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT NOT NULL CHECK (category IN ('announcement', 'press', 'service')),
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured) WHERE is_featured = true;

-- 启用 RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Anyone can view published news"
  ON news FOR SELECT
  USING (is_published = true AND (published_at IS NULL OR published_at <= now()));

-- 管理员完全访问
CREATE POLICY "Service role has full access"
  ON news FOR ALL
  USING (true)
  WITH CHECK (true);
    `);
    console.log('-------------------------------------------');
  } else {
    console.log('✓ news 表存在，當前有', data?.length || 0, '條記錄');

    // 获取所有新闻数量
    const { count } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true });

    console.log('總共有', count, '條新聞');
  }
}

checkNews().catch(console.error);
