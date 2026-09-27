'use client';

import React, { useState } from 'react';

interface IpoCompanyLogoProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function IpoCompanyLogo({
  src,
  name,
  size = 'md',
  className = '',
}: IpoCompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px] rounded-lg',
    md: 'w-8 h-8 text-xs rounded-lg',
    lg: 'w-12 h-12 text-base rounded-xl',
    xl: 'w-16 h-16 text-2xl rounded-2xl',
  }[size];

  const initials = (name || 'IP').slice(0, 2).toUpperCase();

  if (src && !hasError) {
    return (
      <div
        className={`relative ${sizeClasses} shrink-0 overflow-hidden flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-0.5 shadow-2xs transition-all ${className}`}
      >
        <img
          src={src}
          alt={name}
          width={size === 'sm' ? 28 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
          height={size === 'sm' ? 28 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center font-bold text-xs text-sky-600 dark:text-sky-400 group-hover:border-sky-500/50 transition-all shrink-0 select-none ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}

export default IpoCompanyLogo;
