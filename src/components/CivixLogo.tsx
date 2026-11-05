import React from 'react';

interface CivixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export const CivixLogo: React.FC<CivixLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  theme = 'dark',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Rich Layered Geometric Emblem */}
      <div className={`relative ${iconDimensions} flex-shrink-0 flex items-center justify-center`}>
        {/* Ambient Outer Halo */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-400 opacity-25 blur-sm" />

        {/* Primary Emblem Container */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-[1.5px] shadow-md border border-white/10 overflow-hidden">
          {/* Subtle Metallic Corner Highlight */}
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-sky-400/30 rounded-full blur-xs" />

          {/* SVG Vector Precision Mark */}
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-1.5"
          >
            <defs>
              <linearGradient id="civix-grad-primary" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#0284c7" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="civix-grad-accent" x1="28" y1="8" x2="12" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#0ea5e9" />
              </linearGradient>
              <filter id="civix-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Hexagonal Shield Perimeter */}
            <path
              d="M18 3.5L30 10.5V22.5L18 29.5L6 22.5V10.5L18 3.5Z"
              stroke="url(#civix-grad-primary)"
              strokeWidth="2.2"
              strokeLinejoin="round"
              className="opacity-90"
            />

            {/* Stylized Interlocking C & X Geometry */}
            <path
              d="M13 13C10.5 15.5 10.5 20.5 13 23C15.5 25.5 20.5 25.5 23 23"
              stroke="url(#civix-grad-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Dynamic AI Spatial Ray / Neural Cross */}
            <path
              d="M14 14L22 22M22 14L14 22"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              className="opacity-95"
            />

            {/* Core Neural Radar Spark (Center Pulse Beacon) */}
            <circle
              cx="18"
              cy="18"
              r="2.5"
              fill="#38bdf8"
              filter="url(#civix-glow)"
            />
            <circle
              cx="18"
              cy="18"
              r="1.2"
              fill="#ffffff"
            />

            {/* Satellite Geo-Marker Apex Node */}
            <circle
              cx="18"
              cy="3.5"
              r="2"
              fill="#22d3ee"
            />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            <span
              className={`font-black tracking-tight ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              } font-display ${textSizes}`}
            >
              Civix
            </span>
            <span className={`font-black tracking-tight bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent font-display ${textSizes}`}>
              AI
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            Civic Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
