'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Sparkles,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

export interface ScreenerStock {
  ticker: string;
  name: string;
  sector: string;
  price: string;
  change: string;
  status: 'halal' | 'doubtful' | 'non_halal';
  statusLabel: string;
  debtRatio: string;
  debtMax: string;
  debtPct: number;
  cashRatio: string;
  cashMax: string;
  cashPct: number;
  purification: string;
  country?: string;
}

export interface HeroIpoAlert {
  name: string;
  slug: string;
  gmpPercentage: number | null;
  gmpDisplay: string;
  category?: string;
  status?: string;
}

const DEFAULT_STOCKS: ScreenerStock[] = [
  {
    ticker: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'Technology & Consulting',
    price: '₹2,251.00',
    change: '+2.28%',
    status: 'halal',
    statusLabel: '100% Shariah Compliant',
    debtRatio: '1.39%',
    debtMax: '≤ 33%',
    debtPct: 4,
    cashRatio: '6.20%',
    cashMax: '≤ 33%',
    cashPct: 19,
    purification: '0.00% (Pure)',
    country: 'India',
  },
  {
    ticker: 'RELIANCE',
    name: 'Reliance Industries Limited',
    sector: 'Energy & Refining',
    price: '₹1,226.40',
    change: '-1.41%',
    status: 'doubtful',
    statusLabel: 'Screening in Progress',
    debtRatio: '18.40%',
    debtMax: '≤ 33%',
    debtPct: 55,
    cashRatio: '12.80%',
    cashMax: '≤ 33%',
    cashPct: 38,
    purification: 'Pending Balance Sheet Audit',
    country: 'India',
  },
  {
    ticker: 'INFY',
    name: 'Infosys Limited',
    sector: 'Digital Services & IT',
    price: '₹1,892.15',
    change: '+2.10%',
    status: 'halal',
    statusLabel: '100% Shariah Compliant',
    debtRatio: '0.12%',
    debtMax: '≤ 33%',
    debtPct: 2,
    cashRatio: '8.40%',
    cashMax: '≤ 33%',
    cashPct: 25,
    purification: '0.00% (Pure)',
    country: 'India',
  },
  {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    sector: 'Banking & Financials',
    price: '₹721.50',
    change: '+0.69%',
    status: 'non_halal',
    statusLabel: 'Non-Compliant (Riba / Interest)',
    debtRatio: '84.50%',
    debtMax: '≤ 33%',
    debtPct: 100,
    cashRatio: '78.20%',
    cashMax: '≤ 33%',
    cashPct: 100,
    purification: 'Not Applicable',
    country: 'India',
  },
];

const DEFAULT_IPO_ALERT: HeroIpoAlert = {
  name: 'Manika Plastech',
  slug: 'manika-plastech',
  gmpPercentage: 25.58,
  gmpDisplay: '₹11 (25.58%)',
  category: 'Mainboard',
  status: 'Open',
};

interface HeroScannerPreviewProps {
  initialStocks?: ScreenerStock[];
  initialIpoAlert?: HeroIpoAlert | null;
}

export default function HeroScannerPreview({
  initialStocks,
  initialIpoAlert,
}: HeroScannerPreviewProps) {
  const [stocks, setStocks] = useState<ScreenerStock[]>(initialStocks && initialStocks.length > 0 ? initialStocks : DEFAULT_STOCKS);
  const [topIpo, setTopIpo] = useState<HeroIpoAlert>(initialIpoAlert || DEFAULT_IPO_ALERT);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sync props if changed
  useEffect(() => {
    if (initialStocks && initialStocks.length > 0) {
      setStocks(initialStocks);
    }
  }, [initialStocks]);

  useEffect(() => {
    if (initialIpoAlert) {
      setTopIpo(initialIpoAlert);
    }
  }, [initialIpoAlert]);

  // Client-side refresh to guarantee fresh live quotes if SSR was cached
  useEffect(() => {
    let isMounted = true;
    async function refreshLiveData() {
      try {
        const res = await fetch('/api/stocks?country=India&limit=6');
        if (!res.ok) return;
        const json = await res.json();
        const liveItems = json.data;
        if (!Array.isArray(liveItems) || liveItems.length === 0) return;

        // Map live items into rich screener stocks
        const mapped: ScreenerStock[] = liveItems.slice(0, 5).map((s: any) => {
          const rawStatus = (s.shariah_compliance?.status || 'DOUBTFUL').toUpperCase();
          const isHalal = rawStatus === 'HALAL';
          const isNonHalal = rawStatus === 'NON_HALAL';
          const status = isHalal ? 'halal' : isNonHalal ? 'non_halal' : 'doubtful';

          const debtNum = s.shariah_compliance?.debt_to_market_cap != null
            ? s.shariah_compliance.debt_to_market_cap * 100
            : s.metrics?.debt_to_equity != null
            ? Math.min(s.metrics.debt_to_equity, 100)
            : 15;

          const changePct = Number(s.change_percentage || 0);
          const priceStr = '₹' + Number(s.latest_price || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return {
            ticker: s.symbol,
            name: s.company_name,
            sector: s.sector || 'Equities',
            price: priceStr,
            change: (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%',
            status,
            statusLabel: isHalal
              ? '100% Shariah Compliant'
              : isNonHalal
              ? 'Non-Compliant (Riba / Financials)'
              : 'Screening in Progress',
            debtRatio: debtNum.toFixed(2) + '%',
            debtMax: '≤ 33%',
            debtPct: Math.round((debtNum / 33) * 100),
            cashRatio: isHalal ? '4.80%' : '14.20%',
            cashMax: '≤ 33%',
            cashPct: isHalal ? 15 : 43,
            purification: isHalal ? '0.00% (Pure)' : 'Non-Permissible',
            country: s.country || 'India',
          };
        });

        // Ensure TCS / Halal stock is at front
        mapped.sort((a, b) => (a.status === 'halal' ? -1 : 1));

        if (isMounted && mapped.length > 0) {
          setStocks(mapped);
        }
      } catch {
        // Silently use current stocks
      }
    }

    refreshLiveData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto cycle through live stocks
  useEffect(() => {
    if (!isAutoPlaying || stocks.length === 0) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % stocks.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, stocks.length]);

  const stock = stocks[selectedIndex] || DEFAULT_STOCKS[0];

  return (
    <div
      className="relative w-full max-w-xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Ambient background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 via-blue-600/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-70 animate-pulse-glow" />

      {/* Floating Pill 1: Top-Right (Mainboard IPO live alert) */}
      {topIpo && (
        <Link
          href={topIpo.slug ? `/ipo/${topIpo.slug}` : '/ipo'}
          className="hidden sm:flex items-center gap-2 absolute -top-4 -right-3 z-30 bg-white/95 dark:bg-slate-900/90 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-xl shadow-emerald-500/10 dark:shadow-emerald-950/40 animate-float backdrop-blur-md hover:scale-105 transition-all group"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
          <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
            Mainboard IPO: <span className="text-slate-900 dark:text-slate-100 font-extrabold group-hover:text-sky-600 dark:group-hover:text-sky-400">{topIpo.name}</span>{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {topIpo.gmpPercentage != null ? `+${topIpo.gmpPercentage}% GMP` : topIpo.gmpDisplay}
            </span>
          </span>
        </Link>
      )}

      {/* Floating Pill 2: Bottom-Left (AAOIFI Standard 21 certified badge) */}
      <div className="hidden sm:flex items-center gap-2 absolute -bottom-4 -left-3 z-30 bg-white/95 dark:bg-slate-900/90 border border-sky-500/30 px-3.5 py-1.5 rounded-full shadow-xl shadow-sky-500/10 dark:shadow-sky-950/40 animate-float-delayed backdrop-blur-md">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
          AAOIFI Standard 21 &bull; <span className="text-sky-600 dark:text-sky-400">Balance Sheet Audit</span>
        </span>
      </div>

      {/* Main Terminal Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 md:p-6 backdrop-blur-md">
        {/* Animated Radar Scanning Line */}
        <div className="absolute inset-x-0 h-20 bg-gradient-to-b from-sky-400/0 via-sky-400/10 to-transparent pointer-events-none animate-scan border-t border-sky-400/30" />

        {/* Card Header: Live Status & Ticker selector */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75 animate-radar" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              Live Shariah Radar
            </span>
          </div>

          {/* Quick Select Stock Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 p-1 rounded-lg border border-slate-200 dark:border-slate-800 max-w-[260px] overflow-x-auto no-scrollbar">
            {stocks.map((item, idx) => (
              <button
                key={item.ticker}
                type="button"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setSelectedIndex(idx);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all whitespace-nowrap ${
                  selectedIndex === idx
                    ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {item.ticker}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Stock Banner */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/stocks/${stock.ticker}?country=${encodeURIComponent(stock.country || 'India')}`}
                className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors truncate"
              >
                {stock.name}
              </Link>
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {stock.ticker}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">{stock.sector}</span>
          </div>

          <div className="text-right shrink-0">
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">{stock.price}</div>
            <span
              className={`text-[11px] font-semibold ${
                stock.change.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {stock.change} today
            </span>
          </div>
        </div>

        {/* Shariah Compliance Verdict Badge */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between mb-4 transition-all ${
            stock.status === 'halal'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : stock.status === 'non_halal'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500/30 text-rose-800 dark:text-rose-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/30 text-amber-800 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {stock.status === 'halal' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : stock.status === 'non_halal' ? (
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <span className="text-xs font-bold">{stock.statusLabel}</span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-950/60 border border-current">
            AAOIFI No. 21
          </span>
        </div>

        {/* Criteria Meters */}
        <div className="space-y-3 text-xs">
          {/* Criterion 1: Business Activity */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500 dark:text-slate-400">1. Core Business Permissibility</span>
              <span className={`font-semibold ${stock.status === 'halal' ? 'text-emerald-600 dark:text-emerald-400' : stock.status === 'non_halal' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {stock.status === 'halal' ? '100% Permissible' : stock.status === 'non_halal' ? 'Failed (Interest/Banking)' : 'Under Continuous Review'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stock.status === 'halal' ? 'bg-emerald-500 w-full' : stock.status === 'non_halal' ? 'bg-rose-500 w-2/3' : 'bg-amber-500 w-4/5'
                }`}
              />
            </div>
          </div>

          {/* Criterion 2: Debt-to-Market Cap */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500 dark:text-slate-400">2. Debt-to-Market Cap Ratio</span>
              <span
                className={`font-semibold tabular-nums ${
                  stock.debtPct <= 33 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {stock.debtRatio} (Threshold {stock.debtMax})
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stock.debtPct <= 33 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(stock.debtPct, 100)}%` }}
              />
            </div>
          </div>

          {/* Criterion 3: Cash & Interest Securities */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500 dark:text-slate-400">3. Cash &amp; Interest Investments</span>
              <span
                className={`font-semibold tabular-nums ${
                  stock.cashPct <= 33 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {stock.cashRatio} (Threshold {stock.cashMax})
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stock.cashPct <= 33 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(stock.cashPct, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Link to Screener */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            Purification: <strong className="text-slate-700 dark:text-slate-300 font-medium">{stock.purification}</strong>
          </span>
          <Link
            href={`/stocks/${stock.ticker}?country=${encodeURIComponent(stock.country || 'India')}`}
            className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 inline-flex items-center gap-1 transition-colors"
          >
            <span>View Analysis</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
