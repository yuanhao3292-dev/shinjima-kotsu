-- 122: 原子扣减 AI 筛查免费额度
--
-- 背景：analyze / followup 路由原本「读 free_remaining → 内存减 1 → 写回」，
-- 并发时两次扣减基于同一份旧读数，只记账一次（丢失更新）。
-- 首次使用的 INSERT 路径也有并发竞态：两个首次请求同时 INSERT，
-- 第二个因主键冲突失败且代码未检查错误，等于漏记账。
--
-- 本函数用 INSERT ... ON CONFLICT 原子完成「首次建行 / 后续扣减」。
-- 允许 free_remaining 减到负数：两个并发请求都通过了额度预检时，
-- 负数是诚实的记账（并阻止后续使用），钳制在 0 反而等于送免费次数。
--
-- 安全：SECURITY DEFINER + 内部取 auth.uid()，不接受调用方指定 user_id，
-- 用户只能扣自己的额度。

CREATE OR REPLACE FUNCTION consume_screening_credit(p_free_limit INTEGER)
RETURNS TABLE (new_free_remaining INTEGER, new_total_used INTEGER)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO screening_usage (user_id, free_remaining, total_used, last_used_at)
  VALUES (auth.uid(), p_free_limit - 1, 1, NOW())
  ON CONFLICT (user_id) DO UPDATE
    SET free_remaining = screening_usage.free_remaining - 1,
        total_used     = screening_usage.total_used + 1,
        last_used_at   = NOW()
  RETURNING free_remaining, total_used;
$$;

-- 仅限已登录用户调用（匿名/白标筛查不走 screening_usage）
REVOKE ALL ON FUNCTION consume_screening_credit(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION consume_screening_credit(INTEGER) TO authenticated;
