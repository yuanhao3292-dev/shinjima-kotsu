-- ============================================
-- 导游合伙人系统数据库架构
-- Guide Partner System Database Schema
-- ============================================

-- 1. 导游表 (guides)
-- 存储导游基本信息和状态
CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 基本信息
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  wechat_id VARCHAR(100),
  -- 推荐关系
  referrer_id UUID REFERENCES guides(id),
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  level VARCHAR(20) DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'black')),
  -- 认证信息
  auth_user_id UUID REFERENCES auth.users(id),
  -- 统计（冗余字段，便于查询）
  total_bookings INT DEFAULT 0,
  total_commission DECIMAL(12, 2) DEFAULT 0,
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,

  CONSTRAINT unique_phone UNIQUE (phone)
);

-- 2. 夜总会/店铺表 (venues)
-- INSOU集团店铺信息
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 基本信息
  name VARCHAR(200) NOT NULL,
  name_ja VARCHAR(200),
  brand VARCHAR(100), -- INSOU子品牌
  -- 位置
  city VARCHAR(50) NOT NULL, -- 东京/大阪/名古屋等
  area VARCHAR(100), -- 银座/六本木/北新地等
  address TEXT,
  -- 业务信息
  category VARCHAR(50) DEFAULT 'nightclub' CHECK (category IN ('nightclub', 'medical', 'treatment', 'restaurant', 'golf')),
  min_spend DECIMAL(10, 2), -- 最低消费
  avg_spend DECIMAL(10, 2), -- 平均消费
  -- 状态
  is_active BOOLEAN DEFAULT true,
  -- 描述
  description TEXT,
  features TEXT[], -- 特色标签
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 预约表 (bookings)
-- 导游为客户预约的记录
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 关联
  guide_id UUID NOT NULL REFERENCES guides(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  -- 客户信息（不关联具体用户，导游填写）
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20),
  party_size INT DEFAULT 2, -- 人数
  -- 预约信息
  booking_date DATE NOT NULL,
  booking_time TIME,
  special_requests TEXT,
  -- 定金
  deposit_amount DECIMAL(10, 2) DEFAULT 500, -- 人民币
  deposit_status VARCHAR(20) DEFAULT 'pending' CHECK (deposit_status IN ('pending', 'paid', 'refunded', 'forfeited')),
  deposit_paid_at TIMESTAMPTZ,
  -- 消费信息（履约后填写）
  actual_spend DECIMAL(12, 2), -- 实际消费日元
  spend_before_tax DECIMAL(12, 2), -- 税前金额
  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  -- 返金
  commission_rate DECIMAL(4, 2) DEFAULT 0.10, -- 默认10%
  commission_amount DECIMAL(12, 2), -- 计算后的返金
  commission_status VARCHAR(20) DEFAULT 'pending' CHECK (commission_status IN ('pending', 'calculated', 'paid')),
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- 索引
  CONSTRAINT valid_booking_date CHECK (booking_date >= CURRENT_DATE - INTERVAL '1 day')
);

-- 4. 返金结算表 (commission_settlements)
-- 月度结算记录
CREATE TABLE IF NOT EXISTS commission_settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id),
  -- 结算周期
  settlement_month VARCHAR(7) NOT NULL, -- YYYY-MM 格式
  -- 金额
  total_bookings INT DEFAULT 0,
  total_spend DECIMAL(14, 2) DEFAULT 0, -- 总消费
  total_commission DECIMAL(12, 2) DEFAULT 0, -- 总返金
  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid')),
  -- 支付信息
  payment_method VARCHAR(50), -- wechat/alipay/bank
  payment_reference VARCHAR(100), -- 支付凭证
  paid_at TIMESTAMPTZ,
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 每个导游每月只有一条结算记录
  CONSTRAINT unique_guide_month UNIQUE (guide_id, settlement_month)
);

-- 5. 推荐奖励表 (referral_rewards)
-- 推荐人获得的奖励
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 关联
  referrer_id UUID NOT NULL REFERENCES guides(id), -- 推荐人
  referee_id UUID NOT NULL REFERENCES guides(id), -- 被推荐人
  booking_id UUID REFERENCES bookings(id), -- 关联的订单
  -- 奖励
  reward_type VARCHAR(20) DEFAULT 'commission' CHECK (reward_type IN ('commission', 'bonus')),
  reward_rate DECIMAL(4, 2) DEFAULT 0.02, -- 默认2%
  reward_amount DECIMAL(12, 2),
  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 索引
-- ============================================

CREATE INDEX IF NOT EXISTS idx_guides_status ON guides(status);
CREATE INDEX IF NOT EXISTS idx_guides_referrer ON guides(referrer_id);
CREATE INDEX IF NOT EXISTS idx_guides_auth_user ON guides(auth_user_id);

CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_category ON venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_active ON venues(is_active);

CREATE INDEX IF NOT EXISTS idx_bookings_guide ON bookings(guide_id);
CREATE INDEX IF NOT EXISTS idx_bookings_venue ON bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_settlements_guide ON commission_settlements(guide_id);
CREATE INDEX IF NOT EXISTS idx_settlements_month ON commission_settlements(settlement_month);

-- ============================================
-- RLS 策略 (Row Level Security)
-- ============================================

-- 启用 RLS
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

-- Guides 策略
-- 导游只能查看自己的信息
CREATE POLICY "Guides can view own profile" ON guides
  FOR SELECT USING (auth.uid() = auth_user_id);

-- 导游可以更新自己的信息
CREATE POLICY "Guides can update own profile" ON guides
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- 任何人都可以注册（插入）
CREATE POLICY "Anyone can register as guide" ON guides
  FOR INSERT WITH CHECK (true);

-- Venues 策略
-- 所有已认证用户可以查看店铺
CREATE POLICY "Authenticated users can view venues" ON venues
  FOR SELECT USING (auth.role() = 'authenticated');

-- Bookings 策略
-- 导游只能查看自己的预约
CREATE POLICY "Guides can view own bookings" ON bookings
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- 导游可以创建预约
CREATE POLICY "Guides can create bookings" ON bookings
  FOR INSERT WITH CHECK (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid() AND status = 'approved')
  );

-- 导游可以更新自己的预约
CREATE POLICY "Guides can update own bookings" ON bookings
  FOR UPDATE USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- Commission Settlements 策略
CREATE POLICY "Guides can view own settlements" ON commission_settlements
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- Referral Rewards 策略
CREATE POLICY "Guides can view own referral rewards" ON referral_rewards
  FOR SELECT USING (
    referrer_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- ============================================
-- 触发器函数
-- ============================================

-- 自动生成推荐码
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := 'GP' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_referral_code
  BEFORE INSERT ON guides
  FOR EACH ROW
  EXECUTE FUNCTION generate_referral_code();

-- 自动计算返金金额
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.actual_spend IS NOT NULL AND NEW.actual_spend > 0 THEN
    -- 计算税前金额
    NEW.spend_before_tax := NEW.actual_spend / 1.1;
    -- 计算返金
    NEW.commission_amount := NEW.spend_before_tax * NEW.commission_rate;
    NEW.commission_status := 'calculated';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_commission
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  WHEN (OLD.actual_spend IS DISTINCT FROM NEW.actual_spend)
  EXECUTE FUNCTION calculate_commission();

-- 更新导游统计
CREATE OR REPLACE FUNCTION update_guide_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE guides
    SET
      total_bookings = total_bookings + 1,
      total_commission = total_commission + COALESCE(NEW.commission_amount, 0),
      updated_at = NOW()
    WHERE id = NEW.guide_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_guide_stats
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_guide_stats();

-- 自动创建推荐奖励
CREATE OR REPLACE FUNCTION create_referral_reward()
RETURNS TRIGGER AS $$
BEGIN
  -- 当订单返金计算完成时，为推荐人创建奖励
  IF NEW.commission_status = 'calculated' AND (OLD.commission_status IS NULL OR OLD.commission_status != 'calculated') THEN
    INSERT INTO referral_rewards (
      referrer_id,
      referee_id,
      booking_id,
      reward_amount,
      reward_type,
      status
    )
    SELECT
      g.referrer_id,
      NEW.guide_id,
      NEW.id,
      NEW.commission_amount * 0.02,  -- 2% 推荐奖励
      'commission',
      'pending'
    FROM guides g
    WHERE g.id = NEW.guide_id
      AND g.referrer_id IS NOT NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_referral_reward
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_reward();

-- ============================================
-- 初始数据：INSOU 夜总会店铺
-- ============================================

INSERT INTO venues (name, name_ja, brand, city, area, category, min_spend, avg_spend, description, features) VALUES
-- 东京
('Club ANEOS 银座', 'クラブ アネオス 銀座', 'ANEOS', '东京', '银座', 'nightclub', 300000, 800000, '银座顶级会员制俱乐部', ARRAY['VIP包间', '高端服务', '英语对应']),
('Club ANEOS 六本木', 'クラブ アネオス 六本木', 'ANEOS', '东京', '六本木', 'nightclub', 250000, 600000, '六本木人气夜总会', ARRAY['外国人欢迎', '深夜营业', '高级威士忌']),
('Luxury Club 银座本店', 'ラグジュアリークラブ 銀座本店', 'Luxury', '东京', '银座', 'nightclub', 350000, 1000000, 'INSOU旗舰店', ARRAY['最高级', '明星来宾', '私密性强']),

-- 大阪
('Club ANEOS 北新地', 'クラブ アネオス 北新地', 'ANEOS', '大阪', '北新地', 'nightclub', 200000, 500000, '大阪最繁华地段', ARRAY['关西No.1', '中文服务', '交通便利']),
('Premium Club 心斋桥', 'プレミアムクラブ 心斎橋', 'Premium', '大阪', '心斋桥', 'nightclub', 180000, 450000, '心斋桥人气店', ARRAY['年轻氛围', '派对包场', '卡拉OK']),

-- 名古屋
('Club ANEOS �的', 'クラブ アネオス 錦', 'ANEOS', '名古屋', '锦', 'nightclub', 180000, 400000, '名古屋中心', ARRAY['当地人气', '商务接待']),

-- 福冈
('Club ANEOS 中洲', 'クラブ アネオス 中洲', 'ANEOS', '福冈', '中洲', 'nightclub', 150000, 350000, '九州最大欢乐街', ARRAY['九州No.1', '海�的幸', '温泉套餐']),

-- 札幌（北海道 - 实际无店，这里仅作示例移除）
-- 那霸（冲绳 - 实际无店，这里仅作示例移除）

-- 京都
('Club Elegance 祇园', 'クラブ エレガンス 祇園', 'Elegance', '京都', '祇园', 'nightclub', 250000, 600000, '古都风情', ARRAY['艺妓体验', '传统建筑', '高端']),

-- 神户
('Club ANEOS 三宫', 'クラブ アネオス 三宮', 'ANEOS', '神户', '三宫', 'nightclub', 170000, 380000, '神户港口区', ARRAY['夜景', '洋风', '红酒'])

ON CONFLICT DO NOTHING;

-- 添加医疗服务
INSERT INTO venues (name, name_ja, brand, city, area, category, min_spend, avg_spend, description, features) VALUES
('TIMC大阪', 'TIMC OSAKA', 'TIMC', '大阪', '梅田', 'medical', 500000, 1500000, '德洲会国际医疗中心', ARRAY['PET-CT', 'MRI', '中文服务', 'VIP专属']),
('新岛综合治疗', '新島総合治療', '新岛', '大阪', '梅田', 'treatment', 1000000, 3000000, '干细胞/抗衰', ARRAY['干细胞', '抗衰老', '再生医疗'])
ON CONFLICT DO NOTHING;

-- ============================================
-- 完成
-- ============================================
