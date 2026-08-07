/**
 * EmailJS 前端直发配置
 * ============================================
 * EmailJS 的 public key 按设计就是公开的（它只能配合已配置的模板发信，
 * 并受 EmailJS 后台的域名白名单约束），因此不属于密钥泄露。
 *
 * 集中在这里的原因是：这三个值原本在两个组件里各抄了一份，轮换时要改多处，
 * 漏改一处就会出现"一个入口能发信、另一个静默失败"的情况。
 *
 * 允许用环境变量覆盖，方便在预发环境指向另一套模板。
 */

export const EMAILJS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'exX0IhSSUjNgMhuGb';

export const EMAILJS_SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_epq3fhj';

export const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_x7h0fb6';
