require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateTags() {
  console.log('🏥 为综合医院添加分类标签...\n');

  // 更新近畿大学病院
  const { error: kindaiError } = await supabase
    .from('page_modules')
    .update({
      tags: ['综合医院', '特定功能医院', '达芬奇手术', '放射治疗', '心脏血管', '大阪']
    })
    .eq('slug', 'kindai-hospital');

  if (kindaiError) {
    console.error('❌ 更新近畿大学失败:', kindaiError.message);
  } else {
    console.log('✓ 近畿大学病院标签已更新');
  }

  // 更新兵库医科大学
  const { error: hyogoError } = await supabase
    .from('page_modules')
    .update({
      tags: ['综合医院', '特定功能医院', '手术机器人', 'PET-CT', '兵库县', '高端医疗']
    })
    .eq('slug', 'hyogo-medical');

  if (hyogoError) {
    console.error('❌ 更新兵库医科大学失败:', hyogoError.message);
  } else {
    console.log('✓ 兵库医科大学病院标签已更新');
  }

  // 验证结果
  console.log('\n📊 验证结果:\n');
  const { data } = await supabase
    .from('page_modules')
    .select('slug, name, category, tags')
    .in('slug', ['kindai-hospital', 'hyogo-medical'])
    .order('slug');

  if (data) {
    data.forEach(m => {
      console.log(`${m.name} (${m.slug})`);
      console.log(`  category: ${m.category}`);
      console.log(`  tags: ${m.tags.join(', ')}`);
      console.log('');
    });
  }

  console.log('✅ 完成！两家综合医院现在都有"综合医院"标签，可以在选品中心按此分类筛选。');
}

updateTags();
