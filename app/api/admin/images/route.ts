import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - 获取所有图片配置
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('site_images')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('title');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    // 按分类分组
    const grouped = (data || []).reduce((acc: Record<string, typeof data>, img) => {
      const cat = img.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(img);
      return acc;
    }, {});

    return NextResponse.json({
      images: data,
      grouped,
      categories: Object.keys(grouped),
    });
  } catch (error) {
    console.error('获取图片配置失败:', error);
    return NextResponse.json(
      { error: '获取图片配置失败' },
      { status: 500 }
    );
  }
}

// POST - 上传图片
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const authHeader = request.headers.get('Authorization');
    const authResult = await verifyAdminAuth(authHeader);

    if (!authResult.isValid) {
      return NextResponse.json(
        { error: authResult.error || '需要管理员权限' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const imageKey = formData.get('imageKey') as string;
    const file = formData.get('file') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (!imageKey) {
      return NextResponse.json(
        { error: '缺少图片标识 imageKey' },
        { status: 400 }
      );
    }

    let finalUrl = imageUrl;

    // 如果上传了文件
    if (file && file.size > 0) {
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: '不支持的图片格式，请上传 JPG/PNG/WebP/GIF' },
          { status: 400 }
        );
      }

      // 验证文件大小（最大 5MB）
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: '图片大小不能超过 5MB' },
          { status: 400 }
        );
      }

      // 生成文件名
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `site-images/${imageKey}-${Date.now()}.${ext}`;

      // 上传到 Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error('上传失败:', uploadError);
        return NextResponse.json(
          { error: '图片上传失败: ' + uploadError.message },
          { status: 500 }
        );
      }

      // 获取公开 URL
      const { data: urlData } = supabase.storage
        .from('public-assets')
        .getPublicUrl(fileName);

      finalUrl = urlData.publicUrl;
    }

    if (!finalUrl) {
      return NextResponse.json(
        { error: '请上传图片或提供图片 URL' },
        { status: 400 }
      );
    }

    // 更新数据库
    const { data, error } = await supabase
      .from('site_images')
      .update({ image_url: finalUrl })
      .eq('image_key', imageKey)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: '图片更新成功',
      image: data,
    });
  } catch (error) {
    console.error('更新图片失败:', error);
    return NextResponse.json(
      { error: '更新图片失败' },
      { status: 500 }
    );
  }
}

// PUT - 恢复默认图片
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const authResult = await verifyAdminAuth(authHeader);

    if (!authResult.isValid) {
      return NextResponse.json(
        { error: authResult.error || '需要管理员权限' },
        { status: 403 }
      );
    }

    const { imageKey } = await request.json();

    if (!imageKey) {
      return NextResponse.json(
        { error: '缺少图片标识' },
        { status: 400 }
      );
    }

    // 获取默认 URL
    const { data: current } = await supabase
      .from('site_images')
      .select('default_url')
      .eq('image_key', imageKey)
      .single();

    if (!current?.default_url) {
      return NextResponse.json(
        { error: '找不到默认图片' },
        { status: 404 }
      );
    }

    // 恢复默认
    const { data, error } = await supabase
      .from('site_images')
      .update({ image_url: current.default_url })
      .eq('image_key', imageKey)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: '已恢复默认图片',
      image: data,
    });
  } catch (error) {
    console.error('恢复默认图片失败:', error);
    return NextResponse.json(
      { error: '恢复默认图片失败' },
      { status: 500 }
    );
  }
}
