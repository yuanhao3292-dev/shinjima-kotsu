import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/**
 * 获取共享的 Stripe 服务端实例（单例）
 * webhook 路由应单独实例化（需不同配置）
 */
export function getStripeServer(): Stripe {
  if (_stripe) return _stripe;
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}
