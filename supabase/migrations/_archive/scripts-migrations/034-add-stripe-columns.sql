-- Migration 034: 为 medical_packages 表添加 Stripe 字段
-- 添加 stripe_product_id 和 stripe_price_id 列

ALTER TABLE medical_packages 
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- 创建索引加速查询
CREATE INDEX IF NOT EXISTS idx_medical_packages_stripe_price_id ON medical_packages(stripe_price_id);
