-- =====================================================
-- 096: 添加 AC Cell Clinic 完整治疗菜单
-- Add AC Cell Clinic full treatment menu packages
-- Based on AC PLUS CLINIC Menu 2024.12
-- All prices are tax-included (税込 = 税別 × 1.1)
-- =====================================================

-- ─── 血液検査 (Blood Tests) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-initial-blood-test', '初回採血検査', '初次驗血檢查', 'Initial Blood Test', '生活習慣病風險篩檢及感染症檢查', 33000, 'other', true, 400)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-regular-blood-test', '定期検査', '定期血液檢查', 'Regular Blood Test', '一般血液檢查（不含感染症篩檢）·建議每年2-4次', 22000, 'other', true, 401)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-cancer-screening-male', 'がん検査（男性）', '癌症檢查（男性）', 'Cancer Screening (Male)', '腫瘤標記物：CEA、CA19-9、CA72-4、PSA、AFP', 33000, 'other', true, 402)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-cancer-screening-female', 'がん検査（女性）', '癌症檢查（女性）', 'Cancer Screening (Female)', '腫瘤標記物：CEA、CA19-9、CA125、CA15-3、CA72-4、AFP', 33000, 'other', true, 403)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 自己脂肪由来幹細胞 (Adipose Stem Cell) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-stem-cell-3', '自己脂肪由来幹細胞（3回コース）', '自體脂肪幹細胞（3次療程）', 'Adipose Stem Cell Therapy (3 Sessions)', '自體脂肪幹細胞療法·3次療程·每次220萬日元', 7260000, 'other', true, 410)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-stem-cell-6', '自己脂肪由来幹細胞（6回コース）', '自體脂肪幹細胞（6次療程）', 'Adipose Stem Cell Therapy (6 Sessions)', '自體脂肪幹細胞療法·6次療程·每次200萬日元', 13200000, 'other', true, 411)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-stem-cell-10', '自己脂肪由来幹細胞（10回コース）', '自體脂肪幹細胞（10次療程）', 'Adipose Stem Cell Therapy (10 Sessions)', '自體脂肪幹細胞療法·10次療程·每次180萬日元', 19800000, 'other', true, 412)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── NK細胞 (NK Cell) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-nk-cell-1', 'NK細胞（1回）', 'NK細胞療法（1次）', 'NK Cell Therapy (1 Session)', 'NK自然殺手細胞療法·單次療程', 935000, 'other', true, 415)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-nk-cell-5', 'NK細胞（5回コース）', 'NK細胞療法（5次療程）', 'NK Cell Therapy (5 Sessions)', 'NK自然殺手細胞療法·5次療程·每次80萬日元', 4400000, 'other', true, 416)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-nk-cell-10', 'NK細胞（10回コース）', 'NK細胞療法（10次療程）', 'NK Cell Therapy (10 Sessions)', 'NK自然殺手細胞療法·10次療程·每次77萬日元', 8470000, 'other', true, 417)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 血液クレンジング (Blood Purification) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-blood-purification-1', '血液クレンジング（1回）', '血液淨化療法（1次）', 'Blood Purification (1 Session)', 'Leocana濾器血液淨化·單次療程', 1210000, 'other', true, 420)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-blood-purification-3', '血液クレンジング（3回コース）', '血液淨化療法（3次療程）', 'Blood Purification (3 Sessions)', 'Leocana濾器血液淨化·3次療程', 3267000, 'other', true, 421)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-blood-purification-5', '血液クレンジング（5回コース）', '血液淨化療法（5次療程）', 'Blood Purification (5 Sessions)', 'Leocana濾器血液淨化·5次療程', 4840000, 'other', true, 422)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 自己血由来幹細胞上清液 (Autologous Blood Supernatant) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-autologous-supernatant-1', '自己血由来幹細胞上清液（1回）', '自體血幹細胞上清液（1次）', 'Autologous Blood Stem Cell Supernatant (1 Session)', '自體血液幹細胞上清液·2ml·單次療程', 550000, 'other', true, 425)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-autologous-supernatant-12', '自己血由来幹細胞上清液（12回セット）', '自體血幹細胞上清液（12次套餐）', 'Autologous Blood Stem Cell Supernatant (12 Sessions)', '自體血液幹細胞上清液·12次套餐', 6600000, 'other', true, 426)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-autologous-supernatant-24', '自己血由来幹細胞上清液（24回セット）', '自體血幹細胞上清液（24次套餐）', 'Autologous Blood Stem Cell Supernatant (24 Sessions)', '自體血液幹細胞上清液·24次套餐', 13200000, 'other', true, 427)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 幹細胞上清液 (Standard Supernatant) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-umbilical-supernatant', '臍帯幹細胞上清液（2ml）', '臍帶幹細胞上清液（2ml）', 'Umbilical Cord Stem Cell Supernatant (2ml)', '臍帶幹細胞上清液·專注皮膚再生及新生血管', 220000, 'other', true, 430)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-adipose-supernatant', '脂肪幹細胞上清液（2ml）', '脂肪幹細胞上清液（2ml）', 'Adipose Stem Cell Supernatant (2ml)', '脂肪幹細胞上清液·全身性（皮膚、關節、肌肉）', 220000, 'other', true, 431)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-adipose-umbilical-supernatant', '脂肪臍帯幹細胞上清液 SPECIAL（4ml）', '脂肪臍帶幹細胞上清液 SPECIAL（4ml）', 'Adipose + Umbilical Stem Cell Supernatant SPECIAL (4ml)', '脂肪+臍帶幹細胞複合上清液·4ml', 440000, 'other', true, 432)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-special-mix-supernatant', 'SPECIAL MIX上清液（4ml）', 'SPECIAL MIX 上清液（4ml）', 'SPECIAL MIX Supernatant (4ml)', '含全種類成長因子的頂級複合上清液·4ml', 550000, 'other', true, 433)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 美肌メニュー (Skin Beauty) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-skin-acrs', '美肌 ACRS（自己血サイトカインリッチ血清）', '美膚 ACRS（自體血細胞因子血清）', 'Skin Beauty ACRS', 'ACRS自體血細胞因子血清·水光注射/MPGUN', 550000, 'other', true, 440)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-skin-prp', '美肌 PRP（多血小板血漿）', '美膚 PRP（多血小板血漿）', 'Skin Beauty PRP', 'PRP多血小板血漿·水光注射/MPGUN', 220000, 'other', true, 441)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-skin-special-mix', '美肌 SPECIAL MIX上清液', '美膚 SPECIAL MIX上清液', 'Skin Beauty SPECIAL MIX Supernatant', 'SPECIAL MIX上清液·水光注射/MPGUN', 605000, 'other', true, 442)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-skin-adipose-umbilical', '美肌 脂肪臍帯幹細胞上清液', '美膚 脂肪臍帶幹細胞上清液', 'Skin Beauty Adipose + Umbilical Supernatant', '脂肪臍帶幹細胞上清液·水光注射/MPGUN', 495000, 'other', true, 443)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-skin-adipose', '美肌 脂肪幹細胞上清液', '美膚 脂肪幹細胞上清液', 'Skin Beauty Adipose Supernatant', '脂肪幹細胞上清液·水光注射/MPGUN', 275000, 'other', true, 444)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-skin-umbilical', '美肌 臍帯幹細胞上清液', '美膚 臍帶幹細胞上清液', 'Skin Beauty Umbilical Supernatant', '臍帶幹細胞上清液·水光注射/MPGUN', 275000, 'other', true, 445)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-cellage-3d-mask', 'CELLAGE 3D MASK', 'CELLAGE 3D MASK', 'CELLAGE 3D MASK', '日本人體脂肪細胞培養萃取液面膜', 1980, 'other', true, 446)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 頭皮ケアメニュー (Scalp Care) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-scalp-acrs', '頭皮ケア ACRS', '頭皮護理 ACRS', 'Scalp Care ACRS', 'ACRS自體血細胞因子血清·MPGUN頭皮導入', 605000, 'other', true, 450)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-scalp-prp', '頭皮ケア PRP', '頭皮護理 PRP', 'Scalp Care PRP', 'PRP多血小板血漿·MPGUN頭皮導入', 275000, 'other', true, 451)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-scalp-special-mix', '頭皮ケア SPECIAL MIX上清液', '頭皮護理 SPECIAL MIX上清液', 'Scalp Care SPECIAL MIX Supernatant', 'SPECIAL MIX上清液·MPGUN頭皮導入', 660000, 'other', true, 452)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-scalp-adipose-umbilical', '頭皮ケア 脂肪臍帯幹細胞上清液', '頭皮護理 脂肪臍帶幹細胞上清液', 'Scalp Care Adipose + Umbilical Supernatant', '脂肪臍帶幹細胞上清液·MPGUN頭皮導入', 550000, 'other', true, 453)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-scalp-adipose', '頭皮ケア 脂肪幹細胞上清液', '頭皮護理 脂肪幹細胞上清液', 'Scalp Care Adipose Supernatant', '脂肪幹細胞上清液·MPGUN頭皮導入', 330000, 'other', true, 454)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-scalp-umbilical', '頭皮ケア 臍帯幹細胞上清液', '頭皮護理 臍帶幹細胞上清液', 'Scalp Care Umbilical Supernatant', '臍帶幹細胞上清液·MPGUN頭皮導入', 330000, 'other', true, 455)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 膝メニュー (Knee) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-knee-acrs-both', '膝 ACRS（両膝）', '膝關節 ACRS（雙膝）', 'Knee ACRS (Both Knees)', 'ACRS自體血細胞因子血清·雙膝關節注射', 1100000, 'other', true, 460)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-knee-prp-both', '膝 PRP（両膝）', '膝關節 PRP（雙膝）', 'Knee PRP (Both Knees)', 'PRP多血小板血漿·雙膝關節注射', 880000, 'other', true, 461)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-knee-prp-single', '膝 PRP（片膝）', '膝關節 PRP（單膝）', 'Knee PRP (Single Knee)', 'PRP多血小板血漿·單膝關節注射', 550000, 'other', true, 462)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 笑気麻酔 (Nitrous Oxide) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-nitrous-oxide', '笑気麻酔（30分）', '笑氣麻醉（30分鐘）', 'Nitrous Oxide Anesthesia (30 min)', '笑氣麻醉·30分鐘', 33000, 'other', true, 465)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── プリペイド会員 (Prepaid Membership) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-prepaid-platina', 'プリペイド点滴会員 PLATINA（10%OFF）', '點滴會員 PLATINA（全品9折）', 'IV Drip Membership PLATINA (10% OFF)', '預付點滴注射會員·全品項9折·1年有效', 605000, 'other', true, 468)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-prepaid-diamond', 'プリペイド点滴会員 DIAMOND（20%OFF）', '點滴會員 DIAMOND（全品8折）', 'IV Drip Membership DIAMOND (20% OFF)', '預付點滴注射會員·全品項8折·1年有效', 1100000, 'other', true, 469)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 点滴 SPECIAL (Hermes Drip) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-hermes-drip', 'Hermes点滴', '愛馬仕點滴', 'Hermes Drip', '氨基酸·維B群·維C·α-硫辛酸·穀胱甘肽·氨甲環酸·左旋肉鹼·45分鐘', 66000, 'other', true, 470)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── NMN点滴 ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-nmn-150', 'NMN点滴 150mg', 'NMN點滴 150mg', 'NMN IV Drip 150mg', 'NMN抗衰點滴·150mg·45分鐘', 88000, 'other', true, 472)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-nmn-500', 'NMN点滴 500mg', 'NMN點滴 500mg', 'NMN IV Drip 500mg', 'NMN抗衰點滴·500mg·45分鐘', 275000, 'other', true, 473)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 高濃度ビタミンC点滴 (Vitamin C) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-vitc-1200-us', '高濃度ビタミンC 1200mg（アメリカ製）', '高濃度維C 1200mg（美國製）', 'High-Dose Vitamin C 1200mg (US)', '高濃度維生素C點滴·1200mg·美國製·30分鐘', 33000, 'other', true, 475)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-vitc-1200-jp', '高濃度ビタミンC 1200mg（日本製）', '高濃度維C 1200mg（日本製）', 'High-Dose Vitamin C 1200mg (Japan)', '高濃度維生素C點滴·1200mg·日本製·30分鐘', 38500, 'other', true, 476)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-vitc-2500-us', '超高濃度ビタミンC 2500mg（アメリカ製）', '超高濃度維C 2500mg（美國製）', 'Ultra High-Dose Vitamin C 2500mg (US)', '超高濃度維生素C點滴·2500mg·美國製·45分鐘', 55000, 'other', true, 477)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-vitc-2500-jp', '超高濃度ビタミンC 2500mg（日本製）', '超高濃度維C 2500mg（日本製）', 'Ultra High-Dose Vitamin C 2500mg (Japan)', '超高濃度維生素C點滴·2500mg·日本製·45分鐘', 66000, 'other', true, 478)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 疲労・風邪 点滴 (Fatigue/Cold) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-cold-mild', '風邪気味点滴', '風寒前兆點滴', 'Mild Cold IV Drip', '感冒初期症狀緩解·15分鐘', 11000, 'other', true, 480)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-fatigue-recovery', '疲労回復点滴', '疲勞恢復點滴', 'Fatigue Recovery IV Drip', '疲勞恢復·15分鐘', 11000, 'other', true, 481)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-fatigue-detox', '疲労回復デトックス点滴', '疲勞恢復排毒點滴', 'Fatigue Recovery Detox IV Drip', '疲勞恢復+排毒·15分鐘', 14300, 'other', true, 482)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-cold-work', '風邪なのに仕事点滴', '感冒工作點滴', 'Cold + Work IV Drip', '感冒了還要工作·快速緩解·30分鐘', 16500, 'other', true, 483)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-fatigue-special', '疲労回復スペシャル点滴', '特別疲勞恢復點滴', 'Fatigue Recovery Special IV Drip', '高效疲勞恢復·30分鐘', 22000, 'other', true, 484)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 肝臓 点滴 (Liver) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-hangover', '二日酔い点滴', '宿醉點滴', 'Hangover IV Drip', '宿醉緩解·15分鐘', 11000, 'other', true, 490)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-liver-care', '肝臓を大切に点滴', '護肝點滴', 'Liver Care IV Drip', '肝臟保養·15分鐘', 11000, 'other', true, 491)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-liver-limit', 'もう限界点滴', '肝臟極限點滴', 'Liver Limit IV Drip', '肝臟達到極限·深層修復·30分鐘', 16500, 'other', true, 492)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-liver-drinking', '今夜も飲み会点滴', '飲酒應酬點滴', 'Drinking Party IV Drip', '今晚又有飲酒聚會·預防護肝·30分鐘', 16500, 'other', true, 493)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-liver-protect', '肝臓を守ろう点滴', '保護肝臟點滴', 'Liver Protection IV Drip', '肝臟保護·30分鐘', 16500, 'other', true, 494)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-liver-boost', '肝臓に元気注入点滴', '肝臟注入能量點滴', 'Liver Boost IV Drip', '為肝臟注入能量·30分鐘', 16500, 'other', true, 495)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-liver-special', '肝臓スペシャル点滴', '肝臟特別點滴', 'Liver Special IV Drip', '肝臟深層修復·頂級配方·40分鐘', 22000, 'other', true, 496)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 美肌 点滴 (Skin Beauty Drips) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-whitening-drip', '美白・白玉点滴', '美白白玉點滴', 'Whitening IV Drip', '穀胱甘肽美白點滴·15分鐘', 11000, 'other', true, 500)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-aging-care-drip', 'エイジングケア点滴', '抗衰老點滴', 'Anti-Aging IV Drip', '抗衰老護膚點滴·40分鐘', 22000, 'other', true, 501)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-skin-quality-drip', '肌質改善点滴', '膚質改善點滴', 'Skin Quality IV Drip', '改善膚質·30分鐘', 22000, 'other', true, 502)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-skin-special-drip', '美肌スペシャル点滴', '特別美膚點滴', 'Skin Beauty Special IV Drip', '頂級美膚配方·40分鐘', 22000, 'other', true, 503)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── ダイエット 点滴 (Diet) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-diet-drip', 'ダイエット点滴', '減肥點滴', 'Diet IV Drip', '減肥代謝促進·15分鐘', 11000, 'other', true, 506)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-diet-special-drip', 'ダイエットスペシャル点滴', '特別減肥點滴', 'Diet Special IV Drip', '高效減肥代謝促進·25分鐘', 22000, 'other', true, 507)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 花粉症 点滴 (Hay Fever) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-hay-fever-drip', '花粉症点滴', '花粉症點滴', 'Hay Fever IV Drip', '花粉症緩解·15分鐘', 11000, 'other', true, 510)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-hay-fever-special-drip', '花粉症スペシャル点滴', '花粉症特別點滴', 'Hay Fever Special IV Drip', '花粉症強效緩解·30分鐘', 16500, 'other', true, 511)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── プラセンタ・注射 (Placenta & Injections) ───

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-placenta-2a', 'プラセンタ 2A', '胎盤素注射 2A', 'Placenta Injection 2A', '胎盤素注射·Laennec/Melsmon可選', 5500, 'other', true, 515)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-fatigue-injection', '疲労回復注射（20ml）', '疲勞恢復注射（20ml）', 'Fatigue Recovery Injection (20ml)', '快速疲勞恢復注射·20ml', 5500, 'other', true, 518)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-vitamin-fatigue-injection', 'ビタミン疲労回復注射（25ml）', '維生素疲勞恢復注射（25ml）', 'Vitamin Fatigue Recovery Injection (25ml)', '維生素+疲勞恢復注射·25ml', 8800, 'other', true, 519)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-vitamin-injection', 'ビタミン注射（20ml）', '維生素注射（20ml）', 'Vitamin Injection (20ml)', '維生素補充注射·20ml', 5500, 'other', true, 520)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, is_active, display_order)
VALUES ('ac-plus-drinking-party-injection', '飲み会注射（20ml）', '聚會注射（20ml）', 'Drinking Party Injection (20ml)', '飲酒聚會前後護肝注射·20ml', 5500, 'other', true, 521)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 回填 module_id 外键 ───
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.component_key = 'ac_plus'
  AND mp.slug LIKE 'ac-plus-%'
  AND mp.module_id IS NULL;
