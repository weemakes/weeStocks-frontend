'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  Download,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { mockStocksData } from '@/features/stocks/mockData';
import { StockItem, ComplianceStatus, StockSortField, SortDirection } from '@/features/stocks/types';
import StockSummaryStrip from '@/features/stocks/components/StockSummaryStrip';
import StockFilterBar from '@/features/stocks/components/StockFilterBar';
import StockTableView from '@/features/stocks/components/StockTableView';
import StockCardView from '@/features/stocks/components/StockCardView';
import StockDetailModal from '@/features/stocks/components/StockDetailModal';

export default function StocksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedMarketCap, setSelectedMarketCap] = useState('All');
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'all' | 'zero_debt' | 'nifty50'>('all');
  const [activePreset, setActivePreset] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortField, setSortField] = useState<StockSortField>('marketCapCr');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  // Extract unique sectors
  const sectors = useMemo(() => {
    const list = Array.from(new Set(mockStocksData.map((s) => s.sector)));
    return list.sort();
  }, []);

  // Handle preset clicks
  const handleSelectPreset = (preset: string) => {
    setActivePreset(preset);
    setSearchQuery('');
    setSelectedSector('All');
    setSelectedMarketCap('All');

    if (preset === 'all') {
      setStatusFilter('all');
    } else if (preset === 'nifty50_halal') {
      setStatusFilter('compliant');
    } else if (preset === 'zero_debt') {
      setStatusFilter('zero_debt');
    } else if (preset === 'tech') {
      setSelectedSector('Information Technology');
      setStatusFilter('compliant');
    } else if (preset === 'pharma') {
      setSelectedSector('Healthcare & Pharma');
      setStatusFilter('compliant');
    } else if (preset === 'high_purity') {
      setStatusFilter('compliant');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All');
    setSelectedMarketCap('All');
    setStatusFilter('all');
    setActivePreset('all');
  };

  // Handle Sort
  const handleSort = (field: StockSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filtered & Sorted Stocks
  const filteredStocks = useMemo(() => {
    let result = [...mockStocksData];

    // Status filter
    if (statusFilter === 'compliant') {
      result = result.filter((s) => s.complianceStatus === 'compliant');
    } else if (statusFilter === 'doubtful') {
      result = result.filter((s) => s.complianceStatus === 'doubtful');
    } else if (statusFilter === 'non_compliant') {
      result = result.filter((s) => s.complianceStatus === 'non_compliant');
    } else if (statusFilter === 'zero_debt') {
      result = result.filter((s) => s.shariah.debtRatioPercent === 0);
    } else if (statusFilter === 'nifty50') {
      result = result.filter((s) => s.isNifty50 && s.complianceStatus === 'compliant');
    }

    // Preset specifics
    if (activePreset === 'nifty50_halal') {
      result = result.filter((s) => s.isNifty50 && s.complianceStatus === 'compliant');
    } else if (activePreset === 'high_purity') {
      result = result.filter((s) => s.halalScore >= 95);
    }

    // Sector filter
    if (selectedSector !== 'All') {
      result = result.filter((s) => s.sector === selectedSector);
    }

    // Market cap filter
    if (selectedMarketCap !== 'All') {
      result = result.filter((s) => s.marketCapCategory === selectedMarketCap);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = 0;
      let bVal = 0;

      switch (sortField) {
        case 'symbol':
          return sortDirection === 'asc'
            ? a.symbol.localeCompare(b.symbol)
            : b.symbol.localeCompare(a.symbol);
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'changePercent':
          aVal = a.changePercent;
          bVal = b.changePercent;
          break;
        case 'marketCapCr':
          aVal = a.marketCapCr;
          bVal = b.marketCapCr;
          break;
        case 'halalScore':
          aVal = a.halalScore;
          bVal = b.halalScore;
          break;
        case 'debtRatio':
          aVal = a.shariah.debtRatioPercent;
          bVal = b.shariah.debtRatioPercent;
          break;
        case 'purification':
          aVal = a.shariah.purificationPercent;
          bVal = b.shariah.purificationPercent;
          break;
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [
    mockStocksData,
    statusFilter,
    activePreset,
    selectedSector,
    selectedMarketCap,
    searchQuery,
    sortField,
    sortDirection,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 py-6 md:py-8 pb-20">
      <div className="container mx-auto">
        {/* Breadcrumb & Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
              <Link href="/" className="hover:text-slate-200 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-200 font-medium">Equities Screener</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                Shariah & Ethical Stock Screener
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                AAOIFI Standard 21
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Screen Indian NSE/BSE equities for Shariah compliance, low balance sheet leverage, and fundamental quality.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/about"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Methodology
            </Link>
            <button
              onClick={() => alert('Screening criteria exported (CSV)')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              Export
            </button>
          </div>
        </div>

        {/* 1. Summary Strip (Matching IPO summary cards format) */}
        <StockSummaryStrip
          stocks={mockStocksData}
          activeStatusFilter={statusFilter}
          onSelectStatus={(status) => {
            setStatusFilter(status);
            setActivePreset('all');
          }}
        />

        {/* 2. Stock Filter Bar (Search, Presets, View Toggle) */}
        <StockFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSector={selectedSector}
          onSectorChange={setSelectedSector}
          selectedMarketCap={selectedMarketCap}
          onMarketCapChange={setSelectedMarketCap}
          sectors={sectors}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activePreset={activePreset}
          onSelectPreset={handleSelectPreset}
          onResetFilters={handleResetFilters}
          totalFilteredCount={filteredStocks.length}
        />

        {/* 3. Data View (Table or Cards) */}
        {viewMode === 'table' ? (
          <StockTableView
            stocks={filteredStocks}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelectStock={setSelectedStock}
          />
        ) : (
          <StockCardView stocks={filteredStocks} onSelectStock={setSelectedStock} />
        )}

        {/* 4. Investor Educational Context Banner (For All Investors) */}
        <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Why Shariah Screening Protects All Investors (Ethical & Fundamental Quality)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Shariah stock screening is not merely a religious filter — it is one of the world's most rigorous balance-sheet quality filters. Companies that qualify must maintain total interest debt below 33% of market cap and have genuine, transparent revenue models. For both Muslim investors and value investors, this drastically reduces bankruptcy risk, speculative leverage, and corporate governance failures.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-0.5">1. Zero Deceptive Business</span>
              <span className="text-slate-400">Core revenues from alcohol, gambling, tobacco, and predatory lending are strictly filtered out.</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-0.5">2. Extreme Leverage Safety</span>
              <span className="text-slate-400">Debt-to-market-cap must stay below 33%, ensuring safe capital structures in high-interest environments.</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-0.5">3. Dividend Purification</span>
              <span className="text-slate-400">Precise calculation of incidental interest income so you know the exact percentage to cleanse for charity.</span>
            </div>
          </div>
        </div>

        {/* Interactive Deep-Dive Modal */}
        <StockDetailModal stock={selectedStock} onClose={() => setSelectedStock(null)} />
      </div>
    </div>
  );
}
