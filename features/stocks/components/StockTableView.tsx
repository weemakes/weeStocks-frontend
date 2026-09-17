'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ShieldCheck, AlertTriangle, XCircle, ChevronRight, Sparkles } from 'lucide-react';
import { StockItem, StockSortField, SortDirection } from '../types';
import { formatMarketCap } from '../utils/mappers';

interface StockTableViewProps {
  stocks: StockItem[];
  sortField: StockSortField;
  sortDirection: SortDirection;
  onSort: (field: StockSortField) => void;
  onSelectStock: (stock: StockItem) => void;
}

export default function StockTableView({
  stocks,
  sortField,
  sortDirection,
  onSort,
  onSelectStock,
}: StockTableViewProps) {
  const getSortIcon = (field: StockSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-60" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-sky-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-sky-400" />
    );
  };

  const getStatusBadge = (status: StockItem['complianceStatus']) => {
    switch (status) {
      case 'compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            Halal
          </span>
        );
      case 'doubtful':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            Review
          </span>
        );
      case 'non_compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            Haram
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
          Try adjusting your search query, sector selection, or resetting the filters to view the full market universe.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm mb-6 transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Sticky Header with high-density StockeZee spacing */}
          <thead className="sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md z-20 border-b border-slate-200 dark:border-slate-800">
            <tr className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {/* Company & Symbol */}
              <th
                onClick={() => onSort('symbol')}
                className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Symbol & Company</span>
                  {getSortIcon('symbol')}
                </div>
              </th>

              {/* Sector */}
              <th className="px-3 py-3 hidden md:table-cell">Sector</th>

              {/* CMP / Price */}
              <th
                onClick={() => onSort('price')}
                className="px-4 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Price</span>
                  {getSortIcon('price')}
                </div>
              </th>

              {/* 24h Change */}
              <th
                onClick={() => onSort('changePercent')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>24h Change</span>
                  {getSortIcon('changePercent')}
                </div>
              </th>

              {/* Market Cap */}
              <th
                onClick={() => onSort('marketCapCr')}
                className="px-4 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors hidden sm:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Market Cap</span>
                  {getSortIcon('marketCapCr')}
                </div>
              </th>

              {/* Debt / Cap (<33%) */}
              <th
                onClick={() => onSort('debtRatio')}
                className="px-4 py-3 text-left cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors hidden lg:table-cell"
              >
                <div className="flex items-center gap-1.5">
                  <span>Debt / Cap (&lt;33%)</span>
                  {getSortIcon('debtRatio')}
                </div>
              </th>

              {/* Purification % */}
              <th
                onClick={() => onSort('purification')}
                className="px-3 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors hidden xl:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Purification</span>
                  {getSortIcon('purification')}
                </div>
              </th>

              {/* Halal Score / Status */}
              <th
                onClick={() => onSort('halalScore')}
                className="px-4 py-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Halal Score</span>
                  {getSortIcon('halalScore')}
                </div>
              </th>

              {/* Action */}
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {stocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const isDebtPass = stock.shariah.debtRatioPercent < 33;
              const isZeroDebt = stock.shariah.debtRatioPercent === 0;

              return (
                <tr
                  key={stock.id}
                  onClick={() => onSelectStock(stock)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  {/* Symbol & Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center font-bold text-xs text-sky-600 dark:text-sky-400 group-hover:border-sky-500/50 group-hover:shadow-sm transition-all shrink-0">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {stock.symbol}
                          </span>
                          {stock.isNifty50 && (
                            <span className="px-1.5 py-0.2 bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded">
                              N50
                            </span>
                          )}
                          {isZeroDebt && (
                            <span className="hidden sm:inline-flex items-center gap-0.5 px-1 py-0.2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[9px] font-semibold rounded border border-emerald-500/20">
                              <Sparkles className="w-2.5 h-2.5" /> 0-Debt
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Sector */}
                  <td className="px-3 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800/80 rounded text-[11px] text-slate-700 dark:text-slate-300">
                      {stock.sector}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                      {stock.currencySymbol || '₹'}{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                      P/E: {stock.fundamentals.peRatio ? stock.fundamentals.peRatio.toFixed(1) : '–'}
                    </div>
                  </td>

                  {/* 24h Change */}
                  <td className="px-3 py-3 text-right">
                    <div
                      className={`font-semibold tabular-nums inline-flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {isPositive ? '+' : ''}{stock.currencySymbol || '₹'}{stock.change.toFixed(2)}
                    </div>
                  </td>

                  {/* Market Cap */}
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <div className="text-slate-800 dark:text-slate-200 font-medium tabular-nums">
                      {formatMarketCap(stock.marketCapCr * 10000000, stock.country)}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{stock.marketCapCategory}</div>
                  </td>

                  {/* Debt Ratio */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2 max-w-[140px]">
                      <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full ${
                            stock.shariah.debtRatioPercent > 33
                              ? 'bg-rose-500'
                              : stock.shariah.debtRatioPercent > 25
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (stock.shariah.debtRatioPercent / 33) * 100)}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          isDebtPass ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {stock.shariah.debtRatioPercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Threshold &le;33%</div>
                  </td>

                  {/* Purification */}
                  <td className="px-3 py-3 text-right hidden xl:table-cell">
                    <div className="text-slate-800 dark:text-slate-300 font-medium tabular-nums">
                      {stock.shariah.purificationPercent.toFixed(2)}%
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">of dividend</div>
                  </td>

                  {/* Halal Score & Badge */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {getStatusBadge(stock.complianceStatus)}
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                        Score: {stock.halalScore}/100
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStock(stock);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-lg transition-all"
                    >
                      Audit
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
