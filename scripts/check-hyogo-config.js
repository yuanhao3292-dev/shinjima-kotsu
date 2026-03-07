require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkHyogo() {
  const { data } = await supabase
    .from('page_modules')
    .select('category, tags, display_config')
    .eq('slug', 'hyogo-medical')
    .single();

  console.log('📊 兵庫医科大学配置:\n');
  console.log('category:', data.category);
  console.log('tags:', data.tags);
  console.log('\ndisplay_config:');
  console.log(JSON.stringify(data.display_config, null, 2));
}

checkHyogo();
