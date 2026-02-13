-- 合同签名文件存储
-- 创建日期：2026-02-13
-- 功能：为合同管理系统创建 Storage bucket

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 1. 创建 Storage Bucket
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 创建合同签名文件存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('contract-signatures', 'contract-signatures', true)
ON CONFLICT (id) DO NOTHING;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 2. Storage RLS 策略
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 允许认证用户上传签名文件
CREATE POLICY "Authenticated users can upload signature files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'contract-signatures'
  AND auth.uid() IS NOT NULL
);

-- 允许所有人查看签名文件（因为是公开bucket，用于显示在合同PDF中）
CREATE POLICY "Anyone can view signature files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'contract-signatures');

-- 只允许上传者删除自己的签名文件
CREATE POLICY "Users can delete their own signatures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'contract-signatures'
  AND auth.uid() = owner
);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 3. 文件大小和类型限制（通过 Supabase Dashboard 配置）
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 在 Supabase Dashboard 中手动设置：
-- - 最大文件大小：5MB
-- - 允许的 MIME 类型：image/jpeg, image/png, application/pdf

COMMENT ON POLICY "Authenticated users can upload signature files" ON storage.objects IS
'认证用户可以上传签名文件到 contract-signatures bucket';

COMMENT ON POLICY "Anyone can view signature files" ON storage.objects IS
'所有人可以查看签名文件（用于合同PDF显示）';

COMMENT ON POLICY "Users can delete their own signatures" ON storage.objects IS
'用户只能删除自己上传的签名文件';
