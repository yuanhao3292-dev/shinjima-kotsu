-- =====================================================
-- 白标分销系统 - 数据库迁移
-- White-Label Distribution System
-- =====================================================

-- 1. 页面模块表 (选品中心的"产品")
-- Page Modules - Products in the marketplace
CREATE TABLE IF NOT EXISTS page_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 基本信息
  category TEXT NOT NULL CHECK (category IN ('medical', 'beauty', 'vehicle', 'travel', 'other')),
  name TEXT NOT NULL,                    -- "TIMC 综合体检中心"
  name_ja TEXT,                          -- "TIMC総合健診センター"
  name_en TEXT,                          -- "TIMC Comprehensive Health Check"
  slug TEXT UNIQUE NOT NULL,             -- "timc-health-check" (用于 URL)

  -- 展示信息
  description TEXT,                      -- 模块简介
  description_ja TEXT,
  thumbnail_url TEXT,                    -- 缩略图
  preview_images TEXT[],                 -- 预览图片数组

  -- 页面内容 (可以是 MDX 或 JSON)
  page_content JSONB,                    -- 详细页面内容配置

  -- 佣金设置
  commission_rate DECIMAL(5,2) DEFAULT 15.00,  -- 佣金比例 (%)
  min_order_amount INTEGER,              -- 最低订单金额

  -- 分类和标签
  tags TEXT[],                           -- ["体检", "高端", "大阪"]
  is_premium BOOLEAN DEFAULT false,      -- 是否需要高级会员
  is_required BOOLEAN DEFAULT false,     -- 是否为必选模块

  -- 状态
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 添加索引
CREATE INDEX idx_page_modules_category ON page_modules(category);
CREATE INDEX idx_page_modules_is_active ON page_modules(is_active);
CREATE INDEX idx_page_modules_slug ON page_modules(slug);

-- 2. 页面模板表 (自我介绍、车辆介绍的不同风格)
-- Page Templates - Different styles for bio/vehicle pages
CREATE TABLE IF NOT EXISTS page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 分类
  category TEXT NOT NULL CHECK (category IN ('bio', 'vehicle', 'contact')),

  -- 基本信息
  name TEXT NOT NULL,                    -- "商务精英风格"
  name_ja TEXT,
  description TEXT,

  -- 模板配置
  preview_image TEXT,                    -- 预览图
  template_config JSONB NOT NULL,        -- 模板配置 (颜色、布局等)

  -- 状态
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,      -- 是否为默认模板

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_page_templates_category ON page_templates(category);

-- 3. 车辆库 (导游可选的车辆)
-- Vehicle Library - Vehicles available for guides to select
CREATE TABLE IF NOT EXISTS vehicle_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 基本信息
  name TEXT NOT NULL,                    -- "丰田阿尔法"
  name_ja TEXT,                          -- "トヨタ アルファード"
  name_en TEXT,                          -- "Toyota Alphard"
  slug TEXT UNIQUE NOT NULL,             -- "toyota-alphard"

  -- 车辆信息
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('sedan', 'mpv', 'suv', 'bus', 'luxury')),
  seats INTEGER NOT NULL,                -- 座位数

  -- 展示信息
  description TEXT,
  description_ja TEXT,
  images TEXT[],                         -- 车辆图片数组
  features TEXT[],                       -- 特点 ["皮座椅", "WiFi", "冰箱"]

  -- 价格参考
  price_per_day INTEGER,                 -- 日租参考价
  price_per_hour INTEGER,                -- 时租参考价

  -- 状态
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vehicle_library_type ON vehicle_library(vehicle_type);

-- 4. 导游白标配置 (导游的个人网站设置)
-- Guide White-Label Config
CREATE TABLE IF NOT EXISTS guide_white_label (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL UNIQUE REFERENCES guides(id) ON DELETE CASCADE,

  -- URL 设置
  slug TEXT UNIQUE NOT NULL,             -- URL: /g/{slug}
  custom_domain TEXT,                    -- 自定义域名 (可选)

  -- 个人信息展示
  display_name TEXT NOT NULL,            -- 显示名称
  display_name_ja TEXT,
  avatar_url TEXT,                       -- 头像
  cover_image_url TEXT,                  -- 封面图
  bio TEXT,                              -- 个人简介
  bio_ja TEXT,

  -- 联系方式 (展示给客人)
  contact_wechat TEXT,
  contact_wechat_qr TEXT,                -- 微信二维码图片
  contact_line TEXT,
  contact_line_qr TEXT,
  contact_phone TEXT,
  contact_email TEXT,

  -- 模板选择
  bio_template_id UUID REFERENCES page_templates(id),
  vehicle_template_id UUID REFERENCES page_templates(id),
  contact_template_id UUID REFERENCES page_templates(id),

  -- 主题设置
  theme_color TEXT DEFAULT '#f97316',    -- 主题色 (橙色)

  -- SEO 设置
  site_title TEXT,                       -- 网站标题
  site_description TEXT,                 -- 网站描述

  -- 状态
  is_published BOOLEAN DEFAULT false,    -- 是否已发布
  published_at TIMESTAMPTZ,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_guide_white_label_slug ON guide_white_label(slug);
CREATE INDEX idx_guide_white_label_guide ON guide_white_label(guide_id);

-- 5. 导游选择的模块 (导游选了哪些医疗服务)
-- Guide Selected Modules
CREATE TABLE IF NOT EXISTS guide_selected_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES page_modules(id) ON DELETE CASCADE,

  -- 配置
  sort_order INTEGER DEFAULT 0,          -- 显示顺序
  is_enabled BOOLEAN DEFAULT true,       -- 是否启用
  custom_title TEXT,                     -- 自定义标题 (可选)
  custom_description TEXT,               -- 自定义描述 (可选)

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT now(),

  -- 唯一约束: 一个导游对一个模块只能有一条记录
  UNIQUE(guide_id, module_id)
);

CREATE INDEX idx_guide_selected_modules_guide ON guide_selected_modules(guide_id);

-- 6. 导游选择的车辆
-- Guide Selected Vehicles
CREATE TABLE IF NOT EXISTS guide_selected_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicle_library(id) ON DELETE CASCADE,

  -- 配置
  sort_order INTEGER DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  custom_price_note TEXT,                -- 自定义价格说明

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(guide_id, vehicle_id)
);

CREATE INDEX idx_guide_selected_vehicles_guide ON guide_selected_vehicles(guide_id);

-- 7. 白标页面订单 (通过导游白标页面产生的订单)
-- White-Label Orders
CREATE TABLE IF NOT EXISTS white_label_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 关联
  guide_id UUID NOT NULL REFERENCES guides(id),
  module_id UUID REFERENCES page_modules(id),

  -- 客户信息
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  customer_wechat TEXT,
  customer_line TEXT,
  customer_notes TEXT,

  -- 订单信息
  service_type TEXT NOT NULL,            -- 'medical', 'vehicle', 'travel'
  service_name TEXT NOT NULL,            -- "TIMC 综合体检"
  service_date DATE,                     -- 服务日期
  service_time TEXT,                     -- 服务时间

  -- 金额
  total_amount INTEGER NOT NULL,         -- 总金额 (日元)
  commission_rate DECIMAL(5,2),          -- 佣金比例
  commission_amount INTEGER,             -- 佣金金额

  -- 支付信息
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  paid_at TIMESTAMPTZ,

  -- 订单状态
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,

  -- 备注
  admin_notes TEXT,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_white_label_orders_guide ON white_label_orders(guide_id);
CREATE INDEX idx_white_label_orders_status ON white_label_orders(status);
CREATE INDEX idx_white_label_orders_created ON white_label_orders(created_at DESC);

-- =====================================================
-- RLS 策略
-- =====================================================

-- 启用 RLS
ALTER TABLE page_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_white_label ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_selected_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_selected_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_orders ENABLE ROW LEVEL SECURITY;

-- page_modules: 所有人可读活跃的模块
CREATE POLICY "Anyone can read active modules" ON page_modules
  FOR SELECT USING (is_active = true);

-- page_templates: 所有人可读活跃的模板
CREATE POLICY "Anyone can read active templates" ON page_templates
  FOR SELECT USING (is_active = true);

-- vehicle_library: 所有人可读活跃的车辆
CREATE POLICY "Anyone can read active vehicles" ON vehicle_library
  FOR SELECT USING (is_active = true);

-- guide_white_label: 导游可读写自己的配置，所有人可读已发布的
CREATE POLICY "Guides can manage own white label" ON guide_white_label
  FOR ALL USING (
    guide_id IN (
      SELECT id FROM guides WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read published white labels" ON guide_white_label
  FOR SELECT USING (is_published = true);

-- guide_selected_modules: 导游可读写自己的选择
CREATE POLICY "Guides can manage own module selections" ON guide_selected_modules
  FOR ALL USING (
    guide_id IN (
      SELECT id FROM guides WHERE auth_user_id = auth.uid()
    )
  );

-- guide_selected_vehicles: 导游可读写自己的选择
CREATE POLICY "Guides can manage own vehicle selections" ON guide_selected_vehicles
  FOR ALL USING (
    guide_id IN (
      SELECT id FROM guides WHERE auth_user_id = auth.uid()
    )
  );

-- white_label_orders: 导游可读自己的订单
CREATE POLICY "Guides can read own orders" ON white_label_orders
  FOR SELECT USING (
    guide_id IN (
      SELECT id FROM guides WHERE auth_user_id = auth.uid()
    )
  );

-- =====================================================
-- 初始数据: 页面模板
-- =====================================================

INSERT INTO page_templates (category, name, name_ja, description, is_default, template_config) VALUES
-- 自我介绍模板
('bio', '商务精英', 'ビジネスエリート', '深蓝色调，专业商务风格', true, '{"theme": "business", "primaryColor": "#1e40af", "layout": "professional"}'),
('bio', '亲切友好', '親しみやすい', '暖色调，亲切自然风格', false, '{"theme": "friendly", "primaryColor": "#f97316", "layout": "casual"}'),
('bio', '医疗专家', '医療エキスパート', '纯白色调，专业医疗翻译风格', false, '{"theme": "medical", "primaryColor": "#0ea5e9", "layout": "clean"}'),

-- 车辆模板
('vehicle', '豪华展示', 'ラグジュアリー', '大图展示，突出豪华感', true, '{"theme": "luxury", "imageSize": "large", "showPrice": true}'),
('vehicle', '简洁列表', 'シンプルリスト', '紧凑列表，信息清晰', false, '{"theme": "compact", "imageSize": "medium", "showPrice": true}'),

-- 联系模板
('contact', '二维码优先', 'QRコード優先', '突出显示微信/LINE二维码', true, '{"layout": "qr_focused", "showMap": false}'),
('contact', '表单优先', 'フォーム優先', '突出显示联系表单', false, '{"layout": "form_focused", "showMap": true}');

-- =====================================================
-- 初始数据: 车辆库
-- =====================================================

INSERT INTO vehicle_library (name, name_ja, name_en, slug, vehicle_type, seats, description, description_ja, features, sort_order) VALUES
('丰田阿尔法', 'トヨタ アルファード', 'Toyota Alphard', 'toyota-alphard', 'mpv', 7,
 '日本最受欢迎的豪华MPV，宽敞舒适，适合家庭和商务接待',
 '日本で最も人気のある高級MPV。広々とした快適な空間で、ご家族やビジネスシーンに最適です',
 ARRAY['真皮座椅', '电动滑门', '后排娱乐系统', '车载WiFi'], 1),

('丰田海狮', 'トヨタ ハイエース', 'Toyota Hiace', 'toyota-hiace', 'mpv', 10,
 '大空间商务车，适合小团队出行',
 '大空間のワンボックス。小グループでの移動に最適です',
 ARRAY['大行李空间', '舒适座椅', '车载WiFi'], 2),

('丰田考斯特', 'トヨタ コースター', 'Toyota Coaster', 'toyota-coaster', 'bus', 28,
 '中型巴士，适合团队旅游',
 '中型バス。団体旅行に最適です',
 ARRAY['空调', '麦克风', '大行李舱'], 3),

('奔驰V级', 'メルセデス・ベンツ Vクラス', 'Mercedes-Benz V-Class', 'mercedes-v-class', 'luxury', 7,
 '德系豪华MPV，极致舒适体验',
 'ドイツの高級MPV。最高の快適さをお届けします',
 ARRAY['NAPPA皮革', '按摩座椅', '氛围灯', '车载冰箱'], 4),

('雷克萨斯LM', 'レクサス LM', 'Lexus LM', 'lexus-lm', 'luxury', 4,
 '顶级行政座驾，极致奢华',
 '最高級の行政用車両。究極のラグジュアリー',
 ARRAY['头等舱座椅', '隔断屏幕', '车载冰箱', '星空顶'], 5);

-- =====================================================
-- 初始数据: 示例医疗模块 (TIMC)
-- =====================================================

INSERT INTO page_modules (category, name, name_ja, name_en, slug, description, description_ja, commission_rate, tags, page_content) VALUES
('medical', 'TIMC 综合体检中心', 'TIMC総合健診センター', 'TIMC Comprehensive Health Check Center', 'timc-health-check',
 '日本顶级综合体检中心，提供全面精密的健康检查服务',
 '日本トップクラスの総合健診センター。精密で包括的な健康診断サービスを提供します',
 15.00,
 ARRAY['体检', '高端', '大阪', '综合'],
 '{"heroTitle": "TIMC 综合体检中心", "heroSubtitle": "精密医疗 · 健康守护", "sections": []}'::jsonb
);

-- =====================================================
-- 注释
-- =====================================================

COMMENT ON TABLE page_modules IS '页面模块表 - 选品中心的医疗/服务产品';
COMMENT ON TABLE page_templates IS '页面模板表 - 自我介绍、车辆等页面的不同风格';
COMMENT ON TABLE vehicle_library IS '车辆库 - 可供导游选择的车辆';
COMMENT ON TABLE guide_white_label IS '导游白标配置 - 导游个人网站的设置';
COMMENT ON TABLE guide_selected_modules IS '导游选择的模块 - 导游选了哪些医疗服务';
COMMENT ON TABLE guide_selected_vehicles IS '导游选择的车辆 - 导游选了哪些车型';
COMMENT ON TABLE white_label_orders IS '白标订单 - 通过导游白标页面产生的订单';
