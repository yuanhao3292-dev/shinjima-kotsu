-- ============================================
-- KYC Documents Storage 策略配置
-- KYC Documents Storage Policy Configuration
-- ============================================
-- 在 Supabase Dashboard -> SQL Editor 中執行此 SQL

-- 1. 更新 bucket 設置（bucket 已手動創建，這裡確保設置正確）
UPDATE storage.buckets
SET
  public = false,  -- 私有 bucket，需要認證
  file_size_limit = 5242880,  -- 5MB 文件大小限制
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
WHERE id = 'kyc-documents';

-- 如果 bucket 不存在，創建它（備用）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'kyc-documents',
  false,  -- 私有
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- 2. 刪除舊策略（如果存在）
DROP POLICY IF EXISTS "Guides can upload own kyc documents" ON storage.objects;
DROP POLICY IF EXISTS "Guides can view own kyc documents" ON storage.objects;
DROP POLICY IF EXISTS "Guides can update own kyc documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin can view all kyc documents" ON storage.objects;

-- 3. 創建上傳策略 - 導遊只能上傳到自己的文件夾
-- 文件路徑格式: {guide_id}/front-{timestamp}.jpg
CREATE POLICY "Guides can upload own kyc documents" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM guides WHERE auth_user_id = auth.uid()
  )
);

-- 4. 創建讀取策略 - 導遊只能讀取自己的文件
CREATE POLICY "Guides can view own kyc documents" ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM guides WHERE auth_user_id = auth.uid()
  )
);

-- 5. 創建更新策略 - 導遊可以覆蓋自己的文件
CREATE POLICY "Guides can update own kyc documents" ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'kyc-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM guides WHERE auth_user_id = auth.uid()
  )
);

-- 6. 管理員可以查看所有 KYC 文件（用於審核）
-- 注意：需要先創建 admin 角色或使用 service_role
-- 這裡使用 service_role 在後端 API 處理

-- ============================================
-- 驗證策略
-- ============================================
-- 執行以下查詢確認策略已創建
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%kyc%';

-- ============================================
-- 完成
-- ============================================
