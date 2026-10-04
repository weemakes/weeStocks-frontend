'use client';

import React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { StockItem } from '../types';
import { formatMarketCap } from '../utils/mappers';
import CompanyLogo from './CompanyLogo';

interface StockTableViewProps {
  stocks: StockItem[];
  sortField: string;
  sortDirection: 'ASC' | 'DESC' | 'asc' | 'desc';
  onSort: (field: any) => void;
  onSelectStock: (stock: StockItem) => void;
}

function formatVolume(val: number | undefined): string {
  if (!val) return '—';
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toLocaleString();
}

export default function StockTableView({
  stocks,
  sortField,
  sortDirection,
  onSort,
  onSelectStock,
}: StockTableViewProps) {
  const isAsc = sortDirection.toLowerCase() === 'asc';

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400 dark:text-slate-500 opacity-60" />;
    }
    return isAsc ? (
      <ArrowUp className="h-3 w-3 text-sky-500 font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-sky-500 font-bold" />
    );
  };

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

  const getTierBadge = (tier?: string) => {
    if (!tier) return null;
    const clean = tier.replace('_', ' ');
    let color = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    if (tier === 'MEGA_CAP') {
      color = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    } else if (tier === 'LARGE_CAP') {
      color = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    } else if (tier === 'MID_CAP') {
      color = 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
    } else if (tier === 'SMALL_CAP') {
      color = 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
    return (
      <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase tracking-wider ${color}`}>
        {clean}
      </span>
    );
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
          Try resetting the search keyword, changing the sector selection, or expanding market tiers.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto relative scroll-smooth">
      <table className="w-full border-collapse text-left text-xs">
          {/* Table Header */}
          <thead className="sticky top-0 z-20 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/95">
            <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {/* Ticker & Company - STICKY LEFT ON MOBILE AND DESKTOP */}
              <th
                onClick={() => onSort('symbol')}
                className="sticky left-0 z-30 bg-slate-50/95 dark:bg-slate-950/95 px-3.5 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] dark:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Ticker & Company</span>
                  {getSortIcon('symbol')}
                </div>
              </th>

              {/* Sector & Market Tier */}
              <th className="hidden md:table-cell px-3 py-3">Sector & Tier</th>

              {/* Latest Price */}
              <th
                onClick={() => onSort('latest_price')}
                className="px-3.5 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Price</span>
                  {getSortIcon('latest_price')}
                </div>
              </th>

              {/* 24h Change */}
              <th
                onClick={() => onSort('change_percentage')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Change</span>
                  {getSortIcon('change_percentage')}
                </div>
              </th>

              {/* Market Cap */}
              <th
                onClick={() => onSort('market_cap')}
                className="hidden sm:table-cell px-3.5 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Market Cap</span>
                  {getSortIcon('market_cap')}
                </div>
              </th>

              {/* 52-Week Range */}
              <th className="hidden lg:table-cell px-3.5 py-3 text-center">
                <span>52W Range</span>
              </th>

              {/* Volume */}
              <th
                onClick={() => onSort('volume')}
                className="hidden xl:table-cell px-3 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Volume</span>
                  {getSortIcon('volume')}
                </div>
              </th>

              {/* AAOIFI Shariah Status */}
              <th className="px-3 py-3 text-center">
                <span>Shariah Status</span>
              </th>

              {/* Action */}
              <th className="px-3 py-3 text-right">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {stocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const rank = stock.trader_indicators?.rank_in_country;
              const tier = stock.trader_indicators?.market_tier;
              const range52w = stock.trader_indicators?.range_52w_position;
              const currencySym = stock.currencySymbol || '₹';

              // Calculate range position if missing
              let posPct = range52w !== undefined && range52w !== null ? range52w : null;
              if (posPct === null && stock.fundamentals.week52High > stock.fundamentals.week52Low) {
                posPct = Math.round(
                  ((stock.price - stock.fundamentals.week52Low) /
                    (stock.fundamentals.week52High - stock.fundamentals.week52Low)) *
                    100
                );
              }

              return (
                <tr
                  key={stock.id}
                  onClick={() => onSelectStock(stock)}
                  className="group cursor-pointer transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/40"
                >
                  {/* Ticker & Company - STICKY LEFT ON MOBILE & DESKTOP */}
                  <td className="sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/90 px-3.5 py-2.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] dark:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] transition-colors">
                    <div className="flex items-center gap-2">
                      {rank && <div className="shrink-0">{getRankBadge(rank)}</div>}

                      <CompanyLogo
                        src={stock.logo_url}
                        symbol={stock.symbol}
                        name={stock.name}
                        size="md"
                      />

                      <div className="min-w-0 max-w-[130px] sm:max-w-[180px] md:max-w-[210px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm tracking-tight text-slate-900 group-hover:text-sky-600 dark:text-slate-100 dark:group-hover:text-sky-400 transition-colors">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            {stock.exchange}
                          </span>
                        </div>
                        <div className="truncate text-[11px] text-slate-500 dark:text-slate-400" title={stock.name}>
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Sector & Market Tier */}
                  <td className="hidden md:table-cell px-3 py-2.5">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="truncate max-w-[130px] rounded bg-slate-100 px-1.5 py-0.2 text-[11px] font-medium text-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                        {stock.sector}
                      </span>
                      {tier && getTierBadge(tier)}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-3.5 py-2.5 text-right font-mono tabular-nums">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {stock.price > 0
                        ? `${currencySym}${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '—'}
                    </div>
                    {stock.fundamentals.peRatio > 0 && (
                      <div className="text-[10px] text-slate-400">
                        P/E {stock.fundamentals.peRatio.toFixed(1)}
                      </div>
                    )}
                  </td>

                  {/* 24h Change */}
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                    <div
                      className={`inline-flex items-center justify-end rounded px-1.5 py-0.2 text-xs font-semibold ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                    {stock.change !== 0 && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {isPositive ? '+' : ''}{currencySym}{stock.change.toFixed(2)}
                      </div>
                    )}
                  </td>

                  {/* Market Cap */}
                  <td className="hidden sm:table-cell px-3.5 py-2.5 text-right font-mono tabular-nums">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatMarketCap(stock.rawMarketCap || stock.marketCapCr * 10000000, stock.country)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {stock.marketCapCategory}
                    </div>
                  </td>

                  {/* 52W Range */}
                  <td className="hidden lg:table-cell px-3.5 py-2.5">
                    {posPct !== null ? (
                      <div className="w-24 mx-auto">
                        <div className="flex justify-between text-[9px] text-slate-400 font-mono mb-0.5">
                          <span>{stock.fundamentals.week52Low ? stock.fundamentals.week52Low.toFixed(0) : 'L'}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{posPct}%</span>
                          <span>{stock.fundamentals.week52High ? stock.fundamentals.week52High.toFixed(0) : 'H'}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-sky-500 transition-all"
                            style={{ width: `${Math.min(100, Math.max(0, posPct))}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-center block text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Volume */}
                  <td className="hidden xl:table-cell px-3 py-2.5 text-right font-mono text-slate-600 dark:text-slate-400 font-medium">
                    {formatVolume(stock.volume)}
                  </td>

                  {/* Shariah Status */}
                  <td className="px-3 py-2.5 text-center">
                    {getStatusBadge(stock.complianceStatus)}
                  </td>

                  {/* Action */}
                  <td className="px-3 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStock(stock);
                      }}
                      className="inline-flex items-center gap-0.5 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
                    >
                      <span className="hidden sm:inline">Analyze</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  );
}
