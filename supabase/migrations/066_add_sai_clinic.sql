-- =====================================================
-- 066: 添加 SAI CLINIC 医美整形模块 + 套餐
-- SAI CLINIC (サイクリニック) - 大阪梅田抗衰老医美诊所
-- 合作方已授权，价格 = 官网价格 × 2
-- =====================================================

-- 1. 注册 SAI CLINIC 模块到 page_modules
INSERT INTO page_modules (
  category, name, name_ja, name_en, slug,
  description, description_ja,
  component_key, commission_rate, is_required,
  sort_order, is_active, display_config
) VALUES (
  'beauty',
  'SAI CLINIC 医美整形',
  'SAI CLINIC 美容整形',
  'SAI CLINIC Aesthetic Medicine',
  'sai-clinic',
  '大阪梅田·糸リフト专门诊所。崔煌植医生亲诊，融合韩式美学与日本精密医疗，提供线雕提升、注射美容、眼鼻整形等全方位医美服务。',
  '大阪梅田・糸リフト専門クリニック。崔煌植医師による韓国式美学と日本精密医療を融合した総合美容医療サービス。',
  'sai_clinic',
  15.00,
  false,
  85,
  true,
  '{
    "template": "immersive",
    "sectionId": "sai-clinic",
    "navLabel": "SAI CLINIC",
    "heroImage": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop",
    "colorTheme": "rose",
    "tagline": "Aesthetic Medicine in Osaka",
    "title": "SAI CLINIC",
    "subtitle": "大阪梅田·韩式医美",
    "description": "以糸リフト（线雕提升）为核心，融合最新韩国美容趋势与日本精密医疗。崔煌植医生亲诊，JSAS·KAAS双重认证，Allergan认证医师。完全预约制，全程中文服务。",
    "stats": [
      {"value": "15", "unit": "+年", "label": "医美经验"},
      {"value": "JSAS", "unit": "", "label": "日本美容外科"},
      {"value": "KAAS", "unit": "", "label": "韩国美容外科"}
    ],
    "tags": ["糸リフト", "双眼皮", "隆鼻", "肉毒素", "玻尿酸", "干细胞"],
    "ctaText": "查看全部项目",
    "sidebar": {
      "title": "人气项目",
      "type": "checklist",
      "items": [
        {"name": "SAI LIFT 线雕", "desc": "三档可选·自然提升"},
        {"name": "双眼皮手术", "desc": "埋线法·全切法"},
        {"name": "Allergan肉毒素", "desc": "认证医师施术"},
        {"name": "干细胞外泌体", "desc": "最前沿再生医疗"}
      ]
    }
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_ja = EXCLUDED.name_ja,
  name_en = EXCLUDED.name_en,
  description = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  component_key = EXCLUDED.component_key,
  commission_rate = EXCLUDED.commission_rate,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  display_config = EXCLUDED.display_config,
  updated_at = now();

-- 2. 添加 SAI CLINIC 套餐到 medical_packages
-- 价格 = 官网价格 × 2（含服务费·翻译·陪诊）
-- stripe_price_id 暂时使用占位符，需通过脚本批量创建

-- ─── 糸リフト系列 ───
INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-lift-try', 'SAI LIFT TRY 糸リフト体验', 'SAI LIFT TRY（糸リフト体験）', '初次体验推荐·自然提升效果·术后恢复快·含术后回诊', 380000, 'pending_sai_lift_try', 'cosmetic_surgery', true, 300)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-lift-standard', 'SAI LIFT STANDARD 糸リフト标准', 'SAI LIFT STANDARD（糸リフト標準）', '最受欢迎·明显提升效果·效果持续12-18个月·含术后回诊', 680000, 'pending_sai_lift_standard', 'cosmetic_surgery', true, 301)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-lift-perfect', 'SAI LIFT PERFECT 糸リフト完美', 'SAI LIFT PERFECT（糸リフト完美）', '最高级方案·全脸全方位改善·最长持效期·VIP专属服务', 980000, 'pending_sai_lift_perfect', 'cosmetic_surgery', true, 302)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 组合套餐 ───
INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-nasolabial-set', '法令纹改善套餐', 'ほうれい線セット', '糸リフト+玻尿酸·针对法令纹的综合解决方案', 378000, 'pending_sai_nasolabial', 'cosmetic_surgery', true, 310)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-vline-set', 'V脸线条套餐', 'V-Lineセット', '精准脂肪溶解+线雕提升·打造理想V脸线条', 496000, 'pending_sai_vline', 'cosmetic_surgery', true, 311)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-neck-set', '颈纹改善套餐', '首シワセット', '糸リフト+玻尿酸·改善颈部细纹和松弛', 378000, 'pending_sai_neck', 'cosmetic_surgery', true, 312)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-eye-fatigue-set', '眼周疲劳改善套餐', '目元セット', '针对眼周暗沉·细纹的综合年轻化方案', 378000, 'pending_sai_eye_fatigue', 'cosmetic_surgery', true, 313)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 眼部整形 ───
INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-double-eyelid', '自然双眼皮（埋线法）', '二重埋没法（ナチュラル）', '微创埋线法·自然双眼皮效果·1年保障', 300000, 'pending_sai_double_eyelid', 'cosmetic_surgery', true, 320)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-double-eyelid-premium', '精致双眼皮（6点连续法）', '6点連続法二重', '6点连续缝合法·精致持久线条·5年保障', 580000, 'pending_sai_double_eyelid_premium', 'cosmetic_surgery', true, 321)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-under-eye-reversehamra', '黑眼圈·眼袋去除（Reverse Hamra）', '裏ハムラ法', 'Reverse Hamra法·根本解决黑眼圈·脂肪重新分配', 880000, 'pending_sai_reverse_hamra', 'cosmetic_surgery', true, 322)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 鼻部整形 ───
INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-nose-thread', '线雕隆鼻（8线）', 'SAI LIFT NOSE 8本', '8根专用隆鼻线·无需开刀·自然挺拔鼻型', 560000, 'pending_sai_nose_thread', 'cosmetic_surgery', true, 330)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-nose-implant', '硅胶隆鼻', 'プロテーゼ隆鼻', '硅胶假体隆鼻·永久效果·自然手感', 480000, 'pending_sai_nose_implant', 'cosmetic_surgery', true, 331)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 注射美容 ───
INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-botox-full-face', 'Allergan全脸肉毒素（100单位）', 'ボトックス全顔100単位', 'Allergan正品100单位·全脸抗皱除纹·认证医师施术', 240000, 'pending_sai_botox', 'cosmetic_surgery', true, 340)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-hyaluronic-1cc', '玻尿酸注射（Juvéderm 1cc）', 'ヒアルロン酸 1cc', 'Juvéderm系列高端玻尿酸·精准塑形填充', 148000, 'pending_sai_ha', 'cosmetic_surgery', true, 341)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-skin-rejuvenation', '肌肤再生·水光注射', '水光注射+幹細胞エキス', '水光注射+干细胞精华·深层修复再生·改善肤质', 304000, 'pending_sai_skin', 'cosmetic_surgery', true, 342)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-exosome-therapy', '干细胞外泌体疗法（2-3次）', 'エクソソーム療法', '最前沿再生医疗·新鲜干细胞外泌体·2-3次疗程', 760000, 'pending_sai_exosome', 'cosmetic_surgery', true, 343)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 脂肪手术 ───
INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-fat-grafting-face', '全脸脂肪填充', '全顔脂肪注入', '自体脂肪提取+全脸无限注入·永久自然年轻化', 1760000, 'pending_sai_fat_grafting', 'cosmetic_surgery', true, 350)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-liposuction-face', '面部吸脂（双区）', '脂肪吸引（2部位）', '精准面部吸脂（颊部+下颚）·永久减脂不反弹', 480000, 'pending_sai_liposuction', 'cosmetic_surgery', true, 351)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- ─── 美容内科 ───
INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-nutrition-perfect', '精密营养分析（82项）', 'パーフェクト栄養解析', '82项血液检测+专业营养分析+个人健康方案', 118000, 'pending_sai_nutrition', 'cosmetic_surgery', true, 360)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, description_zh_tw, price_jpy, stripe_price_id, category, is_active, display_order)
VALUES ('sai-vitamin-c-drip', '高浓度维C点滴（20g）', '高濃度ビタミンC点滴20g', '超高浓度维生素C静脉注射·美白抗氧化·免疫力提升', 26000, 'pending_sai_vitc', 'cosmetic_surgery', true, 361)
ON CONFLICT (slug) DO UPDATE SET name_zh_tw=EXCLUDED.name_zh_tw, name_ja=EXCLUDED.name_ja, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, is_active=EXCLUDED.is_active, display_order=EXCLUDED.display_order, updated_at=now();

-- =====================================================
-- 总计: 1 个 page_module + 19 个 medical_packages
-- stripe_price_id 使用占位符 pending_*，需运行脚本创建真实 Stripe 价格
-- =====================================================
