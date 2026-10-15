'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, RotateCcw, ShieldCheck, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { IPOQueryParams, IPOV2Summary } from '@/features/ipo/types';

interface IPOFiltersProps {
  currentParams: IPOQueryParams;
  totalResults: number;
  page?: number;
  totalPages?: number;
  limit?: number;
  summary?: IPOV2Summary;
}

export default function IPOFilters({
  currentParams,
  totalResults,
  page = 1,
  totalPages = 1,
  limit = 20,
  summary,
}: IPOFiltersProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(currentParams.search || '');

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams();

    // Copy existing params
    Object.entries(currentParams).forEach(([k, v]) => {
      if (k !== key && k !== 'page' && v && v !== 'all') {
        params.set(k, String(v));
      }
    });

    if (value && value !== 'all') {
      params.set(key, value);
    }

    const query = params.toString();
    router.push(`/ipo${query ? `?${query}` : ''}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchQuery.trim() || null);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    updateParam('search', null);
  };

  const handleResetAll = () => {
    setSearchQuery('');
    router.push('/ipo');
  };

  const isHalalActive = currentParams.halal === 'true';
  const isActiveGmpOnly = currentParams.active_gmp === 'true';
  const currentStatus = currentParams.status || 'all';
  const currentCategory = currentParams.category || 'all';

  const hasActiveFilters = Boolean(
    (currentParams.status && currentParams.status !== 'all') ||
    (currentParams.category && currentParams.category !== 'all') ||
    currentParams.search ||
    (currentParams.sort && currentParams.sort !== 'newest') ||
    isHalalActive ||
    isActiveGmpOnly
  );

  const startIdx = totalResults > 0 ? (page - 1) * limit + 1 : 0;
  const endIdx = Math.min(page * limit, totalResults);

  const statusTabs = [
    { id: 'all', label: 'All', count: summary?.total ?? totalResults },
    { id: 'open', label: 'Open', count: summary?.open },
    { id: 'upcoming', label: 'Upcoming', count: summary?.upcoming },
    { id: 'closed', label: 'Closed', count: summary?.closed },
    { id: 'listed', label: 'Listed', count: summary?.listed },
  ];

  const categoryTabs = [
    { id: 'all', label: 'All', count: null },
    { id: 'mainboard', label: 'Mainboard', count: summary?.mainboard },
    { id: 'sme', label: 'SME', count: summary?.sme },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 mb-4 shadow-xs">
      {/* 1. Status Tabs Row (StockeZee-style) */}
      <div className="overflow-x-auto no-scrollbar mb-3">
        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          {statusTabs.map((tab) => {
            const active = currentStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => updateParam('status', tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                  active
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums ${
                      active
                        ? 'bg-white/20 text-white'
                        : tab.id === 'open' && tab.count > 0
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Category Tabs + Active GMP + Halal Row (StockeZee-style) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Tabs */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            {categoryTabs.map((tab) => {
              const active = currentCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => updateParam('category', tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active GMP Checkbox */}
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none transition-colors">
            <input
              type="checkbox"
              checked={isActiveGmpOnly}
              onChange={(e) => updateParam('active_gmp', e.target.checked ? 'true' : null)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer accent-emerald-600"
            />
            <span className="whitespace-nowrap">Active GMP</span>
          </label>

          {/* Halal Screened Toggle Button */}
          <button
            type="button"
            onClick={() => updateParam('halal', isHalalActive ? null : 'true')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all whitespace-nowrap ${
              isHalalActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-2xs'
                : 'bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isHalalActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
            <span>Halal Screened</span>
          </button>
        </div>

        {/* Reset Filters Icon */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetAll}
            title="Reset all filters"
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* 3. Search Box & Pagination Row (StockeZee-style) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
        {/* Search Box */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search IPO by name or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* 1-10 of 50 + Clean Rounded Arrow Buttons (StockeZee-style) */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium tabular-nums">
          <span>
            <strong className="text-slate-900 dark:text-slate-100">{startIdx}–{endIdx}</strong> of{' '}
            <strong className="text-slate-900 dark:text-slate-100">{totalResults}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => updateParam('page', page > 1 ? String(page - 1) : null)}
              disabled={page <= 1}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-2xs"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => updateParam('page', page < totalPages ? String(page + 1) : null)}
              disabled={page >= totalPages}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-2xs"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
