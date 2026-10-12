import React from 'react';

interface HanifinityLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  alt?: string;
}

export const HanifinityLogo: React.FC<HanifinityLogoProps> = ({
  className = '',
  size = 'md',
  showGlow = true,
  alt = 'Hanifinity Logo'
}) => {
  // Height sizing presets that keep crisp proportions
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11 md:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24'
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center group select-none ${className}`}>
      {/* Ambient cyan-blue atmospheric glow blending into dark backgrounds */}
      {showGlow && (
        <div 
          className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-transparent blur-xl opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* High-fidelity Vector SVG Logo Asset */}
      <img
        src="/hanifinity-logo.svg"
        alt={alt}
        className={`w-auto ${sizeClasses} object-contain relative z-10 transition-transform duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_0_18px_rgba(0,229,255,0.45)]`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export default HanifinityLogo;
