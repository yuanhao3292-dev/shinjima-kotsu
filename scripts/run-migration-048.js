const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Running migration 048: Homepage section images...\n');

  const images = [
    {
      image_key: 'homepage_medical_bg',
      category: 'medical',
      title: '首页医疗体检背景',
      description: '首页医疗体检板块全屏背景图',
      image_url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop',
      default_url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop',
      recommended_width: 2000,
      recommended_height: 1200,
      aspect_ratio: '16:9',
      usage_location: '首页 - 医疗体检板块背景'
    },
    {
      image_key: 'homepage_treatment_bg',
      category: 'medical',
      title: '首页重疾治疗背景',
      description: '首页重疾治疗板块全屏背景图（癌症/心脑血管）',
      image_url: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=2000&auto=format&fit=crop',
      default_url: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=2000&auto=format&fit=crop',
      recommended_width: 2000,
      recommended_height: 1200,
      aspect_ratio: '16:9',
      usage_location: '首页 - 重疾治疗板块背景'
    },
    {
      image_key: 'homepage_golf_bg',
      category: 'golf',
      title: '首页高尔夫背景',
      description: '首页名门高尔夫板块全屏背景图',
      image_url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop',
      default_url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop',
      recommended_width: 2000,
      recommended_height: 1200,
      aspect_ratio: '16:9',
      usage_location: '首页 - 高尔夫板块背景'
    },
    {
      image_key: 'homepage_business_bg',
      category: 'business',
      title: '首页商务考察背景',
      description: '首页商务考察板块全屏背景图',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
      default_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
      recommended_width: 2000,
      recommended_height: 1200,
      aspect_ratio: '16:9',
      usage_location: '首页 - 商务考察板块背景'
    }
  ];

  for (const img of images) {
    const { data, error } = await supabase
      .from('site_images')
      .upsert(img, { onConflict: 'image_key' });

    if (error) {
      console.error(`Error inserting ${img.image_key}:`, error.message);
    } else {
      console.log(`✓ ${img.image_key} - ${img.title}`);
    }
  }

  console.log('\nMigration completed!');

  // Verify
  const { data: allImages, error: fetchError } = await supabase
    .from('site_images')
    .select('image_key, title, usage_location')
    .like('image_key', 'homepage_%')
    .order('image_key');

  if (fetchError) {
    console.error('Error fetching images:', fetchError.message);
  } else {
    console.log('\nHomepage images in database:');
    allImages.forEach(img => {
      console.log(`  - ${img.image_key}: ${img.title}`);
    });
  }
}

runMigration().catch(console.error);
