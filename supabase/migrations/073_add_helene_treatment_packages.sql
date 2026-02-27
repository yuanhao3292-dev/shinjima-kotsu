-- =====================================================
-- 073: 添加HELENE诊所治疗套餐
-- Add HELENE Clinic treatment packages to medical_packages
-- 15 treatment options based on official price list
-- All prices are tax-inclusive (税込)
-- =====================================================

-- MSC幹細胞 静脈/皮下注射
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-msc-iv-grade-b-minus',
  'MSC幹細胞 静脈/皮下 Grade B-（1億個）',
  'MSC幹細胞 靜脈/皮下 Grade B-（1億個）',
  'MSC Stem Cell IV/SC Grade B- (100M cells)',
  1452000,
  'other',
  160
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-msc-iv-grade-b',
  'MSC幹細胞 静脈/皮下 Grade B（4億個）',
  'MSC幹細胞 靜脈/皮下 Grade B（4億個）',
  'MSC Stem Cell IV/SC Grade B (400M cells)',
  2178000,
  'other',
  161
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-msc-iv-grade-b-plus',
  'MSC幹細胞 静脈/皮下 Grade B+（7億個）',
  'MSC幹細胞 靜脈/皮下 Grade B+（7億個）',
  'MSC Stem Cell IV/SC Grade B+ (700M cells)',
  3630000,
  'other',
  162
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-msc-iv-grade-a-minus',
  'MSC幹細胞 静脈/皮下 Grade A-（10億個）',
  'MSC幹細胞 靜脈/皮下 Grade A-（10億個）',
  'MSC Stem Cell IV/SC Grade A- (1B cells)',
  4840000,
  'other',
  163
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-msc-iv-grade-a',
  'MSC幹細胞 静脈/皮下 Grade A（22.5億個）',
  'MSC幹細胞 靜脈/皮下 Grade A（22.5億個）',
  'MSC Stem Cell IV/SC Grade A (2.25B cells)',
  6050000,
  'other',
  164
)
ON CONFLICT (slug) DO NOTHING;

-- MSC幹細胞 膝関節内注射
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-msc-knee-single',
  'MSC幹細胞 膝関節内注射（片膝）',
  'MSC幹細胞 膝關節注射（單膝）',
  'MSC Stem Cell Knee Injection (Single)',
  1185800,
  'other',
  165
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-msc-knee-both',
  'MSC幹細胞 膝関節内注射（両膝）',
  'MSC幹細胞 膝關節注射（雙膝）',
  'MSC Stem Cell Knee Injection (Both)',
  1633500,
  'other',
  166
)
ON CONFLICT (slug) DO NOTHING;

-- MSC幹細胞 歯周組織内注射
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-msc-periodontal-single',
  'MSC幹細胞 歯周組織内注射（上顎or下顎）',
  'MSC幹細胞 牙周組織注射（單顎）',
  'MSC Stem Cell Periodontal (Single Jaw)',
  1185800,
  'other',
  167
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-msc-periodontal-both',
  'MSC幹細胞 歯周組織内注射（上下顎）',
  'MSC幹細胞 牙周組織注射（雙顎）',
  'MSC Stem Cell Periodontal (Both Jaws)',
  1633500,
  'other',
  168
)
ON CONFLICT (slug) DO NOTHING;

-- MSC幹細胞 脱毛部位注射
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-msc-hair',
  'MSC幹細胞 脱毛部位注射 Grade B',
  'MSC幹細胞 脫髮部位注射 Grade B',
  'MSC Stem Cell Hair Loss Treatment Grade B',
  3025000,
  'other',
  169
)
ON CONFLICT (slug) DO NOTHING;

-- 自己エクソソーム
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-exosome-topical',
  '自己エクソソーム 外用塗布（6ヶ月分）',
  '自體外泌體 外用塗抹（6個月份）',
  'Autologous Exosome Topical (6 Months)',
  2178000,
  'other',
  170
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-exosome-injection',
  '自己エクソソーム セルフ注射（1ヶ月分）',
  '自體外泌體 自我注射（1個月份）',
  'Autologous Exosome Self-Injection (1 Month)',
  550000,
  'other',
  171
)
ON CONFLICT (slug) DO NOTHING;

-- NK細胞
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-nk-50',
  'NK細胞 静脈投与（50億個）',
  'NK細胞 靜脈投與（50億個）',
  'NK Cell IV Therapy (5B cells)',
  550000,
  'other',
  172
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-nk-100',
  'NK細胞 静脈投与（100億個）',
  'NK細胞 靜脈投與（100億個）',
  'NK Cell IV Therapy (10B cells)',
  660000,
  'other',
  173
)
ON CONFLICT (slug) DO NOTHING;

-- 血液浄化
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'helene-blood-purification',
  '血液浄化療法',
  '血液淨化療法',
  'Blood Purification Therapy',
  880000,
  'other',
  174
)
ON CONFLICT (slug) DO NOTHING;
