import { createClient } from '@/lib/supabase/server';

export interface SaiClinicImage {
  id: string;
  category: string;
  src: string;
  alt: string;
  label: string | null;
  display_order: number;
  metadata: Record<string, string> | null;
}

/**
 * 从数据库获取 SAI CLINIC 图片资源
 * 按 category + display_order 排序
 * 如果数据库不可用，返回 null（由调用方决定 fallback 策略）
 */
export async function getSaiClinicImages(): Promise<SaiClinicImage[] | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('sai_clinic_images')
      .select('id, category, src, alt, label, display_order, metadata')
      .eq('is_active', true)
      .order('category')
      .order('display_order');

    if (error) {
      console.warn('[sai-clinic-images] DB fetch failed:', error.message);
      return null;
    }

    return data as SaiClinicImage[];
  } catch (e) {
    console.warn('[sai-clinic-images] Unexpected error:', e);
    return null;
  }
}

/**
 * 按分类过滤图片
 */
export function filterByCategory(
  images: SaiClinicImage[],
  category: string
): SaiClinicImage[] {
  return images.filter((img) => img.category === category);
}

/**
 * 按 metadata.usage 查找单张图片
 */
export function findByUsage(
  images: SaiClinicImage[],
  usage: string
): SaiClinicImage | undefined {
  return images.find((img) => img.metadata?.usage === usage);
}
