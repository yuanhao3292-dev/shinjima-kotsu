-- ============================================
-- Health Community — User Stories & Knowledge Base
-- ============================================

-- User-submitted health stories (post-screening experiences)
CREATE TABLE health_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'ja' CHECK (language IN ('ja', 'zh-CN', 'zh-TW', 'en')),
  -- Categorization
  category TEXT NOT NULL DEFAULT 'experience' CHECK (category IN ('experience', 'tip', 'question', 'review')),
  tags TEXT[] DEFAULT '{}',
  -- Related screening (optional)
  screening_id UUID,
  risk_level TEXT CHECK (risk_level IS NULL OR risk_level IN ('low', 'medium', 'high')),
  -- Display info
  author_display_name TEXT,    -- Anonymized or user-chosen display name
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  -- Moderation
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  moderated_by UUID,
  moderated_at TIMESTAMPTZ,
  rejection_reason TEXT,
  -- Engagement
  view_count INTEGER NOT NULL DEFAULT 0,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_stories_status ON health_stories (status, created_at DESC);
CREATE INDEX idx_health_stories_user ON health_stories (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_health_stories_lang ON health_stories (language, status);

-- "Helpful" votes (one per user per story)
CREATE TABLE story_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES health_stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(story_id, user_id)
);

-- Health knowledge articles (admin-curated)
CREATE TABLE health_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  -- Content (4 languages)
  title_ja TEXT NOT NULL,
  title_zh_cn TEXT,
  title_zh_tw TEXT,
  title_en TEXT,
  content_ja TEXT NOT NULL,
  content_zh_cn TEXT,
  content_zh_tw TEXT,
  content_en TEXT,
  -- Categorization
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'screening', 'department', 'lifestyle', 'faq')),
  tags TEXT[] DEFAULT '{}',
  related_departments TEXT[] DEFAULT '{}',
  -- Display
  cover_image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  -- Publishing
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  author_id UUID,
  -- Engagement
  view_count INTEGER NOT NULL DEFAULT 0,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_articles_slug ON health_articles (slug);
CREATE INDEX idx_health_articles_status ON health_articles (status, sort_order);

-- RLS
ALTER TABLE health_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_articles ENABLE ROW LEVEL SECURITY;

-- Users can read approved stories
CREATE POLICY "Anyone can read approved stories"
  ON health_stories FOR SELECT
  USING (status = 'approved');

-- Users can insert their own stories
CREATE POLICY "Users can create stories"
  ON health_stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can read published articles
CREATE POLICY "Anyone can read published articles"
  ON health_articles FOR SELECT
  USING (status = 'published');
