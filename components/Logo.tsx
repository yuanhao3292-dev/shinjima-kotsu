import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Shinjima Kotsu Logo"
    fill="currentColor"
  >
    {/* 
       Typographic Logo Mark: '新' (Shin)
       Font: Shippori Mincho (High-end Serif)
       Style: Minimalist, Ink-like, No border
    */}
    <text 
      x="50" 
      y="58" 
      fontSize="72" 
      fontWeight="600" 
      textAnchor="middle" 
      dominantBaseline="central"
      fontFamily="'Shippori Mincho', serif"
      style={{ letterSpacing: '-0.02em' }}
    >
      新
    </text>
  </svg>
);

export default Logo;