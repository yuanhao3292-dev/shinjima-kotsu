-- SAI CLINIC 全メニュー追加 (based on 施術メニュー・価格表)
-- Pricing: domestic price × 2 (medical tourism markup)
-- Generated: 2026-03-24

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-lift-collagen', 'SAI LIFT COLLAGEN（コラーゲン糸）', 'SAI LIFT COLLAGEN 膠原蛋白線雕', 'SAI LIFT COLLAGEN - Collagen Thread Lift', '韓國最新美容技術·束狀/網狀線強力促進膠原蛋白增生·緊緻回春', 280000, 'cosmetic_surgery', 303, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-lift-single-thread', '糸リフト（1本）', '線雕提升（單線）', 'Thread Lift - Single Thread', '依部位選擇最適合的線材·單線計價', 80000, 'cosmetic_surgery', 304, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-lift-ldm', 'LDM（痛み・腫れ軽減）', 'LDM高密度超音波（減痛消腫）', 'LDM - Pain & Swelling Reduction', '高密度超音波軟化皮下脂肪·減少線雕術後疼痛腫脹瘀血', 42000, 'cosmetic_surgery', 305, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-lift-jalupro', 'ジャルプロ・スーパーハイドロ（糸リフト併用）', 'Jalupro超級保濕（線雕搭配）', 'Jalupro Super Hydro - Thread Lift Combo', '氨基酸+非交聯玻尿酸·促進膠原蛋白增生·延長線雕效果', 166000, 'cosmetic_surgery', 306, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-dissolve-cheeks', '脂肪吸引注射（ホホ）', '溶脂注射（頰部）', 'Fat Dissolving Injection - Cheeks', '精準溶脂·打造纖細臉部線條', 320000, 'cosmetic_surgery', 370, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-dissolve-chin', '脂肪吸引注射（アゴ下）', '溶脂注射（下巴下方）', 'Fat Dissolving Injection - Under Chin', '消除雙下巴·恢復下顎線條', 320000, 'cosmetic_surgery', 371, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-dissolve-cheeks-chin', '脂肪吸引注射（ホホ＋アゴ下）', '溶脂注射（頰部+下巴）', 'Fat Dissolving Injection - Cheeks + Chin', '下臉部完美套組·頰部+下巴雙區域溶脂', 480000, 'cosmetic_surgery', 372, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-dissolve-arms', '脂肪吸引注射（二の腕）', '溶脂注射（手臂）', 'Fat Dissolving Injection - Arms', '告別蝴蝶袖·纖細手臂線條', 440000, 'cosmetic_surgery', 373, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-lipo-cheeks', '脂肪吸引（ホホ）', '吸脂手術（頰部）', 'Liposuction - Cheeks', '手術吸脂·小臉輪廓更分明', 420000, 'cosmetic_surgery', 375, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-lipo-chin', '脂肪吸引（アゴ下）', '吸脂手術（下巴下方）', 'Liposuction - Under Chin', '消除雙下巴·打造銳利下顎線', 420000, 'cosmetic_surgery', 376, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-lipo-cheeks-chin', '脂肪吸引（ホホ＋アゴ下）', '吸脂手術（頰部+下巴）', 'Liposuction - Cheeks + Chin', '下臉部完整吸脂·全方位小臉', 620000, 'cosmetic_surgery', 377, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-lipo-arms', '脂肪吸引（二の腕）', '吸脂手術（手臂）', 'Liposuction - Arms', '纖細手臂·穿無袖更自信', 600000, 'cosmetic_surgery', 378, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-harvest', '脂肪採取・作成料', '脂肪採取製備費', 'Fat Harvest & Preparation', '從大腿採取脂肪+製備注入用脂肪', 380000, 'cosmetic_surgery', 380, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-forehead', '脂肪注入（額）', '自體脂肪填充（額頭）', 'Fat Injection - Forehead', '打造圓潤飽滿的額頭·韓式美學', 500000, 'cosmetic_surgery', 381, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-temple', '脂肪注入（こめかみ）', '自體脂肪填充（太陽穴）', 'Fat Injection - Temple', '改善太陽穴凹陷·恢復蛋形臉輪廓', 320000, 'cosmetic_surgery', 382, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-cheeks', '脂肪注入（ホホ・頬骨下）', '自體脂肪填充（頰部）', 'Fat Injection - Cheeks', '改善頰部凹陷·恢復蛋形臉輪廓', 320000, 'cosmetic_surgery', 383, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-undereye', '脂肪注入（目の下〜ゴルゴ線）', '自體脂肪填充（淚溝）', 'Fat Injection - Under Eye / Tear Trough', '改善淚溝·提升蘋果肌·消除黑眼圈', 300000, 'cosmetic_surgery', 384, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-nasolabial', '脂肪注入（ほうれい線）', '自體脂肪填充（法令紋）', 'Fat Injection - Nasolabial Folds', '填充法令紋·年輕化效果', 280000, 'cosmetic_surgery', 385, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-marionette', '脂肪注入（口角・マリオネットライン）', '自體脂肪填充（木偶紋）', 'Fat Injection - Marionette Lines', '改善嘴角紋路·回復年輕嘴角', 240000, 'cosmetic_surgery', 386, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-chin', '脂肪注入（アゴ）', '自體脂肪填充（下巴）', 'Fat Injection - Chin', '塑造圓潤下巴·打造完美E線側顏', 220000, 'cosmetic_surgery', 387, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-nanofat', 'ナノファット作成', 'Nanofat奈米脂肪製備', 'Nanofat Preparation', '將脂肪超微粒化·幹細胞修復膚質·改善細紋色澤', 320000, 'cosmetic_surgery', 388, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-upper-eyelid', '脂肪注入 上まぶた（ナノファット）', 'Nanofat填充（上眼瞼）', 'Nanofat Injection - Upper Eyelid', '改善上眼瞼細紋凹陷', 240000, 'cosmetic_surgery', 389, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-lower-eyelid', '脂肪注入 下まぶた（ナノファット）', 'Nanofat填充（下眼瞼）', 'Nanofat Injection - Lower Eyelid', '改善下眼瞼細紋·紅黑眼圈·凹陷', 240000, 'cosmetic_surgery', 390, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-inject-hands', '脂肪注入 手の甲（ナノファット）', 'Nanofat填充（手背）', 'Nanofat Injection - Hands', '改善手背血管突出·細紋·恢復年輕手部', 460000, 'cosmetic_surgery', 391, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-double-eyelid-4point', '4点連続自然癒着法', '四點連續自然黏合法', '4-Point Continuous Adhesion Double Eyelid', '自然雙眼皮·1根線4次往復·3年保障', 440000, 'cosmetic_surgery', 323, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-eyelid-fat-removal', '上瞼の脂肪除去', '上眼瞼去脂', 'Upper Eyelid Fat Removal', '消除眼瞼浮腫·搭配埋線法效果更持久', 280000, 'cosmetic_surgery', 324, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-full-incision-double-eyelid', '全切開二重術', '全切開雙眼皮手術', 'Full Incision Double Eyelid Surgery', '適合眼皮厚·埋線多次脫落·鬆弛嚴重者', 640000, 'cosmetic_surgery', 325, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-ptosis-nonsurgical', '切らない眼瞼下垂術', '非切開眼瞼下垂矯正', 'Non-Incisional Ptosis Correction', '不切開·線縫法輕鬆提升眼力+雙眼皮', 420000, 'cosmetic_surgery', 326, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-epicanthoplasty-z', '目頭切開（Z形成）', '開眼頭（Z形成術）', 'Epicanthoplasty - Z Plasty', '消除蒙古褶·MIX型/平行型雙眼皮·適合喜歡尖銳眼頭者', 440000, 'cosmetic_surgery', 327, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-epicanthoplasty-korean', '韓流目頭切開', '韓式開眼頭', 'Korean Style Epicanthoplasty', '消除蒙古褶·自然圓潤眼頭·疤痕不明顯', 500000, 'cosmetic_surgery', 328, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-brow-lift', '眉下リフト（眉下切開）', '眉下提拉（眉下切開）', 'Sub-Brow Lift', '眉下去除多餘皮膚·改善眼瞼下垂·恢復雙眼皮寬度', 700000, 'cosmetic_surgery', 329, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-undereye-fat-removal', '下瞼の脂肪取り', '下眼瞼去脂', 'Lower Eyelid Fat Removal', '從下眼瞼內側取脂·消除眼袋·無疤痕·適合20-30歲', 440000, 'cosmetic_surgery', 333, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-undereye-hamra', '切開ハムラ法', '切開Hamra法', 'Open Hamra Technique', '從下眼瞼外側手術·一次解決眼袋/凹凸/黑眼圈/淚溝/皮膚鬆弛·適合50歲以上', 1080000, 'cosmetic_surgery', 334, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-undereye-skin-excision', '下瞼の皮膚切除', '下眼瞼皮膚切除', 'Lower Eyelid Skin Excision', '切除下眼瞼多餘皮膚·改善細紋鬆弛', 660000, 'cosmetic_surgery', 335, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nose-thread-4', 'SAI LIFT NOSE（4本）', '線雕隆鼻（4線）', 'Nose Thread Lift - 4 Threads', '4根鼻部專用線·不切開·自然挺拔', 320000, 'cosmetic_surgery', 332, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-alar-reduction', '小鼻縮小術（内側法）', '縮鼻翼手術（內切法）', 'Alar Reduction - Internal Method', '改善鼻翼寬大·縮小鼻孔', 540000, 'cosmetic_surgery', 336, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-philtrum-reduction', '人中短縮術', '人中縮短術', 'Lip Lift / Philtrum Reduction', '縮短人中·改善上唇薄·加齡人中也回春', 700000, 'cosmetic_surgery', 337, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-face-1area', 'ボトックス 顔のしわ（1部位）', 'Allergan肉毒素（臉部1部位）', 'Allergan Botox - Face 1 Area', '額/眉間/鼻根/兔子紋/露齦笑/法令紋等·每部位最多20單位', 36000, 'cosmetic_surgery', 400, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-jaw', 'ボトックス エラ（通常）', 'Allergan肉毒素 咬肌（標準）', 'Allergan Botox - Jaw Normal', '瘦臉·改善磨牙/咬合', 88000, 'cosmetic_surgery', 401, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-jaw-double', 'ボトックス エラ（倍量）', 'Allergan肉毒素 咬肌（加倍）', 'Allergan Botox - Jaw Double Dose', '雙倍劑量瘦臉·更強效', 160000, 'cosmetic_surgery', 402, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-temporal', 'ボトックス 側頭筋', 'Allergan肉毒素 顳肌', 'Allergan Botox - Temporal Muscle', '瘦臉·改善磨牙/咬合/頭痛/眼部下垂', 88000, 'cosmetic_surgery', 403, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-neck-wrinkle', 'ボトックス 首のしわ', 'Allergan肉毒素 頸紋', 'Allergan Botox - Neck Wrinkles', '改善頸部縱向皺紋', 96000, 'cosmetic_surgery', 404, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-lift', 'ボトックスリフト（広頚筋）', 'Allergan肉毒素提拉（闊頸肌）', 'Allergan Botox Lift - Platysma', '臉部線條提拉效果', 96000, 'cosmetic_surgery', 405, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-skin', 'スキンボトックス', 'Allergan皮膚肉毒素', 'Allergan Skin Botox', '淺層注射·縮毛孔·抑制皮脂汗液·預防痘痘', 96000, 'cosmetic_surgery', 406, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-face-50u', 'ボトックス 全顔お任せ（50単位）', 'Allergan肉毒素 全臉（50單位）', 'Allergan Botox - Full Face 50 Units', '院長量身注射·最多50單位·自然表情同時改善', 140000, 'cosmetic_surgery', 407, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-armpit', 'ボトックス ワキ（汗）', 'Allergan肉毒素 腋下止汗', 'Allergan Botox - Underarm Sweating', '告別腋下汗漬困擾', 116000, 'cosmetic_surgery', 408, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-palms', 'ボトックス 手のひら（汗）', 'Allergan肉毒素 手掌止汗', 'Allergan Botox - Palm Sweating', '手掌多汗症治療', 146000, 'cosmetic_surgery', 409, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-feet', 'ボトックス 足裏（汗）', 'Allergan肉毒素 腳底止汗', 'Allergan Botox - Foot Sweating', '腳底多汗症治療', 146000, 'cosmetic_surgery', 410, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-shoulder', 'ボトックス 肩と首', 'Allergan肉毒素 肩頸', 'Allergan Botox - Shoulder & Neck', '改善肩膀僵硬·頸部纖細', 114000, 'cosmetic_surgery', 411, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botox-calf', 'ボトックス ふくらはぎ', 'Allergan肉毒素 小腿', 'Allergan Botox - Calf Slimming', '美腿·小腿纖細', 196000, 'cosmetic_surgery', 412, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-face-1area', 'ボツラックス 顔のしわ（1部位）', 'Botulax肉毒素（臉部1部位）', 'Botulax - Face 1 Area', '韓國製·額/眉間/鼻根等·每部位最多20單位', 14000, 'cosmetic_surgery', 415, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-jaw', 'ボツラックス エラ（通常）', 'Botulax肉毒素 咬肌（標準）', 'Botulax - Jaw Normal', '韓國製·瘦臉·改善磨牙/咬合', 36000, 'cosmetic_surgery', 416, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-jaw-double', 'ボツラックス エラ（倍量）', 'Botulax肉毒素 咬肌（加倍）', 'Botulax - Jaw Double Dose', '韓國製·雙倍劑量瘦臉', 64000, 'cosmetic_surgery', 417, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-temporal', 'ボツラックス 側頭筋', 'Botulax肉毒素 顳肌', 'Botulax - Temporal Muscle', '韓國製·瘦臉/改善頭痛', 46000, 'cosmetic_surgery', 418, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-neck-wrinkle', 'ボツラックス 首のしわ', 'Botulax肉毒素 頸紋', 'Botulax - Neck Wrinkles', '韓國製·改善頸部縱向皺紋', 50000, 'cosmetic_surgery', 419, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-lift', 'ボツラックス ボトックスリフト', 'Botulax肉毒素提拉', 'Botulax Lift - Platysma', '韓國製·臉部線條提拉', 50000, 'cosmetic_surgery', 420, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-skin', 'ボツラックス スキンボトックス', 'Botulax皮膚肉毒素', 'Botulax - Skin Botox', '韓國製·縮毛孔·抑制皮脂·預防痘痘', 66000, 'cosmetic_surgery', 421, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-face-50u', 'ボツラックス 全顔お任せ（50単位）', 'Botulax肉毒素 全臉（50單位）', 'Botulax - Full Face 50 Units', '韓國製·院長量身注射·最多50單位', 64000, 'cosmetic_surgery', 422, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-face-100u', 'ボツラックス 全顔お任せ（100単位）', 'Botulax肉毒素 全臉（100單位）', 'Botulax - Full Face 100 Units', '韓國製·院長精心設計·最多100單位·全面抗皺', 116000, 'cosmetic_surgery', 423, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-armpit', 'ボツラックス ワキ（汗）', 'Botulax肉毒素 腋下止汗', 'Botulax - Underarm Sweating', '韓國製·腋下止汗', 42000, 'cosmetic_surgery', 424, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-palms', 'ボツラックス 手のひら（汗）', 'Botulax肉毒素 手掌止汗', 'Botulax - Palm Sweating', '韓國製·手掌多汗症治療', 66000, 'cosmetic_surgery', 425, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-feet', 'ボツラックス 足裏（汗）', 'Botulax肉毒素 腳底止汗', 'Botulax - Foot Sweating', '韓國製·腳底多汗症治療', 66000, 'cosmetic_surgery', 426, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-shoulder', 'ボツラックス 肩と首', 'Botulax肉毒素 肩頸', 'Botulax - Shoulder & Neck', '韓國製·肩膀僵硬改善·頸部纖細', 56000, 'cosmetic_surgery', 427, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-botulax-calf', 'ボツラックス ふくらはぎ', 'Botulax肉毒素 小腿', 'Botulax - Calf Slimming', '韓國製·美腿·小腿纖細', 96000, 'cosmetic_surgery', 428, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-ha-volbella', 'ヒアルロン酸 ボルベラ（ジュビダーム）', '玻尿酸 Volbella（Juvéderm）', 'Hyaluronic Acid - Volbella', '柔軟質地·適用於淚溝/嘴唇', 148000, 'cosmetic_surgery', 430, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-ha-volift', 'ヒアルロン酸 ボリフト（ジュビダーム）', '玻尿酸 Volift（Juvéderm）', 'Hyaluronic Acid - Volift', '中等硬度·適用於額/太陽穴/頰/法令紋', 148000, 'cosmetic_surgery', 431, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-ha-voluma', 'ヒアルロン酸 ボリューマ（ジュビダーム）', '玻尿酸 Voluma（Juvéderm）', 'Hyaluronic Acid - Voluma', '較硬質地·適用於額/淚溝/蘋果肌/法令紋', 148000, 'cosmetic_surgery', 432, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-ha-volux', 'ヒアルロン酸 ボラックス（ジュビダーム）', '玻尿酸 Volux（Juvéderm）', 'Hyaluronic Acid - Volux', '最硬質地·適用於鼻根/下巴', 156000, 'cosmetic_surgery', 433, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-ha-dissolve', 'ヒアルロニダーゼ（ヒアルロン酸溶解）', '玻尿酸溶解術', 'Hyaluronidase - HA Dissolving', '溶解玻尿酸的治療', 60000, 'cosmetic_surgery', 434, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-ldm-face', 'LDM（顔）', 'LDM高密度超音波（臉部）', 'LDM Ultrasound - Face', '保濕·彈力·緊緻·膠原蛋白增生·提亮·改善痘痘紅腫', 42000, 'cosmetic_surgery', 440, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-ldm-face-neck', 'LDM（顔＋首）', 'LDM高密度超音波（臉+頸）', 'LDM Ultrasound - Face + Neck', '臉部+頸部全方位超音波護理', 56000, 'cosmetic_surgery', 441, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-ldm-stemcell-face', 'LDM＋幹細胞上清液（顔）', 'LDM+幹細胞上清液（臉部）', 'LDM + Stem Cell Supernatant - Face', '搭配幹細胞培養上清液·促進細胞再生·改善膚質', 52000, 'cosmetic_surgery', 442, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-ldm-stemcell-face-neck', 'LDM＋幹細胞上清液（顔＋首）', 'LDM+幹細胞上清液（臉+頸）', 'LDM + Stem Cell Supernatant - Face + Neck', '臉部+頸部·幹細胞再生護理', 66000, 'cosmetic_surgery', 443, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-collage', '肌育注射 コラージュ', '肌膚養護注射 Collage膠原蛋白', 'Skin Nurture - Collage Collagen', '高效安全的膠原蛋白製劑·改善眼下凹陷/頬凹/細紋/青黑眼圈', 156000, 'cosmetic_surgery', 450, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-jalupro', '肌育注射 ジャルプロ・スーパーハイドロ', '肌膚養護注射 Jalupro超級保濕', 'Skin Nurture - Jalupro Super Hydro', '氨基酸+非交聯玻尿酸·定期營養補給·緊緻彈力', 166000, 'cosmetic_surgery', 451, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-sunekos', '肌育注射 スネコス・パフォルマ', '肌膚養護注射 Sunekos Performa', 'Skin Nurture - Sunekos Performa', '非交聯玻尿酸+6種氨基酸·促進膠原蛋白和彈性蛋白·改善膚質', 66000, 'cosmetic_surgery', 452, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-hydro', '肌育注射 ハイドロ水光肌', '肌膚養護注射 Hydro水光肌', 'Skin Nurture - Hydro Glow Skin', '3種分子量玻尿酸·細胞再生+極致保水·彈力光澤', 148000, 'cosmetic_surgery', 453, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-hydro-botox', '肌育注射 ハイドロ＋ボトックス', '肌膚養護注射 Hydro+肉毒素', 'Skin Nurture - Hydro + Botox', '保水+縮毛孔·抑制皮脂·膚質更細緻', 226000, 'cosmetic_surgery', 454, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-hydro-botox-stemcell', '肌育注射 ハイドロ＋ボトックス＋臍帯幹細胞', '肌膚養護注射 完美美肌雞尾酒', 'Skin Nurture - Perfect Beauty Cocktail', '保水+縮毛孔+再生·全效合一·從肌底恢復彈力光澤年輕', 378000, 'cosmetic_surgery', 456, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-pluryal-densify', '肌育注射 プルリアル・デンシファイ', '肌膚養護注射 Pluryal Densify', 'Skin Nurture - Pluryal Densify', '多核苷酸自我修復·改善膠原蛋白/彈力/透明感/皺紋/毛孔·全臉', 158000, 'cosmetic_surgery', 457, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-pluryal-silk', '肌育注射 プルリアル・シルク', '肌膚養護注射 Pluryal Silk', 'Skin Nurture - Pluryal Silk', '多核苷酸自我修復·適用眼周·改善彈力透明感', 132000, 'cosmetic_surgery', 458, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-pluryal-bio', '肌育注射 プルリアル バイオスカルプチャー', '肌膚養護注射 Pluryal Bio Sculpture', 'Skin Nurture - Pluryal Bio Sculpture', '交聯玻尿酸·活化纖維芽細胞·促進膠原蛋白和彈性蛋白生成', 148000, 'cosmetic_surgery', 459, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-olidia', '肌育注射 オリディア', '肌膚養護注射 Olidia', 'Skin Nurture - Olidia', '聚左旋乳酸(PLLA)·促進膠原蛋白生成·彈力/體積/皺紋改善·痘疤也有效', 140000, 'cosmetic_surgery', 460, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-botox', '肌育注射 ボトックス', '肌膚養護注射 微量肉毒素', 'Skin Nurture - Micro Botox', '微量肉毒素(Micro Botox)·縮毛孔·抑制皮脂汗液·改善膚質', 98000, 'cosmetic_surgery', 461, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-stemcell-fd', '肌育注射 臍帯幹細胞上清液（フリーズドライ）', '肌膚養護注射 臍帶幹細胞上清液（凍乾）', 'Skin Nurture - Umbilical Stem Cell (Freeze-Dried)', '臍帶幹細胞萃取·高再生能力·改善彈力光澤細紋', 186000, 'cosmetic_surgery', 462, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-pdf-fd', '肌育注射 PDF-FD療法（エクソソーム）', '肌膚養護注射 PDF-FD療法（外泌體）', 'Skin Nurture - PDF-FD Exosome Therapy', '自體血液萃取生長因子·外泌體直接注入·安全高效回春', 456000, 'cosmetic_surgery', 463, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nurture-skinvive', '肌育注射 スキンバイブ（ジュビダーム）', '肌膚養護注射 SkinVive（Juvéderm）', 'Skin Nurture - SkinVive by Juvéderm', '保水性(潤澤)+彈力性(緊緻)+細紋改善·頸部深層皺紋/毛孔改善', 130000, 'cosmetic_surgery', 464, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-meso-hydro', '水光注射 ハイドロ水光肌', '水光注射 Hydro水光肌', 'Mesotherapy - Hydro Glow Skin', '3種分子量玻尿酸·細胞再生+保水·彈力光澤提升', 118000, 'cosmetic_surgery', 470, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-meso-pluryal-densify', '水光注射 プルリアル・デンシファイ', '水光注射 Pluryal Densify', 'Mesotherapy - Pluryal Densify', '多核苷酸自我修復力·改善膠原蛋白/彈力/透明感·全臉', 128000, 'cosmetic_surgery', 471, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-meso-pluryal-silk', '水光注射 プルリアル・シルク', '水光注射 Pluryal Silk', 'Mesotherapy - Pluryal Silk', '多核苷酸自我修復力·適用眼周', 102000, 'cosmetic_surgery', 472, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-meso-eye-deal', '水光注射 リジュビュー・EYE DEAL', '水光注射 Rejuview EYE DEAL', 'Mesotherapy - Rejuview EYE DEAL', '眼部專用高濃度多核苷酸·改善眼下細紋/暗沉/黑眼圈', 96000, 'cosmetic_surgery', 473, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-meso-aqua-bomb', '水光注射 リジュビュー・AQUA BOMB', '水光注射 Rejuview AQUA BOMB', 'Mesotherapy - Rejuview AQUA BOMB', '高保濕皮膚助推劑·改善乾燥細紋·穀胱甘肽美白提亮', 76000, 'cosmetic_surgery', 474, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-meso-jalupro', '水光注射 ジャルプロ・スーパーハイドロ', '水光注射 Jalupro超級保濕', 'Mesotherapy - Jalupro Super Hydro', '氨基酸+非交聯玻尿酸·定期營養補給·緊緻彈力', 146000, 'cosmetic_surgery', 475, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-meso-stemcell-fd', '水光注射 臍帯幹細胞上清液（フリーズドライ）', '水光注射 臍帶幹細胞上清液（凍乾）', 'Mesotherapy - Umbilical Stem Cell (Freeze-Dried)', '高再生能力·改善彈力光澤細紋·疲勞回復·性機能改善', 166000, 'cosmetic_surgery', 476, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-meso-stemcell-frozen', '水光注射 臍帯幹細胞上清液（新鮮凍結品）', '水光注射 臍帶幹細胞上清液（新鮮凍結）', 'Mesotherapy - Umbilical Stem Cell (Fresh Frozen)', '新鮮凍結品10cc·2-3次份量·最高品質再生療法', 700000, 'cosmetic_surgery', 477, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-meso-botox-add', '水光注射 ボトックス追加', '水光注射 追加肉毒素', 'Mesotherapy - Botox Add-on', '追加肉毒素·縮毛孔·抑制皮脂汗液·改善膚質', 60000, 'cosmetic_surgery', 478, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-fat-x-core', '脂肪溶解注射 Fat X Core（1cc）', '溶脂注射 Fat X Core（1cc）', 'Fat Dissolving - Fat X Core 1cc', '日本最高濃度脫氧膽酸·不反彈·高效溶脂+防止皮膚鬆弛', 16000, 'cosmetic_surgery', 480, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-subcision-4', 'サブシジョン（2×2cm）', '皮下剝離術（2×2cm）', 'Subcision - 2×2cm', '剝離皮下粘連·改善痘疤/水痘凹洞', 44000, 'cosmetic_surgery', 481, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-subcision-16', 'サブシジョン（4×4cm）', '皮下剝離術（4×4cm）', 'Subcision - 4×4cm', '剝離皮下粘連·改善痘疤/水痘凹洞', 156000, 'cosmetic_surgery', 482, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-subcision-36', 'サブシジョン（6×6cm）', '皮下剝離術（6×6cm）', 'Subcision - 6×6cm', '剝離皮下粘連·改善痘疤/水痘凹洞', 336000, 'cosmetic_surgery', 483, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-subcision-full', 'サブシジョン（全顔）', '皮下剝離術（全臉）', 'Subcision - Full Face', '全臉皮下粘連剝離·全面改善凹洞痘疤', 540000, 'cosmetic_surgery', 484, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-shopping-lift-20', 'ショッピングリフト（20本）', '購物提拉（20根）', 'Shopping Lift - 20 Threads', '溶解線植入·促進膠原蛋白·緊緻提升·最小停工期', 84000, 'cosmetic_surgery', 485, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-shopping-lift-40', 'ショッピングリフト（40本）', '購物提拉（40根）', 'Shopping Lift - 40 Threads', '溶解線植入·促進膠原蛋白·緊緻提升', 156000, 'cosmetic_surgery', 486, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-shopping-lift-60', 'ショッピングリフト（60本）', '購物提拉（60根）', 'Shopping Lift - 60 Threads', '溶解線植入·促進膠原蛋白·緊緻提升', 236000, 'cosmetic_surgery', 487, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-shopping-lift-80', 'ショッピングリフト（80本）', '購物提拉（80根）', 'Shopping Lift - 80 Threads', '溶解線植入·促進膠原蛋白·緊緻提升', 316000, 'cosmetic_surgery', 488, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-shopping-lift-100', 'ショッピングリフト（100本）', '購物提拉（100根）', 'Shopping Lift - 100 Threads', '溶解線植入·促進膠原蛋白·緊緻提升·最大效果', 396000, 'cosmetic_surgery', 489, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-peel-reverse', 'リバースピール', '逆轉煥膚', 'Reverse Peel', '針對肝斑&色素沉著·3層藥劑從表皮到真皮深層改善', 36000, 'cosmetic_surgery', 490, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-peel-milano', 'ミラノ・リピール', '米蘭煥膚', 'Milano Repeel', '5種酸促進肌膚代謝更新·透明感·改善痘痘/毛孔', 30000, 'cosmetic_surgery', 491, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-peel-massage', 'マッサージピール（コラーゲンピール）', '按摩煥膚（膠原蛋白煥膚）', 'Massage Peel - Collagen Peel', '邊按摩邊將藥劑滲透至真皮層·促進膠原蛋白生成·改善彈力/細紋/鬆弛', 30000, 'cosmetic_surgery', 492, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-aga-cocktail-partial', 'SAI CLINIC発毛カクテル（生え際＋分け目＋頭頂部）', 'SAI CLINIC生髮雞尾酒（前額+分線+頭頂）', 'SAI CLINIC Hair Growth Cocktail - Partial', '生長因子+Minoxidil+12種原創生髮成分·水光注射深層滲透', 116000, 'cosmetic_surgery', 500, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-aga-cocktail-full', 'SAI CLINIC発毛カクテル（頭全体）', 'SAI CLINIC生髮雞尾酒（全頭）', 'SAI CLINIC Hair Growth Cocktail - Full Head', '全頭水光注射·深層滲透毛母細胞周圍·全面促進生髮', 220000, 'cosmetic_surgery', 501, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-aga-stemcell-fd', '薄毛治療 臍帯幹細胞上清液（フリーズドライ）', '生髮治療 臍帶幹細胞上清液（凍乾）', 'Hair Loss - Umbilical Stem Cell (Freeze-Dried)', '幹細胞萃取生長因子·活化毛根·促進生髮·改善髮質·白髮變黑', 178000, 'cosmetic_surgery', 502, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-aga-stemcell-frozen', '薄毛治療 臍帯幹細胞上清液（新鮮凍結品）', '生髮治療 臍帶幹細胞上清液（新鮮凍結）', 'Hair Loss - Umbilical Stem Cell (Fresh Frozen)', '新鮮凍結品·2次份量·最高品質·活化毛根促進生髮', 700000, 'cosmetic_surgery', 503, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-aga-pdf-fd', '薄毛治療 PDF-FD療法', '生髮治療 PDF-FD療法', 'Hair Loss - PDF-FD Therapy', '自體血液萃取生長因子·直接注入頭皮·活化毛根', 456000, 'cosmetic_surgery', 504, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-aga-ogshi', 'Ogshi（女性用毛髪サプリメント）', 'Ogshi女性毛髮營養補充品', 'Ogshi - Women Hair Supplement', '日本女性專用·鐵/氨基酸/礦物質/維生素B群·國產高品質原料', 21168, 'cosmetic_surgery', 505, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-aga-finasteride', 'フィナステリド（男性AGA内服薬）', 'Finasteride非那雄胺（男性AGA內服藥）', 'Finasteride - Male AGA Oral Medicine', '抑制男性荷爾蒙·預防掉髮·1個月份', 19600, 'cosmetic_surgery', 506, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nutrition-light', 'オーソモレキュラー栄養解析 ライトプラン（34項目）', '精密營養分析 輕量方案（34項）', 'Orthomolecular Nutrition - Light Plan (34 Items)', '34項血液檢測+營養分析+結果說明+營養建議', 44000, 'cosmetic_surgery', 362, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-nutrition-standard', 'オーソモレキュラー栄養解析 スタンダードプラン（64項目）', '精密營養分析 標準方案（64項）', 'Orthomolecular Nutrition - Standard Plan (64 Items)', '64項血液檢測+營養分析+結果說明+營養建議', 90000, 'cosmetic_surgery', 363, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-med-tranexamic', 'トラネキサム酸（30日分）', '傳明酸（30日份）', 'Tranexamic Acid - 30 Days', '抗炎症·改善肝斑·美白·美肌效果', 6000, 'cosmetic_surgery', 510, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-med-ubera', 'ユベラ（30日分）', 'Ubera維生素E（30日份）', 'Ubera Vitamin E - 30 Days', '維生素E衍生物·抗氧化·促進肌膚代謝·改善色斑', 5600, 'cosmetic_surgery', 511, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-med-goreisan', '五苓散（7日分）', '五苓散（7日份）', 'Goreisan Herbal Medicine - 7 Days', '術後消腫·排出體內多餘水分·改善浮腫', 4200, 'cosmetic_surgery', 512, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-med-jumihaidokuto', '十味敗毒湯（30日分）', '十味敗毒湯（30日份）', 'Jumihaidokuto Herbal - 30 Days', '調節荷爾蒙平衡·控制皮脂分泌·改善成人痘痘', 7000, 'cosmetic_surgery', 513, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-whitening-600', '白玉・美白点滴（600mg）', '白玉美白點滴（600mg）', 'Whitening IV Drip - 600mg', '穀胱甘肽·抑制黑色素·美白·解毒·改善宿醉和慢性疲勞', 12000, 'cosmetic_surgery', 520, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-whitening-1200', '白玉・美白点滴（1200mg）', '白玉美白點滴（1200mg）', 'Whitening IV Drip - 1200mg', '高劑量穀胱甘肽·更強效美白解毒', 18000, 'cosmetic_surgery', 521, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-vitc-10g', '高濃度ビタミンC点滴（10g）', '高濃度維C點滴（10g）', 'High-Dose Vitamin C IV - 10g', '高濃度維生素C·美肌美白·抗氧化·免疫提升', 14000, 'cosmetic_surgery', 522, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-vitc-30g', '高濃度ビタミンC点滴（30g）', '高濃度維C點滴（30g）', 'High-Dose Vitamin C IV - 30g', '超高濃度維生素C·需事前G6PD檢查', 38000, 'cosmetic_surgery', 523, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-vitc-40g', '高濃度ビタミンC点滴（40g）', '高濃度維C點滴（40g）', 'High-Dose Vitamin C IV - 40g', '最高濃度維生素C·需事前G6PD檢查·疾病預防改善', 50000, 'cosmetic_surgery', 524, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-diet', '脂肪燃焼ダイエット点滴', '燃脂瘦身點滴', 'Fat Burning Diet IV Drip', 'L-肉鹼+α-硫辛酸+維生素B·促進脂肪燃燒·抗氧化·改善疲勞冰冷', 18000, 'cosmetic_surgery', 525, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-cinderella', 'シンデレラ点滴', '灰姑娘點滴', 'Cinderella IV Drip', '美白+燃脂雙效合一·肌膚和身材都像灰姑娘一樣', 26000, 'cosmetic_surgery', 526, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-fatigue', '疲労回復・ストレスケア点滴', '疲勞恢復·壓力舒緩點滴', 'Fatigue Recovery & Stress Care IV', '維生素B群+甘草酸·快速恢復疲勞·解毒抗炎·宿醉腰痛也有效', 14000, 'cosmetic_surgery', 527, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-hangover', '二日酔い・肝機能改善点滴', '宿醉·肝機能改善點滴', 'Hangover & Liver Function IV', '幫助肝臟分解酒精·快速緩解宿醉·改善肝機能·疲勞倦怠', 14000, 'cosmetic_surgery', 528, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-custom', '院長のオーダーメイド点滴', '院長訂製點滴', 'Director Custom IV Drip', '根據營養狀態/體調/目的·院長量身調配的特製雞尾酒點滴', 50000, 'cosmetic_surgery', 529, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-stemcell-fd', '点滴 臍帯幹細胞上清液（フリーズドライ）', '點滴 臍帶幹細胞上清液（凍乾）', 'IV Drip - Umbilical Stem Cell (Freeze-Dried)', '高再生能力·改善膚質/細紋/疲勞恢復/性機能', 166000, 'cosmetic_surgery', 530, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, description_zh_tw, price_jpy, category, display_order, is_active)
VALUES ('sai-drip-stemcell-frozen', '点滴 臍帯幹細胞上清液（新鮮凍結品）', '點滴 臍帶幹細胞上清液（新鮮凍結）', 'IV Drip - Umbilical Stem Cell (Fresh Frozen)', '新鮮凍結品10cc·最高品質再生療法', 700000, 'cosmetic_surgery', 531, true)
ON CONFLICT (slug) DO UPDATE SET name_ja=EXCLUDED.name_ja, name_zh_tw=EXCLUDED.name_zh_tw, name_en=EXCLUDED.name_en, description_zh_tw=EXCLUDED.description_zh_tw, price_jpy=EXCLUDED.price_jpy, category=EXCLUDED.category, display_order=EXCLUDED.display_order;

-- Backfill module_id for SAI CLINIC packages
UPDATE medical_packages SET module_id = (
  SELECT id FROM page_modules WHERE component_key = 'sai_clinic' LIMIT 1
)
WHERE slug LIKE 'sai-%' AND module_id IS NULL;
