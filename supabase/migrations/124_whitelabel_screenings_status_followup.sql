-- 124: whitelabel_screenings.status 允许 'needs_followup'
--
-- 068 建表时 CHECK (status IN ('in_progress', 'completed'))；080 给这张表加了
-- 追问字段却没放开约束。结果白标 analyze 走到安全闸门 Class B、
-- .update({ status: 'needs_followup' }) 时被 23514 拒绝，整个追问分支从未真正
-- 跑通过（主站 health_screenings 建表时就没有 CHECK，不受影响）。
--
-- 2026-08-18 白标追问 UI 补全时发现（在库里造 needs_followup 记录做端到端被拒）。

ALTER TABLE whitelabel_screenings
  DROP CONSTRAINT IF EXISTS whitelabel_screenings_status_check;

ALTER TABLE whitelabel_screenings
  ADD CONSTRAINT whitelabel_screenings_status_check
  CHECK (status IN ('in_progress', 'needs_followup', 'completed'));
