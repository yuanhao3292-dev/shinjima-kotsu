'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// 轮播图配置 - 支持竞拍展位
// 每周竞拍一次，起价 20,000 日币，轮播 3 张图
export interface CarouselSlide {
  id: string;
  // 展位信息
  title: string;           // 主标题
  subtitle?: string;       // 副标题
  description?: string;    // 描述文字
  // 图片
  imageUrl: string;        // 背景图片 URL
  mobileImageUrl?: string; // 移动端图片（可选）
  // 行动按钮
  ctaText?: string;        // 按钮文字
  ctaLink?: string;        // 按钮链接
  ctaExternal?: boolean;   // 是否外部链接
  // 样式
  overlayColor?: string;   // 遮罩颜色 (默认 rgba(0,0,0,0.4))
  textColor?: string;      // 文字颜色 (默认 white)
  textPosition?: 'center' | 'left' | 'right'; // 文字位置
  // 竞拍信息（后期使用）
  advertiser?: string;     // 广告主名称
  bidPrice?: number;       // 竞拍价格（日元）
  weekStart?: string;      // 展示周开始日期
  weekEnd?: string;        // 展示周结束日期
}

interface HeroCarouselProps {
  slides: CarouselSlide[];  // 必须传入 slides，不再使用默认值
  autoPlayInterval?: number; // 自动播放间隔（毫秒），默认 5000
  showIndicators?: boolean;
  showArrows?: boolean;
  height?: string; // 默认 85vh
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  autoPlayInterval = 5000,
  showIndicators = true,
  showArrows = true,
  height = '85vh',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 检测移动端，并标记组件已挂载
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    setIsMounted(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 切换到下一张
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // 切换到上一张
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // 切换到指定索引
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // 3 秒后恢复自动播放
    setTimeout(() => setIsAutoPlaying(true), 3000);
  }, []);

  // 自动播放
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isAutoPlaying, autoPlayInterval, goToNext, slides.length]);

  // 暂停自动播放
  const pauseAutoPlay = () => setIsAutoPlaying(false);
  const resumeAutoPlay = () => setIsAutoPlaying(true);

  // 如果没有 slides 或组件未挂载，显示加载状态（防止 hydration 闪现）
  if (!slides || slides.length === 0 || !isMounted) {
    return (
      <div
        className="relative w-full overflow-hidden bg-gray-900 flex items-center justify-center"
        style={{ height }}
      >
        {/* 空白占位，不显示 Loading 文字 */}
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-900"
      style={{ height }}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      {/* 轮播图片 - 只渲染当前和相邻的图片，避免闪现 */}
      {slides.map((slide, index) => {
        // 只渲染当前图片、前一张和后一张（用于平滑过渡）
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        const nextIndex = (currentIndex + 1) % slides.length;
        const shouldRender = index === currentIndex || index === prevIndex || index === nextIndex;

        if (!shouldRender) return null;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* 背景图片 */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out"
              style={{
                backgroundImage: `url(${isMobile && slide.mobileImageUrl ? slide.mobileImageUrl : slide.imageUrl})`,
                transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)',
              }}
            />

            {/* 遮罩层 */}
            <div
              className="absolute inset-0"
              style={{
                background: slide.overlayColor || 'rgba(0, 0, 0, 0.4)',
              }}
            />
          </div>
        );
      })}

      {/* 内容区域 */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div
          className={`container mx-auto px-6 ${
            currentSlide.textPosition === 'left'
              ? 'text-left'
              : currentSlide.textPosition === 'right'
              ? 'text-right'
              : 'text-center'
          }`}
        >
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* 副标题 */}
            {currentSlide.subtitle && (
              <p
                className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 opacity-90"
                style={{ color: currentSlide.textColor || 'white' }}
              >
                {currentSlide.subtitle}
              </p>
            )}

            {/* 主标题 */}
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight"
              style={{ color: currentSlide.textColor || 'white' }}
            >
              {currentSlide.title}
            </h1>

            {/* 描述 */}
            {currentSlide.description && (
              <p
                className="text-base md:text-xl mb-8 opacity-90 max-w-2xl mx-auto"
                style={{ color: currentSlide.textColor || 'white' }}
              >
                {currentSlide.description}
              </p>
            )}

            {/* CTA 按钮 */}
            {currentSlide.ctaText && currentSlide.ctaLink && (
              currentSlide.ctaExternal ? (
                <a
                  href={currentSlide.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  {currentSlide.ctaText}
                  <ExternalLink size={18} />
                </a>
              ) : (
                <Link
                  href={currentSlide.ctaLink}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  {currentSlide.ctaText}
                  <ChevronRight size={18} />
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* 左右箭头 */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={() => {
              goToPrev();
              pauseAutoPlay();
              setTimeout(resumeAutoPlay, 3000);
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => {
              goToNext();
              pauseAutoPlay();
              setTimeout(resumeAutoPlay, 3000);
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* 指示器 */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-2 bg-white rounded-full'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* 进度条（可选） */}
      {isAutoPlaying && slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/20">
          <div
            className="h-full bg-white/60 transition-none"
            style={{
              animation: `progress ${autoPlayInterval}ms linear`,
              animationIterationCount: 'infinite',
            }}
          />
        </div>
      )}

      {/* 进度条动画样式 */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
