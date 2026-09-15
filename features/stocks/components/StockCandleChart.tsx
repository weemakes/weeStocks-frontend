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
      <div className="h-64 sm:h-72 w-full flex items-center justify-center bg-canvas/60 rounded-xl border border-line">
        <div className="text-xs text-muted animate-pulse">Loading interactive chart...</div>
      </div>
    );
  }

  if (!candles || candles.length === 0) {
    return (
      <div className="h-64 sm:h-72 w-full flex items-center justify-center bg-canvas/60 rounded-xl border border-line">
        <div className="text-xs text-quiet">Historical price candles currently unavailable for this timeframe.</div>
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
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            tickLine={{ stroke: '#334155' }}
            axisLine={{ stroke: '#334155' }}
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
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            tickLine={{ stroke: '#334155' }}
            axisLine={{ stroke: '#334155' }}
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
                  <div className="bg-panel border border-line-strong rounded-lg p-2.5 text-xs shadow-xl min-w-[150px]">
                    <div className="text-[10px] text-muted font-medium mb-1">{data.date}</div>
                    <div className="flex justify-between gap-3 text-body">
                      <span>Close:</span>
                      <span className="font-bold text-ink tabular-nums">
                        {currencySymbol}{data.close?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 text-muted text-[11px]">
                      <span>Open:</span>
                      <span className="tabular-nums">{currencySymbol}{data.open?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-muted text-[11px]">
                      <span>High:</span>
                      <span className="text-positive tabular-nums">{currencySymbol}{data.high?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-muted text-[11px]">
                      <span>Low:</span>
                      <span className="text-negative tabular-nums">{currencySymbol}{data.low?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-muted text-[10px] pt-1 mt-1 border-t border-line">
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
