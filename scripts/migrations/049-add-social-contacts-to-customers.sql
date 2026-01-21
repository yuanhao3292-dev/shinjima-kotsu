-- Migration 049: 添加社交媒体联系字段到 customers 表
-- 修复"代码先行"问题：CustomerInfoSchema 中定义了 line/wechat/whatsapp 但数据库未创建

-- 1. 添加社交媒体联系字段
ALTER TABLE customers ADD COLUMN IF NOT EXISTS line VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS wechat VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(30);

-- 2. 修改 email 字段为可选（允许 NULL）
-- 因为现在联系方式只需填写一种即可（email/phone/line/wechat/whatsapp）
ALTER TABLE customers ALTER COLUMN email DROP NOT NULL;

-- 3. 删除 email 的 UNIQUE 约束（因为多个客户可能都没填 email）
-- 先检查约束是否存在，再删除
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'customers_email_key' AND table_name = 'customers'
  ) THEN
    ALTER TABLE customers DROP CONSTRAINT customers_email_key;
  END IF;
END $$;

-- 4. 添加部分唯一索引（只对非空 email 唯一）
DROP INDEX IF EXISTS idx_customers_email_unique;
CREATE UNIQUE INDEX idx_customers_email_unique ON customers(email) WHERE email IS NOT NULL AND email != '';

-- 5. 添加社交媒体字段的索引
CREATE INDEX IF NOT EXISTS idx_customers_line ON customers(line) WHERE line IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_wechat ON customers(wechat) WHERE wechat IS NOT NULL;

-- 6. 添加注释
COMMENT ON COLUMN customers.line IS 'LINE ID 联系方式';
COMMENT ON COLUMN customers.wechat IS '微信号联系方式';
COMMENT ON COLUMN customers.whatsapp IS 'WhatsApp 号码';
COMMENT ON COLUMN customers.email IS '电子邮箱（可选，但如填写必须唯一）';
