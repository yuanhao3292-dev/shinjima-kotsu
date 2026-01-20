/**
 * API 输入验证 Schemas
 * 使用 Zod 进行类型安全的输入验证
 */
import { z } from 'zod';

// ==================== 通用 Schemas ====================

export const UUIDSchema = z.string().uuid('无效的 ID 格式');

export const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式无效，请使用 YYYY-MM-DD');

export const TimeSchema = z.string().regex(/^\d{2}:\d{2}$/, '时间格式无效，请使用 HH:MM').optional();

export const EmailSchema = z.string().email('邮箱格式无效');

export const PhoneSchema = z.string().min(8, '电话号码至少8位').max(20, '电话号码最多20位').optional();

// ==================== Checkout Session ====================

export const CustomerInfoSchema = z.object({
  email: EmailSchema,
  name: z.string().min(1, '姓名不能为空').max(100, '姓名最多100个字符'),
  phone: PhoneSchema,
  company: z.string().max(200, '公司名最多200个字符').optional(),
  country: z.string().length(2, '国家代码必须是2位').default('TW'),
});

export const CreateCheckoutSessionSchema = z.object({
  packageSlug: z.string().min(1, '套餐标识不能为空'),
  customerInfo: CustomerInfoSchema,
  preferredDate: DateSchema.optional(),
  preferredTime: TimeSchema,
  notes: z.string().max(1000, '备注最多1000个字符').optional(),
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
