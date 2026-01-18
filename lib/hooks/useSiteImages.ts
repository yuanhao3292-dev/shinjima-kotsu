'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface SiteImage {
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

// 缓存图片数据
let cachedImages: Record<string, string> | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

/**
 * 获取网站图片的 Hook
 * 从数据库加载图片配置，支持缓存
 */
export function useSiteImages() {
  const [images, setImages] = useState<Record<string, string>>(cachedImages || {});
  const [loading, setLoading] = useState(!cachedImages);

  useEffect(() => {
    // 如果缓存有效，直接使用
    if (cachedImages && Date.now() - cacheTime < CACHE_DURATION) {
      setImages(cachedImages);
      setLoading(false);
      return;
    }

    const loadImages = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_images')
          .select('image_key, image_url')
          .eq('is_active', true);

        if (error) throw error;

        const imageMap: Record<string, string> = {};
        (data || []).forEach((img) => {
          imageMap[img.image_key] = img.image_url;
        });

        // 更新缓存
        cachedImages = imageMap;
        cacheTime = Date.now();

        setImages(imageMap);
      } catch (err) {
        console.error('加载网站图片失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  /**
   * 获取图片 URL
   * @param key 图片标识符
   * @param fallback 默认图片 URL（如果数据库没有）
   */
  const getImage = (key: string, fallback?: string): string => {
    return images[key] || fallback || '';
  };

  return { images, loading, getImage };
}

/**
 * 服务端获取图片（用于 API 路由或 SSR）
 */
export async function getSiteImagesServer(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_images?is_active=eq.true&select=image_key,image_url`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 300 }, // 5分钟重新验证
    });

    if (!res.ok) return {};

    const data = await res.json();
    const imageMap: Record<string, string> = {};
    data.forEach((img: { image_key: string; image_url: string }) => {
      imageMap[img.image_key] = img.image_url;
    });

    return imageMap;
  } catch {
    return {};
  }
}
