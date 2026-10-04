"use client";

/**
 * HistoryChart Component
 * Interactive price history chart using Recharts with metal-specific colors
 */

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { ChartPoint, Metal, ChartDuration } from "../types";
import { formatChartDate, formatPrice } from "../utils";
import { useTheme } from "@/components/theme/useTheme";

interface HistoryChartProps {
  data: ChartPoint[];
  loading?: boolean;
  metal?: Metal;
  duration?: ChartDuration;
}

// Get metal-specific color
function getMetalColor(metal?: Metal) {
  switch (metal) {
    case 'gold':
      return {
        stroke: '#E5B239',
        fill: '#F5C748',
        tooltip: '#C48A18',
      };
    case 'silver':
      return {
        stroke: '#94A3B8',
        fill: '#94A3B8',
        tooltip: '#64748B',
      };
    case 'platinum':
      return {
        stroke: '#0284C7',
        fill: '#0284C7',
        tooltip: '#0369A1',
      };
    default:
      return {
        stroke: '#0284C7',
        fill: '#0284C7',
        tooltip: '#0369A1',
      };
  }
}

// Custom tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartPoint;
  }>;
  metal?: Metal;
}

function CustomTooltip({ active, payload, metal }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const colors = getMetalColor(metal);
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 min-w-[140px]">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {formatChartDate(data.date)}
        </p>
        <p className="text-base font-bold mt-1 text-slate-900 dark:text-slate-100" style={{ color: colors.tooltip }}>
          {formatPrice(data.value)}
        </p>
      </div>
    );
  }
  return null;
}

export function HistoryChart({ data, loading = false, metal, duration }: HistoryChartProps) {
  const { isDark } = useTheme();
  const colors = useMemo(() => getMetalColor(metal), [metal]);

  const gridStroke = isDark ? '#1E293B' : '#E2E8F0';
  const axisTextFill = isDark ? '#94A3B8' : '#64748B';
  const axisLineStroke = isDark ? '#334155' : '#CBD5E1';

  // Sanitize data: filter non-positive or invalid points
  const validData = useMemo(() => {
    return (data || []).filter(
      (d) => d && typeof d.value === 'number' && d.value > 0 && !isNaN(d.value)
    );
  }, [data]);

  // Compute zoomed domain with proportional breathing room so price changes are prominently displayed
  const { minValue, maxValue } = useMemo(() => {
    if (!validData.length) return { minValue: 0, maxValue: 100 };
    const values = validData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const delta = max - min;
    const padding = delta > 0 ? Math.max(delta * 0.08, min * 0.01) : min * 0.05;
    return {
      minValue: Math.max(0, Math.floor(min - padding)),
      maxValue: Math.ceil(max + padding),
    };
  }, [validData]);

  const isIntraday = useMemo(() => {
    return validData.some((d) => d.date?.includes(':') || d.date?.includes('T'));
  }, [validData]);

  // Compute clean, evenly-spaced trader intervals for the X-axis based on duration
  const smartTicks = useMemo(() => {
    if (!validData || validData.length === 0) return [];
    if (validData.length <= 6) return validData.map((d) => d.date);

    const dur = (duration || '').toLowerCase();

    // 1D: intraday, pick 5 evenly spaced hourly points
    if (dur === '1d' || isIntraday) {
      const count = Math.min(5, validData.length);
      const step = (validData.length - 1) / (count - 1);
      return Array.from({ length: count }, (_, i) => validData[Math.round(i * step)].date);
    }

    // 1W: 5 daily points
    if (dur === '1w') {
      const count = Math.min(5, validData.length);
      const step = (validData.length - 1) / (count - 1);
      return Array.from({ length: count }, (_, i) => validData[Math.round(i * step)].date);
    }

    // 1M: 5 weekly intervals (spaced ~7 days apart)
    if (dur === '1m') {
      const count = 5;
      const step = (validData.length - 1) / (count - 1);
      return Array.from({ length: count }, (_, i) => validData[Math.round(i * step)].date);
    }

    // 3M: 5 bi-weekly intervals
    if (dur === '3m') {
      const count = 5;
      const step = (validData.length - 1) / (count - 1);
      return Array.from({ length: count }, (_, i) => validData[Math.round(i * step)].date);
    }

    // 6M & 9M: Monthly intervals (first point of each month)
    if (dur === '6m' || dur === '9m') {
      const monthMap = new Map<string, string>();
      validData.forEach((d) => {
        if (!d.date) return;
        const parsed = new Date(d.date);
        const key = !isNaN(parsed.getTime())
          ? `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`
          : d.date.slice(0, 7);
        if (!monthMap.has(key)) monthMap.set(key, d.date);
      });
      const monthTicks = Array.from(monthMap.values());
      if (monthTicks.length <= 7) return monthTicks;
      return monthTicks.filter((_, idx) => idx % 2 === 0);
    }

    // 1Y: Bi-monthly intervals (6-7 clean month ticks)
    if (dur === '1y') {
      const monthMap = new Map<string, string>();
      validData.forEach((d) => {
        if (!d.date) return;
        const parsed = new Date(d.date);
        const key = !isNaN(parsed.getTime())
          ? `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`
          : d.date.slice(0, 7);
        if (!monthMap.has(key)) monthMap.set(key, d.date);
      });
      const monthTicks = Array.from(monthMap.values());
      if (monthTicks.length <= 7) return monthTicks;
      return monthTicks.filter((_, idx) => idx % 2 === 0);
    }

    // Fallback: 5 evenly spaced points
    const count = 5;
    const step = (validData.length - 1) / (count - 1);
    return Array.from({ length: count }, (_, i) => validData[Math.round(i * step)].date);
  }, [validData, duration, isIntraday]);

  // Format date for X-axis: clean months for 1Y/9M/6M, clean dates for 1M/3M, times for 1D
  const formatXAxis = useMemo(() => {
    return (dateString: string) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const dur = (duration || '').toLowerCase();

        if (dur === '1d' || isIntraday) {
          return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        }

        if (dur === '1y' || dur === '9m' || dur === '6m') {
          const month = date.toLocaleString('en-IN', { month: 'short' });
          if (date.getMonth() === 0) {
            return `${month} '${String(date.getFullYear()).slice(-2)}`;
          }
          return month;
        }

        return new Intl.DateTimeFormat("en-IN", {
          month: "short",
          day: "numeric",
        }).format(date);
      } catch {
        return dateString;
      }
    };
  }, [duration, isIntraday]);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">Loading interactive chart...</div>
      </div>
    );
  }

  if (validData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="text-center px-4">
          <p className="text-slate-500 dark:text-slate-400 text-xs">Historical price data is currently unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={validData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id={`colorValue-${metal || 'default'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.fill} stopOpacity={0.25}/>
              <stop offset="95%" stopColor={colors.fill} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.6} />
          <XAxis
            key={duration || 'default'}
            dataKey="date"
            ticks={smartTicks.length > 0 ? smartTicks : undefined}
            tickFormatter={formatXAxis}
            interval={0}
            minTickGap={15}
            tick={{ fontSize: 11, fill: axisTextFill }}
            tickLine={{ stroke: axisLineStroke }}
            axisLine={{ stroke: axisLineStroke }}
          />
          <YAxis
            domain={[minValue, maxValue]}
            tickFormatter={(value) => `₹${Math.round(value).toLocaleString("en-IN")}`}
            tick={{ fontSize: 11, fill: axisTextFill }}
            tickLine={{ stroke: axisLineStroke }}
            axisLine={{ stroke: axisLineStroke }}
            width={75}
          />
          <Tooltip content={<CustomTooltip metal={metal} />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors.stroke}
            strokeWidth={2}
            fill={`url(#colorValue-${metal || 'default'})`}
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
