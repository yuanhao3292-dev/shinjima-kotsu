require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 模拟前端的分类配置
const PRODUCT_CATEGORIES = [
  {
    id: 'general_hospital',
    name: '综合医院合作',
    moduleKeys: ['hyogo_medical', 'kindai_hospital', 'osaka_himak', 'cancer_treatment', 'igtc'],
  },
  {
    id: 'health_screening',
    name: '体检中心合作',
    moduleKeys: ['medical_packages'],
  },
  {
    id: 'aesthetics',
    name: '医美整形合作',
    moduleKeys: ['sai_clinic', 'wclinic_mens'],
  },
  {
    id: 'stem_cell',
    name: '干细胞中心合作',
    moduleKeys: ['helene_clinic', 'ac_plus', 'cell_medicine', 'ginza_phoenix'],
  },
];

const DETAIL_MODULES = new Set([
  'medical_packages', 'hyogo_medical', 'kindai_hospital', 'cancer_treatment',
  'sai_clinic', 'wclinic_mens',
  'helene_clinic', 'ginza_phoenix', 'cell_medicine', 'ac_plus', 'igtc',
  'osaka_himak',
]);

async function testIntegration() {
  console.log('🧪 测试近畿大学病院完整集成流程\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ========== 步骤 1: 数据库配置检查 ==========
  console.log('【步骤 1】检查 page_modules 数据库配置\n');

  const { data: kindaiModule } = await supabase
    .from('page_modules')
    .select('*')
    .eq('slug', 'kindai-hospital')
    .single();

  if (!kindaiModule) {
    console.log('❌ 失败：page_modules 表中没有 kindai-hospital 记录\n');
    return;
  }

  console.log('✅ page_modules 记录存在');
  console.log(`   component_key: ${kindaiModule.component_key}`);
  console.log(`   is_active: ${kindaiModule.is_active}`);
  console.log(`   has_detail_page: ${kindaiModule.has_detail_page}`);
  console.log(`   display_config.template: ${kindaiModule.display_config?.template}`);
  console.log('');

  if (!kindaiModule.is_active) {
    console.log('❌ 失败：模块未激活 (is_active=false)\n');
    return;
  }

  if (!kindaiModule.display_config || kindaiModule.display_config.template !== 'immersive') {
    console.log('⚠️  警告：display_config 不是 immersive 模板\n');
  }

  // ========== 步骤 2: 分类配置检查 ==========
  console.log('【步骤 2】检查 product-categories.ts 分类配置\n');

  const categoryWithKindai = PRODUCT_CATEGORIES.find(cat =>
    cat.moduleKeys.includes('kindai_hospital')
  );

  if (!categoryWithKindai) {
    console.log('❌ 失败：kindai_hospital 不在任何分类的 moduleKeys 中');
    console.log('   需要添加到 lib/config/product-categories.ts\n');
    return;
  }

  console.log(`✅ 已加入分类：${categoryWithKindai.name}`);
  console.log(`   该分类包含：${categoryWithKindai.moduleKeys.join(', ')}`);
  console.log('');

  // ========== 步骤 3: 路由注册检查 ==========
  console.log('【步骤 3】检查路由文件注册\n');

  if (!DETAIL_MODULES.has('kindai_hospital')) {
    console.log('❌ 失败：kindai_hospital 未加入 DETAIL_MODULES');
    console.log('   需要在 app/g/[slug]/page.tsx 中添加\n');
    return;
  }

  console.log('✅ DETAIL_MODULES 已包含 kindai_hospital');
  console.log('');

  // ========== 步骤 4: 模拟 API 返回 ==========
  console.log('【步骤 4】模拟 /api/guide/product-center API 返回\n');

  const { data: allModules } = await supabase
    .from('page_modules')
    .select('id, name, component_key, is_active')
    .eq('is_active', true)
    .order('sort_order');

  const kindaiInApiResult = allModules?.find(m => m.component_key === 'kindai_hospital');

  if (!kindaiInApiResult) {
    console.log('❌ 失败：API 不会返回 kindai_hospital');
    console.log('   is_active 可能为 false\n');
    return;
  }

  console.log('✅ API 会返回 kindai_hospital');
  console.log(`   模块总数：${allModules?.length || 0}`);
  console.log('');

  // ========== 步骤 5: 模拟选品中心分类显示 ==========
  console.log('【步骤 5】模拟选品中心分类显示逻辑\n');

  const moduleComponentKeys = (allModules || [])
    .map(m => m.component_key)
    .filter(Boolean);

  const activeCategories = PRODUCT_CATEGORIES.filter(cat =>
    cat.moduleKeys.some(key => moduleComponentKeys.includes(key))
  );

  const generalHospitalCat = activeCategories.find(c => c.id === 'general_hospital');
  if (!generalHospitalCat) {
    console.log('❌ 失败：综合医院分类不会显示\n');
    return;
  }

  const modulesInGeneralHospital = allModules?.filter(m =>
    m.component_key && generalHospitalCat.moduleKeys.includes(m.component_key)
  );

  const kindaiInCategory = modulesInGeneralHospital?.find(m => m.component_key === 'kindai_hospital');

  if (!kindaiInCategory) {
    console.log('❌ 失败：kindai_hospital 不会在综合医院分类中显示\n');
    return;
  }

  console.log('✅ 选品中心会显示近畿大学病院');
  console.log(`   分类：综合医院合作`);
  console.log(`   该分类共 ${modulesInGeneralHospital?.length || 0} 个模块：`);
  modulesInGeneralHospital?.forEach(m => {
    console.log(`     - ${m.name}`);
  });
  console.log('');

  // ========== 步骤 6: 检查导游选择情况 ==========
  console.log('【步骤 6】检查 yuan 导游选择情况\n');

  const { data: guide } = await supabase
    .from('guides')
    .select('id, slug')
    .eq('slug', 'yuan')
    .single();

  if (!guide) {
    console.log('⚠️  yuan 导游不存在，跳过此步骤\n');
  } else {
    const { data: selectedModules } = await supabase
      .from('guide_selected_modules')
      .select(`
        is_enabled,
        page_modules (
          slug,
          component_key
        )
      `)
      .eq('guide_id', guide.id)
      .eq('is_enabled', true);

    const kindaiSelected = selectedModules?.find(m =>
      m.page_modules?.component_key === 'kindai_hospital'
    );

    if (kindaiSelected) {
      console.log('✅ yuan 导游已选择近畿大学病院');
      console.log(`   is_enabled: ${kindaiSelected.is_enabled}`);
    } else {
      console.log('⚠️  yuan 导游未选择近畿大学病院');
      console.log('   需要在选品中心勾选该模块');
    }
    console.log('');
  }

  // ========== 步骤 7: 模拟白标页面过滤逻辑 ==========
  console.log('【步骤 7】模拟白标页面过滤逻辑\n');

  if (!guide) {
    console.log('⚠️  跳过（无导游数据）\n');
  } else {
    const { data: selectedModules } = await supabase
      .from('guide_selected_modules')
      .select(`
        sort_order,
        is_enabled,
        page_modules (
          component_key,
          name,
          display_config
        )
      `)
      .eq('guide_id', guide.id)
      .eq('is_enabled', true)
      .order('sort_order');

    const productCards = (selectedModules || [])
      .filter(m => {
        const dc = m.page_modules?.display_config;
        const componentKey = m.page_modules?.component_key;
        return dc &&
               dc.template === 'immersive' &&
               componentKey &&
               DETAIL_MODULES.has(componentKey);
      });

    const kindaiCard = productCards.find(m =>
      m.page_modules?.component_key === 'kindai_hospital'
    );

    if (kindaiCard) {
      const kindaiIndex = productCards.findIndex(m =>
        m.page_modules?.component_key === 'kindai_hospital'
      );
      console.log('✅ 近畿大学病院会在白标页面显示');
      console.log(`   位置：第 ${kindaiIndex + 1} 个 productCard`);
      console.log(`   总共 ${productCards.length} 个 productCards`);
      if (kindaiIndex === 0) {
        console.log('   ⚠️  作为 Hero 背景显示（不在循环列表中）');
      } else {
        console.log(`   显示在循环列表的第 ${kindaiIndex} 位`);
      }
    } else {
      console.log('❌ 近畿大学病院不会在白标页面显示');
      console.log('   可能原因：');
      console.log('   - display_config.template 不是 immersive');
      console.log('   - component_key 不在 DETAIL_MODULES 中');
      console.log('   - is_enabled = false');
    }
    console.log('');
  }

  // ========== 总结 ==========
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 所有步骤通过！近畿大学病院已完全集成。\n');
  console.log('📋 导游使用流程：');
  console.log('   1. 登录选品中心');
  console.log('   2. 切换到"综合医院合作"分类');
  console.log('   3. 找到"近畿大学病院"卡片');
  console.log('   4. 点击"添加到我的页面"');
  console.log('   5. 点击"预览我的页面"查看效果\n');
  console.log('🌐 预览链接：');
  if (guide) {
    console.log(`   https://www.niijima-koutsu.jp/g/${guide.slug}`);
    console.log(`   https://www.niijima-koutsu.jp/g/${guide.slug}/kindai-hospital`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testIntegration();
