-- 050-news-system.sql
-- 新闻管理系统

-- 1. 创建新闻表
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 基本信息
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,

  -- 分类
  category TEXT NOT NULL CHECK (category IN ('announcement', 'press', 'service')),

  -- 媒体
  image_url TEXT,

  -- 状态
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- 发布日期（可以设置未来日期进行定时发布）
  published_at TIMESTAMPTZ,

  -- 元数据
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- 3. 启用 RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 4. RLS 策略 - 任何人都可以读取已发布的新闻
CREATE POLICY "Anyone can view published news"
  ON news FOR SELECT
  USING (is_published = true AND (published_at IS NULL OR published_at <= now()));

-- 5. RLS 策略 - 管理员可以管理所有新闻（通过 service role key）
-- 注意：管理员操作通过 API 使用 service role key，绕过 RLS

-- 6. 更新时间触发器
CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_news_updated_at ON news;
CREATE TRIGGER trigger_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_news_updated_at();

-- 7. 插入初始数据
INSERT INTO news (title, summary, content, category, image_url, is_published, is_featured, published_at)
VALUES
  (
    '総合医療サービス事業を拡充 - がん治療紹介サービスを新設',
    '陽子線治療、光免疫療法、BNCT（ホウ素中性子捕捉療法）の紹介サービスを開始いたしました。日本国内の最先端がん治療施設と提携し、華人患者様に最適な治療オプションをご提案いたします。',
    '陽子線治療、光免疫療法、BNCT（ホウ素中性子捕捉療法）の紹介サービスを開始いたしました。日本国内の最先端がん治療施設と提携し、華人患者様に最適な治療オプションをご提案いたします。',
    'announcement',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop',
    true,
    true,
    '2025-01-15 00:00:00+09'
  ),
  (
    '年末年始の営業について',
    '2024年12月28日（土）～2025年1月5日（日）は休業とさせていただきます。期間中のお問い合わせは、1月6日以降に順次対応いたします。',
    '2024年12月28日（土）～2025年1月5日（日）は休業とさせていただきます。期間中のお問い合わせは、1月6日以降に順次対応いたします。',
    'press',
    NULL,
    true,
    false,
    '2024-12-20 00:00:00+09'
  ),
  (
    'Webサイトをリニューアルしました',
    'より使いやすく、より多くの情報をお届けできるよう、Webサイトを全面リニューアルいたしました。新デザインでは、サービス情報へのアクセスがより直感的になりました。',
    'より使いやすく、より多くの情報をお届けできるよう、Webサイトを全面リニューアルいたしました。新デザインでは、サービス情報へのアクセスがより直感的になりました。',
    'announcement',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    true,
    true,
    '2024-11-01 00:00:00+09'
  ),
  (
    'ガイドパートナープログラム 登録者3,000名突破',
    '在日華人ガイド向けのパートナープログラムが、登録者3,000名を突破いたしました。引き続き、パートナーの皆様のビジネス成長を全力でサポートしてまいります。',
    '在日華人ガイド向けのパートナープログラムが、登録者3,000名を突破いたしました。引き続き、パートナーの皆様のビジネス成長を全力でサポートしてまいります。',
    'press',
    NULL,
    true,
    false,
    '2024-09-15 00:00:00+09'
  ),
  (
    'AI報価システム「LinkQuote」機能アップデート',
    '24時間即時見積もり対応のAIシステムに、新たに多言語対応機能を追加しました。日本語、中国語、英語での見積もり作成が可能になりました。',
    '24時間即時見積もり対応のAIシステムに、新たに多言語対応機能を追加しました。日本語、中国語、英語での見積もり作成が可能になりました。',
    'service',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop',
    true,
    true,
    '2024-08-01 00:00:00+09'
  ),
  (
    '夏季の人気プランについて',
    '夏休み期間中は、名門ゴルフツアーおよび精密健診の予約が混み合います。お早めのご予約をお勧めいたします。',
    '夏休み期間中は、名門ゴルフツアーおよび精密健診の予約が混み合います。お早めのご予約をお勧めいたします。',
    'announcement',
    NULL,
    true,
    false,
    '2024-06-20 00:00:00+09'
  ),
  (
    '新年度のご挨拶',
    '2024年度も引き続き、高品質なサービスの提供に努めてまいります。新たなサービス展開にもご期待ください。',
    '2024年度も引き続き、高品質なサービスの提供に努めてまいります。新たなサービス展開にもご期待ください。',
    'press',
    NULL,
    true,
    false,
    '2024-04-01 00:00:00+09'
  ),
  (
    'ガイドパートナープログラム開始',
    '在日華人ガイド向けホワイトラベルソリューションの提供を開始いたしました。独自ブランドでの高品質サービス提供が可能になります。',
    '在日華人ガイド向けホワイトラベルソリューションの提供を開始いたしました。独自ブランドでの高品質サービス提供が可能になります。',
    'service',
    NULL,
    true,
    false,
    '2024-03-01 00:00:00+09'
  );

-- 完成
COMMENT ON TABLE news IS '新闻管理表 - 存储公司新闻、公告和服务更新';
