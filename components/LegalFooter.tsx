'use client';

import Link from 'next/link';

interface LegalFooterProps {
  className?: string;
  variant?: 'full' | 'minimal';
}

/**
 * 法律声明组件 - 用于所有页面底部
 * 确保符合日本旅行業法的标识显示义务
 */
export default function LegalFooter({ className = '', variant = 'minimal' }: LegalFooterProps) {
  if (variant === 'full') {
    return (
      <footer className={`bg-gray-900 text-white py-8 ${className}`}>
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <div className="mb-4">
            <p>本サービスは新島交通株式会社が提供しています</p>
            <p className="mt-1">大阪府知事登録旅行業 第2-3115号 ｜ 一般社団法人 日本旅行業協会（JATA）正会員</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs">
            <Link href="/legal/tokushoho" className="hover:text-white transition">
              特定商取引法に基づく表記
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/legal/privacy" className="hover:text-white transition">
              プライバシーポリシー
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/legal/terms" className="hover:text-white transition">
              利用規約
            </Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} 新島交通株式會社. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  // Minimal variant - 简化版，适用于登录/注册等页面
  return (
    <div className={`py-6 text-center ${className}`}>
      <p className="text-xs text-gray-400 leading-relaxed">
        本サービスは新島交通株式会社が提供しています<br />
        大阪府知事登録旅行業 第2-3115号 ｜ JATA正会員
      </p>
      <p className="text-xs text-gray-400 mt-2">
        © {new Date().getFullYear()} 新島交通株式會社
      </p>
    </div>
  );
}
