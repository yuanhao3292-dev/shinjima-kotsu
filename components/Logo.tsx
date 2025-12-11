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
  >
    {/* Outer Seal Border - Golden Yellow matching the image */}
    <rect 
      x="7" 
      y="7" 
      width="86" 
      height="86" 
      rx="16" 
      stroke="#EAB308" 
      strokeWidth="8" 
      fill="none" 
      strokeLinejoin="round"
    />
    
    {/* Inner Character '新' - Bold and Centered */}
    <text 
      x="50" 
      y="55" 
      fontSize="60" 
      fontWeight="800" 
      fill="#EAB308" 
      textAnchor="middle" 
      dominantBaseline="central"
      fontFamily="'Noto Sans JP', sans-serif"
      style={{ letterSpacing: '-2px' }}
    >
      新
    </text>
  </svg>
);

export default Logo;