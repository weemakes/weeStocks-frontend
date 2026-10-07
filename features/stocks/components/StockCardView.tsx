'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  Trophy,
  ChevronRight,
} from 'lucide-react';
import { StockItem } from '../types';
import { formatMarketCap } from '../utils/mappers';
import CompanyLogo from './CompanyLogo';

interface StockCardViewProps {
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
}

function formatVolume(val: number | undefined): string {
  if (!val) return '—';
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toLocaleString();
}

export default function StockCardView({ stocks, onSelectStock }: StockCardViewProps) {
  const getStatusBadge = (status: StockItem['complianceStatus']) => {
    switch (status) {
      case 'compliant':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 border border-emerald-500/30 dark:text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            <span>Halal</span>
          </span>
        );
      case 'doubtful':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-600 border border-amber-500/30 dark:text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            <span>Review</span>
          </span>
        );
      case 'non_compliant':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-semibold text-rose-600 border border-rose-500/30 dark:text-rose-400">
            <XCircle className="h-3 w-3" />
            <span>Haram</span>
          </span>
        );
    }
  };

  const getRankBadge = (rank?: number) => {
    if (!rank) return null;
    if (rank <= 3) {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          <Trophy className="h-2.5 w-2.5 text-amber-500" />
          #{rank}
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
        #{rank}
      </span>
    );
  };

  if (stocks.length === 0) {
    return (
      <div className="p-12 text-center">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-amber-500 dark:text-amber-400 opacity-80" />
        <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-100">
          No equities match your filter criteria
        </h3>
        <p className="mx-auto max-w-md text-xs text-slate-500 dark:text-slate-400">
          Try resetting the search keyword or broadening your compliance filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {stocks.map((stock) => {
        const isPositive = stock.changePercent >= 0;
        const rank = stock.trader_indicators?.rank_in_country;
        const currencySym = stock.currencySymbol || '₹';
        const range52w = stock.trader_indicators?.range_52w_position;

        let posPct = range52w !== undefined && range52w !== null ? range52w : null;
        if (posPct === null && stock.fundamentals.week52High > stock.fundamentals.week52Low) {
          posPct = Math.round(
            ((stock.price - stock.fundamentals.week52Low) /
              (stock.fundamentals.week52High - stock.fundamentals.week52Low)) *
              100
          );
        }

        return (
          <div
            key={stock.id}
            onClick={() => onSelectStock(stock)}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 sm:p-4 shadow-xs transition-all hover:border-sky-500/40 hover:shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90 dark:hover:border-sky-500/30 cursor-pointer"
          >
            <div>
              {/* Header: Logo, Ticker, Exchange & Status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CompanyLogo
                    src={stock.logo_url}
                    symbol={stock.symbol}
                    name={stock.name}
                    size="md"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 transition-colors group-hover:text-sky-600 dark:text-slate-100 dark:group-hover:text-sky-400">
                        {stock.symbol}
                      </span>
                      <span className="rounded bg-slate-100 px-1 py-0.2 text-[9px] font-semibold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {stock.exchange}
                      </span>
                      {rank && getRankBadge(rank)}
                    </div>
                    <Link href={`/stocks/${encodeURIComponent(stock.symbol)}${stock.country && stock.country !== 'India' ? `?${new URLSearchParams({ country: stock.country })}` : ''}`} onClick={(event) => event.stopPropagation()} className="truncate text-xs text-slate-500 dark:text-slate-400 hover:underline" title={stock.name}>{stock.name}</Link>
                  </div>
                </div>

                <div className="shrink-0">{getStatusBadge(stock.complianceStatus)}</div>
              </div>

              {/* Price & Change Banner */}
              <div className="flex items-baseline justify-between rounded-xl bg-slate-50/80 px-3 py-2 border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-950/60 mb-3">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Latest Price
                  </span>
                  <span className="font-mono text-base font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                    {stock.price > 0
                      ? `${currencySym}${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Day Move
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 font-mono text-xs font-bold tabular-nums ${
                      isPositive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* 52-Week Range Bar */}
              {posPct !== null && (
                <div className="mb-3 px-0.5">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                    <span>52W Low: {currencySym}{stock.fundamentals.week52Low?.toFixed(1) || '—'}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{posPct}%</span>
                    <span>High: {currencySym}{stock.fundamentals.week52High?.toFixed(1) || '—'}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, posPct))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Shariah Criteria Summary */}
              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs mb-3">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    {stock.shariah.businessActivityStatus === 'pass' ? (
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                    )}
                    Core Business:
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {stock.sector}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    {stock.shariah.debtRatioPercent <= 33 ? (
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                    )}
                    Debt / MCap:
                  </span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    {stock.shariah.debtRatioPercent > 0 ? `${stock.shariah.debtRatioPercent}% (≤33%)` : 'Compliant'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Stats & Action */}
            <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-medium">Market Cap</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatMarketCap(stock.rawMarketCap || stock.marketCapCr * 10000000, stock.country)}
                </span>
              </div>
              <div className="text-right flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform">
                <span>Analysis</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
