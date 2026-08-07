-- ============================================
-- 061: 白标模块组件化 - 添加 component_key 列
-- Maps modules to React component implementations
-- ============================================

-- Add component_key column to page_modules
ALTER TABLE page_modules
  ADD COLUMN IF NOT EXISTS component_key VARCHAR(50);

-- Create index for quick lookup
CREATE INDEX IF NOT EXISTS idx_page_modules_component_key
  ON page_modules(component_key);

-- Add comment
COMMENT ON COLUMN page_modules.component_key IS
  'Maps to React component in components/whitelabel-modules/registry.ts. NULL means generic card display.';
