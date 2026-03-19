-- ============================================================
-- 086: 医院医学实力数据字段
-- 存储 DPC 治疗实绩 + 专门医信息（来自 Caloo）
-- ============================================================

ALTER TABLE jtb_hospitals
  ADD COLUMN IF NOT EXISTS top_treatments JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS specialist_doctors JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS caloo_url TEXT DEFAULT '';

-- top_treatments 结构示例:
-- [
--   {"disease":"乳房の悪性腫瘍","total":830,"surgery":517,"non_surgery":313,"pref_rank":"千葉県1位","national_rank":"全国16位"},
--   ...
-- ]

-- specialist_doctors 结构示例:
-- [
--   {"name":"西 明博","qualification":"総合診療専門医"},
--   {"name":"田中 一郎","qualification":"循環器専門医"},
--   ...
-- ]

COMMENT ON COLUMN jtb_hospitals.top_treatments IS 'DPC治療実績 top5-10（疾患名, 件数, 手術件数, 県内/全国順位）';
COMMENT ON COLUMN jtb_hospitals.specialist_doctors IS '在籍専門医一覧（医師名, 専門医資格）';
COMMENT ON COLUMN jtb_hospitals.caloo_url IS 'Caloo病院ページURL';
