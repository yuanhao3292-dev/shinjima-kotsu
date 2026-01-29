/**
 * API 输入验证 Schemas
 * 使用 Zod 进行类型安全的输入验证
 */
import { z } from 'zod';

// ==================== 搜索消毒工具 ====================

/**
 * 消毒搜索输入，防止 SQL/NoSQL 注入
 * 移除特殊字符，只保留安全字符
 */
export function sanitizeSearchInput(input: string): string {
  if (!input) return '';
  // 移除 SQL 注入常见字符和 PostgreSQL ilike 通配符攻击
  return input
    .replace(/[%_'"\\;(){}[\]<>|&$`!]/g, '') // 移除危险字符
    .replace(/\s+/g, ' ') // 规范化空格
    .trim()
    .slice(0, 100); // 限制长度
}

// ==================== 分页参数 Schema ====================

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

// ==================== 通用 Schemas ====================

export const UUIDSchema = z.string().uuid('无效的 ID 格式');

export const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式无效，请使用 YYYY-MM-DD');

export const TimeSchema = z.string().regex(/^\d{2}:\d{2}$/, '时间格式无效，请使用 HH:MM').optional();

// 允许空字符串或有效电话号码
export const PhoneSchema = z.string().max(20, '电话号码最多20位').refine(
  (val) => val === '' || val.length >= 8,
  { message: '电话号码至少8位' }
).optional();

// ==================== Checkout Session ====================

export const CustomerInfoSchema = z.object({
  email: z.string().email('邮箱格式无效').optional().or(z.literal('')),
  name: z.string().min(1, '姓名不能为空').max(100, '姓名最多100个字符'),
  phone: PhoneSchema,
  company: z.string().max(200, '公司名最多200个字符').optional(),
  country: z.string().length(2, '国家代码必须是2位').default('TW'),
  // 社交媒体联系方式（可选）
  line: z.string().max(100, 'LINE ID最多100个字符').optional(),
  wechat: z.string().max(100, '微信号最多100个字符').optional(),
  whatsapp: z.string().max(30, 'WhatsApp号码最多30个字符').optional(),
}).refine(
  (data) => {
    // 至少填写一种联系方式
    return (data.email && data.email.trim() !== '') ||
           (data.phone && data.phone.trim() !== '') ||
           (data.line && data.line.trim() !== '') ||
           (data.wechat && data.wechat.trim() !== '') ||
           (data.whatsapp && data.whatsapp.trim() !== '');
  },
  { message: '请至少填写一种联系方式（手机、邮箱、LINE、微信或 WhatsApp）' }
);

export const CreateCheckoutSessionSchema = z.object({
  packageSlug: z.string().min(1, '套餐标识不能为空'),
  customerInfo: CustomerInfoSchema,
  preferredDate: DateSchema.optional().nullable(),
  preferredTime: TimeSchema.nullable(),
  notes: z.string().max(1000, '备注最多1000个字符').optional().nullable(),
});

// ==================== Withdrawal ====================

export const WithdrawalRequestSchema = z.object({
  amount: z.number()
    .min(5000, '提现金额必须至少 ¥5,000')
    .max(10000000, '单次提现金额不能超过 ¥10,000,000'),
});

// ==================== KYC ====================

export const KYCSubmitSchema = z.object({
  guideId: UUIDSchema,
  documentType: z.enum(['passport', 'residence_card', 'drivers_license', 'national_id'], {
    error: '无效的证件类型',
  }),
  documentNumber: z.string().min(5, '证件号码至少5位').max(30, '证件号码最多30位'),
  legalName: z.string().min(2, '法定姓名至少2个字符').max(100, '法定姓名最多100个字符'),
  nationality: z.string().length(2, '国籍代码必须是2位').optional(),
  frontUrl: z.string().url('证件正面URL无效').optional(),
  backUrl: z.string().url('证件背面URL无效').optional(),
});

// ==================== Admin KYC Review ====================

export const KYCReviewSchema = z.object({
  guideId: UUIDSchema,
  action: z.enum(['approve', 'reject'], {
    error: '操作必须是 approve 或 reject',
  }),
  reviewNote: z.string().max(500, '审核备注最多500个字符').optional(),
});

// ==================== Admin Withdrawal ====================

export const WithdrawalActionSchema = z.object({
  withdrawalId: UUIDSchema,
  action: z.enum(['approve', 'reject', 'process', 'complete'], {
    error: '无效的操作类型',
  }),
  reviewNote: z.string().max(500, '审核备注最多500个字符').optional(),
  paymentReference: z.string().max(100, '转账凭证号最多100个字符').optional(),
}).refine(
  (data) => !(data.action === 'complete' && !data.paymentReference),
  { message: '完成打款时必须提供转账凭证号', path: ['paymentReference'] }
);

// ==================== Admin Guide ====================

export const GuideActionSchema = z.object({
  guideId: UUIDSchema,
  action: z.enum(['approve', 'suspend', 'reactivate', 'update_level'], {
    error: '无效的操作类型',
  }),
  level: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
  note: z.string().max(500, '备注最多500个字符').optional(),
}).refine(
  (data) => !(data.action === 'update_level' && !data.level),
  { message: '更新等级时必须指定新等级', path: ['level'] }
);

// ==================== Admin Venue ====================

export const VenueDataSchema = z.object({
  name: z.string().min(1, '店铺名称不能为空').max(200, '店铺名称最多200个字符'),
  category: z.string().min(1, '分类不能为空'),
  city: z.string().min(1, '城市不能为空'),
  address: z.string().max(500, '地址最多500个字符').optional(),
  phone: PhoneSchema,
  description: z.string().max(2000, '描述最多2000个字符').optional(),
  is_active: z.boolean().default(true),
}).partial(); // 允许部分更新

export const VenueActionSchema = z.object({
  action: z.enum(['create', 'update', 'toggle_active', 'delete'], {
    error: '无效的操作类型',
  }),
  venueId: UUIDSchema.optional(),
  venueData: VenueDataSchema.optional(),
}).refine(
  (data) => !(data.action === 'create' && !data.venueData),
  { message: '创建店铺时必须提供店铺数据', path: ['venueData'] }
).refine(
  (data) => !((['update', 'toggle_active', 'delete'].includes(data.action)) && !data.venueId),
  { message: '此操作需要提供店铺 ID', path: ['venueId'] }
);

// ==================== Booking Availability ====================

export const BookingAvailabilityCheckSchema = z.object({
  venueId: UUIDSchema.optional(),
  guideId: UUIDSchema.optional(),
  date: DateSchema,
  time: TimeSchema,
}).refine(
  (data) => data.venueId || data.guideId,
  { message: '必须提供 venueId 或 guideId', path: ['venueId'] }
);

// ==================== Admin Ticket ====================

export const TicketActionSchema = z.object({
  ticketId: UUIDSchema,
  action: z.enum(['update_status', 'reply']).optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  resolutionNote: z.string().max(2000, '解决备注最多2000个字符').optional(),
  replyContent: z.string().max(5000, '回复内容最多5000个字符').optional(),
  assignedTo: z.string().max(200, '指派人最多200个字符').optional(),
});

// ==================== Audit Log ====================

export const AuditLogCreateSchema = z.object({
  action: z.string().min(1, '操作类型不能为空').max(100, '操作类型最多100个字符'),
  entityType: z.string().min(1, '实体类型不能为空').max(50, '实体类型最多50个字符'),
  entityId: UUIDSchema,
  details: z.record(z.string(), z.unknown()).optional(),
  severity: z.enum(['info', 'warning', 'critical']).default('info'),
});

// ==================== Health Screening ====================

export const HealthScreeningAnalyzeSchema = z.object({
  screeningId: UUIDSchema,
  phase: z.union([z.literal(1), z.literal(2)]).default(2),
});

// ==================== Whitelabel Subscription ====================

export const WhitelabelSubscriptionSchema = z.object({
  guideId: UUIDSchema,
  successUrl: z.string().url('无效的成功回调 URL').optional(),
  cancelUrl: z.string().url('无效的取消回调 URL').optional(),
});

// ==================== Calculate Quote ====================

export const CalculateQuoteSchema = z.object({
  pax: z.number().int().min(1, '人数至少为1').max(1000, '人数不能超过1000'),
  travel_days: z.number().int().min(1, '天数至少为1').max(365, '天数不能超过365'),
  hotel_req: z.object({
    rooms: z.number().int().min(1).max(500),
    stars: z.number().int().min(3).max(5),
    nights: z.number().int().min(1).max(365),
    location: z.string().min(1).max(100),
  }),
  need_bus: z.boolean(),
  bus_type: z.enum(['alphard', 'hiace', 'coaster', 'medium_bus', 'large_bus']),
  guide_language: z.enum(['zh', 'en']),
  agency_name: z.string().min(1, '旅行社名称不能为空').max(200, '旅行社名称最多200个字符'),
});

// ==================== Admin Booking Action ====================

export const BookingActionSchema = z.object({
  action: z.enum(['confirm', 'complete', 'no_show', 'cancel'], {
    error: '操作必须是 confirm、complete、no_show 或 cancel',
  }),
  bookingId: UUIDSchema,
  adminNotes: z.string().max(1000, '管理员备注最多1000个字符').nullable().optional(),
  cancelReason: z.string().max(500, '取消原因最多500个字符').nullable().optional(),
  actualSpend: z.number().min(0, '实际消费金额不能为负数').nullable().optional(),
}).refine(
  (data) => !(data.action === 'complete' && (data.actualSpend === undefined || data.actualSpend === null)),
  { message: '完成预约时必须提供实际消费金额 (actualSpend)', path: ['actualSpend'] }
).refine(
  (data) => !(data.action === 'cancel' && !data.cancelReason),
  { message: '取消预约时建议提供取消原因', path: ['cancelReason'] }
);

// ==================== Admin Image Upload ====================

export const AdminImageUploadSchema = z.object({
  imageKey: z.string().min(1, '图片标识不能为空').regex(/^[a-zA-Z0-9_-]+$/, '图片标识只能包含字母、数字、下划线和连字符'),
  imageUrl: z.string().url('无效的图片 URL').optional().nullable(),
});

// ==================== Admin Page Module ====================

export const ModuleDataSchema = z.object({
  moduleType: z.enum(['bio', 'vehicle', 'medical'], {
    error: '模块类型必须是 bio、vehicle 或 medical',
  }),
  name: z.string().min(1, '模块名称不能为空').max(100, '模块名称最多100个字符'),
  nameJa: z.string().max(100, '日文名称最多100个字符').nullable().optional(),
  nameZh: z.string().max(100, '中文名称最多100个字符').nullable().optional(),
  description: z.string().max(2000, '描述最多2000个字符').nullable().optional(),
  descriptionJa: z.string().max(2000, '日文描述最多2000个字符').nullable().optional(),
  descriptionZh: z.string().max(2000, '中文描述最多2000个字符').nullable().optional(),
  iconUrl: z.string().url('图标URL无效').nullable().optional(),
  isRequired: z.boolean().default(false),
  commissionRateMin: z.number().min(0, '佣金比例不能为负').max(100, '佣金比例不能超过100').default(0),
  commissionRateMax: z.number().min(0, '佣金比例不能为负').max(100, '佣金比例不能超过100').default(25),
  status: z.enum(['active', 'inactive']).default('active'),
  displayOrder: z.number().int().min(0).default(0),
  config: z.record(z.string(), z.unknown()).nullable().optional(),
}).partial();

export const ModuleActionSchema = z.object({
  action: z.enum(['create', 'update', 'toggle_status', 'delete'], {
    error: '无效的操作类型',
  }),
  moduleId: UUIDSchema.optional(),
  moduleData: ModuleDataSchema.optional(),
}).refine(
  (data) => !(data.action === 'create' && !data.moduleData),
  { message: '创建模块时必须提供模块数据', path: ['moduleData'] }
).refine(
  (data) => !((['update', 'toggle_status', 'delete'].includes(data.action)) && !data.moduleId),
  { message: '此操作需要提供模块 ID', path: ['moduleId'] }
);

// ==================== Admin Page Template ====================

export const TemplateDataSchema = z.object({
  moduleType: z.enum(['bio', 'vehicle'], {
    error: '模板类型必须是 bio 或 vehicle',
  }),
  templateKey: z.string().min(1, '模板标识不能为空').max(50, '模板标识最多50个字符')
    .regex(/^[a-z][a-z0-9_]*$/, '模板标识只能包含小写字母、数字和下划线，且必须以字母开头'),
  name: z.string().min(1, '模板名称不能为空').max(100, '模板名称最多100个字符'),
  nameJa: z.string().max(100, '日文名称最多100个字符').nullable().optional(),
  nameZh: z.string().max(100, '中文名称最多100个字符').nullable().optional(),
  previewImageUrl: z.string().url('预览图URL无效').nullable().optional(),
  templateConfig: z.record(z.string(), z.unknown()).default({}),
  isDefault: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
}).partial();

export const TemplateActionSchema = z.object({
  action: z.enum(['create', 'update', 'delete'], {
    error: '无效的操作类型',
  }),
  templateId: UUIDSchema.optional(),
  templateData: TemplateDataSchema.optional(),
}).refine(
  (data) => !(data.action === 'create' && !data.templateData),
  { message: '创建模板时必须提供模板数据', path: ['templateData'] }
).refine(
  (data) => !((['update', 'delete'].includes(data.action)) && !data.templateId),
  { message: '此操作需要提供模板 ID', path: ['templateId'] }
);

// ==================== Admin Vehicle Library ====================

export const VehicleLibraryDataSchema = z.object({
  vehicleType: z.string().min(1, '车型类型不能为空').max(50, '车型类型最多50个字符'),
  brand: z.string().min(1, '品牌不能为空').max(100, '品牌最多100个字符'),
  model: z.string().min(1, '型号不能为空').max(100, '型号最多100个字符'),
  year: z.number().int().min(2000).max(2030).nullable().optional(),
  seatCapacity: z.number().int().min(1, '座位数至少为1').max(60, '座位数不能超过60'),
  luggageCapacity: z.number().int().min(0, '行李容量不能为负').max(100, '行李容量不能超过100'),
  imageUrl: z.string().url('图片URL无效').nullable().optional(),
  features: z.array(z.string().max(100)).default([]),
  description: z.string().max(2000, '描述最多2000个字符').nullable().optional(),
  descriptionJa: z.string().max(2000, '日文描述最多2000个字符').nullable().optional(),
  descriptionZh: z.string().max(2000, '中文描述最多2000个字符').nullable().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
}).partial();

export const VehicleLibraryActionSchema = z.object({
  action: z.enum(['create', 'update', 'toggle_active', 'delete'], {
    error: '无效的操作类型',
  }),
  vehicleId: UUIDSchema.optional(),
  vehicleData: VehicleLibraryDataSchema.optional(),
}).refine(
  (data) => !(data.action === 'create' && !data.vehicleData),
  { message: '创建车辆时必须提供车辆数据', path: ['vehicleData'] }
).refine(
  (data) => !((['update', 'toggle_active', 'delete'].includes(data.action)) && !data.vehicleId),
  { message: '此操作需要提供车辆 ID', path: ['vehicleId'] }
);

// ==================== Guide White-Label Page ====================

export const GuideWhiteLabelPageSchema = z.object({
  slug: z.string().min(3, 'URL标识至少3个字符').max(50, 'URL标识最多50个字符')
    .regex(/^[a-z][a-z0-9-]*$/, 'URL标识只能包含小写字母、数字和连字符，且必须以字母开头'),
  isPublished: z.boolean().default(false),
  bioTemplateId: UUIDSchema.nullable().optional(),
  vehicleTemplateId: UUIDSchema.nullable().optional(),
  bioContent: z.record(z.string(), z.unknown()).nullable().optional(),
  vehicleContent: z.record(z.string(), z.unknown()).nullable().optional(),
  customCss: z.string().max(10000, '自定义CSS最多10000个字符').nullable().optional(),
  seoTitle: z.string().max(100, 'SEO标题最多100个字符').nullable().optional(),
  seoDescription: z.string().max(300, 'SEO描述最多300个字符').nullable().optional(),
}).partial();

// ==================== Guide Selected Module ====================

export const GuideSelectedModuleSchema = z.object({
  moduleId: UUIDSchema,
  isEnabled: z.boolean().default(true),
  customConfig: z.record(z.string(), z.unknown()).nullable().optional(),
  displayOrder: z.number().int().min(0).default(0),
});

export const GuideSelectedModuleActionSchema = z.object({
  action: z.enum(['add', 'update', 'remove'], {
    error: '操作必须是 add、update 或 remove',
  }),
  moduleId: UUIDSchema,
  isEnabled: z.boolean().optional(),
  customConfig: z.record(z.string(), z.unknown()).nullable().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

// ==================== Guide Selected Vehicle ====================

export const GuideSelectedVehicleSchema = z.object({
  vehicleId: UUIDSchema,
  customName: z.string().max(100, '自定义名称最多100个字符').nullable().optional(),
  customDescription: z.string().max(2000, '自定义描述最多2000个字符').nullable().optional(),
  customImageUrl: z.string().url('自定义图片URL无效').nullable().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

export const GuideSelectedVehicleActionSchema = z.object({
  action: z.enum(['add', 'update', 'remove'], {
    error: '操作必须是 add、update 或 remove',
  }),
  vehicleId: UUIDSchema,
  customName: z.string().max(100).nullable().optional(),
  customDescription: z.string().max(2000).nullable().optional(),
  customImageUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

// ==================== Distribution Order (分销订单) ====================

/**
 * 分销订单客户信息 Schema
 * 用于白标页面提交的咨询/预约表单
 */
export const DistributionOrderCustomerSchema = z.object({
  // 必填：客户姓名
  name: z.string().min(1, '请填写姓名').max(100, '姓名最多100个字符'),
  // 至少一种联系方式
  email: z.string().email('邮箱格式无效').max(200).optional().or(z.literal('')),
  phone: z.string().max(30, '电话号码最多30位').optional().or(z.literal('')),
  wechat: z.string().max(50, '微信号最多50个字符').optional().or(z.literal('')),
}).refine(
  (data) => {
    // 至少填写一种联系方式
    return (data.email && data.email.trim() !== '') ||
           (data.phone && data.phone.trim() !== '') ||
           (data.wechat && data.wechat.trim() !== '');
  },
  { message: '请至少填写一种联系方式（邮箱、电话或微信）' }
);

/**
 * 分销订单 UTM 追踪参数 Schema
 */
export const UTMTrackingSchema = z.object({
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  referrer: z.string().max(500).optional(),
  source_page_path: z.string().max(500).optional(),
});

/**
 * 分销订单创建 Schema
 * 客户通过导游白标页面提交咨询/预约
 */
export const CreateDistributionOrderSchema = z.object({
  // 必填：导游白标配置 ID
  guideWhiteLabelId: UUIDSchema,
  // 必填：页面模块 ID（哪个服务模块）
  moduleId: UUIDSchema,
  // 必填：客户信息
  customer: DistributionOrderCustomerSchema,
  // 可选：订单详情
  orderDetails: z.record(z.string(), z.unknown()).default({}),
  // 可选：咨询消息
  inquiryMessage: z.string().max(2000, '咨询消息最多2000个字符').optional(),
  // 可选：期望日期
  preferredDate: DateSchema.optional().nullable(),
  // 可选：UTM 追踪
  tracking: UTMTrackingSchema.optional(),
});

/**
 * 分销订单状态更新 Schema（管理员操作）
 */
export const UpdateDistributionOrderSchema = z.object({
  orderId: UUIDSchema,
  // 操作类型
  action: z.enum(['quote', 'request_deposit', 'confirm_deposit', 'start_service', 'complete', 'cancel', 'refund'], {
    error: '无效的操作类型',
  }),
  // 报价金额（quote 操作必填）
  quotedAmount: z.number().int().min(0).optional(),
  // 定金金额（request_deposit 操作必填）
  depositAmount: z.number().int().min(0).optional(),
  // 最终金额（complete 操作必填）
  finalAmount: z.number().int().min(0).optional(),
  // 取消原因（cancel 操作建议填写）
  cancelReason: z.string().max(500).optional(),
  // 管理员备注
  adminNotes: z.string().max(2000).optional(),
}).refine(
  (data) => !(data.action === 'quote' && (data.quotedAmount === undefined || data.quotedAmount === null)),
  { message: '报价操作必须提供报价金额', path: ['quotedAmount'] }
).refine(
  (data) => !(data.action === 'request_deposit' && (data.depositAmount === undefined || data.depositAmount === null)),
  { message: '请求定金操作必须提供定金金额', path: ['depositAmount'] }
).refine(
  (data) => !(data.action === 'complete' && (data.finalAmount === undefined || data.finalAmount === null)),
  { message: '完成操作必须提供最终金额', path: ['finalAmount'] }
);

// ==================== 类型导出 ====================

export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;
export type WithdrawalRequestInput = z.infer<typeof WithdrawalRequestSchema>;
export type KYCSubmitInput = z.infer<typeof KYCSubmitSchema>;
export type KYCReviewInput = z.infer<typeof KYCReviewSchema>;
export type WithdrawalActionInput = z.infer<typeof WithdrawalActionSchema>;
export type GuideActionInput = z.infer<typeof GuideActionSchema>;
export type VenueActionInput = z.infer<typeof VenueActionSchema>;
export type BookingAvailabilityCheckInput = z.infer<typeof BookingAvailabilityCheckSchema>;
export type TicketActionInput = z.infer<typeof TicketActionSchema>;
export type AuditLogCreateInput = z.infer<typeof AuditLogCreateSchema>;
export type HealthScreeningAnalyzeInput = z.infer<typeof HealthScreeningAnalyzeSchema>;
export type WhitelabelSubscriptionInput = z.infer<typeof WhitelabelSubscriptionSchema>;
export type CalculateQuoteInput = z.infer<typeof CalculateQuoteSchema>;
export type BookingActionInput = z.infer<typeof BookingActionSchema>;
export type AdminImageUploadInput = z.infer<typeof AdminImageUploadSchema>;
export type ModuleActionInput = z.infer<typeof ModuleActionSchema>;
export type TemplateActionInput = z.infer<typeof TemplateActionSchema>;
export type VehicleLibraryActionInput = z.infer<typeof VehicleLibraryActionSchema>;
export type GuideWhiteLabelPageInput = z.infer<typeof GuideWhiteLabelPageSchema>;
export type GuideSelectedModuleActionInput = z.infer<typeof GuideSelectedModuleActionSchema>;
export type GuideSelectedVehicleActionInput = z.infer<typeof GuideSelectedVehicleActionSchema>;
export type CreateDistributionOrderInput = z.infer<typeof CreateDistributionOrderSchema>;
export type UpdateDistributionOrderInput = z.infer<typeof UpdateDistributionOrderSchema>;
export type DistributionOrderCustomerInput = z.infer<typeof DistributionOrderCustomerSchema>;
export type UTMTrackingInput = z.infer<typeof UTMTrackingSchema>;
