'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import {
  StockItem,
  ComplianceStatus,
  StockCountry,
  StockListItem,
  StockListResponse,
} from '@/features/stocks/types';
import {
  StockCountrySelector,
  StockFilterBar,
  StockTableView,
  StockCardView,
  StockDetailModal,
} from '@/features/stocks/components';
import { getAvailableCountries, getStocksList } from '@/features/stocks/api';
import { mapBackendStockToStockItem } from '@/features/stocks/utils/mappers';


function StocksPageContent({ initialData, initialCountry }: { initialData: StockListResponse; initialCountry: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Country State
  const [countries, setCountries] = useState<StockCountry[]>([]);
  const countryFromUrl = searchParams.get('country');
  const [selectedCountry, setSelectedCountry] = useState<string>(countryFromUrl || initialCountry);
  const [loadingCountries, setLoadingCountries] = useState(false);

  // Screener Filters & Pagination
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
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
  const [stocks, setStocks] = useState<StockItem[]>(() => initialData.data.map((item) => mapBackendStockToStockItem(item, initialCountry)));
  const [totalStocks, setTotalStocks] = useState(initialData.meta.total);
  const [totalPages, setTotalPages] = useState(initialData.meta.totalPages);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Modal State
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  // The server wrapper remounts the screener when the URL country changes.

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
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

        if (selectedMarketTier !== 'All') {
          mapped = mapped.filter((s) => s.trader_indicators?.market_tier === selectedMarketTier);
        }

        setStocks(mapped);
        setTotalStocks(response.meta?.total ?? mapped.length);
        setTotalPages(response.meta?.totalPages ?? Math.max(1, Math.ceil((response.meta?.total ?? mapped.length) / limit)));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: unknown) {
      console.error('Stocks request failed:', err);
      setBackendError('Stock data is temporarily unavailable. Please try again shortly.');
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
    const request = setTimeout(() => void fetchStocks(), 0);
    return () => clearTimeout(request);
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

  // Navigate to dedicated analysis page
  const handleSelectStock = (stock: StockItem) => {
    router.push(`/stocks/${encodeURIComponent(stock.symbol)}?country=${encodeURIComponent(selectedCountry)}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-1 sm:pt-2 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {backendError && <p role="status" className="mb-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{backendError}</p>}
        {/* Terminal Header with Market Switcher */}
        <header className="mb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div>
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">Equities Screener</span>
              </nav>

              {/* Title & Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>{selectedCountry} Stock Screener</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  AAOIFI Standard 21
                </span>
              </div>
            </div>

            {/* Country / Market Switcher */}
            <div className="shrink-0 self-start md:self-auto">
              <StockCountrySelector
                countries={countries}
                selectedCountry={selectedCountry}
                onSelectCountry={handleSelectCountry}
                isLoading={loadingCountries}
              />
            </div>
          </div>
        </header>

        {/* Master Screener Terminal Workspace (Presets + Filters + Table/Cards in ONE Clean Surface) */}
        <div className="rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm overflow-hidden mb-6">
          {/* Integrated Screener Command Bar & Filters */}
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

          {/* Screener Listings (Terminal Table or Cards View) */}
          {loadingStocks ? (
            <div className="p-10 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-3">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Loading {selectedCountry} equities...
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Screening real-time market data against AAOIFI balance-sheet debt and liquidity thresholds
              </p>
              {/* Shimmer Rows */}
              <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800/80 space-y-2.5 max-w-2xl mx-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-2 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                      <div className="space-y-1.5 text-left">
                        <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-36 h-2 bg-slate-100 dark:bg-slate-850 rounded" />
                      </div>
                    </div>
                    <div className="w-16 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-16 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
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
            <div className="p-4 sm:p-5 bg-slate-50/30 dark:bg-slate-950/30">
              <StockCardView stocks={stocks} onSelectStock={handleSelectStock} />
            </div>
          )}

          {/* Integrated Pagination Ribbon */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 dark:bg-slate-950/70 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Page <strong className="text-slate-900 dark:text-slate-100 font-bold">{page}</strong> of{' '}
                <strong className="text-slate-900 dark:text-slate-100 font-bold">{totalPages}</strong> (
                {totalStocks.toLocaleString()} total {selectedCountry} equities)
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loadingStocks}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
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
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Master Stock Detail Modal */}
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSelectStock={setSelectedStock}
        />
      </div>
    </main>
  );
}

export default function StocksScreener({ initialData, initialCountry }: { initialData: StockListResponse; initialCountry: string }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
        </div>
      }
    >
      <StocksPageContent initialData={initialData} initialCountry={initialCountry} />
    </Suspense>
  );
}
