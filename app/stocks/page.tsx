'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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
  StockCountry,
  StockListItem,
} from '@/features/stocks/types';
import {
  StockCountrySelector,
  StockMarketOverview,
  StockMarketMovers,
  StockFilterBar,
  StockTableView,
  StockCardView,
  StockDetailModal,
} from '@/features/stocks/components';
import { getAvailableCountries, getStocksList } from '@/features/stocks/api';
import { mapBackendStockToStockItem } from '@/features/stocks/utils/mappers';
import { mockStocksData } from '@/features/stocks/mockData';

function StocksPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Country State
  const [countries, setCountries] = useState<StockCountry[]>([]);
  const countryFromUrl = searchParams.get('country');
  const [selectedCountry, setSelectedCountry] = useState<string>(countryFromUrl || 'India');
  const [loadingCountries, setLoadingCountries] = useState(false);

  // Screener Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedMarketTier, setSelectedMarketTier] = useState('All');
  const [selectedHalalStatus, setSelectedHalalStatus] = useState<'ALL' | 'HALAL' | 'NON_HALAL' | 'DOUBTFUL'>('ALL');
  const [activePreset, setActivePreset] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortField, setSortField] = useState<string>('market_cap');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
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

  // Sync country from URL if changed
  useEffect(() => {
    if (countryFromUrl && countryFromUrl !== selectedCountry) {
      setSelectedCountry(countryFromUrl);
    }
  }, [countryFromUrl]);

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
          // If no URL country provided, default to India or first active country
          if (!countryFromUrl) {
            const hasIndia = list.find((c) => c.code === 'IN' || c.country.toLowerCase() === 'india');
            if (hasIndia) {
              setSelectedCountry(hasIndia.country);
            } else if (list.length > 0) {
              setSelectedCountry(list[0].country);
            }
          }
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

  // Fetch stocks when country, search, sector, tier, halalStatus, preset, sort or page changes
  const fetchStocks = useCallback(async () => {
    setLoadingStocks(true);
    setBackendError(null);

    try {
      const response = await getStocksList({
        country: selectedCountry,
        search: debouncedSearch,
        q: debouncedSearch,
        sector: selectedSector !== 'All' ? selectedSector : undefined,
        preset: activePreset !== 'all' ? activePreset : undefined,
        halal_status: selectedHalalStatus !== 'ALL' ? selectedHalalStatus : undefined,
        sort_by: sortField,
        sort_order: sortOrder,
        page,
        limit,
      });

      if (response && response.data && Array.isArray(response.data)) {
        let mapped = response.data.map((item) => mapBackendStockToStockItem(item, selectedCountry));

        // Client-side tier filter if specified and backend returns it
        if (selectedMarketTier !== 'All') {
          mapped = mapped.filter((s) => s.trader_indicators?.market_tier === selectedMarketTier);
        }

        setStocks(mapped);
        setTotalStocks(response.meta?.total ?? mapped.length);
        setTotalPages(response.meta?.totalPages ?? Math.max(1, Math.ceil((response.meta?.total ?? mapped.length) / limit)));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.warn('Backend stocks fetch fallback to local cache/mock:', err?.message);
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
  }, [
    selectedCountry,
    debouncedSearch,
    selectedSector,
    selectedMarketTier,
    selectedHalalStatus,
    activePreset,
    sortField,
    sortOrder,
    page,
    limit,
  ]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  // Country Switch Handler
  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
    setPage(1);
    setSelectedSector('All');
    setSelectedMarketTier('All');
    setSelectedHalalStatus('ALL');
    setSearchQuery('');
    setActivePreset('all');
  };

  // Preset Switch Handler
  const handleSelectPreset = (preset: string) => {
    setActivePreset(preset);
    setPage(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All');
    setSelectedMarketTier('All');
    setSelectedHalalStatus('ALL');
    setActivePreset('all');
    setPage(1);
  };

  // Handle Sort Change
  const handleSort = (field: string, order?: 'ASC' | 'DESC') => {
    if (order) {
      setSortOrder(order);
      setSortField(field);
    } else if (sortField === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('DESC');
    }
    setPage(1);
  };

  // Navigate to dedicated analysis page (StockeZee / TradingView style)
  const handleSelectStock = (stock: StockItem) => {
    router.push(`/stocks/${encodeURIComponent(stock.symbol)}?country=${encodeURIComponent(selectedCountry)}`);
  };

  const handleSelectStockBySymbol = (symbol: string) => {
    router.push(`/stocks/${encodeURIComponent(symbol)}?country=${encodeURIComponent(selectedCountry)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 md:py-8 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
              <span className="text-slate-800 dark:text-slate-200 font-medium">Global Equities Screener</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-sky-600 dark:text-sky-400 shrink-0" />
                Global Shariah &amp; Ethical Stock Screener
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                AAOIFI Standard 21
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Institutional-grade screening across Saudi Arabia (Tadawul), India (NSE), UAE (ADX/DFM), and Japan (TSE) markets. Filter by debt leverage, core business permissibility, and quantitative multiples.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/about"
              className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Methodology
            </Link>
            <button
              type="button"
              onClick={() => {
                alert(`Exporting ${selectedCountry} screener data (${totalStocks} stocks) to CSV...`);
              }}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Export
            </button>
          </div>
        </div>

        {/* Regulatory Compliance / Educational Notice */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-4 py-2.5 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 mb-6 shadow-xs">
          <span className="w-1 h-4 bg-amber-500 rounded-full shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
            <strong className="font-semibold text-slate-900 dark:text-slate-100">Disclosure:</strong> Stock screening and AAOIFI financial ratios are strictly for <strong className="font-semibold text-slate-900 dark:text-slate-100">educational and informational purposes</strong> only and not investment advice.
          </p>
        </div>

        {/* Feature 1: Country Navigation & Market Switcher */}
        <div className="mb-6">
          <StockCountrySelector
            countries={countries}
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
            isLoading={loadingCountries}
          />
        </div>

        {/* Feature 2: Market Overview & Sector Breakdown */}
        <StockMarketOverview
          country={selectedCountry}
          selectedSector={selectedSector !== 'All' ? selectedSector : undefined}
          onSelectSector={(sec) => {
            setSelectedSector(sec || 'All');
            setPage(1);
          }}
        />

        {/* Feature 3: Market Movers Widget */}
        <StockMarketMovers
          country={selectedCountry}
          onSelectStock={handleSelectStockBySymbol}
        />

        {/* Feature 4: Dynamic Filter Bar & Presets */}
        <StockFilterBar
          country={selectedCountry}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSector={selectedSector}
          onSectorChange={(sec) => {
            setSelectedSector(sec);
            setPage(1);
          }}
          selectedMarketTier={selectedMarketTier}
          onMarketTierChange={(tier) => {
            setSelectedMarketTier(tier);
            setPage(1);
          }}
          selectedHalalStatus={selectedHalalStatus}
          onHalalStatusChange={(status) => {
            setSelectedHalalStatus(status);
            setPage(1);
          }}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activePreset={activePreset}
          onSelectPreset={handleSelectPreset}
          onResetFilters={handleResetFilters}
          totalFilteredCount={totalStocks}
          isLoading={loadingStocks}
        />

        {/* Feature 5: Screener Listings (Table or Cards View) */}
        {loadingStocks ? (
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs mb-6 transition-colors">
            <div className="p-8 text-center border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-3">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Loading {selectedCountry} equities...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Screening real-time market data against AAOIFI balance-sheet debt and liquidity thresholds
              </p>
            </div>
            {/* Shimmer Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 p-4 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                    <div className="space-y-1.5">
                      <div className="w-28 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="w-40 h-2.5 bg-slate-100 dark:bg-slate-850 rounded" />
                    </div>
                  </div>
                  <div className="hidden md:block w-24 h-3 bg-slate-100 dark:bg-slate-850 rounded" />
                  <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <StockTableView
            stocks={stocks}
            sortField={sortField}
            sortDirection={sortOrder}
            onSort={(f) => handleSort(f)}
            onSelectStock={handleSelectStock}
          />
        ) : (
          <StockCardView stocks={stocks} onSelectStock={handleSelectStock} />
        )}

        {/* Pagination Strip */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Page <strong className="text-slate-900 dark:text-slate-100">{page}</strong> of{' '}
              <strong className="text-slate-900 dark:text-slate-100">{totalPages}</strong> (
              {totalStocks.toLocaleString()} total {selectedCountry} equities)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loadingStocks}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = idx + 1;
                  } else if (page <= 3) {
                    pageNum = idx + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx;
                  } else {
                    pageNum = page - 2 + idx;
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors ${
                        page === pageNum
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loadingStocks}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Feature 6: Master Stock Detail Modal (14 Institutional Sections) */}
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSelectStock={setSelectedStock}
        />
      </div>
    </div>
  );
}

export default function StocksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
        </div>
      }
    >
      <StocksPageContent />
    </Suspense>
  );
}
