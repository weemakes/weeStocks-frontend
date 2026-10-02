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
  { id: 'all', label: 'All Stocks' },
  { id: 'bluechips', label: 'Blue Chips' },
  { id: 'gainers', label: 'Top Gainers' },
  { id: 'losers', label: 'Dip Opportunities' },
  { id: 'most_active', label: 'Most Active' },
  { id: 'near_52w_high', label: 'Near 52W High' },
  { id: 'undervalued_growth', label: 'Undervalued PE < 20' },
  { id: 'high_dividend', label: 'High Dividend > 3%' },
  { id: 'halal_only', label: '100% Halal' },
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
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 mb-6 shadow-sm space-y-4 transition-colors">
      {/* Row 1: Search + Filters Dropdowns + View Mode Switcher */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={`Search ${country} equities by ticker, name or sector...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-14 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between lg:justify-end">
          {/* Sector Dropdown */}
          <select
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
            aria-label="Filter by Sector"
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="All">All Sectors</option>
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>

          {/* Market Tier Dropdown */}
          <select
            value={selectedMarketTier}
            onChange={(e) => onMarketTierChange(e.target.value)}
            aria-label="Filter by Market Tier"
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="All">All Tiers</option>
            {marketTiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.label}
              </option>
            ))}
          </select>

          {/* Shariah Status Dropdown */}
          <select
            value={selectedHalalStatus}
            onChange={(e) => onHalalStatusChange(e.target.value as any)}
            aria-label="Filter by Shariah Status"
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="ALL">All Compliance</option>
            <option value="HALAL">100% Halal</option>
            <option value="DOUBTFUL">Under Review</option>
            <option value="NON_HALAL">Non-Compliant</option>
          </select>

          {/* Sort Option & Direction */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 overflow-hidden">
            <select
              value={sortField}
              onChange={(e) => onSortChange(e.target.value, sortOrder)}
              aria-label="Sort By Field"
              className="px-2.5 py-2 bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none border-r border-slate-200 dark:border-slate-800"
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
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              title="Reset all filters to default"
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* View Mode Switcher: Table / Cards */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table View (Institutional)"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-sky-600 text-white shadow-xs'
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

      {/* Row 2: Dynamic Screener Presets (StockeZee-Style) + Count */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-500" />
            Presets:
          </span>
          {presets.map((tab) => {
            const isActive = activePreset === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectPreset(isActive && tab.id !== 'all' ? 'all' : tab.id)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/40 shadow-xs font-bold'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
                title={tab.description || tab.label}
              >
                {isActive && <Check className="w-3 h-3 text-sky-500" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Counter Badge */}
        <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium hidden md:block">
          {isLoading ? (
            <span className="animate-pulse">Loading {country} data...</span>
          ) : (
            <span>
              Showing <strong className="text-slate-900 dark:text-slate-100 font-bold">{totalFilteredCount}</strong> stocks
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
