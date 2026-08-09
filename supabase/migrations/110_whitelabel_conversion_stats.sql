-- =====================================================
-- 110: 白标转化计数原子自增
-- =====================================================
-- 背景：guides.whitelabel_conversions 与 guides.total_bookings 两个计数列在
-- 062 迁移中创建，但唯一的自增触发器只存在于已归档的 036 迁移，且挂在写错的表名
-- `whitelabel_orders`（现网真表为 `white_label_orders`），062/077 均未重建。
-- 结果：这两列现网永不自增，导游后台看到的“转化数/预约数”恒为 0，严重打击信任。
--
-- 方案：不重建易错的触发器，改为在应用层（webhook 在线计佣、后台线下完成单）
-- 显式调用本 RPC 原子自增，与 100_ 中 increment_guide_commission 的做法一致。
--
-- ⚠️ 本项目无迁移自动跟踪，需手动在生产库执行本文件。

CREATE OR REPLACE FUNCTION increment_guide_conversion_stats(
  p_guide_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE guides
  SET whitelabel_conversions = COALESCE(whitelabel_conversions, 0) + 1,
      total_bookings = COALESCE(total_bookings, 0) + 1,
      updated_at = NOW()
  WHERE id = p_guide_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
