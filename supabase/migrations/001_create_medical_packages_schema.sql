-- 创建医疗套餐数据库架构
-- Migration: 001_create_medical_packages_schema

-- 1. 套餐表 (medical_packages)
CREATE TABLE IF NOT EXISTS medical_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_ja TEXT NOT NULL,
  name_zh_tw TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ja TEXT,
  description_zh_tw TEXT,
  description_en TEXT,
  price_jpy INTEGER NOT NULL,
  stripe_price_id TEXT, -- Stripe Price ID
  stripe_product_id TEXT, -- Stripe Product ID
  category TEXT NOT NULL CHECK (category IN ('vip', 'premium', 'select', 'standard')),
  is_active BOOLEAN DEFAULT true,
  features JSONB, -- 套餐包含的检查项目
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 客户表 (customers)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  country TEXT DEFAULT 'TW',
  stripe_customer_id TEXT UNIQUE, -- Stripe Customer ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 订单表 (orders)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  package_id UUID REFERENCES medical_packages(id),
  quantity INTEGER DEFAULT 1,
  total_amount_jpy INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'completed', 'cancelled', 'refunded')),
  payment_intent_id TEXT, -- Stripe Payment Intent ID
  checkout_session_id TEXT, -- Stripe Checkout Session ID

  -- 客户信息快照（防止客户信息变更）
  customer_snapshot JSONB,

  -- 预约信息
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 4. 支付记录表 (payments)
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount_jpy INTEGER NOT NULL,
  currency TEXT DEFAULT 'jpy',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  payment_method TEXT, -- 'card', 'alipay', 'wechat_pay', etc.
  stripe_charge_id TEXT,
  receipt_url TEXT,
  failure_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 创建索引
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_stripe_id ON customers(stripe_customer_id);

-- 6. 创建订单编号生成函数
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  prefix TEXT := 'TIMC';
  date_part TEXT := TO_CHAR(NOW(), 'YYMMDD');
  sequence_part TEXT;
  count INTEGER;
BEGIN
  -- 获取今天的订单数量
  SELECT COUNT(*) INTO count
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;

  -- 生成序列号（4位数）
  sequence_part := LPAD((count + 1)::TEXT, 4, '0');

  -- 组合订单号: TIMC + 日期(YYMMDD) + 序列(0001)
  new_number := prefix || date_part || sequence_part;

  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- 7. 自动生成订单号的触发器
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- 8. 自动更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_medical_packages_updated_at BEFORE UPDATE ON medical_packages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. 插入默认套餐数据
INSERT INTO medical_packages (slug, name_ja, name_zh_tw, name_en, price_jpy, category, features) VALUES
(
  'vip-member-course',
  'VIP 頂級全能套裝',
  'VIP 頂級全能套裝',
  'VIP Member Course',
  880000,
  'vip',
  '[
    {"ja": "MRI: 脳(MRA)+心+DWIBS+骨盆", "zh_tw": "MRI: 腦(MRA)+心+DWIBS+骨盆", "en": "MRI: Brain(MRA)+Heart+DWIBS+Pelvis"},
    {"ja": "CT: 胸部+冠脈鈣化+內臓脂肪", "zh_tw": "CT: 胸部+冠脈鈣化+內臟脂肪", "en": "CT: Chest+Coronary Calcium+Visceral Fat"},
    {"ja": "内視鏡: 胃鏡+大腸鏡 (鎮静)", "zh_tw": "內視鏡: 胃鏡+大腸鏡 (鎮靜)", "en": "Endoscopy: Gastroscopy+Colonoscopy (Sedation)"},
    {"ja": "超音波: 頸/心/腹/下肢/乳房(女)", "zh_tw": "超音波: 頸/心/腹/下肢/乳房(女)", "en": "Ultrasound: Neck/Heart/Abdomen/Legs/Breast(F)"},
    {"ja": "尊享: 單間休息室、精緻餐券", "zh_tw": "尊享: 單間休息室、精緻餐券", "en": "VIP: Private Suite, Premium Meal"}
  ]'::jsonb
),
(
  'premium-cardiac-course',
  'PREMIUM (心臓精密)',
  'PREMIUM (心臟精密)',
  'Premium Cardiac Course',
  650000,
  'premium',
  '[
    {"ja": "MRI: 心臓(非造影)+脳+DWIBS", "zh_tw": "MRI: 心臟(非造影)+腦+DWIBS", "en": "MRI: Heart(Non-contrast)+Brain+DWIBS"},
    {"ja": "CT: 冠状動脈鈣化積分", "zh_tw": "CT: 冠狀動脈鈣化積分", "en": "CT: Coronary Calcium Score"},
    {"ja": "超音波: 心臓、頸動脈", "zh_tw": "超音波: 心臟、頸動脈", "en": "Ultrasound: Heart, Carotid"},
    {"ja": "血液: BNP, 心肌蛋白T, CPK", "zh_tw": "血液: BNP, 心肌蛋白T, CPK", "en": "Blood: BNP, Troponin-T, CPK"},
    {"ja": "機能: ABI/CAVI (血管年齢)", "zh_tw": "機能: ABI/CAVI (血管年齡)", "en": "Function: ABI/CAVI (Vascular Age)"}
  ]'::jsonb
),
(
  'select-gastro-colonoscopy',
  'SELECT (胃+大腸鏡)',
  'SELECT (胃+大腸鏡)',
  'Gastro + Colonoscopy Course',
  420000,
  'select',
  '[
    {"ja": "内視鏡: 胃鏡 + 大腸鏡", "zh_tw": "內視鏡: 胃鏡 + 大腸鏡", "en": "Endoscopy: Gastroscopy + Colonoscopy"},
    {"ja": "処置: 可当場切除息肉", "zh_tw": "處置: 可當場切除息肉", "en": "Treatment: Polyp removal available"},
    {"ja": "超音波: 腹部 (肝膵腎脾腎)", "zh_tw": "超音波: 腹部 (肝膽腎脾腎)", "en": "Ultrasound: Abdomen (Liver/GB/Kidney)"},
    {"ja": "感染: 幽門螺旋桿菌抗體", "zh_tw": "感染: 幽門螺旋桿菌抗體", "en": "Infection: H. pylori Antibody"},
    {"ja": "血液: 消化道腫瘤標誌物", "zh_tw": "血液: 消化道腫瘤標誌物", "en": "Blood: GI Tumor Markers"}
  ]'::jsonb
);

-- 10. 启用 Row Level Security (RLS)
ALTER TABLE medical_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 11. RLS 策略 - 套餐可公开读取
CREATE POLICY "套餐信息公开可读" ON medical_packages
FOR SELECT USING (is_active = true);

-- 12. RLS 策略 - 客户只能查看自己的数据
CREATE POLICY "客户可查看自己的信息" ON customers
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "客户可查看自己的订单" ON orders
FOR SELECT USING (
  customer_id IN (
    SELECT id FROM customers WHERE stripe_customer_id = (
      SELECT raw_user_meta_data->>'stripe_customer_id' FROM auth.users WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "客户可查看自己的支付记录" ON payments
FOR SELECT USING (
  order_id IN (
    SELECT id FROM orders WHERE customer_id IN (
      SELECT id FROM customers WHERE stripe_customer_id = (
        SELECT raw_user_meta_data->>'stripe_customer_id' FROM auth.users WHERE id = auth.uid()
      )
    )
  )
);

-- 完成
COMMENT ON TABLE medical_packages IS 'TIMC医疗套餐目录';
COMMENT ON TABLE customers IS '客户信息表';
COMMENT ON TABLE orders IS '订单表';
COMMENT ON TABLE payments IS '支付记录表';
