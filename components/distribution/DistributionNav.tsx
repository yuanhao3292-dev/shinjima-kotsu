'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  /** 如果有 href，使用 Link 页面导航；否则使用 scrollTo 锚点导航 */
  href?: string;
}

interface DistributionNavProps {
  brandName: string;
  brandColor: string;
  brandLogoUrl: string | null;
  navItems: NavItem[];
  /** 品牌 logo/名称 点击后的链接 */
  homeHref?: string;
  /** 没有沉浸式 Hero 时，Nav 默认使用白色背景 */
  startScrolled?: boolean;
}

export default function DistributionNav({
  brandName,
  brandColor,
  brandLogoUrl,
  navItems,
  homeHref,
  startScrolled = false,
}: DistributionNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(startScrolled);
  const pathname = usePathname();

  useEffect(() => {
    if (startScrolled) return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [startScrolled]);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const isActive = (item: NavItem) => {
    if (!item.href) return false;
    // Exact match for homepage, startsWith for sub-pages
    if (item.href === homeHref) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const brandEl = (
    <div className="flex items-center gap-3">
      {brandLogoUrl ? (
        <img src={brandLogoUrl} alt={brandName} className="h-10 w-auto" />
      ) : (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: brandColor }}
        >
          {brandName.charAt(0)}
        </div>
      )}
      <span
        className={`text-xl font-bold transition-colors duration-300 ${
          scrolled ? 'text-gray-900' : 'text-white'
        }`}
      >
        {brandName}
      </span>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {homeHref ? (
          <Link href={homeHref} className="hover:opacity-80 transition-opacity">
            {brandEl}
          </Link>
        ) : (
          brandEl
        )}

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item);
            const cls = `px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              scrolled
                ? active
                  ? 'text-gray-900 bg-gray-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                : active
                  ? 'text-white bg-white/15'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
            }`;

            if (item.href) {
              return (
                <Link key={item.id} href={item.href} className={cls}>
                  {item.label}
                </Link>
              );
            }
            return (
              <button key={item.id} onClick={() => scrollTo(item.id)} className={cls}>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? '关闭菜单' : '打开菜单'}
        >
          {isOpen ? (
            <X size={24} className={scrolled ? 'text-gray-900' : 'text-white'} />
          ) : (
            <Menu size={24} className={scrolled ? 'text-gray-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t shadow-lg px-6 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item);
            const cls = `block w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
              active ? 'text-gray-900 bg-gray-50' : 'text-gray-700 hover:bg-gray-50'
            }`;

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cls}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <button key={item.id} onClick={() => scrollTo(item.id)} className={cls}>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
