'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Flame, ChevronRight, Loader2 } from 'lucide-react';
import { MarketMoverItem } from '../types';
import { getMarketMovers } from '../api';
import { getCurrencySymbol } from '../utils/mappers';

interface StockMarketMoversProps {
  country: string;
  onSelectStock: (symbol: string) => void;
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Market Movers ({country})
            </h2>
            <span className="text-[10px] text-slate-400">
              Live momentum leaders & high volume tickers
            </span>
          </div>
        </div>

        {/* Mover Tabs */}
        <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
          <button
            type="button"
            onClick={() => setMoverType('gainers')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              moverType === 'gainers'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Top Gainers</span>
          </button>
          <button
            type="button"
            onClick={() => setMoverType('losers')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              moverType === 'losers'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            <span>Top Losers</span>
          </button>
          <button
            type="button"
            onClick={() => setMoverType('active')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              moverType === 'active'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Most Active</span>
          </button>
        </div>
      </div>

      {/* Movers Cards Strip */}
      {loading ? (
        <div className="h-20 flex items-center justify-center text-xs text-slate-500 gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          <span>Loading market movers for {country}...</span>
        </div>
      ) : movers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {movers.map((m) => {
            const changePctNum = Number(m.change_percentage || 0);
            const isPositive = changePctNum >= 0;
            return (
              <div
                key={m.id || m.symbol}
                onClick={() => onSelectStock && onSelectStock(m.symbol)}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 p-2.5 rounded-xl cursor-pointer transition-all hover:bg-slate-800/40 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-xs text-slate-100 group-hover:text-sky-400 transition-colors">
                      {m.symbol}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">{m.exchange}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mb-2">
                    {m.company_name}
                  </p>
                </div>

                <div className="flex items-baseline justify-between gap-1 pt-1.5 border-t border-slate-800/60">
                  <span className="text-xs font-bold text-slate-200 tabular-nums">
                    {currencySym}{Number(m.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`text-[11px] font-bold tabular-nums flex items-center gap-0.5 ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPositive ? '+' : ''}{changePctNum.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-4 text-center text-xs text-slate-500">
          No mover data currently recorded for {country}. Track live listings below.
        </div>
      )}
    </div>
  );
}
