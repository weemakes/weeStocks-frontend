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
  Sparkles,
  Trophy,
} from 'lucide-react';
import { StockItem, StockSortField, SortDirection } from '../types';
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
      return <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-slate-500 opacity-60" />;
    }
    return isAsc ? (
      <ArrowUp className="w-3 h-3 text-sky-500 font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-sky-500 font-bold" />
    );
  };

  const getStatusBadge = (status: StockItem['complianceStatus']) => {
    switch (status) {
      case 'compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            Halal
          </span>
        );
      case 'doubtful':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            Review
          </span>
        );
      case 'non_compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            Haram
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
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          <Trophy className="w-2.5 h-2.5 text-amber-500" />
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
        <AlertTriangle className="w-10 h-10 text-amber-500 dark:text-amber-400 mx-auto mb-3 opacity-80" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-200 mb-1">
          No stocks match your filter criteria
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Try adjusting your search query, sector selection, market tier, or resetting presets.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm mb-6 transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Header */}
          <thead className="sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md z-20 border-b border-slate-200 dark:border-slate-800">
            <tr className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {/* Rank / Symbol / Company */}
              <th
                onClick={() => onSort('symbol')}
                className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Ticker & Company</span>
                  {getSortIcon('symbol')}
                </div>
              </th>

              {/* Sector & Tier */}
              <th className="px-3 py-3 hidden md:table-cell">Sector & Tier</th>

              {/* Price */}
              <th
                onClick={() => onSort('latest_price')}
                className="px-4 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
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
                className="px-4 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors hidden sm:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Market Cap</span>
                  {getSortIcon('market_cap')}
                </div>
              </th>

              {/* 52-Week Range */}
              <th className="px-4 py-3 text-center hidden lg:table-cell">
                <span>52W Range</span>
              </th>

              {/* Volume */}
              <th
                onClick={() => onSort('volume')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors hidden xl:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Volume</span>
                  {getSortIcon('volume')}
                </div>
              </th>

              {/* Shariah Status */}
              <th className="px-4 py-3 text-center">
                <span>Shariah Status</span>
              </th>

              {/* Action */}
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {stocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const isZeroDebt = stock.shariah.debtRatioPercent === 0;
              const rank = stock.trader_indicators?.rank_in_country;
              const tier = stock.trader_indicators?.market_tier;
              const range52w = stock.trader_indicators?.range_52w_position;
              const currencySym = stock.currencySymbol || '﷼';

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
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  {/* Symbol & Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {/* Rank Indicator */}
                      {rank && <div className="shrink-0">{getRankBadge(rank)}</div>}

                      {/* Company Logo */}
                      <CompanyLogo
                        src={stock.logo_url}
                        symbol={stock.symbol}
                        name={stock.name}
                        size="md"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            {stock.exchange}
                          </span>
                          {isZeroDebt && (
                            <span className="hidden sm:inline-flex items-center gap-0.5 px-1 py-0.2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[9px] font-semibold rounded border border-emerald-500/20">
                              <Sparkles className="w-2.5 h-2.5" /> 0-Debt
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-[220px]">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Sector & Tier */}
                  <td className="px-3 py-3 hidden md:table-cell">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800/80 rounded text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate max-w-[140px]">
                        {stock.sector}
                      </span>
                      {tier && getTierBadge(tier)}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                      {currencySym}{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                      P/E: {stock.fundamentals.peRatio ? stock.fundamentals.peRatio.toFixed(1) : '–'}
                    </div>
                  </td>

                  {/* 24h Change */}
                  <td className="px-3 py-3 text-right">
                    <div
                      className={`font-semibold tabular-nums inline-flex items-center justify-end gap-0.5 px-1.5 py-0.5 rounded text-xs ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
                      {isPositive ? '+' : ''}{currencySym}{stock.change.toFixed(2)}
                    </div>
                  </td>

                  {/* Market Cap */}
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <div className="text-slate-900 dark:text-slate-100 font-semibold tabular-nums">
                      {formatMarketCap(stock.rawMarketCap || stock.marketCapCr * 10000000, stock.country)}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {stock.marketCapCategory}
                    </div>
                  </td>

                  {/* 52-Week Range Bar */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {posPct !== null ? (
                      <div className="w-28 mx-auto">
                        <div className="flex justify-between text-[9px] text-slate-400 tabular-nums mb-1">
                          <span>{stock.fundamentals.week52Low ? stock.fundamentals.week52Low.toFixed(0) : 'L'}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{posPct}%</span>
                          <span>{stock.fundamentals.week52High ? stock.fundamentals.week52High.toFixed(0) : 'H'}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-sky-500 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, Math.max(0, posPct))}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-center block text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Volume */}
                  <td className="px-3 py-3 text-right hidden xl:table-cell tabular-nums text-slate-600 dark:text-slate-400 font-medium">
                    {formatVolume(stock.volume)}
                  </td>

                  {/* Shariah Status */}
                  <td className="px-4 py-3 text-center">
                    {getStatusBadge(stock.complianceStatus)}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStock(stock);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>Analysis</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
