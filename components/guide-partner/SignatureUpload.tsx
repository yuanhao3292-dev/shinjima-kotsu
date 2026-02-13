'use client';

import { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';

interface Props {
  onSuccess: (url: string) => void;
  onCancel: () => void;
}

export default function SignatureUpload({ onSuccess, onCancel }: Props) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 验证文件类型
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
      alert('只支持 JPG, PNG 或 PDF 格式');
      return;
    }

    // 验证文件大小 (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过 5MB');
      return;
    }

    setFile(selectedFile);

    // 生成预览（仅图片）
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  async function handleUpload() {
    if (!file) return;

    setUploading(true);

    try {
      // 创建FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'guide_signature');

      // 上传到API
      const response = await fetch('/api/upload-signature', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('上传失败');

      const { url } = await response.json();
      onSuccess(url);
    } catch (error) {
      alert('上传失败：' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">上传签字扫描件</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* 文件选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择文件（JPG, PNG 或 PDF，最大 5MB）
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 预览 */}
          {preview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">预览</label>
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto border border-gray-200 rounded-lg"
              />
            </div>
          )}

          {/* 说明 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-medium mb-2">📝 签署说明：</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>下载协议模板并打印</li>
              <li>仔细阅读所有条款</li>
              <li>在最后一页签字栏签字并写日期</li>
              <li>扫描或拍照签字页</li>
              <li>上传扫描件（确保清晰可见）</li>
            </ol>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>上传中...</>
              ) : (
                <>
                  <Upload size={18} />
                  上传
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
