'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, RotateCcw, Flame, ShieldCheck, ArrowUpDown } from 'lucide-react';
import { IPOQueryParams } from '@/features/ipo/types';

interface IPOFiltersProps {
  currentParams: IPOQueryParams;
  totalResults: number;
}

const PRESET_TABS = [
  { id: 'all', label: 'All IPOs', params: {} },
  { id: 'open', label: 'Open Now', params: { status: 'open' } },
  { id: 'upcoming', label: 'Upcoming', params: { status: 'upcoming' } },
  { id: 'mainboard', label: 'Mainboard', params: { category: 'mainboard' } },
  { id: 'sme', label: 'SME', params: { category: 'sme' } },
  { id: 'hot_gmp', label: 'High GMP 🔥', params: { sort: 'gmp_desc' } },
  { id: 'halal', label: 'Halal Screened 🛡️', params: { halal: 'true' } },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'gmp_desc', label: 'GMP: High to Low' },
  { value: 'gmp_asc', label: 'GMP: Low to High' },
  { value: 'sub_desc', label: 'Subscription: High to Low' },
  { value: 'rating_desc', label: 'Rating: High to Low' },
  { value: 'open_date_asc', label: 'Opening Soon' },
  { value: 'close_date_asc', label: 'Closing Soon' },
  { value: 'halal_desc', label: 'Halal First' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'mainboard', label: 'Mainboard' },
  { value: 'sme', label: 'SME' },
];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'closed', label: 'Closed' },
  { value: 'listed', label: 'Listed' },
];

export default function IPOFilters({ currentParams, totalResults }: IPOFiltersProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(currentParams.search || '');

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams();
    
    // Copy existing
    Object.entries(currentParams).forEach(([k, v]) => {
      if (k !== key && k !== 'page' && v && v !== 'all') {
        params.set(k, String(v));
      }
    });

    if (value && value !== 'all') {
      params.set(key, value);
    }

    router.push(`/ipo?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchQuery.trim());
  };

  const handlePresetSelect = (preset: typeof PRESET_TABS[number]) => {
    const params = new URLSearchParams();
    Object.entries(preset.params).forEach(([k, v]) => {
      if (v) params.set(k, String(v));
    });
    setSearchQuery('');
    router.push(`/ipo?${params.toString()}`);
  };

  const handleResetAll = () => {
    setSearchQuery('');
    router.push('/ipo');
  };

  const isPresetActive = (preset: typeof PRESET_TABS[number]) => {
    const pKeys = Object.keys(preset.params);
    if (pKeys.length === 0) {
      return (
        (!currentParams.status || currentParams.status === 'all') &&
        (!currentParams.category || currentParams.category === 'all') &&
        (!currentParams.halal || currentParams.halal === 'false') &&
        (!currentParams.sort || currentParams.sort === 'newest')
      );
    }
    return pKeys.every((k) => (currentParams as any)[k] === (preset.params as any)[k]);
  };

  const hasActiveFilters = Boolean(
    (currentParams.status && currentParams.status !== 'all') ||
    (currentParams.category && currentParams.category !== 'all') ||
    (currentParams.search) ||
    (currentParams.sort && currentParams.sort !== 'newest') ||
    (currentParams.halal === 'true')
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 md:p-4 mb-5 shadow-lg space-y-3">
      {/* Top Row: Search + Category + Status + Sort Dropdowns */}
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search IPO by company name (e.g. Injecto, Quanto, Jindal)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-14 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 rounded border border-sky-500/30 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between md:justify-end">
          {/* Category Dropdown */}
          <select
            value={currentParams.category || 'all'}
            onChange={(e) => updateParam('category', e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 focus:outline-none focus:border-sky-500"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={currentParams.status || 'all'}
            onChange={(e) => updateParam('status', e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 focus:outline-none focus:border-sky-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={currentParams.sort || 'newest'}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 focus:outline-none focus:border-sky-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetAll}
              title="Reset all filters"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: StockeZee-style Preset Tabs + Count */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Quick Views:
          </span>
          {PRESET_TABS.map((tab) => {
            const active = isPresetActive(tab);
            return (
              <button
                key={tab.id}
                onClick={() => handlePresetSelect(tab)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-xs font-semibold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400 shrink-0 font-medium tabular-nums pl-2">
          Total: <span className="text-slate-100 font-bold">{totalResults}</span> IPOs
        </div>
      </div>
    </div>
  );
}
