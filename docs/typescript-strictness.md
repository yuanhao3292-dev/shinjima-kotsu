# TypeScript 严格度现状与推进路线

`tsconfig.json` 里 `"strict"` 仍是 `false`，但已逐项打开当前零错误的严格检查。
这份文档记录为什么这样分阶段，以及剩下什么。

## 已开启

| 选项 | 开启时的错误数 |
|------|----------------|
| `strictFunctionTypes` | 0 |
| `strictBindCallApply` | 0 |
| `noImplicitThis` | 0 |
| `alwaysStrict` | 0 |
| `useUnknownInCatchVariables` | 0 |
| `strictNullChecks` | 22（已逐个修复后开启） |

这几项在打开前实测都不产生新错误，或错误量小到可以一次性修完，
因此没有理由继续关着 —— 关着只会让新代码继续引入同类问题。

## 尚未开启

| 选项 | 当前错误数 | 说明 |
|------|-----------|------|
| `noImplicitAny` | 179 | 主要来自 Supabase 查询结果的隐式 any、事件处理器参数、以及早期迁移自 Vite 的组件 |

`noImplicitAny` 是唯一还挡在 `"strict": true` 前面的选项。179 处不是不能修，
但需要逐个判断真实类型（很多是数据库行的形状），属于独立任务，不适合和
安全修复混在一起。

推进建议：按目录分批处理，每批修完就在这里更新计数。全部归零后把
`"strict": false` 连同上面这一串单项开关一起换成 `"strict": true`。

## 类型检查的覆盖范围

`tsconfig.json` 的 `exclude` 目前是 `["node_modules", "tests", "scripts"]`。

- `tests/` 被排除：测试里有大量 mock 对象，纳入检查会产生噪音。
- `scripts/` 被排除：70+ 个一次性运维脚本，其中不少已经不再使用。

这意味着 `npx tsc --noEmit` 的"零错误"只覆盖 `app/`、`components/`、`lib/`、
`services/`、`hooks/`。把 `tests/` 纳入检查是值得做的（能挡住测试与实现之间
的类型漂移），但要先解决 mock 的类型标注问题。
