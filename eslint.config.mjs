import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      'supabase/**',
      'docs/**',
      'data/**',
      'next-env.d.ts',
    ],
  },

  ...nextCoreWebVitals,

  {
    rules: {
      // 项目现状：tsconfig 尚未开启 noImplicitAny，显式 any 有 179 处历史存量，
      // 先关掉以免 CI 被历史包袱卡死；等 noImplicitAny 推进完再打开。
      '@typescript-eslint/no-explicit-any': 'off',

      // img 绕过 next/image 的优化和 remotePatterns 白名单，值得提醒但不阻断
      '@next/next/no-img-element': 'warn',

      // ── 以下四条是 React 19 新增的编译器相关规则，在本仓库有大量历史命中 ──
      // 命中数（2026-08 基线）：set-state-in-effect 75、immutability 31、
      // static-components 7、purity 2。它们指向的是真实的渲染性能与正确性问题，
      // 但逐个修属于独立的重构工程，不该阻塞当前的 CI 接入。
      // 先降为警告让它们持续可见；等专项处理完再逐条提回 error。
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/purity': 'warn',
    },
  },

  {
    // 错误边界在路由/水合已经出问题时渲染，此时 <Link> 的客户端导航未必可用，
    // 用原生 <a> 做整页跳转是刻意选择。
    files: ['app/error.tsx', 'app/global-error.tsx'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },

  {
    // 一次性运维脚本：不是页面代码，不适用 React/Next 的那套约束
    files: ['scripts/**/*.{js,ts,mjs}'],
    rules: {
      '@next/next/no-assign-module-variable': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];
