require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkConfig() {
  console.log('🔍 检查近畿大学病院的配置...\n');

  const { data, error } = await supabase
    .from('page_modules')
    .select('*')
    .eq('slug', 'kindai-hospital')
    .single();

  if (error) {
    console.error('❌ 查询失败:', error.message);
    return;
  }

  if (!data) {
    console.log('❌ 找不到 kindai-hospital 模块');
    return;
  }

  console.log('✓ 找到模块:', data.name);
  console.log('');
  console.log('📊 模块详情:');
  console.log('  slug:', data.slug);
  console.log('  component_key:', data.component_key);
  console.log('  is_active:', data.is_active);
  console.log('  has_detail_page:', data.has_detail_page);
  console.log('  sort_order:', data.sort_order);
  console.log('');

  if (data.display_config) {
    console.log('✓ display_config 存在');
    console.log('');
    console.log('display_config 内容:');
    console.log(JSON.stringify(data.display_config, null, 2));

    console.log('');
    console.log('验证关键字段:');
    console.log('  template:', data.display_config.template);
    console.log('  colorTheme:', data.display_config.colorTheme);
    console.log('  heroImage:', data.display_config.heroImage);
    console.log('  title:', data.display_config.title);
    console.log('  stats:', data.display_config.stats?.length || 0, '个统计数据');
  } else {
    console.log('❌ display_config 不存在！');
  }
}

checkConfig();
