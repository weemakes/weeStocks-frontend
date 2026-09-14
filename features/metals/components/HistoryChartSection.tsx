"use client";

/**
 * HistoryChartSection Component
 * Complete history chart section with controls
 */

import { useState, useEffect, useCallback } from "react";
import { TrendingUp } from "lucide-react";
import { HistoryChart } from "./HistoryChart";
import { HistoryControls } from "./HistoryControls";
import type {
  Metal,
  MetalPurity,
  MetalUnit,
  ChartDuration,
  ChartPoint,
} from "../types";
import { METAL_CONFIG, CHART_DURATIONS } from "../types";

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

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // In case of platinum, show 9m data by default; even if user selects 1w, 1m, 3m, 6m, query 9m data; 1y will be 1y
      const effectiveDuration: ChartDuration =
        metal === "platinum" && duration !== "1y" ? "9m" : duration;

      const params = new URLSearchParams({
        metal,
        citySlug,
        unit,
        duration: effectiveDuration,
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

  // Fetch new data when controls change
  useEffect(() => {
    const isInitialState =
      unit === initialUnit &&
      duration === initialDuration &&
      purity === initialPurity &&
      chartData.length > 0;

    if (!isInitialState) {
      fetchChartData();
    }
  }, [unit, duration, purity, fetchChartData, initialUnit, initialDuration, initialPurity]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            Historical Price Trend of {metalConfig.displayName} ({unit})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive multi-timeframe price chart with live spot movements
          </p>
        </div>
      </div>

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
      <div className="mt-6">
        {error && chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center bg-slate-950/80 border border-slate-800 rounded-xl">
            <div className="text-center px-4">
              <p className="text-slate-400 text-sm mb-3">{error}</p>
              <button
                onClick={fetchChartData}
                className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-semibold text-sky-400 transition-colors"
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
          />
        )}
      </div>
    </div>
  );
}
