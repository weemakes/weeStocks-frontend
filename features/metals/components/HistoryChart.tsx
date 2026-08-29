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
        stroke: '#FFD700',
        fill: '#FFD700',
        tooltip: '#FFD700',
      };
    case 'silver':
      return {
        stroke: '#C0C0C0',
        fill: '#C0C0C0',
        tooltip: '#C0C0C0',
      };
    case 'platinum':
      return {
        stroke: '#A8B8D8',
        fill: '#A8B8D8',
        tooltip: '#A8B8D8',
      };
    default:
      return {
        stroke: '#4682B4',
        fill: '#4682B4',
        tooltip: '#4682B4',
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
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3">
        <p className="text-sm font-medium text-gray-300">
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
      <div className="h-80 flex items-center justify-center bg-gray-950 rounded-lg">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-950 rounded-lg">
        <div className="text-center">
          <p className="text-gray-400">Historical price data is currently unavailable.</p>
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
