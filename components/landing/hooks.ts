/**
 * Landing Page 共享 Hooks
 */
import { useState, useEffect } from 'react';

/**
 * 检测移动端屏幕的 Hook
 * 使用节流优化 resize 事件
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const check = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };
    // 初始检查
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.removeEventListener('resize', check);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
};
