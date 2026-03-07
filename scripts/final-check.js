require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function finalCheck() {
  console.log('🔍 最终检查：近畿大学病院白标集成\n');

  // 1. 获取导游
  const { data: guide } = await supabase
    .from('guides')
    .select('id, slug, name')
    .eq('slug', 'yuan')
    .single();

  console.log(`✓ 导游: ${guide.name} (${guide.slug})\n`);

  // 2. 查询导游选中的所有模块
  const { data: allModules } = await supabase
    .from('guide_selected_modules')
    .select(`
      id,
      is_enabled,
      sort_order,
      page_modules (
        slug,
        name,
        component_key
      )
    `)
    .eq('guide_id', guide.id)
    .order('sort_order');

  // 3. 找到近畿大学病院
  const kindaiModule = allModules?.find(m => 
    m.page_modules?.slug === 'kindai-hospital'
  );

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (kindaiModule) {
    console.log('✅ 近畿大学病院：已选择');
    console.log(`   slug: ${kindaiModule.page_modules.slug}`);
    console.log(`   component_key: ${kindaiModule.page_modules.component_key}`);
    console.log(`   is_enabled: ${kindaiModule.is_enabled}`);
    console.log(`   sort_order: ${kindaiModule.sort_order}`);
    
    if (kindaiModule.is_enabled) {
      console.log('\n✅ 状态：已启用');
      console.log(`📍 位置：第 ${kindaiModule.sort_order} 个模块`);
      
      // 统计有多少个启用的 immersive 模块
      const enabledCount = allModules.filter(m => m.is_enabled).length;
      console.log(`📊 总共 ${enabledCount} 个已启用模块`);
      
      const kindaiIndex = allModules
        .filter(m => m.is_enabled)
        .findIndex(m => m.page_modules?.slug === 'kindai-hospital');
      console.log(`🎯 在已启用列表中的位置：第 ${kindaiIndex + 1} 个`);
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ 集成成功！近畿大学病院应该显示在：');
      console.log('   https://www.niijima-koutsu.jp/g/yuan\n');
      console.log('💡 提示：');
      console.log('   - 它是第 9 个产品卡片（最后一个）');
      console.log('   - 每个卡片都是全屏高度，需要向下滚动');
      console.log('   - 使用 Ctrl+F 搜索"近畿"可快速定位');
      console.log('   - 或直接访问详情页：');
      console.log('     https://www.niijima-koutsu.jp/g/yuan/kindai-hospital');
    } else {
      console.log('\n⚠️  状态：已选择但未启用');
      console.log('   需要在选品中心启用该模块');
    }
  } else {
    console.log('❌ 近畿大学病院：未找到');
    console.log('   需要在选品中心添加该模块');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

finalCheck();
