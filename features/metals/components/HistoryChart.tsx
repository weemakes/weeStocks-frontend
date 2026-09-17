"use client";

/**
 * HistoryChart Component
 * Interactive price history chart using Recharts with metal-specific colors
 */

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { ChartPoint, Metal } from "../types";
import { formatChartDate, formatPrice } from "../utils";

interface HistoryChartProps {
  data: ChartPoint[];
  loading?: boolean;
  metal?: Metal;
}

// Get metal-specific color
function getMetalColor(metal?: Metal) {
  switch (metal) {
    case 'gold':
      return {
        stroke: '#f59f0bff',
        fill: '#F59E0B',
        tooltip: '#FBBF24',
      };
    case 'silver':
      return {
        stroke: '#CBD5E1',
        fill: '#94A3B8',
        tooltip: '#E2E8F0',
      };
    case 'platinum':
      return {
        stroke: '#00BCFF',
        fill: '#008abdff',
        tooltip: '#92e2ffff',
      };
    default:
      return {
        stroke: '#38BDF8',
        fill: '#0284C7',
        tooltip: '#38BDF8',
      };
  }
}

// Custom tooltip component (defined outside render)
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
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg shadow-xl p-3">
        <p className="text-sm font-medium text-slate-600 dark:text-gray-300">
          {formatChartDate(data.date)}
        </p>
        <p className="text-lg font-bold mt-1" style={{ color: colors.tooltip }}>
          {formatPrice(data.value)}
        </p>
      </div>
    );
  }
  return null;
}

export function HistoryChart({ data, loading = false, metal }: HistoryChartProps) {
  const colors = useMemo(() => getMetalColor(metal), [metal]);
  // Format date for X-axis
  const formatXAxis = useMemo(() => {
    return (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
      }).format(date);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-slate-800 rounded-lg">
        <div className="text-slate-500 dark:text-gray-400">Loading chart...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-slate-800 rounded-lg">
        <div className="text-center">
          <p className="text-slate-500 dark:text-gray-400">Historical price data is currently unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id={`colorValue-${metal || 'default'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.fill} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colors.fill} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12, fill: "#ffffff" }}
            tickLine={{ stroke: "#374151" }}
            axisLine={{ stroke: "#374151" }}
          />
          <YAxis
            tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
            tick={{ fontSize: 12, fill: "#ffffff" }}
            tickLine={{ stroke: "#374151" }}
            axisLine={{ stroke: "#374151" }}
            width={90}
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
