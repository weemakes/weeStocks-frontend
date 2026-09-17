'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, ArrowUpRight, ArrowDownRight, Sparkles, Check, X } from 'lucide-react';
import { StockItem } from '../types';
import { formatMarketCap } from '../utils/mappers';

interface StockCardViewProps {
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
}

export default function StockCardView({ stocks, onSelectStock }: StockCardViewProps) {
  const getStatusBadge = (status: StockItem['complianceStatus']) => {
    switch (status) {
      case 'compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Halal
          </span>
        );
      case 'doubtful':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Under Review
          </span>
        );
      case 'non_compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Non-Compliant
          </span>
        );
    }
  };

  if (stocks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
        <AlertTriangle className="w-10 h-10 text-amber-500 dark:text-amber-400 mx-auto mb-3 opacity-80" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-200 mb-1">No stocks match your filter criteria</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Try adjusting your search query, sector selection, or resetting the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
      {stocks.map((stock) => {
        const isPositive = stock.changePercent >= 0;
        const isZeroDebt = stock.shariah.debtRatioPercent === 0;

        return (
          <div
            key={stock.id}
            onClick={() => onSelectStock(stock)}
            className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-850/50 cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            {/* Top Row: Symbol, Sector, Compliance Badge */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-sm text-sky-600 dark:text-sky-400 group-hover:border-sky-500/50 transition-colors">
                    {stock.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {stock.symbol}
                      </span>
                      {stock.isNifty50 && (
                        <span className="px-1.5 py-0.2 bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded">
                          N50
                        </span>
                      )}
                      {isZeroDebt && (
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[9px] font-semibold rounded border border-emerald-500/20">
                          <Sparkles className="w-2.5 h-2.5" /> 0-Debt
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
                      {stock.name}
                    </div>
                  </div>
                </div>

                <div>{getStatusBadge(stock.complianceStatus)}</div>
              </div>

              {/* Price & Change Banner */}
              <div className="flex items-baseline justify-between p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800/80 mb-3">
                <div>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block uppercase">Current Price</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {stock.currencySymbol || '₹'}{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block uppercase">Day Move</span>
                  <span
                    className={`inline-flex items-center gap-0.5 font-bold text-xs tabular-nums ${
                      isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {isPositive ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Shariah Criteria Checklist */}
              <div className="space-y-1.5 text-xs mb-3">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    {stock.shariah.businessActivityStatus === 'pass' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    )}
                    Business Activity:
                  </span>
                  <span
                    className={`font-semibold ${
                      stock.shariah.businessActivityStatus === 'pass' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {stock.shariah.businessActivityStatus === 'pass' ? 'Halal Core' : 'Non-Permissible'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    {stock.shariah.debtRatioPercent <= 33 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    )}
                    Debt / Market Cap (&le;33%):
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      stock.shariah.debtRatioPercent <= 33 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {stock.shariah.debtRatioPercent.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Dividend Purification:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                    {stock.shariah.purificationPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: Market Cap & Action */}
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Mkt Cap: <span className="text-slate-800 dark:text-slate-300 font-semibold tabular-nums">{formatMarketCap(stock.marketCapCr * 10000000, stock.country)}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStock(stock);
                }}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors inline-flex items-center gap-1"
              >
                View Audit &rarr;
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
