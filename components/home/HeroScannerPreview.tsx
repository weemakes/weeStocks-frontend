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

interface ScreenerStock {
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
}

const SAMPLE_STOCKS: ScreenerStock[] = [
  {
    ticker: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'Information Technology',
    price: '₹4,285.40',
    change: '+1.45%',
    status: 'halal',
    statusLabel: '100% Shariah Compliant',
    debtRatio: '0.04%',
    debtMax: '≤ 33%',
    debtPct: 1,
    cashRatio: '6.20%',
    cashMax: '≤ 33%',
    cashPct: 19,
    purification: '0.00% (Pure)',
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
  },
  {
    ticker: 'TITAN',
    name: 'Titan Company Limited',
    sector: 'Consumer Goods & Luxury',
    price: '₹3,560.80',
    change: '+0.85%',
    status: 'halal',
    statusLabel: 'Halal with Purification',
    debtRatio: '14.20%',
    debtMax: '≤ 33%',
    debtPct: 43,
    cashRatio: '4.80%',
    cashMax: '≤ 33%',
    cashPct: 15,
    purification: '0.42% to donate',
  },
  {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    sector: 'Financial Services / Banking',
    price: '₹1,640.25',
    change: '-0.30%',
    status: 'non_halal',
    statusLabel: 'Non-Compliant (Riba / Interest)',
    debtRatio: '84.50%',
    debtMax: '≤ 33%',
    debtPct: 100,
    cashRatio: '78.20%',
    cashMax: '≤ 33%',
    cashPct: 100,
    purification: 'Not Applicable',
  },
];

export default function HeroScannerPreview() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto cycle through demo stocks to create an active terminal feel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % SAMPLE_STOCKS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const stock = SAMPLE_STOCKS[selectedIndex];

  return (
    <div
      className="relative w-full max-w-xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Ambient background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 via-blue-600/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-70 animate-pulse-glow" />

      {/* Floating Pill 1: Top-Right (IPO GMP live alert) */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-4 -right-3 z-30 bg-slate-900/90 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-xl shadow-emerald-950/40 animate-float backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <Flame className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] font-bold text-slate-100">
          IPO GMP Alert: <span className="text-emerald-400 font-extrabold">+38.5% Gain</span>
        </span>
      </div>

      {/* Floating Pill 2: Bottom-Left (AAOIFI Standard 21 certified badge) */}
      <div className="hidden sm:flex items-center gap-2 absolute -bottom-4 -left-3 z-30 bg-slate-900/90 border border-sky-500/30 px-3.5 py-1.5 rounded-full shadow-xl shadow-sky-950/40 animate-float-delayed backdrop-blur-md">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
        <span className="text-[11px] font-bold text-slate-200">
          AAOIFI Standard 21 &bull; <span className="text-sky-400">Zero-Debt Screening</span>
        </span>
      </div>

      {/* Main Terminal Card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-5 md:p-6 backdrop-blur-md">
        {/* Animated Radar Scanning Line */}
        <div className="absolute inset-x-0 h-20 bg-gradient-to-b from-sky-400/0 via-sky-400/10 to-transparent pointer-events-none animate-scan border-t border-sky-400/30" />

        {/* Card Header: Live Status & Ticker selector */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-radar" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-sky-400" />
              Live Shariah Radar
            </span>
          </div>

          {/* Quick Select Stock Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            {SAMPLE_STOCKS.map((item, idx) => (
              <button
                key={item.ticker}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setSelectedIndex(idx);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  selectedIndex === idx
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.ticker}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Stock Banner */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg md:text-xl font-bold text-slate-100">{stock.name}</h3>
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {stock.ticker}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{stock.sector}</span>
          </div>

          <div className="text-right">
            <div className="text-base font-bold text-slate-100 tabular-nums">{stock.price}</div>
            <span
              className={`text-[11px] font-semibold ${
                stock.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
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
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {stock.status === 'halal' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="text-xs font-bold">{stock.statusLabel}</span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950/60 border border-current">
            AAOIFI No. 21
          </span>
        </div>

        {/* Criteria Meters */}
        <div className="space-y-3 text-xs">
          {/* Criterion 1: Business Activity */}
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">1. Core Business Permissibility</span>
              <span className="font-semibold text-emerald-400">
                {stock.status === 'halal' ? '100% Permissible' : 'Failed (Interest/Alcohol)'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stock.status === 'halal' ? 'bg-emerald-500 w-full' : 'bg-rose-500 w-2/3'
                }`}
              />
            </div>
          </div>

          {/* Criterion 2: Debt-to-Market Cap */}
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">2. Debt-to-Market Cap Ratio</span>
              <span
                className={`font-semibold tabular-nums ${
                  stock.debtPct <= 33 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {stock.debtRatio} (Threshold {stock.debtMax})
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stock.debtPct <= 33 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(stock.debtPct, 100)}%` }}
              />
            </div>
          </div>

          {/* Criterion 3: Cash & Interest Securities */}
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">3. Cash &amp; Interest Investments</span>
              <span
                className={`font-semibold tabular-nums ${
                  stock.cashPct <= 33 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {stock.cashRatio} (Threshold {stock.cashMax})
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
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
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Purification: <strong className="text-slate-300 font-medium">{stock.purification}</strong>
          </span>
          <Link
            href="/stocks"
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 transition-colors"
          >
            Explore 10,000+ Stocks
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
