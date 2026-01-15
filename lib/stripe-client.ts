import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

    if (!publishableKey) {
      throw new Error('Missing Stripe publishable key');
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};
