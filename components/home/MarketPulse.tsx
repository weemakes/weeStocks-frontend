import React from 'react';
import Link from 'next/link';
import { Flame, ArrowUpRight, TrendingUp, Sparkles, Coins, Calculator } from 'lucide-react';

export interface MarketPulseData {
  featuredStock: {
    symbol: string;
    name: string;
    price: string;
    change: string;
    changePct: number;
    debtRatio: string;
    status: string;
    country: string;
  };
  gold: {
    price10g: string;
    changeDisplay: string;
    isPositive: boolean;
    city: string;
  };
  topIpo: {
    name: string;
    slug: string;
    status: string;
    category: string;
    gmpDisplay: string;
    gmpPercentage: number | null;
  };
  zakatNisab: {
    silverRatePerGram: string;
    silverNisabValue: string;
    goldNisabValue: string;
  };
}

interface MarketPulseProps {
  data?: MarketPulseData | null;
}

// Fallback baseline in case network is down
const DEFAULT_PULSE: MarketPulseData = {
  featuredStock: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: '₹2,251.00',
    change: '+2.28%',
    changePct: 2.28,
    debtRatio: '1.39% • Net Cash',
    status: 'HALAL',
    country: 'India',
  },
  gold: {
    price10g: '₹1,53,320',
    changeDisplay: '-₹920 (Today)',
    isPositive: false,
    city: 'Standard Rate',
  },
  topIpo: {
    name: 'Manika Plastech',
    slug: 'manika-plastech',
    status: 'Open',
    category: 'Mainboard',
    gmpDisplay: '₹11 (25.58%)',
    gmpPercentage: 25.58,
  },
  zakatNisab: {
    silverRatePerGram: '₹245/g',
    silverNisabValue: '₹1,45,775',
    goldNisabValue: '₹13,03,220',
  },
};

export default function MarketPulse({ data }: MarketPulseProps) {
  const pulse = data || DEFAULT_PULSE;
  const { featuredStock, gold, topIpo, zakatNisab } = pulse;

  const isStockPos = featuredStock.changePct >= 0;

  return (
    <section className="py-8 bg-slate-50/70 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Live Market Pulse
            </h2>
            <span className="hidden sm:inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Live Feeds
            </span>
          </div>
          <Link
            href="/stocks"
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>View Full Screener</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Widget 1: Top Halal Giant */}
          <Link
            href={`/stocks/${featuredStock.symbol}?country=${encodeURIComponent(featuredStock.country || 'India')}`}
            className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-sky-500/40 dark:hover:border-sky-500/40 p-4 rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Featured Halal Bluechip
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                {featuredStock.status === 'HALAL' ? 'AAOIFI Compliant' : featuredStock.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                  {featuredStock.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{featuredStock.symbol}</span>
                  <span>&bull;</span>
                  <span>Debt: {featuredStock.debtRatio}</span>
                </div>
              </div>
              <div className="text-right tabular-nums shrink-0">
                <div className="font-bold text-slate-900 dark:text-slate-100">{featuredStock.price}</div>
                <div className={`text-[11px] font-bold ${isStockPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {featuredStock.change}
                </div>
              </div>
            </div>
          </Link>

          {/* Widget 2: Live Gold Today */}
          <Link
            href="/gold"
            className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 dark:hover:border-amber-500/40 p-4 rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-500" />
                Gold Rate (24 Karat)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                10 Grams
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Pure 24K Gold
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Live Reference Rate
                </div>
              </div>
              <div className="text-right tabular-nums shrink-0">
                <div className="font-bold text-slate-900 dark:text-slate-100">{gold.price10g}</div>
                <div className={`text-[11px] font-semibold ${gold.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {gold.changeDisplay}
                </div>
              </div>
            </div>
          </Link>

          {/* Widget 3: Hot Mainboard IPO GMP */}
          <Link
            href={topIpo.slug ? `/ipo/${topIpo.slug}` : '/ipo'}
            className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 dark:hover:border-rose-500/40 p-4 rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
                Mainboard IPO GMP
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold flex items-center gap-1">
                <span>{topIpo.category}</span>
                <span>&bull;</span>
                <span>{topIpo.status}</span>
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
                  {topIpo.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Est. Listing Gain
                </div>
              </div>
              <div className="text-right tabular-nums shrink-0">
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {topIpo.gmpPercentage != null ? `+${topIpo.gmpPercentage}%` : topIpo.gmpDisplay}
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {topIpo.gmpDisplay}
                </div>
              </div>
            </div>
          </Link>

          {/* Widget 4: Zakat Nisab */}
          <Link
            href="/zakat"
            className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 p-4 rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Calculator className="w-3 h-3 text-indigo-500" />
                Zakat Nisab Value
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                Silver Nisab (595g)
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {zakatNisab.silverNisabValue}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  At {zakatNisab.silverRatePerGram} live silver
                </div>
              </div>
              <div className="text-right tabular-nums shrink-0">
                <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 justify-end">
                  <span>Calculate</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Gold: {zakatNisab.goldNisabValue}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
