"use client";

/**
 * HistoryChartSection Component
 * Complete history chart section with controls
 */

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { TrendingUp } from "lucide-react";
import { HistoryControls } from "./HistoryControls";
import type {
  Metal,
  MetalPurity,
  MetalUnit,
  ChartDuration,
  ChartPoint,
} from "../types";
import { METAL_CONFIG, CHART_DURATIONS } from "../types";

const HistoryChart = dynamic(
  () => import("./HistoryChart").then((module) => module.HistoryChart),
  {
    ssr: false,
    loading: () => <div className="skeleton h-80 rounded-2xl" aria-label="Loading price chart" />,
  }
);

interface HistoryChartSectionProps {
  metal: Metal;
  citySlug: string;
  initialData: ChartPoint[];
  initialPurity?: MetalPurity;
  initialUnit: MetalUnit;
  initialDuration: ChartDuration;
}

export function HistoryChartSection({
  metal,
  citySlug,
  initialData,
  initialPurity,
  initialUnit,
  initialDuration,
}: HistoryChartSectionProps) {
  const metalConfig = METAL_CONFIG[metal];
  const historyUnits = metalConfig.historyUnits || metalConfig.units;

  const [purity, setPurity] = useState<MetalPurity | undefined>(
    metal === "gold" ? initialPurity : undefined
  );
  const [unit, setUnit] = useState<MetalUnit>(initialUnit);
  const [duration, setDuration] = useState<ChartDuration>(initialDuration);
  const [chartData, setChartData] = useState<ChartPoint[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track initial mount so SSR initialData is used initially,
  // but ANY subsequent change (including returning to initial settings) triggers an API call
  const isFirstMount = useRef(true);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        metal,
        citySlug,
        unit,
        duration,
      });

      // Strictly only append purity for gold
      if (metal === "gold" && purity) {
        params.append("purity", purity);
      }

      const response = await fetch(`/api/metals/history?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch chart data");
      }

      const result = await response.json();
      setChartData(result.data || []);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
      setError("Historical price data is currently unavailable for this timeframe.");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [metal, citySlug, unit, duration, purity]);

  // Fetch new data whenever controls change (including returning to initial duration)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    fetchChartData();
  }, [unit, duration, purity, fetchChartData]);

  return (
    <div className="space-y-3 sm:space-y-4">

      {/* Controls */}
      <HistoryControls
        purities={
          metal === "gold" && metalConfig.purityOptions.length > 0
            ? metalConfig.purityOptions
            : undefined
        }
        selectedPurity={metal === "gold" ? purity : undefined}
        onPurityChange={metal === "gold" ? setPurity : undefined}
        units={historyUnits}
        selectedUnit={unit}
        onUnitChange={setUnit}
        durations={CHART_DURATIONS}
        selectedDuration={duration}
        onDurationChange={setDuration}
      />

      {/* Chart */}
      <div className="mt-3 sm:mt-4">
        {error && chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-center px-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{error}</p>
              <button
                onClick={fetchChartData}
                className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-500/15 hover:bg-sky-100 dark:hover:bg-sky-500/25 border border-sky-200 dark:border-sky-500/30 text-xs font-semibold text-sky-700 dark:text-sky-400 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          </div>
        ) : (
          <HistoryChart
            data={chartData}
            loading={loading}
            metal={metal}
            duration={duration}
          />
        )}
      </div>
    </div>
  );
}
