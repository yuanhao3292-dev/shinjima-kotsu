import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

// Default images as fallback (all verified working URLs)
const DEFAULT_IMAGES: Record<string, string> = {
  'hokkaido-summer': 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop',
  'hokkaido-niseko': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop',
  'hokkaido-premium': 'https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1200&auto=format&fit=crop',
  'okinawa-resort': 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1200&auto=format&fit=crop',
  'okinawa-island-hop': 'https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=1200&auto=format&fit=crop',
  'kyushu-onsen': 'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?q=80&w=1200&auto=format&fit=crop',
  'kyushu-championship': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
  'kyushu-grand': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200&auto=format&fit=crop',
  'chugoku-sanyo': 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200&auto=format&fit=crop',
  'chugoku-sanin': 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop',
  'shikoku-pilgrimage': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop',
  'shikoku-seto': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
  'kansai-championship': 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop',
  'kansai-kyoto': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop',
  'kansai-hirono': 'https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1200&auto=format&fit=crop',
  'tokyo-championship': 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1200&auto=format&fit=crop',
  'tokyo-fuji': 'https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=1200&auto=format&fit=crop',
  'tokyo-historic': 'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?q=80&w=1200&auto=format&fit=crop',
  'chubu-alps': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
  'chubu-nagoya': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200&auto=format&fit=crop',
};

export async function GET() {
  try {
    // Try to fetch from database
    const { data, error } = await supabase
      .from('golf_plan_images')
      .select('plan_id, image_url');

    if (error) {
      console.warn('Failed to fetch from database, using defaults:', error.message);
      return NextResponse.json(DEFAULT_IMAGES);
    }

    if (!data || data.length === 0) {
      console.warn('No data in database, using defaults');
      return NextResponse.json(DEFAULT_IMAGES);
    }

    // Convert array to object
    const images: Record<string, string> = {};
    for (const row of data) {
      images[row.plan_id] = row.image_url;
    }

    // Merge with defaults for any missing entries
    const merged = { ...DEFAULT_IMAGES, ...images };

    return NextResponse.json(merged, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    console.error('Error fetching golf plan images:', err);
    return NextResponse.json(DEFAULT_IMAGES);
  }
}
