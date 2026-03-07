require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  // 获取一条记录查看所有字段
  const { data } = await supabase
    .from('page_modules')
    .select('*')
    .eq('slug', 'kindai-hospital')
    .single();

  console.log('📋 page_modules 表的所有字段:\n');
  console.log(Object.keys(data || {}).join(', '));
  console.log('\n');
  
  console.log('📊 kindai-hospital 完整记录:\n');
  console.log(JSON.stringify(data, null, 2));
}

checkSchema();
