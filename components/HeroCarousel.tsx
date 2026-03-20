'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaExternal?: boolean;
  overlayColor?: string;
  textColor?: string;
  textPosition?: 'center' | 'left' | 'right';
  advertiser?: string;
  bidPrice?: number;
  weekStart?: string;
  weekEnd?: string;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  height?: string;
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    setIsMounted(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isAutoPlaying, autoPlayInterval, goToNext, slides.length]);

  const pauseAutoPlay = () => setIsAutoPlaying(false);
  const resumeAutoPlay = () => setIsAutoPlaying(true);

  if (!slides || slides.length === 0 || !isMounted) {
    return (
      <div
        className="relative w-full overflow-hidden bg-brand-900 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden bg-brand-900"
      style={{ height }}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      {/* Slides — only render current + adjacent for smooth transition */}
      {slides.map((slide, index) => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        const nextIndex = (currentIndex + 1) % slides.length;
        const shouldRender = index === currentIndex || index === prevIndex || index === nextIndex;

        if (!shouldRender) return null;

        const isCurrent = index === currentIndex;
        const imgSrc = isMobile && slide.mobileImageUrl ? slide.mobileImageUrl : slide.imageUrl;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Ken Burns zoom wrapper */}
            <div
              className="absolute inset-0 transition-transform duration-[10000ms] ease-out"
              style={{ transform: isCurrent ? 'scale(1.05)' : 'scale(1)' }}
            >
              <Image
                src={imgSrc}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="100vw"
                quality={75}
                priority={index === 0}
              />
            </div>

            {/* Brand overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/80 to-brand-900/60" />
          </div>
        );
      })}

      {/* Decorative blur circles */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
        <div className="absolute w-72 h-72 bg-gold-400/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl animate-fade-in-up">
            {currentSlide.subtitle && (
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-gold-400"></div>
                <span className="text-xs tracking-[0.3em] text-gold-400 uppercase">
                  {currentSlide.subtitle}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              {currentSlide.title.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>

            {currentSlide.description && (
              <p className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed max-w-2xl">
                {currentSlide.description}
              </p>
            )}

            {currentSlide.ctaText && currentSlide.ctaLink && (
              <div className="flex flex-wrap gap-4">
                {currentSlide.ctaExternal ? (
                  <a
                    href={currentSlide.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-brand-900 px-8 py-4 font-bold hover:bg-neutral-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    {currentSlide.ctaText}
                    <ExternalLink size={18} />
                  </a>
                ) : (
                  <Link
                    href={currentSlide.ctaLink}
                    className="inline-flex items-center gap-2 bg-white text-brand-900 px-8 py-4 font-bold hover:bg-neutral-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    {currentSlide.ctaText}
                    <ArrowRight size={18} />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={() => { goToPrev(); pauseAutoPlay(); setTimeout(resumeAutoPlay, 3000); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => { goToNext(); pauseAutoPlay(); setTimeout(resumeAutoPlay, 3000); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-1 bg-gold-400'
                  : 'w-4 h-1 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {isAutoPlaying && slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/10">
          <div
            className="h-full bg-gold-400/60 transition-none"
            style={{
              animation: `progress ${autoPlayInterval}ms linear`,
              animationIterationCount: 'infinite',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
