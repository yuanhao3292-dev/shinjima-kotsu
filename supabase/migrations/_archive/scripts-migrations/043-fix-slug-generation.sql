-- ============================================
-- 修复 Slug 生成函数
-- Fix Slug Generation for Chinese Names
-- ============================================
-- 问题：原函数只保留字母数字，中文名会生成空 slug
-- 解决：使用随机 ID + 可选的英文昵称

-- 替换原有的 slug 生成函数
CREATE OR REPLACE FUNCTION generate_guide_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug VARCHAR(50);
  final_slug VARCHAR(50);
  counter INT := 0;
  random_suffix VARCHAR(8);
BEGIN
  -- 如果已有 slug，不覆盖
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;

  -- 生成随机后缀（用于确保唯一性）
  random_suffix := LOWER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));

  -- 尝试从名字生成 slug
  -- 只保留英文字母、数字和连字符
  base_slug := LOWER(REGEXP_REPLACE(COALESCE(NEW.name, ''), '[^a-zA-Z0-9-]', '', 'g'));

  -- 如果 base_slug 有效（长度 >= 2），使用它
  IF LENGTH(base_slug) >= 2 THEN
    -- 限制长度
    base_slug := SUBSTRING(base_slug FROM 1 FOR 20);
  ELSE
    -- 对于纯中文或其他非拉丁字符的名字，使用 'g' + 随机 ID
    -- 格式：g-xxxxxxxx（总共 10 个字符）
    base_slug := 'g-' || random_suffix;
  END IF;

  -- 确保唯一性
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM guides WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    counter := counter + 1;
    IF counter > 100 THEN
      -- 如果尝试次数过多，使用纯随机 slug
      final_slug := 'g-' || LOWER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 10));
      EXIT;
    END IF;
    -- 添加数字后缀
    final_slug := base_slug || counter::TEXT;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 重新创建触发器（确保使用新函数）
DROP TRIGGER IF EXISTS trigger_generate_guide_slug ON guides;

CREATE TRIGGER trigger_generate_guide_slug
  BEFORE INSERT OR UPDATE ON guides
  FOR EACH ROW
  EXECUTE FUNCTION generate_guide_slug();

-- 为现有没有 slug 的导游生成 slug
DO $$
DECLARE
  guide_rec RECORD;
  new_slug VARCHAR(50);
  counter INT;
BEGIN
  FOR guide_rec IN SELECT id, name FROM guides WHERE slug IS NULL OR slug = '' LOOP
    -- 生成新 slug
    new_slug := 'g-' || LOWER(SUBSTRING(MD5(guide_rec.id::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8));
    counter := 0;

    -- 确保唯一性
    WHILE EXISTS (SELECT 1 FROM guides WHERE slug = new_slug AND id != guide_rec.id) LOOP
      counter := counter + 1;
      new_slug := 'g-' || LOWER(SUBSTRING(MD5(guide_rec.id::TEXT || counter::TEXT) FROM 1 FOR 8));
    END LOOP;

    -- 更新
    UPDATE guides SET slug = new_slug WHERE id = guide_rec.id;
    RAISE NOTICE 'Updated guide % with slug %', guide_rec.name, new_slug;
  END LOOP;
END;
$$;

-- ============================================
-- 添加用户自定义 slug 功能
-- ============================================
-- 允许用户在设置中自定义 slug（需要验证唯一性）

COMMENT ON COLUMN guides.slug IS '白标页面 URL 标识，支持自定义。格式：小写字母、数字、连字符，3-50 字符';

-- ============================================
-- 验证
-- ============================================
-- SELECT id, name, slug FROM guides ORDER BY created_at DESC LIMIT 10;
