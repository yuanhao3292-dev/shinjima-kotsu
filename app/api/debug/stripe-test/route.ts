import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  // Test 1: Check if STRIPE_SECRET_KEY exists
  const secretKey = process.env.STRIPE_SECRET_KEY;
  results.tests.hasSecretKey = !!secretKey;
  results.tests.secretKeyPrefix = secretKey?.substring(0, 20) || "missing";

  if (!secretKey) {
    return NextResponse.json({
      ...results,
      error: "STRIPE_SECRET_KEY is missing",
    });
  }

  // Test 2: Initialize Stripe
  let stripe: Stripe;
  try {
    stripe = new Stripe(secretKey);
    results.tests.stripeInitialized = true;
  } catch (error: any) {
    results.tests.stripeInitialized = false;
    results.tests.initError = error.message;
    return NextResponse.json(results);
  }

  // Test 3: Try to list customers (simple API call)
  try {
    const customers = await stripe.customers.list({ limit: 1 });
    results.tests.canListCustomers = true;
    results.tests.customerCount = customers.data.length;
  } catch (error: any) {
    results.tests.canListCustomers = false;
    results.tests.customerError = error.message;
    results.tests.customerErrorType = error.type;
    results.tests.customerErrorCode = error.code;
  }

  // Test 4: Try to list products
  try {
    const products = await stripe.products.list({ limit: 1 });
    results.tests.canListProducts = true;
    results.tests.productCount = products.data.length;
  } catch (error: any) {
    results.tests.canListProducts = false;
    results.tests.productError = error.message;
  }

  // Test 5: Try to create a simple product (test mode only)
  if (secretKey.startsWith("sk_test_")) {
    try {
      const testProduct = await stripe.products.create({
        name: "Test Product - Delete Me",
        metadata: { test: "true", created_by: "debug_endpoint" },
      });
      results.tests.canCreateProduct = true;
      results.tests.testProductId = testProduct.id;

      // Clean up - delete the test product
      await stripe.products.update(testProduct.id, { active: false });
    } catch (error: any) {
      results.tests.canCreateProduct = false;
      results.tests.createProductError = error.message;
      results.tests.createProductErrorType = error.type;
    }
  } else {
    results.tests.canCreateProduct = "skipped (not test mode)";
  }

  return NextResponse.json(results);
}
