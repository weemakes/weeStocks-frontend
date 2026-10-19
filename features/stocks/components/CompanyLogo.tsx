import React, { useState } from 'react';

interface CompanyLogoProps {
  src?: string | null;
  symbol: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function CompanyLogo({
  src,
  symbol,
  name,
  size = 'md',
  className = '',
}: CompanyLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px] rounded-lg',
    md: 'w-8 h-8 text-xs rounded-lg',
    lg: 'w-10 h-10 text-sm rounded-xl',
    xl: 'w-14 h-14 text-xl rounded-2xl',
  }[size];

  const initials = (symbol || 'ST').slice(0, 2).toUpperCase();

  const dimension = size === 'sm' ? 28 : size === 'md' ? 32 : size === 'lg' ? 40 : 56;

  // If valid src and hasn't errored out
  if (src && failedSrc !== src) {
    return (
      <div
        className={`relative ${sizeClasses} shrink-0 overflow-hidden flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-all ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name || symbol}
          width={dimension}
          height={dimension}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      </div>
    );
  }

  // Fallback Initials Avatar with clean styling
  return (
    <div
      className={`${sizeClasses} bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 group-hover:border-sky-500/50 group-hover:shadow-2xs transition-all shrink-0 select-none ${className}`}
      title={name || symbol}
    >
      {initials}
    </div>
  );
}
