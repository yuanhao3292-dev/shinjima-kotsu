-- ============================================
-- 添加店铺价格信息字段
-- ============================================

-- 添加营业时间
ALTER TABLE venues ADD COLUMN IF NOT EXISTS business_hours TEXT;

-- 添加定休日
ALTER TABLE venues ADD COLUMN IF NOT EXISTS closed_days TEXT;

-- 添加服务费
ALTER TABLE venues ADD COLUMN IF NOT EXISTS service_charge TEXT;

-- 添加详细价格信息 (JSONB)
ALTER TABLE venues ADD COLUMN IF NOT EXISTS pricing_info JSONB;

-- 添加备考
ALTER TABLE venues ADD COLUMN IF NOT EXISTS remarks TEXT;

-- 添加官网链接
ALTER TABLE venues ADD COLUMN IF NOT EXISTS website TEXT;

-- 添加注释
COMMENT ON COLUMN venues.business_hours IS '営業時間';
COMMENT ON COLUMN venues.closed_days IS '定休日';
COMMENT ON COLUMN venues.service_charge IS 'サービス料';
COMMENT ON COLUMN venues.pricing_info IS '詳細料金情報 (JSON)';
COMMENT ON COLUMN venues.remarks IS '備考';
COMMENT ON COLUMN venues.website IS '公式サイトURL';
