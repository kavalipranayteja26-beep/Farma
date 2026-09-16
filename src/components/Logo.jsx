import React from 'react';

const Logo = ({ size = 'md', showTagline = true, variant = 'light' }) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const titleSize = size === 'sm' ? '1.25rem' : size === 'lg' ? '2rem' : '1.5rem';

  const isDark = variant === 'dark';

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Emblem SVG */}
      <div 
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300 p-2"
        style={{ width: iconSize + 12, height: iconSize + 12 }}
      >
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background shield/circle */}
          <circle cx="32" cy="32" r="28" fill="#15803D" />
          
          {/* Medical Cross Stem */}
          <path d="M28 20C28 17.7909 29.7909 16 32 16C34.2091 16 36 17.7909 36 20V28H44C46.2091 28 48 29.7909 48 32C48 34.2091 46.2091 36 44 36H36V44C36 46.2091 34.2091 48 32 48C29.7909 48 28 46.2091 28 44V36H20C17.7909 36 16 34.2091 16 32C16 29.7909 17.7909 28 20 28H28V20Z" fill="#22C55E" />
          
          {/* Organic Leaf Overlay */}
          <path d="M32 14C32 14 44 22 44 34C44 42 36.5 48 32 48C27.5 48 20 42 20 34C20 22 32 14 32 14Z" fill="url(#leafGrad)" opacity="0.95" />
          <path d="M32 18V44M32 26L39 21M32 32L24 28M32 38L38 35" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

          <defs>
            <linearGradient id="leafGrad" x1="20" y1="14" x2="44" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4ADE80" />
              <stop offset="1" stopColor="#15803D" />
            </linearGradient>
          </defs>
        </svg>

        {/* Small Rx / Medicine pulse dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
        </span>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-extrabold tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}
            style={{ fontSize: titleSize, lineHeight: 1.1 }}
          >
            Far<span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>ma</span>
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full ${
            isDark 
              ? 'bg-amber-400 text-slate-950 shadow-sm' 
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            Rx Nature
          </span>
        </div>

        {showTagline && (
          <span className={`text-[11px] font-semibold tracking-wide flex items-center gap-1 mt-0.5 ${
            isDark ? 'text-emerald-200' : 'text-emerald-800'
          }`}>
            <svg className={`w-3.5 h-3.5 inline ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Farm products are like medicines
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
