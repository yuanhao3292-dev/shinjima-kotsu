-- Golf Plan Images Configuration Table
-- Run this SQL in your Supabase SQL Editor

-- Create the table
CREATE TABLE IF NOT EXISTS golf_plan_images (
  id SERIAL PRIMARY KEY,
  plan_id VARCHAR(50) UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  description VARCHAR(255),
  region VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookup
CREATE INDEX IF NOT EXISTS idx_golf_plan_images_plan_id ON golf_plan_images(plan_id);

-- Enable Row Level Security
ALTER TABLE golf_plan_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access (images are public)
CREATE POLICY "Allow public read access" ON golf_plan_images
  FOR SELECT USING (true);

-- Allow authenticated users to update (for admin)
CREATE POLICY "Allow authenticated update" ON golf_plan_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON golf_plan_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert default data with working Unsplash URLs
INSERT INTO golf_plan_images (plan_id, image_url, description, region) VALUES
  -- Hokkaido (3)
  ('hokkaido-summer', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop', '北海道夏季球場', 'hokkaido'),
  ('hokkaido-niseko', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop', '新雪谷度假球場', 'hokkaido'),
  ('hokkaido-premium', 'https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1200&auto=format&fit=crop', '北海道精選球場', 'hokkaido'),

  -- Okinawa (2)
  ('okinawa-resort', 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1200&auto=format&fit=crop', '沖繩度假球場', 'okinawa'),
  ('okinawa-island-hop', 'https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=1200&auto=format&fit=crop', '沖繩跳島球場', 'okinawa'),

  -- Kyushu (3)
  ('kyushu-onsen', 'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?q=80&w=1200&auto=format&fit=crop', '九州溫泉球場', 'kyushu'),
  ('kyushu-championship', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop', '九州冠軍球場', 'kyushu'),
  ('kyushu-grand', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200&auto=format&fit=crop', '九州巡迴球場', 'kyushu'),

  -- Chugoku (2)
  ('chugoku-sanyo', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200&auto=format&fit=crop', '山陽線球場', 'chugoku'),
  ('chugoku-sanin', 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop', '山陰線球場', 'chugoku'),

  -- Shikoku (2)
  ('shikoku-pilgrimage', 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop', '四國遍路球場', 'shikoku'),
  ('shikoku-seto', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop', '瀨戶內海球場', 'shikoku'),

  -- Kansai (3)
  ('kansai-championship', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop', '關西冠軍球場', 'kansai'),
  ('kansai-kyoto', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop', '京都風格球場', 'kansai'),
  ('kansai-hirono', 'https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1200&auto=format&fit=crop', '廣野名門球場', 'kansai'),

  -- Tokyo (3)
  ('tokyo-championship', 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1200&auto=format&fit=crop', '東京冠軍球場', 'tokyo'),
  ('tokyo-fuji', 'https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=1200&auto=format&fit=crop', '富士山景球場', 'tokyo'),
  ('tokyo-historic', 'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?q=80&w=1200&auto=format&fit=crop', '東京歷史名門', 'tokyo'),

  -- Chubu (2)
  ('chubu-alps', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop', '中部阿爾卑斯球場', 'chubu'),
  ('chubu-nagoya', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200&auto=format&fit=crop', '名古屋精選球場', 'chubu')
ON CONFLICT (plan_id) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  region = EXCLUDED.region,
  updated_at = NOW();

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_golf_plan_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_golf_plan_images_updated_at ON golf_plan_images;
CREATE TRIGGER trigger_update_golf_plan_images_updated_at
  BEFORE UPDATE ON golf_plan_images
  FOR EACH ROW
  EXECUTE FUNCTION update_golf_plan_images_updated_at();

-- Verify the data
SELECT * FROM golf_plan_images ORDER BY region, plan_id;
