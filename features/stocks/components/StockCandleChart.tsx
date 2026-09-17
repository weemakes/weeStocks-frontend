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
}

export default function StockCandleChart({
  candles,
  currencySymbol = '₹',
  loading = false,
}: StockCandleChartProps) {
  const { isDark } = useTheme();
  const gridStroke = isDark ? '#1E293B' : '#E2E8F0';
  const axisTextFill = isDark ? '#94A3B8' : '#64748B';
  const axisLineStroke = isDark ? '#334155' : '#CBD5E1';

  const chartData = useMemo(() => {
    return candles.map((c) => ({
      ...c,
      isGreen: c.close >= c.open,
    }));
  }, [candles]);

  const minPrice = useMemo(() => {
    if (!candles.length) return 0;
    const min = Math.min(...candles.map((c) => c.low || c.close));
    return Math.floor(min * 0.98);
  }, [candles]);

  const maxPrice = useMemo(() => {
    if (!candles.length) return 100;
    const max = Math.max(...candles.map((c) => c.high || c.close));
    return Math.ceil(max * 1.02);
  }, [candles]);

  const isOverallUp = useMemo(() => {
    if (candles.length < 2) return true;
    return candles[candles.length - 1].close >= candles[0].close;
  }, [candles]);

  if (loading) {
    return (
      <div className="h-64 sm:h-72 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">Loading interactive chart...</div>
      </div>
    );
  }

  if (!candles || candles.length === 0) {
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
            dataKey="date"
            tick={{ fontSize: 10, fill: axisTextFill }}
            tickLine={{ stroke: axisLineStroke }}
            axisLine={{ stroke: axisLineStroke }}
            tickFormatter={(val) => {
              try {
                const d = new Date(val);
                return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
              } catch {
                return val;
              }
            }}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            orientation="right"
            tick={{ fontSize: 10, fill: axisTextFill }}
            tickLine={{ stroke: axisLineStroke }}
            axisLine={{ stroke: axisLineStroke }}
            tickFormatter={(v) => `${currencySymbol}${v.toLocaleString()}`}
            width={70}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as StockCandle & { isGreen: boolean };
                const chg = data.close - data.open;
                const chgPct = data.open ? (chg / data.open) * 100 : 0;
                return (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs shadow-xl min-w-[150px]">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">{data.date}</div>
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
