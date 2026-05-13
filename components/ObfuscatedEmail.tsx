'use client';

/**
 * 邮箱地址反爬虫混淆组件
 * - HTML 源码中不含明文邮箱，爬虫无法抓取
 * - 用户看到的是正常邮箱，可点击发送
 * - 通过 JavaScript 在客户端拼接邮箱地址
 */
export default function ObfuscatedEmail({
  user,
  domain,
  className,
}: {
  user: string;      // e.g. "haoyuan"
  domain: string;    // e.g. "niijima-koutsu.jp"
  className?: string;
}) {
  const handleClick = () => {
    window.location.href = `mailto:${user}@${domain}`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || 'hover:text-gray-900 transition-colors underline cursor-pointer'}
      aria-label="Send email"
    >
      {user}&#64;{domain}
    </button>
  );
}
