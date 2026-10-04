'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  LayoutGrid,
  Table,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Flame,
  ArrowUpDown,
  Filter,
  Check,
  ChevronDown,
  Layers,
  BarChart2,
  X,
} from 'lucide-react';
import { StockFiltersConfig, StockFilterPreset, StockSortOption, StockMarketTier } from '../types';
import { getFiltersConfig } from '../api';

interface StockFilterBarProps {
  country: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedSector: string;
  onSectorChange: (val: string) => void;
  selectedMarketTier: string;
  onMarketTierChange: (val: string) => void;
  selectedHalalStatus: 'ALL' | 'HALAL' | 'NON_HALAL' | 'DOUBTFUL';
  onHalalStatusChange: (val: 'ALL' | 'HALAL' | 'NON_HALAL' | 'DOUBTFUL') => void;
  sortField: string;
  sortOrder: 'ASC' | 'DESC';
  onSortChange: (field: string, order?: 'ASC' | 'DESC') => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  activePreset: string;
  onSelectPreset: (preset: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  isLoading?: boolean;
}

const DEFAULT_PRESETS: StockFilterPreset[] = [
  { id: 'all', label: 'All Equities' },
  { id: 'halal_only', label: '100% Halal' },
  { id: 'bluechips', label: 'Blue Chips' },
  { id: 'gainers', label: 'Top Gainers' },
  { id: 'losers', label: 'Dip Opportunities' },
  { id: 'most_active', label: 'Most Active' },
  { id: 'near_52w_high', label: 'Near 52W High' },
  { id: 'undervalued_growth', label: 'Undervalued PE < 20' },
  { id: 'high_dividend', label: 'High Dividend > 3%' },
];

export default function StockFilterBar({
  country,
  searchQuery,
  onSearchChange,
  selectedSector,
  onSectorChange,
  selectedMarketTier,
  onMarketTierChange,
  selectedHalalStatus,
  onHalalStatusChange,
  sortField,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  activePreset,
  onSelectPreset,
  onResetFilters,
  totalFilteredCount,
  isLoading = false,
}: StockFilterBarProps) {
  const [config, setConfig] = useState<StockFiltersConfig | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadConfig() {
      try {
        const res = await getFiltersConfig(country);
        if (isMounted && res) {
          setConfig(res);
        }
      } catch (err) {
        console.error('Failed to load filter config for', country, err);
      }
    }
    loadConfig();
    return () => {
      isMounted = false;
    };
  }, [country]);

  const presets = config?.presets?.length ? config.presets : DEFAULT_PRESETS;
  const sectors = config?.sectors || [];
  const marketTiers = config?.market_tiers || [
    { id: 'MEGA_CAP', label: 'Mega Cap' },
    { id: 'LARGE_CAP', label: 'Large Cap' },
    { id: 'MID_CAP', label: 'Mid Cap' },
    { id: 'SMALL_CAP', label: 'Small Cap' },
  ];
  const sortOptions = config?.sort_options || [
    { id: 'market_cap', label: 'Market Cap' },
    { id: 'latest_price', label: 'Price' },
    { id: 'change_percentage', label: '% Change' },
    { id: 'volume', label: 'Volume' },
    { id: 'pe_ratio', label: 'P/E Ratio' },
  ];

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedSector !== 'All' ||
    selectedMarketTier !== 'All' ||
    selectedHalalStatus !== 'ALL' ||
    activePreset !== 'all';

  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
      {/* 1. Strategy Presets Ribbon (Top Strategy Switcher) */}
      <div className="px-3 py-1.5 bg-slate-50/75 dark:bg-slate-950/60 border-b border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1 flex-nowrap shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden sm:inline-flex items-center gap-1 mr-1">
            <Sparkles className="h-3 w-3 text-sky-500" />
            Screens:
          </span>
          {presets.map((tab) => {
            const isActive = activePreset === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectPreset(isActive && tab.id !== 'all' ? 'all' : tab.id)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold shadow-2xs ring-1 ring-sky-400/30'
                    : 'border border-slate-200/60 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
                title={tab.description || tab.label}
              >
                {isActive && <Check className="h-2.5 w-2.5 text-white" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Total Equities Count */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-medium hidden md:block">
          {isLoading ? (
            <span className="animate-pulse">Loading {country} data...</span>
          ) : (
            <span>
              Showing <strong className="font-bold text-slate-900 dark:text-slate-100">{totalFilteredCount.toLocaleString()}</strong> equities
            </span>
          )}
        </div>
      </div>

      {/* 2. Main Filter Controls: Unified Responsive Command Bar */}
      <div className="p-2 sm:p-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          {/* Search Input + Mobile View Mode */}
          <div className="flex items-center gap-2 flex-1 min-w-[180px] sm:min-w-[220px] lg:max-w-xs xl:max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder={`Search ${country} stocks, tickers...`}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 pl-8 pr-12 py-1.5 text-xs text-slate-900 placeholder-slate-400 transition-all focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500/20 dark:border-slate-800/80 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-950"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Mode Toggle: Table / Cards (Mobile & Tablet) */}
            <div className="flex lg:hidden items-center rounded-lg border border-slate-200/70 bg-slate-100 p-0.5 dark:border-slate-800/70 dark:bg-slate-950 shrink-0">
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Table View"
              >
                <Table className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('cards')}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Cards View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Dropdowns + Reset + Desktop View Toggle */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap items-center gap-1.5 shrink-0">
            {/* Sector Selector */}
            <div className="relative">
              <select
                value={selectedSector}
                onChange={(e) => onSectorChange(e.target.value)}
                aria-label="Filter by Sector"
                className="w-full sm:w-auto appearance-none rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 pr-6 text-xs font-medium text-slate-700 transition-colors focus:border-sky-500 focus:outline-none dark:border-slate-800/80 dark:bg-slate-950/70 dark:text-slate-300 cursor-pointer"
              >
                <option value="All">All Sectors</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Market Cap Tier */}
            <div className="relative">
              <select
                value={selectedMarketTier}
                onChange={(e) => onMarketTierChange(e.target.value)}
                aria-label="Filter by Market Tier"
                className="w-full sm:w-auto appearance-none rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 pr-6 text-xs font-medium text-slate-700 transition-colors focus:border-sky-500 focus:outline-none dark:border-slate-800/80 dark:bg-slate-950/70 dark:text-slate-300 cursor-pointer"
              >
                <option value="All">All Caps</option>
                {marketTiers.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Shariah Status */}
            <div className="relative">
              <select
                value={selectedHalalStatus}
                onChange={(e) => onHalalStatusChange(e.target.value as any)}
                aria-label="Filter by Shariah Status"
                className="w-full sm:w-auto appearance-none rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 pr-6 text-xs font-medium text-slate-700 transition-colors focus:border-sky-500 focus:outline-none dark:border-slate-800/80 dark:bg-slate-950/70 dark:text-slate-300 cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="HALAL">100% Halal</option>
                <option value="DOUBTFUL">Under Review</option>
                <option value="NON_HALAL">Non-Compliant</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Sort Option & Direction */}
            <div className="flex items-center rounded-lg border border-slate-200/80 bg-slate-50/80 overflow-hidden dark:border-slate-800/80 dark:bg-slate-950/70">
              <select
                value={sortField}
                onChange={(e) => onSortChange(e.target.value, sortOrder)}
                aria-label="Sort By Field"
                className="bg-transparent px-2 py-1.5 text-xs font-medium text-slate-700 focus:outline-none border-r border-slate-200/80 dark:border-slate-800/80 dark:text-slate-300 w-full cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => onSortChange(sortField, sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                title={`Sorting ${sortOrder === 'ASC' ? 'Ascending' : 'Descending'}. Click to toggle.`}
                className="p-1.5 text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors shrink-0 cursor-pointer"
              >
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                title="Reset all active filters"
                className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300 transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}

            {/* View Mode Toggle: Table / Cards (Desktop lg+) */}
            <div className="hidden lg:flex items-center rounded-lg border border-slate-200/70 bg-slate-100 p-0.5 dark:border-slate-800/70 dark:bg-slate-950 shrink-0 ml-1">
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Terminal Table View"
              >
                <Table className="h-3 w-3" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('cards')}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="h-3 w-3" />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
