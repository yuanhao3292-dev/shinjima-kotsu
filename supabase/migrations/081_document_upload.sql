-- 081: 文档上传支持
-- 为健康筛查和白标筛查表增加文档上传相关字段

ALTER TABLE health_screenings
  ADD COLUMN IF NOT EXISTS document_url TEXT,
  ADD COLUMN IF NOT EXISTS document_name TEXT,
  ADD COLUMN IF NOT EXISTS document_type TEXT,
  ADD COLUMN IF NOT EXISTS document_extracted_text TEXT,
  ADD COLUMN IF NOT EXISTS input_mode TEXT NOT NULL DEFAULT 'questionnaire';

ALTER TABLE whitelabel_screenings
  ADD COLUMN IF NOT EXISTS document_url TEXT,
  ADD COLUMN IF NOT EXISTS document_name TEXT,
  ADD COLUMN IF NOT EXISTS document_type TEXT,
  ADD COLUMN IF NOT EXISTS document_extracted_text TEXT,
  ADD COLUMN IF NOT EXISTS input_mode TEXT NOT NULL DEFAULT 'questionnaire';

COMMENT ON COLUMN health_screenings.document_type IS 'pdf | image';
COMMENT ON COLUMN health_screenings.input_mode IS 'questionnaire | document | hybrid';
COMMENT ON COLUMN whitelabel_screenings.document_type IS 'pdf | image';
COMMENT ON COLUMN whitelabel_screenings.input_mode IS 'questionnaire | document | hybrid';
