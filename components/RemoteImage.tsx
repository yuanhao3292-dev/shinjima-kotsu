'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * 外链图片 —— 加载失败时降级为品牌占位，而不是留一个空洞。
 *
 * 站上约 180 张图片托管在合作方或第三方服务器上（合作医院官网、
 * 免费图床、对方 CDN）。这类地址随时会失效：2026-08 实测 igtc.jp 的
 * 27 张返回 404、cdn.yun.sooce.cn 的 25 张返回 403，/igtc 页面 28 张图
 * 里 26 张加载不出来，整屏空白。
 *
 * 原生 <img> 加载失败时不同浏览器表现不一（破图标 / 空白 / alt 文字），
 * 在设定了高度的容器里就是一大片空。这里统一接管 onError：
 * 画一个带图标与说明的占位块，尺寸与原图容器一致，版面不塌。
 *
 * ⚠️ 这只是止损。图片本身的根治办法是向合作方索要授权素材并上传到
 * 自有存储（public-assets 桶），像 site/ 前缀下那批一样。
 */
export default function RemoteImage({
  src,
  alt,
  className = '',
  containerClassName = '',
}: {
  src: string;
  alt: string;
  className?: string;
  /** 占位块的容器样式，通常与 <img> 的父级一致 */
  containerClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // 服务端渲染的 <img> 可能在 React 完成 hydration 之前就已经加载失败，
  // 那一次 error 事件发生时监听还没挂上 —— 实测 /igtc 有 8 张图因此
  // 一直停留在空洞状态。挂载后主动补一次判定：complete 为真而
  // naturalWidth 为 0，就是加载失败。
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-100 text-neutral-400 ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff size={28} strokeWidth={1.5} />
        <span className="px-3 text-center text-xs leading-snug">{alt}</span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element -- 第三方地址，不走 next/image 优化
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
