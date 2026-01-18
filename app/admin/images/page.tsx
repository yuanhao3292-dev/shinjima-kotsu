'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Check,
  X,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface SiteImage {
  id: string;
  image_key: string;
  category: string;
  title: string;
  description: string | null;
  image_url: string;
  default_url: string | null;
  recommended_width: number | null;
  recommended_height: number | null;
  aspect_ratio: string | null;
  usage_location: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  hero: '首页横幅',
  medical: '医疗版块',
  golf: '高尔夫版块',
  business: '商务版块',
  team: '团队/关于',
  general: '通用图片',
};

export default function AdminImagesPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [grouped, setGrouped] = useState<Record<string, SiteImage[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<SiteImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // 验证管理员
      const verifyRes = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!verifyRes.ok) {
        router.push('/');
        return;
      }

      // 加载图片
      await loadImages();
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async () => {
    try {
      const res = await fetch('/api/admin/images');
      const data = await res.json();

      if (data.images) {
        setImages(data.images);
        setGrouped(data.grouped || {});
      }
    } catch (error) {
      console.error('加载图片失败:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedImage) return;

    setUploading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formData = new FormData();
      formData.append('imageKey', selectedImage.image_key);
      formData.append('file', file);

      const res = await fetch('/api/admin/images', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: '图片上传成功！' });
        await loadImages();
        // 更新选中的图片
        if (data.image) {
          setSelectedImage(data.image);
        }
      } else {
        setMessage({ type: 'error', text: data.error || '上传失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '上传失败，请重试' });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!selectedImage || !urlInput.trim()) return;

    setUploading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formData = new FormData();
      formData.append('imageKey', selectedImage.image_key);
      formData.append('imageUrl', urlInput.trim());

      const res = await fetch('/api/admin/images', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: '图片 URL 更新成功！' });
        setUrlInput('');
        await loadImages();
        if (data.image) {
          setSelectedImage(data.image);
        }
      } else {
        setMessage({ type: 'error', text: data.error || '更新失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '更新失败，请重试' });
    } finally {
      setUploading(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!selectedImage) return;

    setUploading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch('/api/admin/images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ imageKey: selectedImage.image_key }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: '已恢复默认图片' });
        await loadImages();
        if (data.image) {
          setSelectedImage(data.image);
        }
      } else {
        setMessage({ type: 'error', text: data.error || '恢复失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '恢复失败，请重试' });
    } finally {
      setUploading(false);
    }
  };

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">网站图片管理</h1>
              <p className="text-sm text-gray-500">管理网站上显示的所有图片</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* 左侧：图片列表 */}
          <div className="flex-1">
            {/* 分类筛选 */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                全部 ({images.length})
              </button>
              {Object.entries(grouped).map(([cat, imgs]) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat} ({imgs.length})
                </button>
              ))}
            </div>

            {/* 图片网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => {
                    setSelectedImage(img);
                    setMessage(null);
                    setUrlInput('');
                  }}
                  className={`bg-white rounded-xl border overflow-hidden cursor-pointer transition hover:shadow-lg ${
                    selectedImage?.id === img.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="aspect-video relative bg-gray-100">
                    <img
                      src={img.image_url}
                      alt={img.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Error';
                      }}
                    />
                    {img.image_url !== img.default_url && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        已自定义
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{img.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{img.usage_location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：编辑面板 */}
          <div className="w-96 flex-shrink-0">
            <div className="bg-white rounded-xl border sticky top-24">
              {selectedImage ? (
                <div>
                  {/* 预览 */}
                  <div className="aspect-video relative bg-gray-100">
                    <img
                      src={selectedImage.image_url}
                      alt={selectedImage.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">{selectedImage.title}</h2>
                    {selectedImage.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedImage.description}</p>
                    )}

                    {/* 信息 */}
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">标识符</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{selectedImage.image_key}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">分类</span>
                        <span>{CATEGORY_LABELS[selectedImage.category] || selectedImage.category}</span>
                      </div>
                      {selectedImage.aspect_ratio && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">推荐比例</span>
                          <span>{selectedImage.aspect_ratio}</span>
                        </div>
                      )}
                      {selectedImage.recommended_width && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">推荐尺寸</span>
                          <span>{selectedImage.recommended_width} × {selectedImage.recommended_height}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">使用位置</span>
                        <span className="text-right">{selectedImage.usage_location}</span>
                      </div>
                    </div>

                    {/* 消息提示 */}
                    {message && (
                      <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
                        message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {message.type === 'success' ? <Check size={16} /> : <X size={16} />}
                        {message.text}
                      </div>
                    )}

                    {/* 上传区域 */}
                    <div className="mt-6 space-y-4">
                      {/* 文件上传 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          上传图片
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-center gap-2 text-gray-600"
                        >
                          {uploading ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <Upload size={20} />
                          )}
                          <span>点击选择图片</span>
                        </button>
                        <p className="text-xs text-gray-500 mt-1">支持 JPG、PNG、WebP、GIF，最大 5MB</p>
                      </div>

                      {/* URL 输入 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          或输入图片 URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          />
                          <button
                            onClick={handleUrlSubmit}
                            disabled={uploading || !urlInput.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            确认
                          </button>
                        </div>
                      </div>

                      {/* 恢复默认 */}
                      {selectedImage.image_url !== selectedImage.default_url && (
                        <button
                          onClick={handleResetToDefault}
                          disabled={uploading}
                          className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 text-gray-600"
                        >
                          <RefreshCw size={16} />
                          恢复默认图片
                        </button>
                      )}

                      {/* 查看原图 */}
                      <a
                        href={selectedImage.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center text-gray-600 text-sm"
                      >
                        <ExternalLink size={14} className="inline mr-1" />
                        查看原图
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                  <p>选择左侧图片进行编辑</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
