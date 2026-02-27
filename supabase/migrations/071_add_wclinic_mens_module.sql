-- =====================================================
-- 071: 添加 W CLINIC men's 模块到选品中心
-- Insert W CLINIC men's (Osaka Umeda) as a page module
-- =====================================================

-- 0. 清理旧的 aoyama-meijyo 数据（如果存在）
DELETE FROM page_modules WHERE slug = 'aoyama-meijyo';
DELETE FROM medical_packages WHERE slug IN ('aoyama-meijyo-initial-consultation', 'aoyama-meijyo-remote-consultation');

-- 1. 插入模块
INSERT INTO page_modules (
  category,
  name,
  name_ja,
  name_en,
  slug,
  description,
  description_ja,
  commission_rate,
  tags,
  is_premium,
  is_required,
  sort_order,
  is_active,
  component_key,
  display_config,
  page_content
) VALUES (
  'medical',
  'W CLINIC men''s 梅田院',
  'Wクリニック メンズ 梅田院',
  'W CLINIC men''s Umeda',
  'wclinic-mens',
  '大阪梅田の男性専科クリニック。植村天受教授（日本泌尿科学会認定專科医·40年以上临床経験）领衔，提供ED勃起功能障碍（Morenova冲击波·口服药·ICI注射）、男性更年期LOH综合征（睾酮检测·HRT）、AGA脱发治疗、男性抗衰美容等综合诊疗。全预约制·独立诊室·隐私保障。',
  '大阪梅田のメンズ専門クリニック。植村天受教授（日本泌尿器科学会認定専門医・40年以上の臨床経験）がED（モアノヴァ衝撃波・内服薬・ICI注射）、男性更年期LOH症候群（テストステロン検査・HRT）、AGA薄毛治療、男性アンチエイジングを総合的に診療。完全予約制・完全個室・プライバシー保護。',
  15.00,
  ARRAY['ED', 'LOH', '男性更年期', 'AGA', '男性美容', '植村天受', '大阪', '梅田', 'Morenova'],
  false,
  false,
  17,
  true,
  'wclinic_mens',
  '{
    "template": "immersive",
    "sectionId": "wclinic-mens",
    "navLabel": "W CLINIC men''s",
    "heroImage": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2000&auto=format&fit=crop",
    "colorTheme": "teal",
    "tagline": "W CLINIC men''s · Osaka Umeda",
    "title": "W CLINIC men''s",
    "subtitle": "大阪梅田 · 男性専科クリニック",
    "description": "植村天受教授领衔，日本泌尿科学会认证专科医生。提供ED、男性更年期(LOH)、AGA脱发、男性抗衰美容等综合诊疗。全预约制，独立诊室，保护隐私。",
    "stats": [
      {"value": "40", "unit": "年+", "label": "临床经验"},
      {"value": "30", "unit": "+", "label": "学会会员"},
      {"value": "2", "unit": "院", "label": "大阪据点"},
      {"value": "全", "unit": "预约", "label": "隐私保障"}
    ],
    "tags": ["ED治疗", "男性更年期", "AGA", "全预约制"],
    "ctaText": "预约男性健康咨询",
    "sidebar": {
      "title": "诊疗项目",
      "type": "steps",
      "items": [
        {"name": "ED治疗", "desc": "Morenova·药物·ICI", "step": "1"},
        {"name": "LOH综合征", "desc": "睾酮检测·HRT治疗", "step": "2"},
        {"name": "AGA脱发", "desc": "综合生发方案", "step": "3"},
        {"name": "男性抗衰", "desc": "HIFU·线雕·NMN", "step": "4"}
      ]
    }
  }'::jsonb,
  '{
    "heroTitle": "W CLINIC men''s",
    "heroSubtitle": "大阪梅田 · 男性専科クリニック",
    "sections": [],
    "detailPage": "/wclinic-mens"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_ja = EXCLUDED.name_ja,
  name_en = EXCLUDED.name_en,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  commission_rate = EXCLUDED.commission_rate,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  component_key = EXCLUDED.component_key,
  display_config = EXCLUDED.display_config,
  page_content = EXCLUDED.page_content,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- 2. 插入 W CLINIC men's 初期咨询服务
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'wclinic-mens-initial-consultation',
  'Wクリニック メンズ - 初期相談サービス',
  'W CLINIC men''s - 前期諮詢服務',
  'W CLINIC men''s - Initial Consultation',
  221000,
  'other',
  140
)
ON CONFLICT (slug) DO NOTHING;

-- 3. 插入 W CLINIC men's 远程诊断服务
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'wclinic-mens-remote-consultation',
  'Wクリニック メンズ - 遠隔診療サービス',
  'W CLINIC men''s - 遠程診斷服務',
  'W CLINIC men''s - Remote Consultation',
  243000,
  'other',
  141
)
ON CONFLICT (slug) DO NOTHING;
