require('dotenv').config({ path: '.env.production.local' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadImage(filePath, storagePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(storagePath);
  const contentType = filePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

  console.log(`Uploading ${filePath} to ${storagePath}...`);

  const { data, error } = await supabase.storage
    .from('clinic-images')
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('clinic-images')
    .getPublicUrl(storagePath);

  console.log('✓ Upload successful!');
  console.log('Public URL:', publicUrl);
  return publicUrl;
}

const filePath = process.argv[2];
const storagePath = process.argv[3] || `ac-plus/${path.basename(filePath)}`;

if (!filePath) {
  console.error('Usage: node upload-image.js <file-path> [storage-path]');
  process.exit(1);
}

uploadImage(filePath, storagePath);
