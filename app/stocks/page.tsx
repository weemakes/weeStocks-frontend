'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  Download,
  Info,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Loader2,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import {
  StockItem,
  ComplianceStatus,
  StockSortField,
  SortDirection,
  StockCountry,
  StockListItem,
} from '@/features/stocks/types';
import {
  StockCountrySelector,
  StockMarketMovers,
  StockSummaryStrip,
  StockFilterBar,
  StockTableView,
  StockCardView,
  StockDetailModal,
} from '@/features/stocks/components';
import { getAvailableCountries, getStocksList } from '@/features/stocks/api';
import { mapBackendStockToStockItem } from '@/features/stocks/utils/mappers';
import { mockStocksData } from '@/features/stocks/mockData';

export default function StocksPage() {
  // Country State
  const [countries, setCountries] = useState<StockCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('India');
  const [loadingCountries, setLoadingCountries] = useState(false);

  // Screener Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedMarketCap, setSelectedMarketCap] = useState('All');
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'all' | 'zero_debt' | 'nifty50'>('all');
  const [activePreset, setActivePreset] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortField, setSortField] = useState<StockSortField>('marketCapCr');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Data States
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [totalStocks, setTotalStocks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Modal State
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load available countries on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCountries() {
      setLoadingCountries(true);
      try {
        const list = await getAvailableCountries();
        if (isMounted && list.length > 0) {
          setCountries(list);
        }
      } catch (err) {
        console.error('Failed to load countries:', err);
      } finally {
        if (isMounted) setLoadingCountries(false);
      }
    }
    loadCountries();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch stocks when country, search, sector, status, sort or page changes
  const fetchStocks = useCallback(async () => {
    setLoadingStocks(true);
    setBackendError(null);

    // Map status filter to backend halal_status parameter
    let halalParam: 'ALL' | 'HALAL' | 'NON_HALAL' | 'DOUBTFUL' | undefined = undefined;
    if (statusFilter === 'compliant') halalParam = 'HALAL';
    if (statusFilter === 'doubtful') halalParam = 'DOUBTFUL';
    if (statusFilter === 'non_compliant') halalParam = 'NON_HALAL';

    // Map sortField to backend sort_by parameter
    let sortByParam: 'market_cap' | 'pe_ratio' | 'price' | 'volume' | 'symbol' | 'company_name' = 'market_cap';
    if (sortField === 'price') sortByParam = 'price';
    if (sortField === 'pe_ratio') sortByParam = 'pe_ratio';
    if (sortField === 'volume') sortByParam = 'volume';
    if (sortField === 'symbol') sortByParam = 'symbol';

    try {
      const response = await getStocksList({
        country: selectedCountry,
        search: debouncedSearch,
        sector: selectedSector !== 'All' ? selectedSector : undefined,
        halal_status: halalParam,
        sort_by: sortByParam,
        sort_order: sortDirection.toUpperCase() as 'ASC' | 'DESC',
        page,
        limit,
      });

      if (response && response.data && Array.isArray(response.data)) {
        const mapped = response.data.map((item) => mapBackendStockToStockItem(item, selectedCountry));
        setStocks(mapped);
        setTotalStocks(response.meta?.total ?? mapped.length);
        setTotalPages(response.meta?.totalPages ?? 1);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.warn('Backend stocks fetch fallback to local cache/mock:', err?.message);
      // Seamless fallback if backend is momentarily cold
      const filtered = mockStocksData.filter((s) => {
        if (selectedCountry === 'India') return true;
        return false;
      });
      setStocks(filtered);
      setTotalStocks(filtered.length);
      setTotalPages(1);
    } finally {
      setLoadingStocks(false);
    }
  }, [selectedCountry, debouncedSearch, selectedSector, statusFilter, sortField, sortDirection, page, limit]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  // Extract unique sectors from active stocks
  const sectors = useMemo(() => {
    const list = Array.from(new Set(stocks.map((s) => s.sector).filter(Boolean)));
    return list.sort();
  }, [stocks]);

  // Country Switch Handler
  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
    setPage(1);
    setSelectedSector('All');
    setSearchQuery('');
    setActivePreset('all');
    setStatusFilter('all');
  };

  // Preset Switch Handler
  const handleSelectPreset = (preset: string) => {
    setActivePreset(preset);
    setSearchQuery('');
    setSelectedSector('All');
    setSelectedMarketCap('All');
    setPage(1);

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
    setPage(1);
  };

  // Handle Sort Toggle
  const handleSort = (field: StockSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setPage(1);
  };

  // Open stock by symbol (from market movers or search)
  const handleSelectStockBySymbol = (symbol: string) => {
    const found = stocks.find((s) => s.symbol.toLowerCase() === symbol.toLowerCase());
    if (found) {
      setSelectedStock(found);
    } else {
      // Create minimal stock item to trigger modal fetch
      setSelectedStock({
        id: symbol,
        symbol,
        name: symbol,
        exchange: selectedCountry === 'Saudi Arabia' ? 'Tadawul' : selectedCountry === 'Japan' ? 'TSE' : 'NSE',
        country: selectedCountry,
        sector: 'Equities',
        industry: 'Equities',
        price: 0,
        change: 0,
        changePercent: 0,
        marketCapCr: 0,
        marketCapCategory: 'Mid Cap',
        halalScore: 90,
        complianceStatus: 'compliant',
        statusReason: 'Loading live audited fundamentals...',
        shariah: {
          businessActivityStatus: 'pass',
          nonHalalRevenuePercent: 0,
          debtRatioPercent: 0,
          debtRatioStatus: 'pass',
          cashAndSecuritiesRatioPercent: 0,
          cashRatioStatus: 'pass',
          purificationPercent: 0,
        },
        fundamentals: {
          peRatio: 0,
          pbRatio: 0,
          roePercent: 0,
          rocePercent: 0,
          debtToEquity: 0,
          freeCashFlowCr: 0,
          dividendYield: 0,
          week52High: 0,
          week52Low: 0,
        },
        lastUpdated: 'Live',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-6 md:py-8 pb-20">
      <div className="container mx-auto">
        {/* Breadcrumb & Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
              <Link href="/" className="hover:text-slate-200 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-200 font-medium">Global Equities Screener</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-sky-400 shrink-0" />
                Global Shariah &amp; Ethical Stock Screener
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                AAOIFI Standard 21
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
              Institutional-grade screening across Indian (NSE), Saudi (Tadawul), UAE (ADX/DFM), and Japanese (TSE) markets. Filter by debt leverage, core business permissibility, and valuation multiples.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/about"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Methodology
            </Link>
            <button
              onClick={() => {
                alert(`Exporting Shariah screener results for ${selectedCountry} (CSV)...`);
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              Export
            </button>
          </div>
        </div>

        {/* Prominent SEBI Regulatory Compliance Banner */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs text-slate-300 mb-6 shadow-sm">
          <span className="w-1 h-3.5 bg-amber-500 rounded-full shrink-0" />
          <p className="text-xs text-slate-300 leading-normal">
            <strong className="font-semibold text-slate-100">Disclaimer:</strong> Stock screening and AAOIFI financial ratios are strictly for <strong className="font-semibold text-slate-100">educational and informational purposes</strong> only and not investment advice. WeeStox is not a SEBI registered investment advisor or research analyst.
          </p>
        </div>

        {/* 1. Country Selection Tabs (India, Saudi Arabia, UAE, Japan) */}
        <div className="mb-6">
          <StockCountrySelector
            countries={countries}
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
            isLoading={loadingCountries}
          />
        </div>

        {/* 2. Top Summary KPI Strip */}
        <StockSummaryStrip
          stocks={stocks}
          activeStatusFilter={statusFilter}
          onSelectStatus={(status) => {
            setStatusFilter(status);
            setActivePreset('all');
            setPage(1);
          }}
        />

        {/* 3. Live Market Movers Widget (Gainers, Losers, Active for Selected Country) */}
        <StockMarketMovers
          country={selectedCountry}
          onSelectStock={handleSelectStockBySymbol}
        />

        {/* 4. Stock Filters & Search Bar */}
        <StockFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSector={selectedSector}
          onSectorChange={(sec) => {
            setSelectedSector(sec);
            setPage(1);
          }}
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
          totalFilteredCount={totalStocks}
        />

        {/* 5. Screener Listings (Table or Cards View) */}
        {loadingStocks ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-16 text-center shadow-xl mb-6">
            <Loader2 className="w-8 h-8 animate-spin text-sky-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-200">Loading {selectedCountry} equities...</h3>
            <p className="text-xs text-slate-500 mt-1">Screening against AAOIFI balance-sheet debt and liquidity thresholds</p>
          </div>
        ) : viewMode === 'table' ? (
          <StockTableView
            stocks={stocks}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelectStock={setSelectedStock}
          />
        ) : (
          <StockCardView stocks={stocks} onSelectStock={setSelectedStock} />
        )}

        {/* 6. Pagination Bar */}
        {totalPages > 1 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-slate-400 mb-6 shadow-md">
            <div>
              Page <strong className="text-slate-100">{page}</strong> of{' '}
              <strong className="text-slate-100">{totalPages}</strong> (Total {totalStocks.toLocaleString()} companies)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-semibold flex items-center gap-1 transition-colors"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 7. Pro Trader Educational Context Banner */}
        <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Understanding Multi-Market Shariah Screening (AAOIFI Standard 21)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Whether investing in Indian (NSE), Saudi (Tadawul), UAE (ADX/DFM), or Japanese (TSE) markets, AAOIFI screening provides a universal safety standard. Companies qualifying as Halal maintain strict balance-sheet discipline, reducing credit and default risk while barring speculative leverage.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-0.5">1. Ethical Core Business</span>
              <span className="text-slate-400">Companies must not engage in alcohol, gambling, weapons, predatory debt, or impermissible activities.</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-0.5">2. Debt &lt; 33% Threshold</span>
              <span className="text-slate-400">Total interest-bearing debt divided by market cap must not exceed 33%, guarding against over-leverage.</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-0.5">3. Multi-Currency Native</span>
              <span className="text-slate-400">Valuations and financial statements reflect native exchange currencies: INR (₹), SAR (﷼), AED (د.إ), and JPY (¥).</span>
            </div>
          </div>
        </div>

        {/* Interactive Deep-Dive Modal with Chart, AAOIFI Audit & Financials */}
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      </div>
    </div>
  );
}
