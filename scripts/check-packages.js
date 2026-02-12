require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data, error } = await supabase
    .from('medical_packages')
    .select('slug, stripe_price_id, is_active, price_jpy')
    .in('slug', [
      'cancer-initial-consultation',
      'cancer-remote-consultation',
      'hyogo-initial-consultation',
      'hyogo-remote-consultation',
    ]);

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
})();
