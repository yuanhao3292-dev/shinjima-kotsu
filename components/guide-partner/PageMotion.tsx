'use client';

import React from 'react';
import { motion, MotionConfig } from 'motion/react';
import { staggerContainer, riseItem } from '@/lib/motion';

/**
 * 后台页面统一的「流体入场」容器。
 *
 * 用同一套 lib/motion.ts 令牌(与控制台一致):容器逐个错开、子块淡入上浮 + 轻微缩放,
 * 弹簧物理、可中断;<MotionConfig reducedMotion="user"> 尊重系统「减弱动态」。
 *
 * 用法:把页面内容容器 <div className="p-6 lg:p-8"> 换成
 *       <PageMotion className="p-6 lg:p-8">…</PageMotion> 即可,直接子块会自动逐个入场。
 * 注意:仅用于「纵向堆叠」的内容容器(子块块级排列);不要用在 flex/grid 容器上
 *       (会因每个子块被额外包一层 div 而破坏其直接子布局)。
 */
export default function PageMotion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className={className} variants={staggerContainer} initial="hidden" animate="show">
        {React.Children.map(children, (child) =>
          child == null || child === false || child === true ? (
            child
          ) : (
            <motion.div variants={riseItem}>{child}</motion.div>
          ),
        )}
      </motion.div>
    </MotionConfig>
  );
}
