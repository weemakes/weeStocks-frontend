'use client';

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  ComposedChart,
} from 'recharts';
import { StockCandle } from '../types';
import { useTheme } from '@/components/theme/useTheme';

interface StockCandleChartProps {
  candles: StockCandle[];
  currencySymbol?: string;
  loading?: boolean;
  range?: string;
}

export default function StockCandleChart({
  candles,
  currencySymbol = '₹',
  loading = false,
  range,
}: StockCandleChartProps) {
  const { isDark } = useTheme();
  const gridStroke = isDark ? '#1E293B' : '#E2E8F0';
  const axisTextFill = isDark ? '#94A3B8' : '#64748B';
  const axisLineStroke = isDark ? '#334155' : '#CBD5E1';

  // Sanitize candles: discard non-positive close stubs (e.g. unpopulated market sessions)
  // and normalize open/high/low to ensure integrity
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

  // Compute zoomed domain with proportional breathing room so price changes are prominently displayed
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

  const isOverallUp = useMemo(() => {
    if (chartData.length < 2) return true;
    return chartData[chartData.length - 1].close >= chartData[0].close;
  }, [chartData]);

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

    // 1M: 5 weekly ticks (spaced ~7 days apart)
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

    // 6M: Monthly intervals (first candle of each month)
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

    // 1Y: Bi-monthly intervals (6-7 clean month ticks)
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

    // 5Y: 5 yearly ticks (first candle of each calendar year)
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

  // Format date for X-axis: clean months for 1Y/6M, clean years for 5Y, clean dates for 1M/3M, times for 1D
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

  if (loading) {
    return (
      <div className="h-64 sm:h-72 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">Loading interactive chart...</div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-64 sm:h-72 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400">Historical price candles currently unavailable for this timeframe.</div>
      </div>
    );
  }

  const strokeColor = isOverallUp ? '#10B981' : '#F43F5E';
  const fillColor = isOverallUp ? '#10B981' : '#F43F5E';

  return (
    <div className="h-64 sm:h-72 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="stockAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={fillColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.6} />
          <XAxis
            key={range || 'default'}
            dataKey="date"
            ticks={smartTicks.length > 0 ? smartTicks : undefined}
            tickFormatter={formatXAxis}
            interval={0}
            minTickGap={15}
            tick={{ fontSize: 10, fill: axisTextFill }}
            tickLine={{ stroke: axisLineStroke }}
            axisLine={{ stroke: axisLineStroke }}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            orientation="right"
            tick={{ fontSize: 10, fill: axisTextFill }}
            tickLine={{ stroke: axisLineStroke }}
            axisLine={{ stroke: axisLineStroke }}
            tickFormatter={(v) => `${currencySymbol}${Math.round(v).toLocaleString()}`}
            width={70}
          />
          <Tooltip
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
                      formattedDate = `${d.getDate()} ${d.toLocaleString('en-IN', { month: 'short' })} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
                    } else {
                      formattedDate = `${d.getDate()} ${d.toLocaleString('en-IN', { month: 'short', year: 'numeric' })}`;
                    }
                  }
                } catch {
                  // keep raw date
                }

                return (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs shadow-xl min-w-[160px]">
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{formattedDate}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${chg >= 0 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'}`}>
                        {chg >= 0 ? '+' : ''}{chgPct.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 text-slate-700 dark:text-slate-300">
                      <span>Close:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {currencySymbol}{data.close?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Open:</span>
                      <span className="tabular-nums">{currencySymbol}{data.open?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>High:</span>
                      <span className="text-emerald-500 dark:text-emerald-400 tabular-nums">{currencySymbol}{data.high?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Low:</span>
                      <span className="text-rose-500 dark:text-rose-400 tabular-nums">{currencySymbol}{data.low?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-slate-500 dark:text-slate-400 text-[10px] pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>Volume:</span>
                      <span className="tabular-nums">{data.volume?.toLocaleString()}</span>
                    </div>
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
            strokeWidth={2}
            fill="url(#stockAreaGrad)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
