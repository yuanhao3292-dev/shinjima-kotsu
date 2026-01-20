import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Niijima Kotsu Logo"
    fill="currentColor"
  >
    {/*
       Typographic Logo Mark: 'N' (Niijima)
       Font: Serif style
       Style: Minimalist, Elegant
    */}
    <text
      x="50"
      y="58"
      fontSize="72"
      fontWeight="700"
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="'Times New Roman', serif"
      style={{ letterSpacing: '-0.02em' }}
    >
      N
    </text>
  </svg>
);

export default Logo;