'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { StockMasterDetail } from '@/features/stocks/types';
import { getStockDetail } from '@/features/stocks/api';
import StockDetailDashboard from '@/features/stocks/components/StockDetailDashboard';

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Main Workstation Container */}
      <div className="mx-auto max-w-[1500px] px-3 py-3 sm:px-6 sm:py-5 lg:px-8">
        {/* Clean, Lightweight Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-2.5 sm:mb-3.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Link
            href={`/stocks?country=${encodeURIComponent(countryParam)}`}
            className="inline-flex items-center gap-1 font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{countryParam} Screener</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{symbol}</span>
          {detail?.company?.name && (
            <span className="text-slate-400 dark:text-slate-500 hidden sm:inline truncate max-w-[280px]">
              ({detail.company.name})
            </span>
          )}
        </nav>
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
          <StockDetailDashboard
            key={detail.company.symbol}
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
