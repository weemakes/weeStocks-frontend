'use client';

import React from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
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
  const current = countries.find((c) => c.country.toLowerCase() === selectedCountry.toLowerCase()) || countries[0];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm transition-colors">
      {/* Title & Active Country Header */}
      <div className="flex items-center gap-2.5 px-2">
        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-base shrink-0 shadow-inner">
          {current?.flag || '🌍'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200 tracking-wide">
              {current?.country || 'India'}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
              {current?.exchange || 'NSE'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {current?.total_companies ? `${current.total_companies.toLocaleString()} Listed Entities` : 'Global Market'} • Currency:{' '}
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">{current?.currency || 'INR'} ({current?.currency_symbol || '₹'})</strong>
          </p>
        </div>
      </div>

      {/* Country Selection Tabs (Desktop & Tablet) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl">
        {countries.map((c) => {
          const isSelected = c.country.toLowerCase() === selectedCountry.toLowerCase();
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelectCountry(c.country)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 ring-1 ring-sky-400/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/80'
              }`}
            >
              <span className="text-sm shrink-0">{c.flag}</span>
              <span>{c.country}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                  isSelected ? 'bg-sky-600/70 text-sky-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {c.total_companies ? `${c.total_companies} Stocks` : c.exchange}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
