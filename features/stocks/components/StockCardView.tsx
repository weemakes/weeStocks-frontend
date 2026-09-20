'use client';

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Check,
  X,
  Trophy,
  BarChart2,
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Halal
          </span>
        );
      case 'doubtful':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Under Review
          </span>
        );
      case 'non_compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Non-Compliant
          </span>
        );
    }
  };

  const getRankBadge = (rank?: number) => {
    if (!rank) return null;
    if (rank <= 3) {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          <Trophy className="w-3 h-3 text-amber-500" />
          #{rank}
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
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
          Try adjusting your search query, sector selection, or resetting the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {stocks.map((stock) => {
        const isPositive = stock.changePercent >= 0;
        const isZeroDebt = stock.shariah.debtRatioPercent === 0;
        const rank = stock.trader_indicators?.rank_in_country;
        const tier = stock.trader_indicators?.market_tier;
        const range52w = stock.trader_indicators?.range_52w_position;
        const currencySym = stock.currencySymbol || '﷼';

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
            className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 transition-all hover:bg-slate-50/60 dark:hover:bg-slate-850/50 cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Header: Avatar, Ticker, Exchange, Rank & Status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <CompanyLogo
                    src={stock.logo_url}
                    symbol={stock.symbol}
                    name={stock.name}
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {stock.exchange}
                      </span>
                      {rank && getRankBadge(rank)}
                      {isZeroDebt && (
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[9px] font-semibold rounded border border-emerald-500/20">
                          <Sparkles className="w-2.5 h-2.5" /> 0-Debt
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[190px]" title={stock.name}>
                      {stock.name}
                    </div>
                  </div>
                </div>

                <div>{getStatusBadge(stock.complianceStatus)}</div>
              </div>

              {/* Price & Change Banner */}
              <div className="flex items-baseline justify-between p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 mb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                    Current Price
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                    {currencySym}{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                    Day Move
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 font-bold text-xs tabular-nums px-1.5 py-0.5 rounded ${
                      isPositive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {isPositive ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* 52-Week Range Bar */}
              {posPct !== null && (
                <div className="mb-3 px-1">
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 tabular-nums mb-1">
                    <span>52W Low: {currencySym}{stock.fundamentals.week52Low?.toFixed(1) || '–'}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Pos: {posPct}%</span>
                    <span>High: {currencySym}{stock.fundamentals.week52High?.toFixed(1) || '–'}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, posPct))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Shariah Criteria Checklist */}
              <div className="space-y-1.5 text-xs mb-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    {stock.shariah.businessActivityStatus === 'pass' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    )}
                    Business Activity:
                  </span>
                  <span
                    className={`font-semibold ${
                      stock.shariah.businessActivityStatus === 'pass'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {stock.shariah.businessActivityStatus === 'pass' ? 'Halal Core' : 'Non-Permissible'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    {stock.shariah.debtRatioPercent <= 33 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    )}
                    Interest-Bearing Debt:
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      stock.shariah.debtRatioPercent <= 33
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {stock.shariah.debtRatioPercent}% (Max 33%)
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Stats: Market Cap & Volume */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-medium">Market Cap</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatMarketCap(stock.rawMarketCap || stock.marketCapCr * 10000000, stock.country)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-medium">Vol</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatVolume(stock.volume)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
