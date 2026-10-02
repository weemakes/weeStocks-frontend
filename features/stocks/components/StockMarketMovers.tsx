'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Flame, ChevronRight, Loader2, BarChart2 } from 'lucide-react';
import { MarketMoverItem } from '../types';
import { getMarketMovers } from '../api';
import { getCurrencySymbol } from '../utils/mappers';

interface StockMarketMoversProps {
  country: string;
  onSelectStock: (symbol: string) => void;
}

function formatVolume(val: number | string | undefined): string {
  if (!val) return '—';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '—';
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toLocaleString();
}

export default function StockMarketMovers({ country, onSelectStock }: StockMarketMoversProps) {
  const [moverType, setMoverType] = useState<'gainers' | 'losers' | 'active'>('gainers');
  const [movers, setMovers] = useState<MarketMoverItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMovers() {
      setLoading(true);
      try {
        const data = await getMarketMovers(country, moverType, 5);
        if (isMounted) {
          setMovers(data);
        }
      } catch (err) {
        console.error('Failed to load market movers:', err);
        if (isMounted) setMovers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMovers();
    return () => {
      isMounted = false;
    };
  }, [country, moverType]);

  const currencySym = getCurrencySymbol(country);

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 transition-colors">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Market Movers ({country})
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Live momentum leaders & high volume tickers
            </span>
          </div>
        </div>

        {/* Mover Tabs */}
        <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => setMoverType('gainers')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              moverType === 'gainers'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Top Gainers</span>
          </button>
          <button
            type="button"
            onClick={() => setMoverType('losers')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              moverType === 'losers'
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Top Losers</span>
          </button>
          <button
            type="button"
            onClick={() => setMoverType('active')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              moverType === 'active'
                ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Most Active</span>
          </button>
        </div>
      </div>

      {/* Movers Cards Strip */}
      {loading ? (
        <div className="h-24 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-sky-600 dark:text-sky-400" />
          <span>Loading market movers for {country}...</span>
        </div>
      ) : movers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {movers.map((m, idx) => {
            const changePctNum = Number(m.change_percentage || 0);
            const isPositive = changePctNum >= 0;
            return (
              <div
                key={m.id || m.symbol}
                onClick={() => onSelectStock && onSelectStock(m.symbol)}
                className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 p-3 rounded-xl cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {m.symbol}
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-500 uppercase px-1 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800/60">
                      {m.exchange}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-2" title={m.company_name}>
                    {m.company_name}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/60">
                  <div className="flex items-baseline justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {currencySym}{Number(m.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}{changePctNum.toFixed(2)}%
                    </span>
                  </div>
                  {m.volume && (
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>Vol:</span>
                      <span className="font-medium tabular-nums text-slate-600 dark:text-slate-400">
                        {formatVolume(m.volume)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-500">
          No mover data currently recorded for {country}. Track live listings below.
        </div>
      )}
    </div>
  );
}
