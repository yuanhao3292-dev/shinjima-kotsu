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
`ko` 而大部分字典只有 4 语（ja/zh-CN/zh-TW/en）。断言让 tsc 看不出这个缺口。

**运行时影响已通过 `useLanguage4()` 兜住**（见 `hooks/useLanguage.ts`）：
11 个医院专题页把 `ko` 归一到 `ja`，韩语用户看到一致的日文而不是空白。
在此之前，选韩语会让这些页面的标题、描述、资质文案整片渲染成空。

实测缺口（2026-08）：8 个页面完全没有韩语文案，兵库医大缺 35 处、
癌症治疗缺 7 处、大阪 HIMAK 缺 3 处；只有 ac-plus 是完整的，因此它仍用
`useLanguage()`。

补齐真实韩语文案后，把对应页面改回 `useLanguage()` 即可。

共享类型在 `hooks/useLanguage.ts`：`LocalizedText`（5 语）、
`LocalizedText4`（4 语）、`Language4`。新代码优先用它们 + `satisfies`，
别再手写断言——`satisfies` 会在缺键时直接报错，断言不会。

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
