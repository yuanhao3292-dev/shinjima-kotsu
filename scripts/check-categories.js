require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCategories() {
  console.log('📊 查询所有模块分类...\n');

  const { data } = await supabase
    .from('page_modules')
    .select('id, slug, name, category, component_key, is_active')
    .eq('is_active', true)
    .order('category')
    .order('sort_order');

  // 按 category 分组
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
    })));
  });

  console.log('\n\n📝 是否有"综合医院"模块？');
  const comprehensiveHospital = data?.find(m => 
    m.name.includes('综合医院') || 
    m.slug.includes('comprehensive') ||
    m.component_key?.includes('comprehensive')
  );
  
  if (comprehensiveHospital) {
    console.log('✓ 找到综合医院模块:', comprehensiveHospital);
  } else {
    console.log('✗ 没有找到综合医院模块');
    console.log('\n建议：');
    console.log('1. 创建一个新的"综合医院"父模块');
    console.log('2. 或者修改近畿大学病院的 category 为现有分类');
  }
}

checkCategories();
