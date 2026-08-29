"use client";

/**
 * HistoryChartSection Component
 * Complete history chart section with controls
 */

import { useState, useEffect } from "react";
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

  const [purity, setPurity] = useState<MetalPurity | undefined>(initialPurity);
  const [unit, setUnit] = useState<MetalUnit>(initialUnit);
  const [duration, setDuration] = useState<ChartDuration>(initialDuration);
  const [chartData, setChartData] = useState<ChartPoint[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch new data when controls change
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          metal,
          citySlug,
          unit,
          duration,
        });

        if (purity) {
          params.append("purity", purity);
        }

        const response = await fetch(`/api/metals/history?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const result = await response.json();
        setChartData(result.data);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
        setError("Unable to load historical prices.");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if not using initial values
    const isInitialState =
      unit === initialUnit &&
      duration === initialDuration &&
      purity === initialPurity;

    if (!isInitialState) {
      fetchChartData();
    }
  }, [metal, citySlug, purity, unit, duration, initialPurity, initialUnit, initialDuration]);

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-white mb-6">
        Weekly & Monthly Graph of {metalConfig.displayName} Price in India
      </h2>

      {/* Controls */}
      <HistoryControls
        purities={
          metalConfig.purityOptions.length > 0
            ? metalConfig.purityOptions
            : undefined
        }
        selectedPurity={purity}
        onPurityChange={setPurity}
        units={metalConfig.units}
        selectedUnit={unit}
        onUnitChange={setUnit}
        durations={CHART_DURATIONS}
        selectedDuration={duration}
        onDurationChange={setDuration}
      />

      {/* Chart */}
      <div className="mt-6">
        {error ? (
          <div className="h-80 flex items-center justify-center bg-gray-950 rounded-lg">
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={() => setDuration(initialDuration)}
                className="text-sm text-blue-400 underline hover:text-blue-300"
              >
                Retry
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
