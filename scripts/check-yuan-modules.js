require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkModules() {
  // 1. 获取 yuan 导游的 ID
  const { data: guide } = await supabase
    .from('guides')
    .select('id, slug, name')
    .eq('slug', 'yuan')
    .single();

  if (!guide) {
    console.log('❌ 找不到 yuan 导游');
    return;
  }

  console.log('✓ 导游信息:', guide);
  console.log('');

  // 2. 查询所有选中的模块（包括 disabled 的）
  const { data: modules } = await supabase
    .from('guide_selected_modules')
    .select(`
      id,
      is_enabled,
      sort_order,
      custom_title,
      page_modules (
        slug,
        name,
        component_key,
        is_active
      )
    `)
    .eq('guide_id', guide.id)
    .order('sort_order');

  console.log(`📊 yuan 导游选中的模块总数: ${modules?.length || 0}`);
  console.log('');

  if (modules && modules.length > 0) {
    console.log('已选中的模块列表:');
    console.table(modules.map(m => ({
      slug: m.page_modules?.slug || 'N/A',
      name: m.page_modules?.name || 'N/A',
      component_key: m.page_modules?.component_key || 'N/A',
      is_enabled: m.is_enabled ? '✓' : '✗',
      sort_order: m.sort_order,
      module_active: m.page_modules?.is_active ? '✓' : '✗',
    })));
  }

  // 3. 检查是否包含 kindai-hospital
  const kindaiModule = modules?.find(m => m.page_modules?.slug === 'kindai-hospital');
  console.log('');
  if (kindaiModule) {
    console.log('✓ 找到 kindai-hospital 模块');
    console.log('详细信息:', {
      is_enabled: kindaiModule.is_enabled,
      sort_order: kindaiModule.sort_order,
      custom_title: kindaiModule.custom_title,
    });

    if (!kindaiModule.is_enabled) {
      console.log('');
      console.log('⚠️  模块已添加但未启用！需要在选品中心启用该模块。');
    }
  } else {
    console.log('❌ yuan 导游没有选择 kindai-hospital 模块');
    console.log('');
    console.log('📝 需要在选品中心添加该模块');
  }
}

checkModules();
