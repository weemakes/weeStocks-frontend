"use client";

/**
 * HistoryControls Component
 * Controls for selecting chart parameters (purity, unit, duration)
 */

import type { MetalPurity, MetalUnit, ChartDuration } from "../types";
import { DURATION_LABELS } from "../types";

interface HistoryControlsProps {
  // Purity controls (for gold)
  purities?: MetalPurity[];
  selectedPurity?: MetalPurity;
  onPurityChange?: (purity: MetalPurity) => void;

  // Unit controls
  units: MetalUnit[];
  selectedUnit: MetalUnit;
  onUnitChange: (unit: MetalUnit) => void;

  // Duration controls
  durations: ChartDuration[];
  selectedDuration: ChartDuration;
  onDurationChange: (duration: ChartDuration) => void;
}

export function HistoryControls({
  purities,
  selectedPurity,
  onPurityChange,
  units,
  selectedUnit,
  onUnitChange,
  durations,
  selectedDuration,
  onDurationChange,
}: HistoryControlsProps) {
  const hasPurityControls = purities && purities.length > 0 && onPurityChange;

  return (
    <div className="flex flex-wrap items-center gap-6">
      {/* Purity Controls (Gold only) */}
      {hasPurityControls && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-white whitespace-nowrap">
            Purity
          </label>
          <div className="inline-flex rounded-lg border border-gray-700 bg-gray-900 p-1">
            {purities!.map((purity) => (
              <button
                key={purity}
                onClick={() => onPurityChange!(purity)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    purity === selectedPurity
                      ? "bg-blue-600 text-white"
                      : "text-white hover:bg-gray-800"
                  }
                `}
              >
                {purity}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Unit Controls */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-white whitespace-nowrap">
          Unit
        </label>
        <div className="inline-flex rounded-lg border border-gray-700 bg-gray-900 p-1 flex-wrap">
          {units.map((unit) => (
            <button
              key={unit}
              onClick={() => onUnitChange(unit)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  unit === selectedUnit
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-gray-800"
                }
              `}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      {/* Duration Controls */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-white whitespace-nowrap">
          Duration
        </label>
        <div className="inline-flex rounded-lg border border-gray-700 bg-gray-900 p-1">
          {durations.map((duration) => (
            <button
              key={duration}
              onClick={() => onDurationChange(duration)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  duration === selectedDuration
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-gray-800"
                }
              `}
            >
              {DURATION_LABELS[duration]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
