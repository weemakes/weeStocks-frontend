'use client';

import React from 'react';
import { StockCountry } from '../types';

interface StockCountrySelectorProps {
  countries: StockCountry[];
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  isLoading?: boolean;
}

export default function StockCountrySelector({
  countries,
  selectedCountry,
  onSelectCountry,
  isLoading = false,
}: StockCountrySelectorProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth p-0.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
      {countries.map((c) => {
        const isSelected = c.country.toLowerCase() === selectedCountry.toLowerCase();
        return (
          <button
            key={c.code}
            type="button"
            onClick={() => onSelectCountry(c.country)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isSelected
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-2xs font-bold ring-1 ring-sky-500/20'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span className="text-xs shrink-0">{c.flag}</span>
            <span>{c.country}</span>
            <span
              className={`rounded px-1.5 py-0.2 font-mono text-[10px] ${
                isSelected
                  ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold'
                  : 'bg-slate-200/70 text-slate-600 dark:bg-slate-850 dark:text-slate-400'
              }`}
            >
              {c.total_companies ? c.total_companies.toLocaleString() : c.exchange}
            </span>
          </button>
        );
      })}
    </div>
  );
}
