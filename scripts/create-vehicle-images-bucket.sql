-- 創建 vehicle-images bucket 用於存儲車輛圖片
-- 在 Supabase Dashboard -> Storage 中執行此 SQL

-- 1. 創建 bucket（如果不存在）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-images',
  'vehicle-images',
  true,  -- 設為公開，無需認證即可訪問
  5242880,  -- 5MB 文件大小限制
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. 設置公開讀取策略（允許任何人讀取）
CREATE POLICY "Public Access for vehicle-images" ON storage.objects
FOR SELECT
USING (bucket_id = 'vehicle-images');

-- 3. 設置管理員上傳策略（需要認證）
-- 注意：您需要在 Supabase Dashboard 中手動上傳圖片，或使用 service_role key

-- 預期的圖片文件名：
-- - alphard.jpg    (豐田埃爾法)
-- - hiace.jpg      (豐田海獅)
-- - coaster.jpg    (豐田考斯特)
-- - melpha.jpg     (日野梅爾法)
-- - selega.jpg     (日野賽雷加)
-- - aeroqueen.jpg  (三菱艾洛皇后)

-- 上傳後的公開 URL 格式：
-- https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-images/[filename]
