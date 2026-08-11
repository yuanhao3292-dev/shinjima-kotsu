/**
 * 动效令牌 —— 全站统一的弹簧物理与入场变体。
 *
 * 借鉴 Apple「Designing Fluid Interfaces」的做法:用弹簧物理(stiffness/damping)而非
 * 时长+缓动曲线,动画天然可中断、有动量感;并保持克制(位移小、幅度小)与空间一致
 * (所有组件共用这几个预设,不各弹各的)。配合 <MotionConfig reducedMotion="user">
 * 自动尊重系统「减弱动态」。
 */

import type { Transition, Variants } from 'motion/react';

// ── 弹簧预设 ──────────────────────────────────────────────
export const spring = {
  /** 大块入场 / 卡片浮现:柔和、有一点点回弹 */
  gentle: { type: 'spring', stiffness: 140, damping: 20, mass: 1 } as Transition,
  /** 交互反馈(按压 / hover):干脆、临界阻尼、几乎不过冲 */
  snappy: { type: 'spring', stiffness: 420, damping: 32 } as Transition,
  /** 布局 / 尺寸变化:平滑 */
  smooth: { type: 'spring', stiffness: 220, damping: 28 } as Transition,
} as const;

// ── 入场:容器逐个错开 + 子项轻微上浮淡入 ──────────────────
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
};

/** 子项:从下方 10px 淡入,克制的位移 */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: spring.gentle },
};

// ── 交互反馈(按压下沉、hover 微抬) ────────────────────────
export const pressable = {
  whileHover: { y: -2, transition: spring.snappy },
  whileTap: { scale: 0.98, transition: spring.snappy },
} as const;

/** 纯按压(按钮,不位移只轻微缩放) */
export const tappable = {
  whileTap: { scale: 0.97, transition: spring.snappy },
} as const;

// ── 弹窗:背板淡入 + 面板弹簧缩放浮现 ──────────────────────
export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const dialogPop: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: spring.smooth },
  exit: { opacity: 0, scale: 0.98, y: 8, transition: { duration: 0.15 } },
};
