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
  const hasPurityControls = Boolean(purities && purities.length > 0 && onPurityChange);
  const hasMultipleUnits = Boolean(units && units.length > 1);
  const hasSingleUnit = Boolean(units && units.length === 1);

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5">
      {/* Purity Controls (Gold only: 24K, 22K, 18K) */}
      {hasPurityControls && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Purity
          </label>
          <div className="inline-flex rounded-lg border border-slate-700/80 bg-slate-950/80 p-0.5">
            {purities!.map((purity) => (
              <button
                key={purity}
                onClick={() => onPurityChange!(purity)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-semibold transition-all
                  ${
                    purity === selectedPurity
                      ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }
                `}
              >
                {purity}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Unit Controls (Multiple for Gold; Fixed badge for Silver 10g / Platinum 1g) */}
      {hasMultipleUnits ? (
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Unit
          </label>
          <div className="inline-flex rounded-lg border border-slate-700/80 bg-slate-950/80 p-0.5 flex-wrap">
            {units.map((unit) => (
              <button
                key={unit}
                onClick={() => onUnitChange(unit)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-semibold transition-all
                  ${
                    unit === selectedUnit
                      ? "bg-sky-500 text-white font-bold shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }
                `}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
      ) : hasSingleUnit ? (
        <div className="flex items-center gap-1.5 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span className="text-slate-500 font-medium uppercase text-[10px] tracking-wider">Unit:</span>
          <span className="text-slate-100 font-bold">{units[0]}</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">(Fixed Benchmark)</span>
        </div>
      ) : null}

      {/* Duration Controls (1D, 1W, 1M, 3M, 6M, 9M, 1Y) */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Duration
        </label>
        <div className="inline-flex rounded-lg border border-slate-700/80 bg-slate-950/80 p-0.5">
          {durations.map((duration) => (
            <button
              key={duration}
              onClick={() => onDurationChange(duration)}
              className={`
                px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all
                ${
                  duration === selectedDuration
                    ? "bg-sky-500 text-white font-bold shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
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
