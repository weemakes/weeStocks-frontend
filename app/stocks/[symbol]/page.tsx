'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Globe,
  ChevronRight,
  Share2,
  Check,
  Printer,
  Search,
  RefreshCw,
} from 'lucide-react';
import { StockMasterDetail } from '@/features/stocks/types';
import { getStockDetail } from '@/features/stocks/api';
import StockDetailContent from '@/features/stocks/components/StockDetailContent';

function StockDetailInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const symbol =
    typeof params?.symbol === 'string'
      ? params.symbol
      : Array.isArray(params?.symbol)
      ? params.symbol[0]
      : '';
  const countryParam = searchParams.get('country') || 'India';

  const [detail, setDetail] = useState<StockMasterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchJump, setSearchJump] = useState('');

  const loadData = async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getStockDetail(symbol, countryParam);
      if (res) {
        setDetail(res);
      } else {
        setError(`Could not find institutional report for ticker "${symbol}".`);
      }
    } catch (err: any) {
      console.error('Failed to load stock detail:', err);
      setError(err?.message || 'Error fetching stock data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [symbol, countryParam]);

  const handleSelectPeer = (peerSymbol: string) => {
    router.push(`/stocks/${peerSymbol}?country=${encodeURIComponent(countryParam)}`);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSearchJump = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchJump.trim()) {
      router.push(`/stocks/${searchJump.trim().toUpperCase()}?country=${encodeURIComponent(countryParam)}`);
      setSearchJump('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Trader Action Bar */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <Link
              href={`/stocks?country=${encodeURIComponent(countryParam)}`}
              className="inline-flex items-center gap-1.5 font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{countryParam} Screener</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{symbol}</span>
            {detail && (
              <span className="text-slate-400 dark:text-slate-600 hidden md:inline">
                ({detail.company.name})
              </span>
            )}
          </div>

          {/* Quick Jump Search + Trader Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <form onSubmit={handleSearchJump} className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Jump to ticker..."
                value={searchJump}
                onChange={(e) => setSearchJump(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 w-36 focus:w-48 transition-all"
              />
            </form>

            <button
              type="button"
              onClick={loadData}
              title="Refresh live quote & calculations"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workstation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="py-36 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-9 h-9 animate-spin text-sky-600 dark:text-sky-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Generating institutional analysis for {symbol}...
            </p>
            <span className="text-xs text-slate-400">
              Auditing AAOIFI debt leverage, CPR technicals, financial statements, and quant scores
            </span>
          </div>
        ) : error || !detail ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-12">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Report Not Available
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {error || 'Unable to retrieve live market data for this ticker.'}
            </p>
            <Link
              href={`/stocks?country=${encodeURIComponent(countryParam)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to {countryParam} Screener</span>
            </Link>
          </div>
        ) : (
          <StockDetailContent
            detail={detail}
            onSelectPeer={handleSelectPeer}
            isStandalonePage={true}
          />
        )}
      </div>
    </div>
  );
}

export default function StockDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
        </div>
      }
    >
      <StockDetailInner />
    </Suspense>
  );
}
