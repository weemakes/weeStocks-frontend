'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  PieChart,
  Loader2,
  X,
} from 'lucide-react';
import { MarketOverviewData, MarketMoverItem } from '../types';
import { getMarketOverview, getMarketMovers } from '../api';
import { getCurrencySymbol } from '../utils/mappers';

interface StockMarketPulseProps {
  country: string;
  selectedSector?: string;
  onSelectSector: (sector: string) => void;
  onSelectStock: (symbol: string) => void;
}

const SECTOR_DOTS = [
  'bg-sky-500',
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-cyan-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-blue-400',
  'bg-slate-400',
];

export default function StockMarketPulse({
  country,
  selectedSector,
  onSelectSector,
  onSelectStock,
}: StockMarketPulseProps) {
  const [pulseMode, setPulseMode] = useState<'gainers' | 'losers' | 'active' | 'sectors'>('gainers');

  // Data states
  const [overview, setOverview] = useState<MarketOverviewData | null>(null);
  const [movers, setMovers] = useState<MarketMoverItem[]>([]);
  const [loadingMovers, setLoadingMovers] = useState(false);
  const [loadingOverview, setLoadingOverview] = useState(false);

  // Load Overview Data
  useEffect(() => {
    let isMounted = true;
    async function loadOverview() {
      setLoadingOverview(true);
      try {
        const data = await getMarketOverview(country);
        if (isMounted) setOverview(data);
      } catch (err) {
        console.error('Failed to load market overview:', err);
        if (isMounted) setOverview(null);
      } finally {
        if (isMounted) setLoadingOverview(false);
      }
    }
    loadOverview();
    return () => {
      isMounted = false;
    };
  }, [country]);

  // Load Movers Data
  useEffect(() => {
    if (pulseMode === 'sectors') return;
    let isMounted = true;
    async function loadMovers() {
      setLoadingMovers(true);
      try {
        const data = await getMarketMovers(country, pulseMode as 'gainers' | 'losers' | 'active', 6);
        if (isMounted) setMovers(data);
      } catch (err) {
        console.error('Failed to load market movers:', err);
        if (isMounted) setMovers([]);
      } finally {
        if (isMounted) setLoadingMovers(false);
      }
    }
    loadMovers();
    return () => {
      isMounted = false;
    };
  }, [country, pulseMode]);

  const currencySym = getCurrencySymbol(country);

  const totalStocks = useMemo(() => {
    if (!overview) return 0;
    const sumSectors = overview.top_sectors?.reduce((acc, s) => acc + (Number(s.count) || 0), 0) || 0;
    const summaryTotal = overview.summary?.[0]?.total_companies ? Number(overview.summary[0].total_companies) : 0;
    return Number(overview.total_stocks || 0) || summaryTotal || sumSectors;
  }, [overview]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
      {/* Pulse Controls & Mode Selector */}
      <div className="flex items-center gap-1.5 shrink-0 pr-2 sm:border-r border-slate-200 dark:border-slate-800">
        <span className="relative flex h-2 w-2 mr-1">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800 dark:text-slate-200 mr-1 hidden sm:inline">
          Pulse:
        </span>

        {/* Mode Selector Buttons */}
        <div className="inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setPulseMode('gainers')}
            className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
              pulseMode === 'gainers'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            Gainers
          </button>
          <button
            type="button"
            onClick={() => setPulseMode('losers')}
            className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
              pulseMode === 'losers'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            Losers
          </button>
          <button
            type="button"
            onClick={() => setPulseMode('active')}
            className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
              pulseMode === 'active'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setPulseMode('sectors')}
            className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              pulseMode === 'sectors'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            <span>Sectors</span>
            {selectedSector && selectedSector !== 'All' && (
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
            )}
          </button>
        </div>
      </div>

      {/* Stream Area: Horizontal Ticker Stream (Movers or Sectors) */}
      <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth">
        {pulseMode !== 'sectors' ? (
          /* Live Ticker Tape for Movers */
          <div className="flex items-center gap-3 sm:gap-4 whitespace-nowrap min-w-max py-0.5">
            {loadingMovers ? (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs py-0.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-500" />
                <span>Loading live market movers...</span>
              </div>
            ) : movers.length > 0 ? (
              movers.map((m, idx) => {
                const chg = Number(m.change_percentage || 0);
                const isPos = chg >= 0;
                return (
                  <button
                    key={m.id || m.symbol}
                    type="button"
                    onClick={() => onSelectStock(m.symbol)}
                    className="group inline-flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    <span className="font-mono text-[10px] text-slate-400">#{idx + 1}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                      {m.symbol}
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                      {currencySym}{Number(m.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`font-mono font-bold text-[11px] px-1 py-0.2 rounded ${
                        isPos
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isPos ? '+' : ''}{chg.toFixed(2)}%
                    </span>
                  </button>
                );
              })
            ) : (
              <span className="text-slate-400 text-xs py-0.5">
                No active momentum leaders recorded right now.
              </span>
            )}
          </div>
        ) : (
          /* Live Sector Distribution Ribbon */
          <div className="flex items-center gap-1.5 whitespace-nowrap min-w-max py-0.5">
            {selectedSector && selectedSector !== 'All' && (
              <button
                type="button"
                onClick={() => onSelectSector('')}
                className="inline-flex items-center gap-1 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400 px-2 py-0.5 font-bold text-[11px] hover:bg-sky-500/25 transition-colors cursor-pointer mr-1"
              >
                <span>Reset ({selectedSector})</span>
                <X className="h-3 w-3" />
              </button>
            )}

            {overview?.top_sectors && overview.top_sectors.length > 0 ? (
              overview.top_sectors.map((sec, idx) => {
                const isSelected = selectedSector === sec.sector;
                const secCount = Number(sec.count) || 0;
                const pct = sec.percentage
                  ? parseFloat(String(sec.percentage))
                  : totalStocks > 0
                  ? parseFloat(((secCount / totalStocks) * 100).toFixed(1))
                  : 0;
                const dotColor = SECTOR_DOTS[idx % SECTOR_DOTS.length];

                return (
                  <button
                    key={sec.sector}
                    type="button"
                    onClick={() => onSelectSector(isSelected ? '' : sec.sector)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : dotColor}`}></span>
                    <span>{sec.sector}</span>
                    <span className={`font-mono text-[10px] ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                      {pct}%
                    </span>
                  </button>
                );
              })
            ) : (
              <span className="text-slate-400 text-xs py-0.5">Loading sector metrics...</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
