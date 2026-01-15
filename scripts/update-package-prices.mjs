/**
 * 更新 medical_packages 表价格
 * 使价格与主页 (LandingPage.tsx) 一致
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcpcjfqxxtxlbtvbjduk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('错误：需要设置 SUPABASE_SERVICE_ROLE_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 正确的价格（与主页一致）
const correctPrices = [
  { slug: 'vip-member-course', name: 'VIP 頂級全能套裝', price_jpy: 1512500 },
  { slug: 'premium-cardiac-course', name: 'PREMIUM 心臟精密', price_jpy: 825000 },
  { slug: 'select-gastro-colonoscopy', name: 'SELECT 胃+大腸鏡', price_jpy: 825000 },
  { slug: 'select-gastroscopy', name: 'SELECT 胃鏡', price_jpy: 687500 },
  { slug: 'dwibs-cancer-screening', name: 'DWIBS 防癌篩查', price_jpy: 275000 },
  { slug: 'basic-checkup', name: 'BASIC 基礎套餐', price_jpy: 550000 },
];

async function updatePrices() {
  console.log('开始更新套餐价格...\n');

  for (const pkg of correctPrices) {
    const { data, error } = await supabase
      .from('medical_packages')
      .update({ price_jpy: pkg.price_jpy })
      .eq('slug', pkg.slug)
      .select();

    if (error) {
      console.error(`❌ 更新 ${pkg.slug} 失败:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ ${pkg.name}: ¥${pkg.price_jpy.toLocaleString()}`);
    } else {
      console.log(`⚠️ ${pkg.slug}: 未找到记录，可能需要创建`);
    }
  }

  console.log('\n价格更新完成！');
}

updatePrices();
