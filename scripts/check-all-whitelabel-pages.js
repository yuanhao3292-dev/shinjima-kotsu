require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPages() {
  console.log('📊 检查所有白标页面配置...\n');

  // 查询所有 has_detail_page = true 的模块
  const { data } = await supabase
    .from('page_modules')
    .select('slug, name, component_key, has_detail_page, detail_route_type, is_active, category')
    .eq('has_detail_page', true)
    .eq('is_active', true)
    .order('category')
    .order('sort_order');

  console.log(`共有 ${data?.length || 0} 个白标页面模块\n`);

  const grouped = {};
  data?.forEach(m => {
    if (!grouped[m.category]) {
      grouped[m.category] = [];
    }
    grouped[m.category].push(m);
  });

  Object.keys(grouped).sort().forEach(cat => {
    console.log(`\n━━━━━━ ${cat.toUpperCase()} ━━━━━━`);
    console.table(grouped[cat].map(m => ({
      slug: m.slug,
      name: m.name,
      component_key: m.component_key,
      route_type: m.detail_route_type,
    })));
  });
}

checkPages();
