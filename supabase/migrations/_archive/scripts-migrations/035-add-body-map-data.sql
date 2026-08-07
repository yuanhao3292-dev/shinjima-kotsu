-- Migration 035: Add body_map_data column to health_screenings table
-- 为健康筛查表添加人体图数据列

-- 1. 添加 body_map_data 列
ALTER TABLE health_screenings
ADD COLUMN IF NOT EXISTS body_map_data JSONB DEFAULT NULL;

-- 2. 添加索引以支持 JSONB 查询
CREATE INDEX IF NOT EXISTS idx_health_screenings_body_map_data
ON health_screenings USING GIN (body_map_data);

-- 3. 添加注释
COMMENT ON COLUMN health_screenings.body_map_data IS '人体图选择数据: {selectedBodyParts, selectedSymptoms, recommendedDepartments, riskLevel}';
