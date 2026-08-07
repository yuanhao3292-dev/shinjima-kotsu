-- ============================================================
-- 恢复 medical_packages 表（修复 B2B 部署事故）
-- 执行位置：Supabase Dashboard → SQL Editor
-- 日期：2026-02-25
-- ============================================================

-- 第一步：备份当前错误的表（B2B 数据）
-- ============================================================
ALTER TABLE IF EXISTS medical_packages RENAME TO medical_packages_b2b_backup;

-- 如果有 FK 约束从 orders 指向旧表，先解除
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_package_id_fkey;

-- 第二步：重建正确的 medical_packages 表
-- ============================================================
CREATE TABLE medical_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_ja TEXT NOT NULL,
  name_zh_tw TEXT NOT NULL,
  name_en TEXT NOT NULL DEFAULT '',
  description_ja TEXT,
  description_zh_tw TEXT,
  description_en TEXT,
  price_jpy INTEGER NOT NULL,
  stripe_price_id TEXT,
  stripe_product_id TEXT,
  category TEXT NOT NULL DEFAULT 'health_checkup',
  is_active BOOLEAN DEFAULT true,
  features JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 第三步：不恢复 FK 约束（旧订单引用的 package_id 已失效，加 FK 会报错）
-- 历史订单通过 customer_snapshot + notes 仍可追溯，不影响业务

-- 第四步：插入所有套餐数据
-- ============================================================

-- ─── TIMC 健康体检套餐（6个）───
INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order) VALUES
('vip-member-course', 'VIP会員コース', 'VIP 會員套餐', 'VIP Member Course', 1512500, 'health_checkup', 200),
('premium-cardiac-course', 'プレミアム心臓コース', '尊享心臟套餐', 'Premium Cardiac Course', 825000, 'health_checkup', 201),
('select-gastro-colonoscopy', '胃腸セレクトコース', '甄選胃腸套餐', 'Gastro + Colonoscopy Course', 825000, 'health_checkup', 202),
('select-gastroscopy', '胃カメラセレクト', '甄選胃鏡套餐', 'Gastroscopy Course', 687500, 'health_checkup', 203),
('basic-checkup', 'スタンダード健診', '標準健診套餐', 'Standard Checkup Course', 550000, 'health_checkup', 205),
('dwibs-cancer-screening', 'DWIBSがんスクリーニング', 'DWIBS 癌症篩查', 'DWIBS Cancer Screening', 275000, 'health_checkup', 204);

-- ─── 癌症治疗咨询（2个）───
INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order) VALUES
('cancer-initial-consultation', 'がん治療 - 初期相談サービス', '癌症治療 - 前期諮詢服務', 'Cancer Treatment - Initial Consultation', 221000, 'cancer_treatment', 100),
('cancer-remote-consultation', 'がん治療 - 遠隔診療サービス', '癌症治療 - 遠程會診服務', 'Cancer Treatment - Remote Consultation', 243000, 'cancer_treatment', 101);

-- ─── 兵库医大咨询（2个）───
INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order) VALUES
('hyogo-initial-consultation', '兵庫医大 - 初期相談サービス', '兵庫醫大 - 前期諮詢服務', 'Hyogo Medical - Initial Consultation', 221000, 'cancer_treatment', 110),
('hyogo-remote-consultation', '兵庫医大 - 遠隔診療サービス', '兵庫醫大 - 遠程會診服務', 'Hyogo Medical - Remote Consultation', 243000, 'cancer_treatment', 111);

-- ─── HELENE 干细胞诊所咨询（2个）───
INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order) VALUES
('helene-initial-consultation', 'ヘレネクリニック - 初期相談サービス', 'HELENE診所 - 前期諮詢服務', 'HELENE Clinic - Initial Consultation', 221000, 'other', 120),
('helene-remote-consultation', 'ヘレネクリニック - 遠隔診療サービス', 'HELENE診所 - 遠程診斷服務', 'HELENE Clinic - Remote Consultation', 243000, 'other', 121);

-- ─── SAI CLINIC 医美整形（20个）───
INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order) VALUES
('sai-lift-try', 'SAI LIFT TRY（糸リフト体験）', 'SAI LIFT TRY 糸リフト體驗', 'SAI LIFT TRY - Thread Lift Trial', 380000, 'cosmetic_surgery', 300),
('sai-lift-standard', 'SAI LIFT STANDARD（糸リフト標準）', 'SAI LIFT STANDARD 糸リフト標準', 'SAI LIFT STANDARD - Thread Lift Standard', 680000, 'cosmetic_surgery', 301),
('sai-lift-perfect', 'SAI LIFT PERFECT（糸リフト完美）', 'SAI LIFT PERFECT 糸リフト完美', 'SAI LIFT PERFECT - Thread Lift Premium', 980000, 'cosmetic_surgery', 302),
('sai-nasolabial-set', 'ほうれい線セット', '法令紋改善套餐', 'Nasolabial Fold Treatment Set', 378000, 'cosmetic_surgery', 310),
('sai-vline-set', 'V-Lineセット', 'V臉線條套餐', 'V-Line Facial Contouring Set', 496000, 'cosmetic_surgery', 311),
('sai-neck-set', '首シワセット', '頸紋改善套餐', 'Neck Wrinkle Treatment Set', 378000, 'cosmetic_surgery', 312),
('sai-eye-fatigue-set', '目元セット', '眼周疲勞改善套餐', 'Eye Fatigue Treatment Set', 378000, 'cosmetic_surgery', 313),
('sai-double-eyelid', '二重埋没法（ナチュラル）', '自然雙眼皮（埋線法）', 'Natural Double Eyelid Surgery', 300000, 'cosmetic_surgery', 320),
('sai-double-eyelid-premium', '6点連続法二重', '精緻雙眼皮（6點連續法）', 'Premium Double Eyelid - 6-Point Method', 580000, 'cosmetic_surgery', 321),
('sai-under-eye-reversehamra', '裏ハムラ法', '黑眼圈·眼袋去除（Reverse Hamra）', 'Under-Eye Treatment - Reverse Hamra', 880000, 'cosmetic_surgery', 322),
('sai-nose-thread', 'SAI LIFT NOSE 8本', '線雕隆鼻（8線）', 'Nose Thread Lift - 8 Threads', 560000, 'cosmetic_surgery', 330),
('sai-nose-implant', 'プロテーゼ隆鼻', '硅膠隆鼻', 'Silicone Nose Implant', 480000, 'cosmetic_surgery', 331),
('sai-botox-full-face', 'ボトックス全顔100単位', 'Allergan全臉肉毒素（100單位）', 'Allergan Botox Full Face 100 Units', 240000, 'cosmetic_surgery', 340),
('sai-hyaluronic-1cc', 'ヒアルロン酸 1cc', '玻尿酸注射（Juvéderm 1cc）', 'Hyaluronic Acid Filler 1cc', 148000, 'cosmetic_surgery', 341),
('sai-skin-rejuvenation', '水光注射+幹細胞エキス', '肌膚再生·水光注射', 'Skin Rejuvenation - Hydro + Stem Cell', 304000, 'cosmetic_surgery', 342),
('sai-exosome-therapy', 'エクソソーム療法', '幹細胞外泌體療法（2-3次）', 'Exosome Stem Cell Therapy', 760000, 'cosmetic_surgery', 343),
('sai-fat-grafting-face', '全顔脂肪注入', '全臉脂肪填充', 'Full Face Fat Grafting', 1760000, 'cosmetic_surgery', 350),
('sai-liposuction-face', '脂肪吸引（2部位）', '面部吸脂（雙區）', 'Facial Liposuction - 2 Areas', 480000, 'cosmetic_surgery', 351),
('sai-nutrition-perfect', 'パーフェクト栄養解析', '精密營養分析（82項）', 'Precision Nutrition Analysis - Perfect', 118000, 'cosmetic_surgery', 360),
('sai-vitamin-c-drip', '高濃度ビタミンC点滴20g', '高濃度維C點滴（20g）', 'High-Dose Vitamin C IV Drip 20g', 26000, 'cosmetic_surgery', 361);

-- 第五步：创建索引
-- ============================================================
CREATE INDEX idx_medical_packages_slug ON medical_packages(slug);
CREATE INDEX idx_medical_packages_category ON medical_packages(category);
CREATE INDEX idx_medical_packages_active ON medical_packages(is_active);

-- 第六步：启用 RLS 和策略
-- ============================================================
ALTER TABLE medical_packages ENABLE ROW LEVEL SECURITY;

-- 套餐信息公开可读（活跃的套餐）
CREATE POLICY "medical_packages_public_read" ON medical_packages
  FOR SELECT USING (is_active = true);

-- service_role 全权限（API 路由使用）
CREATE POLICY "medical_packages_service_all" ON medical_packages
  FOR ALL USING (true) WITH CHECK (true);

-- 第七步：自动更新 updated_at 触发器
-- ============================================================
CREATE OR REPLACE FUNCTION update_medical_packages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_medical_packages_updated_at ON medical_packages;
CREATE TRIGGER update_medical_packages_updated_at
  BEFORE UPDATE ON medical_packages
  FOR EACH ROW EXECUTE FUNCTION update_medical_packages_updated_at();

-- 第八步：验证
-- ============================================================
SELECT slug, price_jpy, is_active, category, display_order
FROM medical_packages
ORDER BY display_order;

-- 完成！共应有 32 条记录
-- 接下来需要运行 scripts/restore-stripe-prices.js 创建 Stripe Price IDs
