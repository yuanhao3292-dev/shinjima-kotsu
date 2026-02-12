-- =====================================================
-- 067: SAI CLINIC 图片资源表
-- 将页面图片从代码硬编码迁移到数据库管理
-- =====================================================

-- 1. 创建图片表
CREATE TABLE IF NOT EXISTS sai_clinic_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN (
    'hero', 'gallery', 'case', 'doctor', 'feature',
    'concept', 'threadlift', 'background', 'other'
  )),
  src TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  label TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 索引
CREATE INDEX idx_sai_clinic_images_category ON sai_clinic_images(category);
CREATE INDEX idx_sai_clinic_images_active ON sai_clinic_images(is_active, category, display_order);

-- 3. RLS
ALTER TABLE sai_clinic_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sai_clinic_images_public_read" ON sai_clinic_images
FOR SELECT USING (is_active = true);

-- 4. 自动更新 updated_at
CREATE TRIGGER update_sai_clinic_images_updated_at
  BEFORE UPDATE ON sai_clinic_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. 种子数据
-- ─── Hero 背景 ───
INSERT INTO sai_clinic_images (category, src, alt, label, display_order, metadata) VALUES
('hero', '/images/sai-clinic/hero-01.jpg', 'SAI CLINIC 大阪梅田 - 院内環境', '院内大厅', 1, '{"usage": "hero_background"}'::jsonb),
('hero', '/images/sai-clinic/hero-02.jpg', '崔煌植医生施术中', '施术中', 2, '{"usage": "hero_grid"}'::jsonb),
('hero', '/images/sai-clinic/hero-03.jpg', 'SAI CLINIC 院内', '院内', 3, '{"usage": "hero_grid"}'::jsonb),
('hero', '/images/sai-clinic/hero-04.jpg', 'SAI CLINIC', 'CTA背景', 4, '{"usage": "cta_background"}'::jsonb),
('hero', '/images/sai-clinic/hero-05.jpg', 'SAI CLINIC', '流程背景', 5, '{"usage": "flow_background"}'::jsonb);

-- ─── 诊所环境 Gallery ───
INSERT INTO sai_clinic_images (category, src, alt, label, display_order) VALUES
('gallery', '/images/sai-clinic/gallery-1.jpg', 'SAI CLINIC 接待大厅', '接待大厅', 1),
('gallery', '/images/sai-clinic/gallery-2.jpg', 'SAI CLINIC 候诊区域', '候诊区域', 2),
('gallery', '/images/sai-clinic/gallery-3.jpg', 'SAI CLINIC 咨询室', '咨询室', 3),
('gallery', '/images/sai-clinic/gallery-4.jpg', 'SAI CLINIC 治疗室', '治疗室', 4),
('gallery', '/images/sai-clinic/gallery-5.jpg', 'SAI CLINIC 化妆间', '化妆间', 5),
('gallery', '/images/sai-clinic/gallery-6.jpg', 'SAI CLINIC 手术室', '手术室', 6),
('gallery', '/images/sai-clinic/gallery-7.jpg', 'SAI CLINIC 恢复室', '恢复室', 7),
('gallery', '/images/sai-clinic/gallery-8.jpg', 'SAI CLINIC 入口', '诊所入口', 8),
('gallery', '/images/sai-clinic/gallery-9.jpg', 'SAI CLINIC 走廊', '诊所走廊', 9);

-- ─── 症例 Case ───
INSERT INTO sai_clinic_images (category, src, alt, label, display_order, metadata) VALUES
('case', '/images/sai-clinic/case-40s-01.jpg', '40代女性 糸リフト+ヒアルロン酸', '40代女性', 1, '{"title": "40代女性 · 糸リフト+ヒアルロン酸", "desc": "SAI LIFT STANDARD + 法令纹玻尿酸注射。自然的提升效果，法令纹明显改善。"}'::jsonb),
('case', '/images/sai-clinic/case-50s-01.jpg', '50代女性 糸リフト', '50代女性', 2, '{"title": "50代女性 · 糸リフト", "desc": "SAI LIFT PERFECT 全脸线雕提升。显著改善面部松弛，恢复年轻轮廓。"}'::jsonb),
('case', '/images/sai-clinic/case-50s-02.jpg', '50代女性 糸リフト+脂肪溶解', '50代女性', 3, '{"title": "50代女性 · 糸リフト+脂肪溶解", "desc": "线雕提升 + 面部吸脂。V脸效果明显，下颚线条更加紧致。"}'::jsonb);

-- ─── 医生 Doctor ───
INSERT INTO sai_clinic_images (category, src, alt, label, display_order, metadata) VALUES
('doctor', '/images/sai-clinic/doctor.jpg', '崔煌植 院長', '院長头像', 1, '{"usage": "avatar"}'::jsonb),
('doctor', '/images/sai-clinic/sign.png', '崔煌植 签名', '签名', 2, '{"usage": "signature"}'::jsonb),
('doctor', '/images/sai-clinic/recommend.jpg', '推薦', '推薦头像', 3, '{"usage": "recommend"}'::jsonb);

-- ─── 特色 Feature ───
INSERT INTO sai_clinic_images (category, src, alt, label, display_order, metadata) VALUES
('feature', '/images/sai-clinic/feature-01.jpg', '糸リフト专门诊所', '糸リフト专门', 1, '{"title": "糸リフト专门诊所"}'::jsonb),
('feature', '/images/sai-clinic/about-feature-1.jpg', '韩式美学·日本品质', '韩式美学', 2, '{"title": "韩式美学·日本品质"}'::jsonb),
('feature', '/images/sai-clinic/about-feature-2.jpg', '内外兼修·个性定制', '内外兼修', 3, '{"title": "内外兼修·个性定制"}'::jsonb);

-- ─── Concept ───
INSERT INTO sai_clinic_images (category, src, alt, label, display_order) VALUES
('concept', '/images/sai-clinic/concept-1.jpg', 'SAI CLINIC 施術風景', '施术风景', 1),
('concept', '/images/sai-clinic/concept-2.jpg', '抗衰老专门', '抗衰老专门', 2),
('concept', '/images/sai-clinic/concept-3.jpg', '韩式美学', '韩式美学', 3),
('concept', '/images/sai-clinic/concept-4.jpg', '个性化方案', '个性化方案', 4);

-- ─── 糸リフト Threadlift ───
INSERT INTO sai_clinic_images (category, src, alt, label, display_order) VALUES
('threadlift', '/images/sai-clinic/threadlift-hero.jpg', 'SAI LIFT 糸リフト', '糸リフト hero', 1),
('threadlift', '/images/sai-clinic/threadlift-title.jpg', 'SAI LIFT Title', '糸リフト标题', 2);

-- ─── 其他 ───
INSERT INTO sai_clinic_images (category, src, alt, label, display_order) VALUES
('other', '/images/sai-clinic/logo.svg', 'SAI CLINIC Logo', 'Logo', 1),
('other', '/images/sai-clinic/promise-1.jpg', 'Promise 1', '承诺1', 2),
('other', '/images/sai-clinic/promise-2.jpg', 'Promise 2', '承诺2', 3),
('other', '/images/sai-clinic/promise-3.jpg', 'Promise 3', '承诺3', 4);

-- =====================================================
-- 总计: 31 条图片记录
-- 分类: hero(5), gallery(9), case(3), doctor(3),
--       feature(3), concept(4), threadlift(2), other(4)
-- =====================================================
