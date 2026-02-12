require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data: pkgs } = await supabase
    .from('medical_packages')
    .select('slug, stripe_price_id, price_jpy, is_active')
    .eq('is_active', true)
    .order('display_order');

  console.log(`共 ${pkgs.length} 个活跃套餐:\n`);

  for (const pkg of pkgs) {
    try {
      const price = await stripe.prices.retrieve(pkg.stripe_price_id);
      console.log(`✓ ${pkg.slug} — ¥${pkg.price_jpy} — ${pkg.stripe_price_id} (Stripe: ¥${price.unit_amount})`);
    } catch (err) {
      console.log(`✗ ${pkg.slug} — ¥${pkg.price_jpy} — ${pkg.stripe_price_id} — ERROR: ${err.message}`);
    }
  }
})();
