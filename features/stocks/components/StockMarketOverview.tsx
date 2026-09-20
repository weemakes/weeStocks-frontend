'use client';

import React, { useEffect, useState } from 'react';
import { Layers, PieChart, Building2, BarChart2, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { MarketOverviewData, MarketSectorOverview } from '../types';
import { getMarketOverview } from '../api';

interface StockMarketOverviewProps {
  country: string;
  selectedSector?: string;
  onSelectSector: (sector: string) => void;
}

export default function StockMarketOverview({
  country,
  selectedSector,
  onSelectSector,
}: StockMarketOverviewProps) {
  const [overview, setOverview] = useState<MarketOverviewData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadOverview() {
      setLoading(true);
      try {
        const data = await getMarketOverview(country);
        if (isMounted) {
          setOverview(data);
        }
      } catch (err) {
        console.error('Failed to load market overview:', err);
        if (isMounted) setOverview(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOverview();
    return () => {
      isMounted = false;
    };
  }, [country]);

  if (loading && !overview) {
    return (
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm flex items-center justify-center gap-2 text-xs text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin text-sky-600 dark:text-sky-400" />
        <span>Loading market breakdown for {country}...</span>
      </div>
    );
  }

  if (!overview || !overview.top_sectors || overview.top_sectors.length === 0) {
    return null;
  }

  const sumOfSectorCounts = overview.top_sectors.reduce((acc, s) => acc + (Number(s.count) || 0), 0);
  const parsedSummaryTotal = overview.summary?.[0]?.total_companies ? Number(overview.summary[0].total_companies) : 0;
  const totalStocks = Number(overview.total_stocks || 0) || parsedSummaryTotal || sumOfSectorCounts;
  const topSector = overview.top_sectors[0];
  const topSectorCount = topSector ? (Number(topSector.count) || 0) : 0;
  const topSectorPct = topSector?.percentage
    ? parseFloat(String(topSector.percentage))
    : totalStocks > 0
    ? parseFloat(((topSectorCount / totalStocks) * 100).toFixed(1))
    : 0;

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm transition-colors">
      {/* Header & High-Level Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/20 via-sky-500/10 to-indigo-500/10 dark:from-sky-500/30 dark:to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Market Structure & Sector Breakdown
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                {country}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sectoral distribution & active equity concentration
            </p>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">Tradable Stocks:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalStocks.toLocaleString()}
            </span>
          </div>

          {topSector && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">Largest Sector:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                {topSector.sector}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                ({topSectorPct}%)
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">Active Sectors:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {overview.top_sectors.length}
            </span>
          </div>
        </div>
      </div>

      {/* Sector Pills / Progress Bars */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
          <span className="font-medium">Top Sectors (Click to filter screener)</span>
          {selectedSector && (
            <button
              type="button"
              onClick={() => onSelectSector('')}
              className="text-sky-600 dark:text-sky-400 hover:underline font-semibold text-[11px]"
            >
              Reset Sector Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {overview.top_sectors.map((sec) => {
            const isSelected = selectedSector === sec.sector;
            const secCount = Number(sec.count) || 0;
            const pct = sec.percentage
              ? parseFloat(String(sec.percentage))
              : totalStocks > 0
              ? parseFloat(((secCount / totalStocks) * 100).toFixed(1))
              : 0;

            return (
              <button
                key={sec.sector}
                type="button"
                onClick={() => onSelectSector(isSelected ? '' : sec.sector)}
                className={`flex flex-col p-2.5 rounded-xl border text-left transition-all group ${
                  isSelected
                    ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-500/10 dark:bg-sky-950/30'
                    : 'border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <span
                    className={`text-xs font-semibold truncate ${
                      isSelected
                        ? 'text-sky-700 dark:text-sky-300 font-bold'
                        : 'text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400'
                    }`}
                    title={sec.sector}
                  >
                    {sec.sector}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                      {sec.count}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                      ({pct}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSelected
                        ? 'bg-sky-500'
                        : 'bg-gradient-to-r from-sky-500 to-indigo-500 opacity-70 group-hover:opacity-100'
                    }`}
                    style={{ width: `${Math.min(Math.max(pct, 4), 100)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
