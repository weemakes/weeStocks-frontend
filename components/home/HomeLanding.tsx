'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight, BarChart3, Calculator, Check, ChevronRight,
  Coins, FileSearch, Gem, LineChart, PieChart, Rocket, Search, ShieldCheck, Sparkles,
  TrendingUp, WalletCards, Flame,
} from 'lucide-react';
import type { MarketPulseData } from './MarketPulse';
import CompanyLogo from '@/features/stocks/components/CompanyLogo';
import GlobalMarketSearch from './GlobalMarketSearch';
import { AAOIFI_PILLARS, HOME_FAQS, POPULAR_HALAL_SECTORS } from './seoContent';

interface Props {
  data: MarketPulseData;
}

const BASE_STOCKS = [
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'IT Services • Global Bluechip',
    price: '₹2,251.00',
    change: '+2.28%',
    changePct: 2.28,
    debtRatio: '1.39% • Net Cash',
    status: 'AAOIFI Standard 21 Pass',
    purification: '0.00% (Pure)',
    country: 'India',
    path: 'M3 49 L18 40 L31 43 L46 27 L59 32 L72 20 L88 25 L101 14 L117 18 L132 8 L152 11',
    areaPath: 'M3 49 L18 40 L31 43 L46 27 L59 32 L72 20 L88 25 L101 14 L117 18 L132 8 L152 11 L152 54 L3 54 Z',
    color: '#0ea5e9',
    beaconX: 152,
    beaconY: 11,
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    sector: 'Enterprise Tech • Zero Debt',
    price: '₹1,892.40',
    change: '+1.22%',
    changePct: 1.22,
    debtRatio: '0.00% • Zero Riba',
    status: 'AAOIFI Standard 21 Pass',
    purification: '0.00% (Pure)',
    country: 'India',
    path: 'M3 44 L18 40 L31 35 L46 38 L59 26 L72 28 L88 18 L101 20 L117 12 L132 14 L152 6',
    areaPath: 'M3 44 L18 40 L31 35 L46 38 L59 26 L72 28 L88 18 L101 20 L117 12 L132 14 L152 6 L152 54 L3 54 Z',
    color: '#10b981',
    beaconX: 152,
    beaconY: 6,
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    sector: 'Automotive & EV • High Growth',
    price: '₹984.75',
    change: '+3.15%',
    changePct: 3.15,
    debtRatio: '18.4% • Under Limit',
    status: 'AAOIFI Standard 21 Pass',
    purification: '0.00% (Pure)',
    country: 'India',
    path: 'M3 50 L18 45 L31 46 L46 33 L59 34 L72 23 L88 25 L101 16 L117 13 L132 15 L152 8',
    areaPath: 'M3 50 L18 45 L31 46 L46 33 L59 34 L72 23 L88 25 L101 16 L117 13 L132 15 L152 8 L152 54 L3 54 Z',
    color: '#0284c7',
    beaconX: 152,
    beaconY: 8,
  },
  {
    symbol: 'HCLTECH',
    name: 'HCL Technologies Ltd.',
    sector: 'Digital Engineering • Low Debt',
    price: '₹1,780.20',
    change: '+1.85%',
    changePct: 1.85,
    debtRatio: '2.10% • Clean Books',
    status: 'AAOIFI Standard 21 Pass',
    purification: '0.00% (Pure)',
    country: 'India',
    path: 'M3 46 L18 42 L31 43 L46 31 L59 33 L72 24 L88 21 L101 23 L117 14 L132 11 L152 9',
    areaPath: 'M3 46 L18 42 L31 43 L46 31 L59 33 L72 24 L88 21 L101 23 L117 14 L132 11 L152 9 L152 54 L3 54 Z',
    color: '#8b5cf6',
    beaconX: 152,
    beaconY: 9,
  },
  {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharma Industries',
    sector: 'Healthcare & Pharma • Halal',
    price: '₹1,642.50',
    change: '+1.45%',
    changePct: 1.45,
    debtRatio: '3.60% • Strong Balance Sheet',
    status: 'AAOIFI Standard 21 Pass',
    purification: '0.00% (Pure)',
    country: 'India',
    path: 'M3 48 L18 43 L31 39 L46 41 L59 30 L72 32 L88 23 L101 18 L117 19 L132 10 L152 7',
    areaPath: 'M3 48 L18 43 L31 39 L46 41 L59 30 L72 32 L88 23 L101 18 L117 19 L132 10 L152 7 L152 54 L3 54 Z',
    color: '#06b6d4',
    beaconX: 152,
    beaconY: 7,
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    sector: 'Energy & Retail • Mega Cap',
    price: '₹2,965.80',
    change: '+0.95%',
    changePct: 0.95,
    debtRatio: '22.8% • Under 33%',
    status: 'AAOIFI Standard 21 Pass',
    purification: '0.00% (Pure)',
    country: 'India',
    path: 'M3 44 L18 46 L31 39 L46 41 L59 34 L72 28 L88 29 L101 21 L117 19 L132 14 L152 10',
    areaPath: 'M3 44 L18 46 L31 39 L46 41 L59 34 L72 28 L88 29 L101 21 L117 19 L132 14 L152 10 L152 54 L3 54 Z',
    color: '#3b82f6',
    beaconX: 152,
    beaconY: 10,
  },
];

const BASE_METALS = [
  {
    name: 'Gold 24K',
    shortName: 'Gold',
    rateDisplay: '₹1,53,320',
    changeDisplay: '-₹920 (Today)',
    isPositive: false,
    unit: '10g Standard Rate',
    purity: '999 Fine Bullion',
    href: '/gold',
    icon: Coins,
    color: '#f59e0b',
    glowTheme: 'border-amber-300/80 bg-amber-500/5 dark:border-amber-500/40 dark:bg-amber-950/20',
    badgeTheme: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/50',
    iconTone: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  },
  {
    name: 'Silver 999',
    shortName: 'Silver',
    rateDisplay: '₹94,500',
    changeDisplay: '+₹450 (Today)',
    isPositive: true,
    unit: '1 Kilogram Bar',
    purity: '99.9% Fine Silver',
    href: '/silver',
    icon: Gem,
    color: '#94a3b8',
    glowTheme: 'border-slate-300 bg-slate-500/5 dark:border-slate-700 dark:bg-slate-800/20',
    badgeTheme: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300/50',
    iconTone: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
  {
    name: 'Platinum 999',
    shortName: 'Platinum',
    rateDisplay: '₹32,400',
    changeDisplay: '+₹180 (Today)',
    isPositive: true,
    unit: '10g Ingot',
    purity: '99.95% Grade',
    href: '/platinum',
    icon: Sparkles,
    color: '#06b6d4',
    glowTheme: 'border-cyan-300/80 bg-cyan-500/5 dark:border-cyan-500/40 dark:bg-cyan-950/20',
    badgeTheme: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300/50',
    iconTone: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
  },
];

const BASE_IPOS = [
  {
    name: 'Tata Technologies',
    gmpDisplay: '+82.40%',
    gmpSub: '₹412 Premium',
    demand: '69.4x Demand',
    demandWidth: '94%',
    status: 'High Demand',
    statusTone: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300/40',
    type: 'Mainboard',
    slug: 'tata-technologies',
  },
  {
    name: 'Manika Plastech',
    gmpDisplay: '+25.58%',
    gmpSub: '₹11 Premium',
    demand: '18.4x Demand',
    demandWidth: '65%',
    status: 'Open for Bidding',
    statusTone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40',
    type: 'Mainboard',
    slug: 'manika-plastech',
  },
  {
    name: 'Hyundai Motor India',
    gmpDisplay: '+15.20%',
    gmpSub: '₹298 Premium',
    demand: '2.4x Demand',
    demandWidth: '40%',
    status: 'Upcoming Mega IPO',
    statusTone: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-300/40',
    type: 'Auto Giant',
    slug: 'hyundai-motor-india',
  },
  {
    name: 'NTPC Green Energy',
    gmpDisplay: '+28.00%',
    gmpSub: '₹30 Premium',
    demand: '24.2x Demand',
    demandWidth: '72%',
    status: 'Open Soon',
    statusTone: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40',
    type: 'Renewable',
    slug: 'ntpc-green-energy',
  },
];

const BASE_NISAB = [
  {
    title: 'Zakat Nisab',
    benchmark: 'Silver (Primary AAOIFI)',
    value: '₹1,45,775',
    sub: '595g Silver basis',
  },
  {
    title: 'Gold Nisab',
    benchmark: 'Gold 24K (85g basis)',
    value: '₹13,03,220',
    sub: 'Bullion & jewelry benchmark',
  },
];

export default function HomeLanding({ data }: Props) {
  const { featuredStock, gold, topIpo, zakatNisab } = data;

  // Merge live server data
  const stocksList = useMemo(() => {
    if (data.stocksList && data.stocksList.length > 0) {
      return data.stocksList.map((s, idx) => {
        const base = BASE_STOCKS[idx % BASE_STOCKS.length];
        return {
          symbol: s.symbol,
          name: s.name,
          sector: s.sector || base.sector,
          price: s.price,
          change: s.change,
          changePct: s.changePct,
          debtRatio: s.debtRatio,
          status: s.status || 'AAOIFI Standard 21 Pass',
          purification: s.purification || '0.00% (Pure)',
          country: s.country || 'India',
          logoUrl: s.logoUrl,
          path: base.path,
          areaPath: base.areaPath,
          color: base.color,
          beaconX: base.beaconX,
          beaconY: base.beaconY,
        };
      });
    }
    if (!featuredStock?.name) return BASE_STOCKS;
    const first = {
      symbol: featuredStock.symbol || 'TCS',
      name: featuredStock.name || 'Tata Consultancy Services',
      sector: 'IT Services • Global Bluechip',
      price: featuredStock.price || '₹2,251.00',
      change: featuredStock.change || '+2.28%',
      changePct: featuredStock.changePct || 2.28,
      debtRatio: featuredStock.debtRatio || '1.39% • Net Cash',
      status: 'AAOIFI Standard 21 Pass',
      purification: '0.00% (Pure)',
      country: featuredStock.country || 'India',
      path: BASE_STOCKS[0].path,
      areaPath: BASE_STOCKS[0].areaPath,
      color: BASE_STOCKS[0].color,
      beaconX: BASE_STOCKS[0].beaconX,
      beaconY: BASE_STOCKS[0].beaconY,
    };
    return [first, ...BASE_STOCKS.filter((s) => s.symbol !== first.symbol)];
  }, [data.stocksList, featuredStock]);

  const metalsList = useMemo(() => {
    if (!gold?.price10g) return BASE_METALS;
    const goldItem = {
      ...BASE_METALS[0],
      rateDisplay: gold.price10g,
      changeDisplay: gold.changeDisplay || '-₹920 (Today)',
      isPositive: gold.isPositive ?? false,
    };
    return [goldItem, ...BASE_METALS.slice(1)];
  }, [gold]);

  const iposList = useMemo(() => {
    if (data.iposList && data.iposList.length > 0) {
      return data.iposList.map((ip, idx) => {
        const base = BASE_IPOS[idx % BASE_IPOS.length];
        return {
          name: ip.name,
          gmpDisplay: ip.gmpDisplay,
          gmpSub: base.gmpSub,
          demand: base.demand,
          demandWidth: base.demandWidth,
          status: ip.status || base.status,
          statusTone: base.statusTone,
          type: ip.category || base.type,
          slug: ip.slug || base.slug,
        };
      });
    }
    if (!topIpo?.name) return BASE_IPOS;
    const first = {
      name: topIpo.name,
      gmpDisplay: topIpo.gmpPercentage != null ? `+${topIpo.gmpPercentage}%` : topIpo.gmpDisplay,
      gmpSub: 'Live Premium',
      demand: '34.2x Demand',
      demandWidth: '78%',
      status: topIpo.status || 'Open for Bidding',
      statusTone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40',
      type: 'Mainboard',
      slug: topIpo.slug || 'manika-plastech',
    };
    return [first, ...BASE_IPOS.filter((i) => i.name !== first.name)];
  }, [data.iposList, topIpo]);

  const nisabList = useMemo(() => {
    if (!zakatNisab?.silverNisabValue) return BASE_NISAB;
    return [
      {
        title: 'Zakat Nisab',
        benchmark: 'Silver (Primary AAOIFI)',
        value: zakatNisab.silverNisabValue,
        sub: '595g Silver basis',
      },
      {
        title: 'Gold Nisab',
        benchmark: 'Gold 24K (85g basis)',
        value: zakatNisab.goldNisabValue || '₹13,03,220',
        sub: 'Bullion & jewelry benchmark',
      },
    ];
  }, [zakatNisab]);

  // Rotation indices
  const [stockIdx, setStockIdx] = useState(0);
  const [stockFading, setStockFading] = useState(false);
  const [metalIdx, setMetalIdx] = useState(0);
  const [ipoIdx, setIpoIdx] = useState(0);
  const [nisabIdx, setNisabIdx] = useState(0);

  // Pause on hover
  const [pausedStock, setPausedStock] = useState(false);
  const [pausedMetal, setPausedMetal] = useState(false);
  const [pausedIpo, setPausedIpo] = useState(false);

  // Silky smooth stock timer (every 2.8s with graceful 220ms crossfade)
  useEffect(() => {
    if (pausedStock || stocksList.length <= 1) return;
    const t = setInterval(() => {
      setStockFading(true);
      setTimeout(() => {
        setStockIdx((i) => (i + 1) % stocksList.length);
        setStockFading(false);
      }, 220);
    }, 2800);
    return () => clearInterval(t);
  }, [pausedStock, stocksList.length]);

  // Metal timer (every 3.8s)
  useEffect(() => {
    if (pausedMetal) return;
    const t = setInterval(() => {
      setMetalIdx((i) => (i + 1) % metalsList.length);
    }, 3800);
    return () => clearInterval(t);
  }, [pausedMetal, metalsList.length]);

  // IPO timer (every 4.2s)
  useEffect(() => {
    if (pausedIpo) return;
    const t = setInterval(() => {
      setIpoIdx((i) => (i + 1) % iposList.length);
    }, 4200);
    return () => clearInterval(t);
  }, [pausedIpo, iposList.length]);

  // Nisab timer (every 5.0s)
  useEffect(() => {
    const t = setInterval(() => {
      setNisabIdx((i) => (i + 1) % nisabList.length);
    }, 5000);
    return () => clearInterval(t);
  }, [nisabList.length]);

  const currentStock = stocksList[stockIdx] || stocksList[0];
  const currentMetal = metalsList[metalIdx] || metalsList[0];
  const currentIpo = iposList[ipoIdx] || iposList[0];
  const currentNisab = nisabList[nisabIdx] || nisabList[0];
  const [activeTab, setActiveTab] = useState<'stocks' | 'metals' | 'ipo' | 'zakat'>('stocks');

  return (
    <div className="overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative flex min-h-[calc(100svh-98px)] sm:min-h-[calc(100svh-106px)] flex-col border-b border-slate-200 bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/60 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/20">
        {/* Subtle Background Blueprint Grid */}
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,#dbeafe_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)] dark:opacity-10" />

        <div className="container relative mx-auto flex flex-1 items-center py-5 sm:py-7 lg:py-8">
          <div className="grid w-full items-center gap-4 sm:gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            {/* Left Column: Heading, Search & CTAs */}
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-4xl xl:text-5xl font-black leading-snug tracking-tight text-slate-950 dark:text-white">
                Research markets with clarity.{' '}
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Invest with confidence.
                </span>
              </h1>

              <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
                Halal stock screening, live IPO GMP, bullion rates, and AAOIFI Zakat tools.
              </p>

              <GlobalMarketSearch />

              {/* CTAs: Hidden on mobile to let search and terminal shine without clutter */}
              <div className="mt-3.5 hidden sm:flex items-center gap-2 sm:mt-5 sm:gap-3">
                <Link
                  href="/stocks"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-600/20 hover:bg-sky-500 active:scale-98 transition-all sm:px-5"
                >
                  Explore Screener <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/80 bg-white/90 px-3.5 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900/90 dark:text-emerald-300 shadow-2xs active:scale-98 transition-all sm:px-5"
                >
                  Methodology <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                </Link>
              </div>

              {/* Trust badges: desktop only (hidden on mobile to prevent clutter) */}
              <div className="mt-4 hidden sm:flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-1.5 shadow-2xs backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> AAOIFI Standard No. 21
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-1.5 shadow-2xs backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                  <BarChart3 className="h-4 w-4 text-sky-500" /> Live market intelligence
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-1.5 shadow-2xs backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Stocks · IPOs · Metals
                </span>
              </div>
            </div>

            {/* Right Column: Clean, High-End Responsive Market Intelligence Terminal */}
            <div className="relative mx-auto w-full max-w-xl">
              {/* Ambient Multi-Hue Depth Glow behind Terminal */}
              <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-tr from-sky-500/15 via-emerald-500/10 to-indigo-500/15 blur-2xl dark:from-sky-500/20 dark:via-emerald-500/10 dark:to-indigo-500/15 -z-10 animate-glow-aura" />

              {/* ======================================================================= */}
              {/* MOBILE ONLY (< lg): 4-Tab Segmented Cockpit (Zero Bloat, Perfectly Fitted) */}
              {/* ======================================================================= */}
              <div className="lg:hidden flex flex-col gap-2">
                {/* 4-Tab Native Segmented Switcher Bar */}
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 w-full shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('stocks')}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center truncate ${
                      activeTab === 'stocks'
                        ? 'bg-white text-sky-600 dark:bg-slate-800 dark:text-sky-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    ⚡ Stocks
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('metals')}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center truncate ${
                      activeTab === 'metals'
                        ? 'bg-white text-amber-600 dark:bg-slate-800 dark:text-amber-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    🪙 Bullion
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ipo')}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center truncate ${
                      activeTab === 'ipo'
                        ? 'bg-white text-rose-600 dark:bg-slate-800 dark:text-rose-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    🚀 IPOs
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('zakat')}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center truncate ${
                      activeTab === 'zakat'
                        ? 'bg-white text-emerald-600 dark:bg-slate-800 dark:text-emerald-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    🧮 Zakat
                  </button>
                </div>

                {/* Active Tab Card on Mobile */}
                {activeTab === 'stocks' && (
                  <div
                    onMouseEnter={() => setPausedStock(true)}
                    onMouseLeave={() => setPausedStock(false)}
                    className="rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 animate-slide-up-fade"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Halal Stock
                        </span>
                        <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[8px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          AAOIFI 21
                        </span>
                      </div>

                      <div className="flex gap-1 items-center">
                        {stocksList.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (idx === stockIdx) return;
                              setStockFading(true);
                              setTimeout(() => {
                                setStockIdx(idx);
                                setStockFading(false);
                              }, 180);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              idx === stockIdx ? 'w-3.5 bg-sky-500 shadow-xs shadow-sky-500/50' : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                            }`}
                            aria-label={`Stock ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/stocks/${currentStock.symbol}?country=${encodeURIComponent(currentStock.country || 'India')}`}
                      className="mt-2.5 block group"
                    >
                      <div
                        className={`transition-all duration-300 ease-out will-change-transform ${
                          stockFading
                            ? 'opacity-0 -translate-y-1'
                            : 'opacity-100 translate-y-0'
                        }`}
                      >
                        {/* Row 1: Full-width Company Identity (Never gets squished by chart!) */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CompanyLogo symbol={currentStock.symbol} name={currentStock.name} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="truncate text-sm font-black text-slate-900 group-hover:text-sky-600 dark:text-white transition-colors">
                                {currentStock.name}
                              </h3>
                              <span className="rounded bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.2 text-[8px] font-black text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
                                {currentStock.symbol}
                              </span>
                            </div>
                            <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                              {currentStock.sector}
                            </p>
                          </div>
                        </div>

                        {/* Row 2: Price on Left, Chart on Right */}
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <div>
                            <div className="text-xl font-black text-slate-950 dark:text-white tabular-nums tracking-tight">
                              {currentStock.price}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                currentStock.changePct >= 0
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {currentStock.changePct >= 0 ? '▲' : '▼'} {currentStock.change}
                              </span>
                            </div>
                          </div>

                          <div className="relative shrink-0">
                            <AreaChart
                              path={currentStock.path}
                              areaPath={currentStock.areaPath}
                              color={currentStock.color}
                              gradientId={`mobile-stock-${currentStock.symbol}`}
                              beaconX={currentStock.beaconX}
                              beaconY={currentStock.beaconY}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[9px] dark:border-slate-800">
                      <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        Debt/MCap: <b className="font-mono text-slate-900 dark:text-slate-100">{currentStock.debtRatio}</b>
                      </span>
                      <Link
                        href={`/stocks/${currentStock.symbol}?country=India`}
                        className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 ml-auto"
                      >
                        Audit Report →
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 'metals' && (
                  <div
                    onMouseEnter={() => setPausedMetal(true)}
                    onMouseLeave={() => setPausedMetal(false)}
                    className={`rounded-2xl border p-3.5 shadow-lg backdrop-blur-xl transition-all ${currentMetal.glowTheme} animate-slide-up-fade`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 dark:border-slate-700/50">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <currentMetal.icon className="h-3.5 w-3.5" style={{ color: currentMetal.color }} />
                        Bullion Desk
                      </span>
                      <div className="flex gap-1">
                        {metalsList.map((m, idx) => (
                          <button
                            key={m.name}
                            type="button"
                            onClick={() => setMetalIdx(idx)}
                            className={`rounded px-1.5 py-0.5 text-[8px] font-bold transition-all ${
                              idx === metalIdx
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xs'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {m.shortName}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Link href={currentMetal.href} className="mt-2.5 block group">
                      <div key={currentMetal.name} className="animate-slide-up-fade">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-sm font-black text-slate-900 group-hover:text-amber-600 dark:text-white transition-colors truncate">
                            {currentMetal.name}
                          </span>
                          <span className={`rounded px-1.5 py-0.2 text-[8px] font-bold shrink-0 ${currentMetal.badgeTheme}`}>
                            {currentMetal.unit}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div>
                            <strong className="block text-lg font-black tracking-tight text-slate-950 dark:text-white tabular-nums">
                              {currentMetal.rateDisplay}
                            </strong>
                            <span className={`text-[10px] font-bold ${currentMetal.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {currentMetal.changeDisplay}
                            </span>
                          </div>

                          <div className="shrink-0">
                            <MiniMetalWave color={currentMetal.color} gradientId={`mobile-metal-${currentMetal.name}`} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {activeTab === 'ipo' && (
                  <div
                    onMouseEnter={() => setPausedIpo(true)}
                    onMouseLeave={() => setPausedIpo(false)}
                    className="rounded-2xl border border-rose-200/90 bg-rose-500/5 p-3.5 shadow-lg backdrop-blur-xl dark:border-rose-900/60 dark:bg-rose-950/20 animate-slide-up-fade"
                  >
                    <div className="flex items-center justify-between border-b border-rose-200/50 pb-2 dark:border-rose-800/40">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1">
                        <Rocket className="h-3.5 w-3.5 text-rose-500" />
                        Live IPO GMP
                      </span>
                      <div className="flex gap-1 items-center">
                        {iposList.map((ip, idx) => (
                          <button
                            key={ip.name}
                            type="button"
                            onClick={() => setIpoIdx(idx)}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === ipoIdx ? 'w-3 bg-rose-500' : 'w-1.5 bg-rose-200 dark:bg-rose-800'
                            }`}
                            aria-label={`IPO ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <Link href="/ipo" className="mt-2.5 block group">
                      <div key={currentIpo.name}>
                        <div className="flex items-center justify-between">
                          <h4 className="truncate text-sm font-black text-slate-900 group-hover:text-rose-600 dark:text-white transition-colors">
                            {currentIpo.name}
                          </h4>
                          <span className={`rounded px-1.5 py-0.2 text-[8px] font-bold ${currentIpo.statusTone}`}>
                            {currentIpo.status}
                          </span>
                        </div>

                        <div className="mt-1 flex items-baseline justify-between">
                          <strong className="text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums">
                            {currentIpo.gmpDisplay}
                          </strong>
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            {currentIpo.gmpSub}
                          </span>
                        </div>

                        <div className="mt-2">
                          <div className="flex justify-between text-[8px] font-semibold text-slate-500">
                            <span>Subscription Pace</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{currentIpo.demand}</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                              style={{ width: currentIpo.demandWidth }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Zakat Tab Card on Mobile */}
                {activeTab === 'zakat' && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/60 p-3.5 shadow-lg backdrop-blur-xl dark:border-emerald-500/30 dark:bg-emerald-950/30 animate-slide-up-fade">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Calculator className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
                          Live Zakat Nisab
                        </span>
                      </div>
                      <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[8px] font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                        AAOIFI Standard
                      </span>
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-emerald-500/20 bg-white/90 p-2 dark:bg-slate-900/90">
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block truncate">Silver Nisab (595g)</span>
                        <strong className="text-sm font-black text-emerald-900 dark:text-emerald-300 font-mono mt-0.5 block">
                          {zakatNisab?.silverNisabValue || currentNisab.value}
                        </strong>
                        <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">Primary Benchmark</span>
                      </div>
                      <div className="rounded-xl border border-amber-500/20 bg-white/90 p-2 dark:bg-slate-900/90">
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block truncate">Gold Nisab (85g)</span>
                        <strong className="text-sm font-black text-amber-900 dark:text-amber-300 font-mono mt-0.5 block">
                          {zakatNisab?.goldNisabValue || '₹13,03,220'}
                        </strong>
                        <span className="text-[8px] text-amber-600 dark:text-amber-400 font-bold block mt-0.5">Bullion Benchmark</span>
                      </div>
                    </div>

                    <Link
                      href="/zakat"
                      className="mt-2.5 flex items-center justify-center gap-1.5 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/25 transition-all"
                    >
                      Calculate Your Zakat <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>

            {/* ======================================================================= */}
            {/* DESKTOP VIEW (>= lg): Sleek Unified 2-Tier Cockpit Dashboard            */}
            {/* ======================================================================= */}
            <div className="hidden lg:flex flex-col gap-3 w-full">
              
              {/* PRIMARY COCKPIT CARD: Featured Shariah Stock */}
              <div
                onMouseEnter={() => setPausedStock(true)}
                onMouseLeave={() => setPausedStock(false)}
                className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-sky-400 dark:border-slate-800 dark:bg-slate-900/95"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Featured Halal Stock
                    </span>
                    <span className="rounded-md border border-emerald-400/40 bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      AAOIFI Compliant
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="text-[9px] font-medium text-slate-400">Auto-Rotating</span>
                    <div className="flex gap-1 items-center">
                      {stocksList.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (idx === stockIdx) return;
                            setStockFading(true);
                            setTimeout(() => {
                              setStockIdx(idx);
                              setStockFading(false);
                            }, 180);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === stockIdx ? 'w-3.5 bg-sky-500 shadow-xs shadow-sky-500/50' : 'w-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                          }`}
                          aria-label={`Stock ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/stocks/${currentStock.symbol}?country=${encodeURIComponent(currentStock.country || 'India')}`}
                  className="mt-3.5 block group"
                >
                  <div
                    className={`grid grid-cols-[1fr_auto] items-center gap-3 transition-all duration-300 ease-out will-change-transform ${
                      stockFading
                        ? 'opacity-0 -translate-y-1'
                        : 'opacity-100 translate-y-0'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <CompanyLogo symbol={currentStock.symbol} name={currentStock.name} size="md" />
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-black text-slate-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400 transition-colors">
                            {currentStock.name}
                          </h3>
                          <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                            {currentStock.sector}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-baseline gap-2.5">
                        <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white tabular-nums">
                          {currentStock.price}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          currentStock.changePct >= 0
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {currentStock.change}
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <AreaChart
                        path={currentStock.path}
                        areaPath={currentStock.areaPath}
                        color={currentStock.color}
                        gradientId={`desktop-stock-${currentStock.symbol}`}
                        beaconX={currentStock.beaconX}
                        beaconY={currentStock.beaconY}
                      />
                    </div>
                  </div>
                </Link>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[9px] dark:border-slate-800">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    Debt to MCap: <b className="font-mono text-slate-900 dark:text-slate-100">{currentStock.debtRatio}</b>
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Purification: <b className="font-mono text-slate-900 dark:text-slate-100">{currentStock.purification}</b>
                  </span>
                  <Link
                    href={`/stocks/${currentStock.symbol}?country=India`}
                    className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-0.5 ml-auto"
                  >
                    Full Audit →
                  </Link>
                </div>
              </div>

              {/* LOWER ROW: Metals Desk + IPO Radar (Side-by-side) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Metals Desk */}
                <div
                  onMouseEnter={() => setPausedMetal(true)}
                  onMouseLeave={() => setPausedMetal(false)}
                  className={`relative overflow-hidden rounded-xl border p-3 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg ${currentMetal.glowTheme}`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 dark:border-slate-700/50">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <currentMetal.icon className="h-3.5 w-3.5" style={{ color: currentMetal.color }} />
                      Bullion Desk
                    </span>
                    <div className="flex gap-1">
                      {metalsList.map((m, idx) => (
                        <button
                          key={m.name}
                          type="button"
                          onClick={() => setMetalIdx(idx)}
                          className={`rounded px-1.5 py-0.5 text-[8px] font-bold transition-all ${
                            idx === metalIdx
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {m.shortName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Link href={currentMetal.href} className="mt-2.5 block group">
                    <div key={currentMetal.name} className="animate-slide-up-fade flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 group-hover:text-sky-600 dark:text-white transition-colors">
                            {currentMetal.name}
                          </span>
                          <span className={`rounded px-1 py-0.2 text-[8px] font-bold ${currentMetal.badgeTheme}`}>
                            {currentMetal.unit}
                          </span>
                        </div>
                        <strong className="mt-1 block text-base font-black tracking-tight text-slate-950 dark:text-white tabular-nums">
                          {currentMetal.rateDisplay}
                        </strong>
                        <span className={`text-[10px] font-bold ${currentMetal.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {currentMetal.changeDisplay}
                        </span>
                      </div>

                      <MiniMetalWave color={currentMetal.color} gradientId={`desktop-metal-${currentMetal.name}`} />
                    </div>
                  </Link>
                </div>

                {/* Live IPO Desk */}
                <div
                  onMouseEnter={() => setPausedIpo(true)}
                  onMouseLeave={() => setPausedIpo(false)}
                  className="relative overflow-hidden rounded-xl border border-rose-200/90 bg-rose-500/5 p-3 shadow-md backdrop-blur-md transition-all duration-300 hover:border-rose-400 hover:shadow-lg dark:border-rose-900/60 dark:bg-rose-950/20"
                >
                  <div className="flex items-center justify-between border-b border-rose-200/50 pb-2 dark:border-rose-800/40">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1">
                      <Rocket className="h-3.5 w-3.5 text-rose-500" />
                      Live IPO GMP
                    </span>
                    <div className="flex gap-1 items-center">
                      {iposList.map((ip, idx) => (
                        <button
                          key={ip.name}
                          type="button"
                          onClick={() => setIpoIdx(idx)}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === ipoIdx ? 'w-3 bg-rose-500' : 'w-1.5 bg-rose-200 dark:bg-rose-800'
                          }`}
                          aria-label={`IPO ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <Link href="/ipo" className="mt-2.5 block group">
                    <div key={currentIpo.name} className="animate-slide-up-fade">
                      <div className="flex items-center justify-between">
                        <h4 className="truncate text-xs font-black text-slate-900 group-hover:text-rose-600 dark:text-white transition-colors">
                          {currentIpo.name}
                        </h4>
                        <span className={`rounded px-1.5 py-0.2 text-[8px] font-bold ${currentIpo.statusTone}`}>
                          {currentIpo.status}
                        </span>
                      </div>

                      <div className="mt-1 flex items-baseline justify-between">
                        <strong className="text-base font-black text-rose-600 dark:text-rose-400 tabular-nums">
                          {currentIpo.gmpDisplay}
                        </strong>
                        <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                          {currentIpo.gmpSub}
                        </span>
                      </div>

                      <div className="mt-1.5">
                        <div className="flex justify-between text-[8px] font-semibold text-slate-500">
                          <span>Subscription Pace</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{currentIpo.demand}</span>
                        </div>
                        <div className="mt-0.5 h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                            style={{ width: currentIpo.demandWidth }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Seamless Zakat Nisab Quick Ribbon */}
              <Link
                href="/zakat"
                className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-50/70 px-3.5 py-2 text-[11px] font-semibold text-emerald-950 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-200"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold">Live Zakat Nisab:</span>
                  <span className="font-mono font-black">{currentNisab.value}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">({currentNisab.benchmark})</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  Calculator <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Category Dock at Bottom of Hero - Sleek 2x2 Grid on Mobile */}
      <div className="relative z-10 border-t border-slate-200/80 bg-white/80 pt-3 pb-5 sm:py-3 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="container mx-auto grid gap-2 grid-cols-2 lg:grid-cols-4">
          <CategoryLink href="/stocks" icon={<TrendingUp />} title="Stock Intelligence" note="Research. Analyse. Invest." tone="sky" />
          <CategoryLink href="/ipo" icon={<Rocket />} title="IPO Tracker" note="GMP, dates & allotment." tone="rose" />
          <CategoryLink href="/gold" icon={<Coins />} title="Precious Metals" note="Gold, silver & platinum." tone="amber" />
          <CategoryLink href="/zakat" icon={<Calculator />} title="Zakat Calculator" note="Nisab & purification." tone="emerald" />
        </div>
      </div>
      </section>

      {/* Products Overview */}
      <section className="bg-slate-50/70 py-14 dark:bg-slate-900/30">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Products"
            title="Everything you need to research with confidence."
            copy="Powerful tools for smarter, ethical investing across Indian and global markets."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ProductCard
              href="/stocks"
              icon={<TrendingUp />}
              title="Stocks"
              copy="Fundamental, technical and Shariah-compliant stock research."
              items={['Detailed company analysis', 'Technical indicators', 'Shariah compliance screening']}
              preview={`${featuredStock.symbol}  ${featuredStock.price}`}
              tone="sky"
            />
            <ProductCard
              href="/ipo"
              icon={<Rocket />}
              title="IPOs"
              copy="Track upcoming and live IPOs with GMP and subscription insights."
              items={['Live GMP and subscription', 'Key dates and analysis', 'Compare with listed peers']}
              preview={`${topIpo.name}  ${topIpo.gmpDisplay}`}
              tone="rose"
            />
            <ProductCard
              href="/gold"
              icon={<Gem />}
              title="Precious Metals"
              copy="Track gold, silver and platinum with historical prices."
              items={['Live and historical prices', 'Interactive trend charts', 'Price alerts and calculators']}
              preview={`Gold 24K  ${gold.price10g}`}
              tone="amber"
            />
            <ProductCard
              href="/zakat"
              icon={<WalletCards />}
              title="Islamic Wealth"
              copy="Track Zakat, purification and ethical investing."
              items={['Zakat calculator', 'Income purification', 'Screening guidance']}
              preview={`Nisab  ${zakatNisab.silverNisabValue}`}
              tone="emerald"
            />
          </div>
        </div>
      </section>

      {/* Feature Showcases */}
      <section className="py-14">
        <div className="container mx-auto">
          <SectionHeading
            title="Powerful tools, simple experience."
            copy="Designed to make complex research clear, visual and meaningful."
          />
          <div className="mt-9 space-y-10">
            <Showcase
              title="Shariah-compliant stock research"
              copy="Get a complete view of any company with price charts, key ratios, growth trends and Shariah compliance status—all in one place."
              bullets={['Price charts with key indicators', 'Valuation and financial highlights', 'AAOIFI-based compliance checks']}
              href="/stocks"
              cta="Try the Stock Screener"
              preview="stock"
            />
            <Showcase
              title="Track IPOs and precious metals with ease"
              copy="Stay updated on IPO GMP and subscription demand while tracking gold, silver and platinum prices with useful calculators."
              bullets={['Live IPO GMP and subscription', 'IPO dates and company insights', 'Historical metal prices and calculators']}
              href="/ipo"
              cta="Explore IPOs & Metals"
              preview="markets"
              reverse
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-r from-sky-50 to-emerald-50 py-10 dark:from-sky-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto">
          <SectionHeading
            title="How WeeStox helps you decide"
            copy="A simple path from discovery to confident, ethical investing."
          />
          <div className="mt-7 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <DecisionFlow number="1" title="Discover opportunities" copy="Find ideas across stocks, IPOs, metals and Islamic wealth tools." type="search" />
            <ArrowRight className="mx-auto hidden h-5 w-5 text-sky-500 md:block" />
            <DecisionFlow number="2" title="Analyse the full picture" copy="Explore charts, ratios, GMP and Shariah compliance in one place." type="analysis" />
            <ArrowRight className="mx-auto hidden h-5 w-5 text-sky-500 md:block" />
            <DecisionFlow number="3" title="Decide with ethical clarity" copy="Use transparent data and methodology aligned with your values." type="decision" />
          </div>
        </div>
      </section>

      {/* AAOIFI Standard 21 & Compliance Criteria */}
      <section className="py-12">
        <div className="container mx-auto">
          <SectionHeading
            title="A platform you can trust"
            copy="Built on ethical standards, transparent methodology and reliable data."
          />

          <div className="mt-8 grid items-center gap-5 lg:grid-cols-[220px_1fr]">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-[8px] border-emerald-500">
                <strong className="text-lg">4/4</strong>
                <span className="text-[9px] text-slate-500">criteria</span>
              </div>
              <div>
                <strong className="text-sm">AAOIFI Standard No. 21</strong>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  Shariah screening based on recognized financial criteria.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <TrustCard icon={<FileSearch />} title="Transparent calculations" copy="Clear methodology you can verify." />
              <TrustCard icon={<PieChart />} title="Multiple market tools" copy="Stocks, IPOs, metals and Islamic wealth." />
              <TrustCard icon={<BarChart3 />} title="Live and historical data" copy="Reliable context for informed decisions." />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AAOIFI_PILLARS.map((pillar) => (
              <div key={pillar.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${pillar.tagColor}`}>
                    {pillar.badge}
                  </span>
                  <span className="text-xs font-black tabular-nums text-slate-900 dark:text-white">
                    {pillar.threshold}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{pillar.title}</h4>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">NSE & BSE Shariah Sectors</span>
                <h3 className="text-base font-black sm:text-lg">Key Halal Investment Sectors in India</h3>
              </div>
              <Link href="/stocks" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700">
                Open Full Screener <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {POPULAR_HALAL_SECTORS.map((sector) => (
                <div key={sector.name} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white">{sector.name}</strong>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{sector.complianceRate}</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500 dark:text-slate-400">{sector.note}</p>
                  <span className="mt-2 block truncate text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                    e.g. {sector.examples}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning / Articles */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-12 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="container mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Learn before you invest</h2>
              <p className="mt-1 text-xs text-slate-500">Insights and guides for smarter, more ethical decisions.</p>
            </div>
            <Link href="/about" className="text-xs font-bold text-sky-600">
              View all articles <ArrowRight className="inline h-3 w-3" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Article icon={<LineChart />} tag="Stocks" title="Stock analysis basics" copy="Key ratios every investor should understand." />
            <Article icon={<Rocket />} tag="IPOs" title="Understanding IPO GMP" copy="What it means and how to use it wisely." />
            <Article icon={<Coins />} tag="Metals" title="Gold purity and Zakat" copy="A complete beginner’s guide." />
          </div>
        </div>
      </section>

      <ReviewMarquee />

      {/* Comprehensive FAQs Section */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-12 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            title="Frequently asked questions"
            copy="Comprehensive answers to help you navigate Halal stocks, IPO GMP, bullion rates, and Zakat calculations."
          />
          <div className="mt-7 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {HOME_FAQS.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-sky-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                      {faq.category}
                    </span>
                    <span className="text-slate-900 dark:text-slate-100">{faq.question}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90 text-slate-400 group-hover:text-sky-600" />
                </summary>
                <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-600 dark:text-slate-300 pl-1">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-r from-sky-100 to-blue-50 px-7 py-9 dark:from-sky-950 dark:to-slate-900 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Build wealth with clarity.</h2>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                Access stocks, IPOs, metals and Islamic wealth tools in one trusted platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/stocks" className="rounded-lg bg-sky-600 px-5 py-3 text-xs font-bold text-white hover:bg-sky-700 transition-colors">
                Launch Stock Screener
              </Link>
              <Link href="/about" className="rounded-lg border border-sky-300 bg-white px-5 py-3 text-xs font-bold text-sky-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 transition-colors">
                Explore All Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AreaChart({
  path,
  areaPath,
  color,
  gradientId,
  beaconX = 152,
  beaconY = 11,
}: {
  path: string;
  areaPath: string;
  color: string;
  gradientId: string;
  beaconX?: number;
  beaconY?: number;
}) {
  const safeId = gradientId.replace(/[^a-zA-Z0-9_-]/g, '-');
  return (
    <svg viewBox="0 0 160 56" className="h-14 w-36 sm:w-44 overflow-visible shrink-0">
      <defs>
        <linearGradient id={safeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="2" y1="52" x2="158" y2="52" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
      <path d={areaPath} fill={`url(#${safeId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={beaconX} cy={beaconY} r="3" fill={color} />
      <circle cx={beaconX} cy={beaconY} r="7" fill={color} opacity="0.45" className="animate-ping" />
    </svg>
  );
}

function MiniMetalWave({ color, gradientId }: { color: string; gradientId: string }) {
  const safeId = gradientId.replace(/[^a-zA-Z0-9_-]/g, '-');
  return (
    <svg viewBox="0 0 96 36" className="h-9 w-20 overflow-visible shrink-0">
      <defs>
        <linearGradient id={safeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M2 28 Q 24 10, 48 20 T 94 8 L 94 34 L 2 34 Z" fill={`url(#${safeId})`} />
      <path d="M2 28 Q 24 10, 48 20 T 94 8" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="94" cy="8" r="2.5" fill={color} />
    </svg>
  );
}

function TrustMini({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/60 p-2 text-[9px] font-bold text-slate-600 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
      <span className="text-sky-600 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {title}
    </div>
  );
}

const tones = {
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
} as const;

function CategoryLink({
  href, icon, title, note, tone,
}: {
  href: string; icon: React.ReactNode; title: string; note: string; tone: keyof typeof tones;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 sm:gap-3 rounded-xl border border-slate-200/90 bg-white/90 p-2 sm:p-2.5 transition-all hover:border-sky-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900/90"
    >
      <span className={`rounded-lg p-1.5 sm:p-2 shrink-0 ${tones[tone]} [&>svg]:h-3.5 [&>svg]:w-3.5 sm:[&>svg]:h-4 sm:[&>svg]:w-4`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <strong className="block text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{title}</strong>
        <span className="block truncate text-[8px] sm:text-[9px] text-slate-500">{note}</span>
      </span>
      <ChevronRight className="hidden sm:block ml-auto h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-sky-600" />
    </Link>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-sky-600">{eyebrow}</span>}
      <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{copy}</p>
    </div>
  );
}

function ProductCard({
  href, icon, title, copy, items, preview, tone,
}: {
  href: string; icon: React.ReactNode; title: string; copy: string; items: string[]; preview: string; tone: keyof typeof tones;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 flex min-h-80 flex-col p-5">
      <span className={`w-fit rounded-xl p-2.5 ${tones[tone]} [&>svg]:h-5 [&>svg]:w-5`}>{icon}</span>
      <h3 className="mt-4 text-base font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{copy}</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[10px] text-slate-700 dark:text-slate-300">
            <Check className="h-3 w-3 text-emerald-500" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold dark:border-slate-800 dark:bg-slate-950">
        {preview}
      </div>
      <Link
        href={href}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-[10px] font-bold text-white hover:bg-sky-700 transition-colors"
      >
        Explore {title} <ArrowRight className="h-3 w-3" />
      </Link>
    </article>
  );
}

function Showcase({
  title, copy, bullets, href, cta, preview, reverse,
}: {
  title: string; copy: string; bullets: string[]; href: string; cta: string; preview: 'stock' | 'markets'; reverse?: boolean;
}) {
  return (
    <div className={`grid items-center gap-8 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div>
        <h3 className="text-xl font-black text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-3 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">{copy}</p>
        <ul className="mt-5 space-y-2">
          {bullets.map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-xs font-bold text-white hover:bg-sky-700 transition-colors"
        >
          {cta}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {preview === 'stock' ? <StockPreview /> : <MarketPreview />}
    </div>
  );
}

function StockPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[9px] text-slate-400">NSE • IT Services</span>
          <h4 className="font-black text-slate-950 dark:text-white">Tata Consultancy Services</h4>
          <strong className="text-xl text-slate-950 dark:text-white">₹4,124.50</strong>
        </div>
        <span className="rounded-lg bg-emerald-100 px-3 py-2 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          AAOIFI 21 Compliant
        </span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1.45fr_1fr]">
        <div className="rounded-xl bg-sky-50 p-3 dark:bg-sky-950/30">
          <svg viewBox="0 0 150 56" className="h-14 w-36">
            <path d="M3 49 L18 40 L31 43 L46 27 L59 32 L72 20 L88 25 L101 14 L117 18 L132 8 L147 11" fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-2 flex justify-between text-[9px] text-slate-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SmallMetric label="P/E" value="19.8" />
          <SmallMetric label="Market cap" value="₹11.9T" />
          <SmallMetric label="ROE" value="16.4%" />
          <SmallMetric label="Growth" value="+14.2%" />
        </div>
      </div>
    </div>
  );
}

function MarketPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex justify-between text-xs font-black">
          <span>Upcoming IPOs</span>
          <Link href="/ipo" className="text-sky-600 hover:text-sky-700">View all</Link>
        </div>
        {['Tata Technologies', 'Ola Electric', 'Hyundai India'].map((name, index) => (
          <div key={name} className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] dark:border-slate-800">
            <span>{name}</span>
            <b className="text-rose-600">+{12 - index * 4}%</b>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <b className="text-xs">Gold 24K</b>
          <Coins className="h-4 w-4 text-amber-500" />
        </div>
        <strong className="mt-4 block text-xl text-slate-950 dark:text-white">₹73,482</strong>
        <svg viewBox="0 0 150 56" className="h-14 w-36">
          <path d="M3 49 L18 40 L31 43 L46 27 L59 32 L72 20 L88 25 L101 14 L117 18 L132 8 L147 11" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Link href="/gold" className="mt-2 block text-[10px] font-bold text-sky-600 hover:text-sky-700">
          Open metals desk →
        </Link>
      </div>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-950">
      <span className="block text-[8px] uppercase text-slate-400">{label}</span>
      <b className="text-xs text-slate-900 dark:text-slate-100">{value}</b>
    </div>
  );
}

function DecisionFlow({
  number, title, copy, type,
}: {
  number: string; title: string; copy: string; type: 'search' | 'analysis' | 'decision';
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white ${type === 'decision' ? 'bg-emerald-500' : 'bg-sky-600'}`}>
          {number}
        </span>
        <h3 className="text-xs font-black text-slate-950 dark:text-white">{title}</h3>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 h-24">
        {type === 'search' && (
          <>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[8px] text-slate-400 dark:border-slate-700">
              <Search className="h-3 w-3" />
              Search stocks, IPOs or tools...
            </div>
            <div className="mt-2 flex gap-1 text-[7px]">
              <span className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">RELIANCE</span>
              <span className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">Gold 24K</span>
              <span className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">Upcoming IPOs</span>
            </div>
          </>
        )}
        {type === 'analysis' && (
          <>
            <div className="flex gap-4 border-b border-slate-200 pb-1 text-[7px] dark:border-slate-700">
              <b className="text-sky-600">Price</b>
              <span>Financials</span>
              <span>Shariah</span>
              <span>News</span>
            </div>
            <svg viewBox="0 0 220 44" className="mt-1 h-11 w-full">
              <polyline points="2,38 24,32 45,34 66,25 88,28 112,18 133,22 154,11 177,15 218,4" fill="none" stroke="#3b82f6" strokeWidth="2" />
            </svg>
          </>
        )}
        {type === 'decision' && (
          <div className="flex h-full flex-col items-center justify-center">
            <span className="rounded-lg bg-emerald-100 px-4 py-2 text-[9px] font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              ✓ Shariah Compliant
            </span>
            <span className="mt-2 rounded-md bg-sky-600 px-4 py-1.5 text-[8px] font-bold text-white">
              Add to Watchlist
            </span>
          </div>
        )}
      </div>
      <p className="mt-2 text-[9px] leading-4 text-slate-500 dark:text-slate-400">{copy}</p>
    </div>
  );
}

function TrustCard({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <span className="rounded-lg bg-sky-100 p-2 text-sky-600 dark:bg-sky-950 dark:text-sky-400 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div>
        <b className="text-xs text-slate-900 dark:text-slate-100">{title}</b>
        <p className="mt-1 text-[9px] leading-4 text-slate-500 dark:text-slate-400">{copy}</p>
      </div>
    </div>
  );
}

function Article({ icon, tag, title, copy }: { icon: React.ReactNode; tag: string; title: string; copy: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
      <span className="rounded-xl bg-sky-100 p-3 text-sky-600 dark:bg-sky-950 dark:text-sky-400 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
      <div>
        <span className="text-[8px] font-bold uppercase tracking-wider text-sky-600">{tag}</span>
        <h3 className="mt-1 text-sm font-black text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{copy}</p>
        <span className="mt-2 block text-[9px] font-bold text-sky-600">5 min read →</span>
      </div>
    </article>
  );
}

const reviews = [
  ['AK', 'The Shariah audit makes every pass and threshold easy to understand.', 'Stock research'],
  ['PS', 'IPO GMP, allotment and subscription data are much easier to follow.', 'IPO tracking'],
  ['FM', 'Metals and Zakat tools bring my research into one clear workflow.', 'Islamic wealth'],
  ['RK', 'The stock detail layout gives me the important numbers without confusion.', 'Long-term investing'],
  ['SA', 'I can compare valuations, growth and risks without opening several sites.', 'Fundamentals'],
  ['NM', 'Gold and silver city rates are presented clearly and update quickly.', 'Precious metals'],
  ['HI', 'The compliance methodology is transparent instead of showing only a badge.', 'Shariah screening'],
  ['VR', 'Delivery and ownership charts help me understand conviction better.', 'Trading'],
  ['AZ', 'The Zakat calculator makes the Nisab calculation simple to verify.', 'Zakat'],
  ['MJ', 'The IPO pages combine the dates, GMP and company research I need.', 'IPO research'],
  ['SK', 'Search and navigation make it easy to move between different markets.', 'Platform'],
  ['TA', 'The page feels useful for both active trading and long-term research.', 'Market research'],
] as const;

function ReviewMarquee() {
  const items = [...reviews, ...reviews];
  return (
    <section className="overflow-hidden py-12">
      <div className="container mx-auto flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Community feedback</h2>
          <p className="mt-1 text-xs text-slate-500">What investors value across WeeStox tools.</p>
        </div>
        <a
          href="mailto:care@weestox.com?subject=WeeStox%20feedback"
          className="rounded-lg border border-sky-300 px-4 py-2 text-xs font-bold text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-slate-900"
        >
          Share your feedback
        </a>
      </div>
      <div className="mt-7 overflow-hidden">
        <div className="flex w-max gap-4 animate-ticker">
          {items.map(([initials, text, category], index) => (
            <article key={`${initials}-${index}`} className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 w-[340px] shrink-0 p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-xs font-black text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  {initials}
                </span>
                <span className="text-amber-500">★★★★★</span>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-600 dark:text-slate-300">“{text}”</p>
              <span className="mt-4 block text-[9px] font-bold uppercase tracking-wide text-slate-400">{category}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
