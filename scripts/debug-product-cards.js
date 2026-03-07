require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DETAIL_MODULES = new Set([
  'medical_packages', 'hyogo_medical', 'kindai_hospital', 'cancer_treatment',
  'sai_clinic', 'wclinic_mens',
  'helene_clinic', 'ginza_phoenix', 'cell_medicine', 'ac_plus', 'igtc',
  'osaka_himak',
]);

async function debugProductCards() {
  console.log('🔍 调试 yuan 导游的 productCards 过滤逻辑...\n');

  // 1. 获取导游ID
  const { data: guide } = await supabase
    .from('guides')
    .select('id')
    .eq('slug', 'yuan')
    .single();

  // 2. 获取选中的模块（按 sort_order 排序）
  const { data: selectedModules } = await supabase
    .from('guide_selected_modules')
    .select(`
      sort_order,
      is_enabled,
      page_modules (
        slug,
        name,
        component_key,
        display_config
      )
    `)
    .eq('guide_id', guide.id)
    .eq('is_enabled', true)
    .order('sort_order');

  console.log(`📊 总共 ${selectedModules.length} 个已启用的模块\n`);

  // 3. 模拟前端的过滤逻辑
  const productCards = selectedModules
    .filter(m => {
      const dc = m.page_modules?.display_config;
      const componentKey = m.page_modules?.component_key;
      
      const hasDisplayConfig = !!dc;
      const isImmersive = dc?.template === 'immersive';
      const hasComponentKey = !!componentKey;
      const inDetailModules = componentKey ? DETAIL_MODULES.has(componentKey) : false;
      
      const passes = hasDisplayConfig && isImmersive && hasComponentKey && inDetailModules;
      
      console.log(`${m.page_modules?.slug || 'N/A'}:`);
      console.log(`  sort_order: ${m.sort_order}`);
      console.log(`  component_key: ${componentKey}`);
      console.log(`  ✓ hasDisplayConfig: ${hasDisplayConfig}`);
      console.log(`  ✓ isImmersive: ${isImmersive} (template=${dc?.template})`);
      console.log(`  ✓ hasComponentKey: ${hasComponentKey}`);
      console.log(`  ✓ inDetailModules: ${inDetailModules}`);
      console.log(`  → PASSES: ${passes ? '✅ YES' : '❌ NO'}`);
      console.log('');
      
      return passes;
    })
    .map(m => ({
      slug: m.page_modules.slug,
      name: m.page_modules.name,
      componentKey: m.page_modules.component_key,
      sortOrder: m.sort_order,
    }));

  console.log(`\n📦 过滤后的 productCards (${productCards.length} 个):\n`);
  console.table(productCards);

  console.log('\n💡 渲染逻辑:');
  console.log(`  Hero 背景: ${productCards[0]?.name || '无'}`);
  console.log(`  循环渲染 (slice(1)): ${productCards.slice(1).map(p => p.name).join(', ') || '无'}`);
}

debugProductCards();
