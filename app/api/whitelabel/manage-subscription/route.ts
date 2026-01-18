import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getSupabase = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error("Supabase configuration is missing");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const supabase = getSupabase();

    const { guideId, returnUrl } = await request.json();

    if (!guideId) {
      return NextResponse.json({ error: "Missing guideId" }, { status: 400 });
    }

    // 获取导游的 Stripe Customer ID
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("stripe_customer_id")
      .eq("id", guideId)
      .single();

    if (guideError || !guide?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    // 创建 Customer Portal Session
    const session = await stripe.billingPortal.sessions.create({
      customer: guide.stripe_customer_id,
      return_url:
        returnUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://niijima-koutsu.jp"}/guide-partner/dashboard`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: unknown) {
    console.error("Manage subscription error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create portal session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
