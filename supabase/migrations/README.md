# 数据库迁移

## 目录约定

```
supabase/migrations/
├── NNN_描述.sql              ← 现行迁移，按编号顺序应用
├── _archive/
│   ├── scripts-migrations/   ← 历史遗留：原 scripts/migrations/（033–062）
│   └── one-off/              ← 历史遗留：原 scripts/*.sql 一次性数据修补
└── README.md
```

新增迁移一律放在顶层，编号取当前最大值 +1。`_archive/` 下的文件仅作历史
参考，**不要再执行**，也不要在其中新增文件。

## 这个项目没有迁移状态跟踪

仓库里没有 `supabase/config.toml`，也没有用 Supabase CLI 托管迁移。这意味着：

- 文件系统上的编号顺序 **不等于** 数据库里实际应用过的顺序；
- 没有任何记录能告诉你某个 `NNN_xxx.sql` 到底跑没跑过；
- 因此**不要**直接运行 `supabase db push` —— 它会尝试应用全部迁移，
  在一个已经有数据的生产库上执行未知状态的 DDL 是危险操作。

在为现有表做变更前，先直接查库确认当前真实状态，例如：

```sql
-- 确认某列是否已存在
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'customer_service_contracts';

-- 确认某条 RLS 策略的实际角色与条件
SELECT tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'whitelabel_screenings';
```

写迁移时坚持幂等写法（`IF NOT EXISTS` / `DROP ... IF EXISTS` 后重建），
这样重复执行不会出错，也就抵消了一部分"不知道跑没跑过"的风险。

## 已知的历史编号冲突

下面这些编号在同一目录内被用了两次。它们对应的变更都已经发生过，
重新编号只会让文件名和历史记录对不上，因此保持原样、在此登记：

| 编号 | 冲突文件 |
|------|----------|
| 062 | `062_contract_management_system.sql`、`062_fix_module_alignment.sql` |
| 063 | `063_contract_signatures_storage.sql`、`063_simplify_commission_tiers.sql` |

`_archive/scripts-migrations/` 内另有 037、047、048、050 四组重复，
且 059–062 与顶层迁移编号区间重叠 —— 这正是当初两套目录并行的后果。

`scripts/check-migration-numbering.js` 会在 CI 里拦截**新增**的编号冲突，
上表中的历史冲突已登记在该脚本的白名单里。

## 与 RLS 有关的一条硬规矩

`CREATE POLICY` 不写 `TO` 子句时默认作用于 `PUBLIC`，其中包含 `anon` ——
也就是任何持有公开 anon key 的人。而 `service_role` 本身就绕过 RLS、
根本不需要策略。

所以「给 service role 开全权限」这个意图，正确写法是**不写策略**；
写成 `FOR ALL USING (true)` 反而是把权限开放给了匿名用户。
迁移 `108_fix_permissive_rls_policies.sql` 修的就是四条这样的策略。

新增策略时务必显式写出 `TO`：

```sql
CREATE POLICY "..." ON some_table
  FOR SELECT
  TO authenticated          -- ← 不要省略
  USING (user_id = auth.uid());
```
