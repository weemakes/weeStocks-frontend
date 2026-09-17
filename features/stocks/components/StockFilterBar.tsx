'use client';

import React from 'react';
import { Search, LayoutGrid, Table, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { StockSortField, SortDirection } from '../types';

interface StockFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedSector: string;
  onSectorChange: (val: string) => void;
  selectedMarketCap: string;
  onMarketCapChange: (val: string) => void;
  sectors: string[];
  sortField: StockSortField;
  sortDirection: SortDirection;
  onSortChange: (field: StockSortField) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  activePreset: string;
  onSelectPreset: (preset: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  isLoading?: boolean;
}

const PRESET_TABS = [
  { id: 'all', label: 'All Stocks' },
  { id: 'nifty50_halal', label: 'Nifty 50 Halal' },
  { id: 'zero_debt', label: 'Zero Debt' },
  { id: 'tech', label: 'Tech & IT' },
  { id: 'pharma', label: 'Pharma & Health' },
  { id: 'high_purity', label: '95%+ Halal Score' },
];

export default function StockFilterBar({
  searchQuery,
  onSearchChange,
  selectedSector,
  onSectorChange,
  selectedMarketCap,
  onMarketCapChange,
  sectors,
  sortField,
  sortDirection,
  onSortChange,
  viewMode,
  onViewModeChange,
  activePreset,
  onSelectPreset,
  onResetFilters,
  totalFilteredCount,
  isLoading = false,
}: StockFilterBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3 md:p-4 mb-5 shadow-sm space-y-3.5 transition-colors">
      {/* Top Row: Search + Sort Dropdown + View Mode Switcher */}
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        {/* Search Input with Shortcut badge */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by company name, ticker (e.g., TCS, INFY, TITAN) or sector..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-14 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between md:justify-end">
          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Sectors</option>
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>

          {/* Market Cap Filter */}
          <select
            value={selectedMarketCap}
            onChange={(e) => onMarketCapChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Market Caps</option>
            <option value="Large Cap">Large Cap (&gt;₹20k Cr)</option>
            <option value="Mid Cap">Mid Cap</option>
            <option value="Small Cap">Small Cap</option>
          </select>

          {/* Reset Filters */}
          {(searchQuery || selectedSector !== 'All' || selectedMarketCap !== 'All' || activePreset !== 'all') && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* View Mode Toggle: Table / Cards */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table View (Institutional)"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Presets (StockeZee-style tabs) + Result Count */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Quick Views:
          </span>
          {PRESET_TABS.map((tab) => {
            const isActive = activePreset === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectPreset(tab.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/40 shadow-xs font-semibold'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium tabular-nums pl-2">
          {isLoading ? (
            <span className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              Screening equities...
            </span>
          ) : (
            <>
              Showing <span className="text-slate-900 dark:text-slate-100 font-bold">{totalFilteredCount}</span> results
            </>
          )}
        </div>
      </div>
    </div>
  );
}
