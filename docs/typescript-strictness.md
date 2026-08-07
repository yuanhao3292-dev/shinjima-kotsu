# TypeScript 严格度现状

**`"strict": true` 已于 2026-08-07 全量开启**，`npx tsc --noEmit` 零错误。

推进过程（供追溯）：

1. 先逐项打开当时零错误的选项：`strictFunctionTypes`、`strictBindCallApply`、
   `noImplicitThis`、`alwaysStrict`、`useUnknownInCatchVariables`
2. 修复 26 处 `strictNullChecks` 错误后开启（多为 `let x = null` 推断、
   `[]` 推断成 `never[]`、recharts formatter 参数签名）
3. 修复 165 处 `noImplicitAny`——大头是医院专题页的内联多语言字典缺
   `as Record<Language, string>` 标注（KindaiHospitalContent 一个文件 99 处）
4. 换成 `"strict": true`，修掉最后 1 处 `strictPropertyInitialization` 关联错误

## 已知的类型层"谎言"

多语言字典大量使用 `as Record<Language, string>` 断言，但 `Language` 含
`ko` 而大部分字典只有 4 语（ja/zh-CN/zh-TW/en）。**韩语用户在这些位置
实际拿到 `undefined`**——这是代码库长期存在的约定，断言只是让它显式化了。
若要真正支持韩语，需要补文案并把断言换成完整的 5 语字典。

共享类型在 `hooks/useLanguage.ts`：`LocalizedText`（5 语）、
`LocalizedText4`（4 语）。新代码优先用它们 + `satisfies`，别再手写断言。

## 检查覆盖范围的缺口

`tsconfig.json` 的 `exclude` 仍排除 `tests/` 和 `scripts/`：

- `tests/`：mock 对象缺类型标注，纳入前需先补
- `scripts/`：70+ 一次性运维脚本，多数已废弃，不值得投入

`vitest.config.ts` 的 coverage 阈值（lines 60 等）只在手动
`npm run test:coverage` 时生效，CI 未开——测试数量已足够（1583 个），
先不给 CI 增加 coverage 采集的时间成本。

## 注意事项

`incremental: true` + 陈旧的 `.tsbuildinfo` 会跳过未改动文件的检查，
曾掩盖过 4 个真实错误。本地验证一律用：

```bash
npx tsc --noEmit --incremental false
```

CI 是全新 checkout 不受影响；`.tsbuildinfo` 已加入 `.gitignore`。
