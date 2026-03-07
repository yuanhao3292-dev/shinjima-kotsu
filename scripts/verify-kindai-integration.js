require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  console.log('🔍 验证近畿大学病院白标集成...\n');

  const checks = {
    database: false,
    guideSelection: false,
    displayConfig: false,
    immersiveTemplate: false,
  };

  // 1. 检查 page_modules
  const { data: module } = await supabase
    .from('page_modules')
    .select('*')
    .eq('slug', 'kindai-hospital')
    .single();

  if (module) {
    checks.database = true;
    console.log('✅ 数据库配置: page_modules 记录存在');
    console.log(`   - component_key: ${module.component_key}`);
    console.log(`   - is_active: ${module.is_active}`);
    console.log(`   - has_detail_page: ${module.has_detail_page}`);

    if (module.display_config) {
      checks.displayConfig = true;
      console.log('✅ display_config: 存在');

      if (module.display_config.template === 'immersive') {
        checks.immersiveTemplate = true;
        console.log('✅ 模板类型: immersive ✓');
      } else {
        console.log(`❌ 模板类型: ${module.display_config.template} (应该是 immersive)`);
      }
    } else {
      console.log('❌ display_config: 不存在');
    }
  } else {
    console.log('❌ 数据库配置: 找不到 kindai-hospital 模块');
  }

  console.log('');

  // 2. 检查导游选择
  const { data: guide } = await supabase
    .from('guides')
    .select('id')
    .eq('slug', 'yuan')
    .single();

  if (guide) {
    const { data: selection } = await supabase
      .from('guide_selected_modules')
      .select('is_enabled, sort_order')
      .eq('guide_id', guide.id)
      .eq('page_modules.slug', 'kindai-hospital')
      .limit(1)
      .maybeSingle();

    if (selection && selection.is_enabled) {
      checks.guideSelection = true;
      console.log('✅ 导游选择: yuan 已选择近畿大学病院');
      console.log(`   - is_enabled: ${selection.is_enabled}`);
      console.log(`   - sort_order: ${selection.sort_order}`);
    } else if (selection) {
      console.log('⚠️  导游选择: 已选择但未启用');
    } else {
      console.log('❌ 导游选择: yuan 未选择近畿大学病院');
    }
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 集成检查总结\n');

  const allPassed = Object.values(checks).every(v => v);

  if (allPassed) {
    console.log('✅ 所有检查通过！近畿大学病院已完全集成。\n');
    console.log('🌐 测试链接:');
    console.log('   首页: https://www.niijima-koutsu.jp/g/yuan');
    console.log('   详情页: https://www.niijima-koutsu.jp/g/yuan/kindai-hospital\n');
    console.log('💡 如果页面上看不到，请:');
    console.log('   1. 硬刷新浏览器 (Ctrl+Shift+R)');
    console.log('   2. 滚动到页面底部（近畿大学是第9个，需要向下滚动）');
    console.log('   3. 使用 Ctrl+F 搜索"近畿"来快速定位');
  } else {
    console.log('❌ 存在配置问题:\n');
    if (!checks.database) console.log('   - page_modules 记录缺失');
    if (!checks.displayConfig) console.log('   - display_config 缺失');
    if (!checks.immersiveTemplate) console.log('   - template 不是 immersive');
    if (!checks.guideSelection) console.log('   - 导游未选择或未启用');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

verify();
