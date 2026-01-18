-- ============================================
-- 预约冲突检测
-- Booking Conflict Detection
-- ============================================
-- 防止同一店铺同一时间段的重复预约

-- 1. 创建唯一约束（软约束：仅针对非取消状态的预约）
-- 不使用直接的 UNIQUE 约束，因为需要排除已取消的预约
-- 改用触发器实现

-- 2. 创建预约冲突检测函数
CREATE OR REPLACE FUNCTION check_booking_conflict()
RETURNS TRIGGER AS $$
DECLARE
  conflict_count INT;
  conflict_booking RECORD;
BEGIN
  -- 只检查新创建或更新为非取消状态的预约
  IF NEW.status = 'cancelled' THEN
    RETURN NEW;
  END IF;

  -- 检查同一店铺、同一日期、同一时间段是否已有预约
  -- 考虑时间重叠的情况
  SELECT COUNT(*), MIN(id), MIN(customer_name) INTO conflict_count, conflict_booking.id, conflict_booking.customer_name
  FROM bookings
  WHERE venue_id = NEW.venue_id
    AND booking_date = NEW.booking_date
    AND status NOT IN ('cancelled', 'no_show')
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    -- 时间冲突检测：如果都有时间，检查是否在同一小时内
    AND (
      -- 两者都没有指定时间（同一天的预约视为冲突）
      (NEW.booking_time IS NULL AND booking_time IS NULL)
      OR
      -- 新预约没有时间，但已有预约有时间（可能冲突，保守处理）
      (NEW.booking_time IS NULL AND booking_time IS NOT NULL)
      OR
      -- 已有预约没有时间，新预约有时间（可能冲突，保守处理）
      (NEW.booking_time IS NOT NULL AND booking_time IS NULL)
      OR
      -- 两者都有时间，检查是否在2小时内
      (NEW.booking_time IS NOT NULL AND booking_time IS NOT NULL
       AND ABS(EXTRACT(EPOCH FROM (NEW.booking_time - booking_time))) < 7200) -- 2小时 = 7200秒
    );

  IF conflict_count > 0 THEN
    RAISE EXCEPTION '预约冲突：该店铺在 % % 已有其他预约',
      NEW.booking_date,
      COALESCE(NEW.booking_time::TEXT, '(全天)');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. 创建触发器
DROP TRIGGER IF EXISTS trigger_check_booking_conflict ON bookings;
CREATE TRIGGER trigger_check_booking_conflict
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_conflict();

-- 4. 创建检查导游时间冲突的函数（可选，导游同一时间不能服务多个客户）
CREATE OR REPLACE FUNCTION check_guide_availability()
RETURNS TRIGGER AS $$
DECLARE
  conflict_count INT;
BEGIN
  -- 只检查非取消状态的预约
  IF NEW.status = 'cancelled' THEN
    RETURN NEW;
  END IF;

  -- 检查同一导游、同一日期、同一时间段是否已有预约
  SELECT COUNT(*) INTO conflict_count
  FROM bookings
  WHERE guide_id = NEW.guide_id
    AND booking_date = NEW.booking_date
    AND status NOT IN ('cancelled', 'no_show')
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND (
      -- 两者都没有时间
      (NEW.booking_time IS NULL AND booking_time IS NULL)
      OR
      -- 时间在2小时内
      (NEW.booking_time IS NOT NULL AND booking_time IS NOT NULL
       AND ABS(EXTRACT(EPOCH FROM (NEW.booking_time - booking_time))) < 7200)
    );

  IF conflict_count > 0 THEN
    RAISE EXCEPTION '导游时间冲突：您在 % % 已有其他预约安排',
      NEW.booking_date,
      COALESCE(NEW.booking_time::TEXT, '(全天)');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. 创建导游可用性检查触发器
DROP TRIGGER IF EXISTS trigger_check_guide_availability ON bookings;
CREATE TRIGGER trigger_check_guide_availability
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_guide_availability();

-- 6. 创建查询可用时间段的函数
CREATE OR REPLACE FUNCTION get_venue_availability(
  p_venue_id UUID,
  p_date DATE
)
RETURNS TABLE (
  time_slot TIME,
  is_available BOOLEAN,
  existing_booking_id UUID
) AS $$
BEGIN
  RETURN QUERY
  WITH time_slots AS (
    -- 生成从 10:00 到 22:00 的时间段（每小时一个）
    SELECT generate_series('10:00'::TIME, '22:00'::TIME, '1 hour'::INTERVAL) AS slot_time
  ),
  booked_slots AS (
    SELECT
      booking_time,
      id
    FROM bookings
    WHERE venue_id = p_venue_id
      AND booking_date = p_date
      AND status NOT IN ('cancelled', 'no_show')
      AND booking_time IS NOT NULL
  )
  SELECT
    ts.slot_time AS time_slot,
    NOT EXISTS (
      SELECT 1 FROM booked_slots bs
      WHERE ABS(EXTRACT(EPOCH FROM (ts.slot_time - bs.booking_time))) < 7200
    ) AS is_available,
    (SELECT bs.id FROM booked_slots bs
     WHERE ABS(EXTRACT(EPOCH FROM (ts.slot_time - bs.booking_time))) < 7200
     LIMIT 1) AS existing_booking_id
  FROM time_slots ts
  ORDER BY ts.slot_time;
END;
$$ LANGUAGE plpgsql;

-- 7. 创建查询导游可用性的函数
CREATE OR REPLACE FUNCTION get_guide_availability(
  p_guide_id UUID,
  p_date DATE
)
RETURNS TABLE (
  time_slot TIME,
  is_available BOOLEAN,
  venue_name VARCHAR,
  customer_name VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  WITH time_slots AS (
    SELECT generate_series('10:00'::TIME, '22:00'::TIME, '1 hour'::INTERVAL) AS slot_time
  ),
  booked_slots AS (
    SELECT
      b.booking_time,
      v.name AS venue_name,
      b.customer_name
    FROM bookings b
    JOIN venues v ON b.venue_id = v.id
    WHERE b.guide_id = p_guide_id
      AND b.booking_date = p_date
      AND b.status NOT IN ('cancelled', 'no_show')
      AND b.booking_time IS NOT NULL
  )
  SELECT
    ts.slot_time AS time_slot,
    NOT EXISTS (
      SELECT 1 FROM booked_slots bs
      WHERE ABS(EXTRACT(EPOCH FROM (ts.slot_time - bs.booking_time))) < 7200
    ) AS is_available,
    (SELECT bs.venue_name FROM booked_slots bs
     WHERE ABS(EXTRACT(EPOCH FROM (ts.slot_time - bs.booking_time))) < 7200
     LIMIT 1) AS venue_name,
    (SELECT bs.customer_name FROM booked_slots bs
     WHERE ABS(EXTRACT(EPOCH FROM (ts.slot_time - bs.booking_time))) < 7200
     LIMIT 1) AS customer_name
  FROM time_slots ts
  ORDER BY ts.slot_time;
END;
$$ LANGUAGE plpgsql;

-- 8. 添加注释
COMMENT ON FUNCTION check_booking_conflict() IS '检查预约是否与现有预约冲突（同一店铺、同一时间）';
COMMENT ON FUNCTION check_guide_availability() IS '检查导游在指定时间是否有空（避免双重预约）';
COMMENT ON FUNCTION get_venue_availability(UUID, DATE) IS '获取店铺在指定日期的可用时间段';
COMMENT ON FUNCTION get_guide_availability(UUID, DATE) IS '获取导游在指定日期的可用时间段';

-- ============================================
-- 验证
-- ============================================
-- 测试冲突检测（应该报错）：
-- INSERT INTO bookings (guide_id, venue_id, customer_name, booking_date, booking_time)
-- VALUES ('...', '...', '测试客户1', '2026-01-20', '18:00');
-- INSERT INTO bookings (guide_id, venue_id, customer_name, booking_date, booking_time)
-- VALUES ('...', '...', '测试客户2', '2026-01-20', '18:30'); -- 应该报错

-- 查询可用时间：
-- SELECT * FROM get_venue_availability('venue-id', '2026-01-20');
-- SELECT * FROM get_guide_availability('guide-id', '2026-01-20');
