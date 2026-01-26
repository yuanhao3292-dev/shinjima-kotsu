import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
    hasStripePublic: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    hasStripeWebhook: !!process.env.STRIPE_WEBHOOK_SECRET,
    hasStripePriceId: !!process.env.STRIPE_WHITELABEL_PRICE_ID,
    stripeSecretPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 15) || 'missing',
    timestamp: new Date().toISOString(),
  });
}
