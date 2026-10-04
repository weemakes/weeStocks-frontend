'use client';

import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
} from 'recharts';
import { LineChart } from 'lucide-react';
import { StockCandle } from '../types';
import { useTheme } from '@/components/theme/useTheme';
import { formatSafePct } from '../utils/mappers';

interface StockCandleChartProps {
  candles: StockCandle[];
  currencySymbol?: string;
  loading?: boolean;
  range?: string;
  chartRanges?: readonly { label: string; range: string; interval: string }[];
  onRangeChange?: (range: any) => void;
  performance?: {
    return_1w_pct?: number | null;
    return_1m_pct?: number | null;
    return_3m_pct?: number | null;
    return_6m_pct?: number | null;
    return_1y_pct?: number | null;
    return_3y_pct?: number | null;
  } | null;
}

export default function StockCandleChart({
  candles,
  currencySymbol = '₹',
  loading = false,
  range = '1Y',
  chartRanges,
  onRangeChange,
  performance,
}: StockCandleChartProps) {
  const { isDark } = useTheme();
  const gridStroke = isDark ? '#1E293B' : '#F1F5F9';
  const axisTextFill = isDark ? '#94A3B8' : '#64748B';

  const [hoveredData, setHoveredData] = useState<StockCandle | null>(null);

  // Sanitize candles
  const chartData = useMemo(() => {
    return (candles || [])
      .filter((c) => c && typeof c.close === 'number' && c.close > 0 && !isNaN(c.close))
      .map((c) => {
        const close = Number(c.close);
        const open = typeof c.open === 'number' && c.open > 0 ? c.open : close;
        const high = typeof c.high === 'number' && c.high > 0 ? Math.max(c.high, open, close) : Math.max(open, close);
        const low = typeof c.low === 'number' && c.low > 0 ? Math.min(c.low, open, close) : Math.min(open, close);
        return {
          ...c,
          open,
          high,
          low,
          close,
          volume: Number(c.volume || 0),
          isGreen: close >= open,
        };
      });
  }, [candles]);

  // Compute zoomed domain with proportional breathing room
  const { minPrice, maxPrice } = useMemo(() => {
    if (!chartData.length) return { minPrice: 0, maxPrice: 100 };
    const min = Math.min(...chartData.map((c) => c.low));
    const max = Math.max(...chartData.map((c) => c.high));
    const delta = max - min;
    const padding = delta > 0 ? Math.max(delta * 0.08, min * 0.01) : min * 0.05;
    return {
      minPrice: Math.max(0, Math.floor(min - padding)),
      maxPrice: Math.ceil(max + padding),
    };
  }, [chartData]);

  const latestCandle = chartData[chartData.length - 1];
  const firstCandle = chartData[0];
  const displayCandle = hoveredData || latestCandle;

  const isOverallUp = useMemo(() => {
    if (chartData.length < 2) return true;
    return chartData[chartData.length - 1].close >= chartData[0].close;
  }, [chartData]);

  const periodHigh = useMemo(() => {
    if (!chartData.length) return 0;
    return Math.max(...chartData.map((c) => c.high || c.close));
  }, [chartData]);

  const periodLow = useMemo(() => {
    if (!chartData.length) return 0;
    return Math.min(...chartData.map((c) => c.low || c.close));
  }, [chartData]);

  const periodReturn = useMemo(() => {
    if (!firstCandle || !displayCandle) return { diff: 0, pct: 0, isUp: true };
    const diff = displayCandle.close - firstCandle.close;
    const pct = firstCandle.close > 0 ? (diff / firstCandle.close) * 100 : 0;
    return { diff, pct, isUp: diff >= 0 };
  }, [firstCandle, displayCandle]);

  const isIntraday = useMemo(() => {
    return chartData.some((c) => c.date?.includes('T') || c.date?.includes(':'));
  }, [chartData]);

  // Compute clean, evenly-spaced trader intervals for the X-axis based on range
  const smartTicks = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    if (chartData.length <= 6) return chartData.map((c) => c.date);

    const dur = (range || '').toLowerCase();

    // 1D (Intraday): 5 clean hourly ticks
    if (dur === '1d' || isIntraday) {
      const count = Math.min(5, chartData.length);
      const step = (chartData.length - 1) / (count - 1);
      return Array.from({ length: count }, (_, i) => chartData[Math.round(i * step)].date);
    }

    // 1W: 5 daily ticks
    if (dur === '1w') {
      const count = Math.min(5, chartData.length);
      const step = (chartData.length - 1) / (count - 1);
      return Array.from({ length: count }, (_, i) => chartData[Math.round(i * step)].date);
    }

    // 1M: 5 weekly ticks
    if (dur === '1m') {
      const count = 5;
      const step = (chartData.length - 1) / (count - 1);
      return Array.from({ length: count }, (_, i) => chartData[Math.round(i * step)].date);
    }

    // 3M: 5 bi-weekly ticks
    if (dur === '3m') {
      const count = 5;
      const step = (chartData.length - 1) / (count - 1);
      return Array.from({ length: count }, (_, i) => chartData[Math.round(i * step)].date);
    }

    // 6M: Monthly intervals
    if (dur === '6m') {
      const monthMap = new Map<string, string>();
      chartData.forEach((c) => {
        if (!c.date) return;
        const d = new Date(c.date);
        const key = !isNaN(d.getTime())
          ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          : c.date.slice(0, 7);
        if (!monthMap.has(key)) monthMap.set(key, c.date);
      });
      const monthTicks = Array.from(monthMap.values());
      if (monthTicks.length <= 7) return monthTicks;
      return monthTicks.filter((_, idx) => idx % 2 === 0);
    }

    // 1Y: Bi-monthly intervals
    if (dur === '1y') {
      const monthMap = new Map<string, string>();
      chartData.forEach((c) => {
        if (!c.date) return;
        const d = new Date(c.date);
        const key = !isNaN(d.getTime())
          ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          : c.date.slice(0, 7);
        if (!monthMap.has(key)) monthMap.set(key, c.date);
      });
      const monthTicks = Array.from(monthMap.values());
      if (monthTicks.length <= 7) return monthTicks;
      return monthTicks.filter((_, idx) => idx % 2 === 0);
    }

    // 5Y: 5 yearly ticks
    if (dur === '5y') {
      const yearMap = new Map<number, string>();
      chartData.forEach((c) => {
        if (!c.date) return;
        const d = new Date(c.date);
        if (!isNaN(d.getTime())) {
          const yr = d.getFullYear();
          if (!yearMap.has(yr)) yearMap.set(yr, c.date);
        }
      });
      const yearTicks = Array.from(yearMap.values());
      if (yearTicks.length >= 2) return yearTicks;
    }

    // Fallback: 5 evenly spaced ticks
    const count = 5;
    const step = (chartData.length - 1) / (count - 1);
    return Array.from({ length: count }, (_, i) => chartData[Math.round(i * step)].date);
  }, [chartData, range, isIntraday]);

  // Format date for X-axis
  const formatXAxis = useMemo(() => {
    return (val: string) => {
      try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        const dur = (range || '').toLowerCase();

        if (dur === '1d' || isIntraday) {
          return d.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        }

        if (dur === '5y') {
          return String(d.getFullYear());
        }

        if (dur === '1y' || dur === '6m') {
          const monthStr = d.toLocaleString('en-IN', { month: 'short' });
          if (d.getMonth() === 0) {
            return `${monthStr} '${String(d.getFullYear()).slice(-2)}`;
          }
          return monthStr;
        }

        return `${d.getDate()} ${d.toLocaleString('en-IN', { month: 'short' })}`;
      } catch {
        return val;
      }
    };
  }, [range, isIntraday]);

  const strokeColor = isOverallUp ? '#10B981' : '#F43F5E';
  const fillColor = isOverallUp ? '#10B981' : '#F43F5E';

  return (
    <div className="w-full">
      {/* 1. Header with Title & Timeframe Selector */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
          <LineChart className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <span>Price chart</span>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            ({range})
          </span>
        </div>

        {/* 7-Timeframe iOS-Style Segmented Control */}
        {chartRanges && onRangeChange && (
          <div className="grid grid-cols-7 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl select-none w-full sm:w-auto">
            {chartRanges.map((item) => {
              const active = range === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onRangeChange(item.label)}
                  className={`py-1 sm:px-2.5 text-center text-xs font-bold rounded-lg transition-all ${
                    active
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Timeframe Return & High/Low Stats (No duplicate main price) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 mb-2 px-0.5 min-h-[26px]">
        {hoveredData ? (
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {hoveredData.date}:
            </span>
            <span className="text-base font-black tabular-nums text-slate-950 dark:text-white">
              {currencySymbol}
              {hoveredData.close.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span
              className={`text-xs font-bold ${
                periodReturn.isUp
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              ({periodReturn.isUp ? '+' : ''}
              {periodReturn.pct.toFixed(2)}%)
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-600 dark:text-slate-300">{range} Return:</span>
            <strong
              className={`font-black ${
                periodReturn.isUp
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {periodReturn.isUp ? '+' : ''}
              {periodReturn.pct.toFixed(2)}% ({periodReturn.isUp ? '+' : ''}
              {currencySymbol}
              {Math.abs(periodReturn.diff).toFixed(2)})
            </strong>
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          <span className="rounded-md bg-slate-100/90 dark:bg-slate-800/80 px-2 py-0.5">
            H: <strong className="text-slate-800 dark:text-slate-200">{currencySymbol}{periodHigh ? periodHigh.toLocaleString() : '—'}</strong>
          </span>
          <span className="rounded-md bg-slate-100/90 dark:bg-slate-800/80 px-2 py-0.5">
            L: <strong className="text-slate-800 dark:text-slate-200">{currencySymbol}{periodLow ? periodLow.toLocaleString() : '—'}</strong>
          </span>
        </div>
      </div>

      {/* 3. The Chart Canvas */}
      {loading ? (
        <div className="h-64 sm:h-72 w-full flex items-center justify-center bg-slate-50/60 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 my-2">
          <div className="text-xs font-semibold text-slate-400 animate-pulse">Loading {range} market data...</div>
        </div>
      ) : !chartData || chartData.length === 0 ? (
        <div className="h-64 sm:h-72 w-full flex items-center justify-center bg-slate-50/60 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 my-2">
          <div className="text-xs text-slate-400">Historical price candles currently unavailable for this timeframe.</div>
        </div>
      ) : (
        <div className="h-64 sm:h-72 w-full pt-1 overflow-hidden select-none">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 12, right: 38, left: -22, bottom: 4 }}
              onMouseMove={(e: any) => {
                const payload = e?.activePayload?.[0]?.payload;
                if (payload) {
                  setHoveredData(payload as StockCandle);
                }
              }}
              onMouseLeave={() => setHoveredData(null)}
            >
              <defs>
                <linearGradient id="stockAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fillColor} stopOpacity={0.25} />
                  <stop offset="50%" stopColor={fillColor} stopOpacity={0.08} />
                  <stop offset="100%" stopColor={fillColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={gridStroke} opacity={0.5} />
              <XAxis
                key={range || 'default'}
                dataKey="date"
                ticks={smartTicks.length > 0 ? smartTicks : undefined}
                tickFormatter={formatXAxis}
                interval={0}
                minTickGap={24}
                padding={{ left: 6, right: 6 }}
                tick={{ fontSize: 10, fill: axisTextFill }}
                tickLine={false}
                axisLine={false}
                dy={6}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                orientation="right"
                tick={{ fontSize: 10, fill: axisTextFill }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${currencySymbol}${Math.round(v).toLocaleString()}`}
                width={46}
              />
              <Tooltip
                cursor={{
                  stroke: isDark ? '#475569' : '#94A3B8',
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as StockCandle & { isGreen: boolean };
                    const chg = data.close - data.open;
                    const chgPct = data.open ? (chg / data.open) * 100 : 0;
                    let formattedDate = data.date;
                    try {
                      const d = new Date(data.date);
                      if (!isNaN(d.getTime())) {
                        if (isIntraday) {
                          formattedDate = `${d.getDate()} ${d.toLocaleString('en-IN', {
                            month: 'short',
                          })} ${d.toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`;
                        } else {
                          formattedDate = `${d.getDate()} ${d.toLocaleString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          })}`;
                        }
                      }
                    } catch {}

                    return (
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs shadow-xl min-w-[130px] pointer-events-none">
                        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                            {formattedDate}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              chg >= 0
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {chg >= 0 ? '+' : ''}
                            {chgPct.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-3 text-slate-700 dark:text-slate-300">
                          <span>Close:</span>
                          <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                            {currencySymbol}
                            {data.close?.toLocaleString()}
                          </span>
                        </div>
                        {data.volume ? (
                          <div className="flex justify-between gap-3 text-slate-400 text-[10px] mt-0.5">
                            <span>Vol:</span>
                            <span className="tabular-nums">{data.volume.toLocaleString()}</span>
                          </div>
                        ) : null}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={strokeColor}
                strokeWidth={2.5}
                fill="url(#stockAreaGrad)"
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 4. Sleek Performance Returns (Single Clean Row, No scrollbar) */}
      {performance && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-1 sm:gap-2 text-center">
            {[
              ['1W', performance.return_1w_pct],
              ['1M', performance.return_1m_pct],
              ['3M', performance.return_3m_pct],
              ['6M', performance.return_6m_pct],
              ['1Y', performance.return_1y_pct],
              ['3Y', performance.return_3y_pct],
            ]
              .filter(([, val]) => val != null)
              .map(([label, val]) => (
                <div
                  key={String(label)}
                  className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-950/40 py-1.5 px-0.5 sm:px-1 border border-slate-100 dark:border-slate-800/60"
                >
                  <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                  </span>
                  <strong
                    className={`mt-0.5 block text-[10px] sm:text-xs font-black tabular-nums ${
                      Number(val) >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {formatSafePct(Number(val))}
                  </strong>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
