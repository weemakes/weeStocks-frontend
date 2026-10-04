/**
 * Last10DaysTable Component
 * Displays price data for the last 10 days
 */

import type { MetalLast10Days, MetalPurity, Metal } from "../types";
import { METAL_CONFIG } from "../types";
import { formatPrice } from "../utils";
import { Calendar, ArrowUp, ArrowDown } from "lucide-react";

interface Last10DaysTableProps {
  data: MetalLast10Days;
}

function formatHistoricalDate(dateStr: string) {
  if (!dateStr) return "–";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function Last10DaysTable({ data }: Last10DaysTableProps) {
  if (!data || !data.metal) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-rose-400 text-xs">Unable to display historical data</p>
      </div>
    );
  }

  const metalKey = data.metal.toLowerCase() as Metal;
  const metalConfig = METAL_CONFIG[metalKey];

  if (!metalConfig) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-rose-400 text-xs">Unable to display price table for metal: {data.metal}</p>
      </div>
    );
  }

  const hasGoldPurity = metalConfig.purityOptions.length > 0;

  // Get columns based on metal type
  const columns: { purity?: MetalPurity; unit?: string; label: string }[] = [];

  if (data.data.length > 0) {
    if (hasGoldPurity) {
      const purities: MetalPurity[] = ["24K", "22K"];
      purities.forEach((purity) => {
        columns.push({
          purity,
          label: `${purity} (1g)`,
        });
      });
    } else {
      const units = ["1g", "10g", "100g"];
      units.forEach((unit) => {
        columns.push({
          unit,
          label: `${unit} Rate`,
        });
      });
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted px-1">
        <span>Historical daily spot benchmarks in {data.cityName || "city"}</span>
        <span className="font-semibold uppercase tracking-wider text-[11px] bg-panel px-2 py-0.5 rounded border border-line">
          Unit: {data.unit || "1g"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line/70 bg-panel/30">
        <table className="w-full text-left text-xs divide-y divide-line/70">
          <thead className="bg-panel/70 text-[11px] font-semibold text-muted uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Date</th>
              {columns.map((col, idx) => (
                <th key={idx} className="py-2.5 px-4 text-right">
                  {col.label}
                </th>
              ))}
              <th className="py-2.5 px-4 text-center">Daily Movement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {data.data.map((day: any, idx: number) => {
              // Extract primary change info from 24K or first available column
              const mainPurityData = day["24K"] || day["22K"] || day["1g"];
              const change = mainPurityData?.change;
              const dir = mainPurityData?.changeDirection;
              const isUp = dir === "up";
              const isDown = dir === "down";

              return (
                <tr
                  key={day.date}
                  className={`transition-colors ${
                    idx === 0
                      ? "bg-accent/10 font-semibold"
                      : "hover:bg-well/50"
                  }`}
                >
                  <td className="py-2.5 px-4 font-bold text-ink tabular-nums">
                    {formatHistoricalDate(day.date)}
                  </td>

                  {columns.map((col, colIdx) => {
                    const priceInfo = col.purity ? day[col.purity] : day[col.unit!];
                    const price = priceInfo?.price !== undefined ? priceInfo.price : priceInfo;
                    const is24K = col.purity === "24K";

                    return (
                      <td key={colIdx} className="py-2.5 px-4 text-right tabular-nums">
                        {price !== undefined ? (
                          <span className={`font-bold ${is24K ? "text-[#B68214] dark:text-[#FCD34D] font-black" : "text-ink"}`}>
                            {formatPrice(price)}
                          </span>
                        ) : (
                          <span className="text-quiet">—</span>
                        )}
                      </td>
                    );
                  })}

                  <td className="py-2.5 px-4 text-center tabular-nums">
                    {change !== undefined && change !== 0 ? (
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-semibold ${
                          isUp
                            ? "text-positive bg-emerald-500/10"
                            : isDown
                            ? "text-negative bg-rose-500/10"
                            : "text-muted bg-panel"
                        }`}
                      >
                        {isUp ? <ArrowUp className="w-3 h-3" /> : isDown ? <ArrowDown className="w-3 h-3" /> : null}
                        {isUp ? "+" : ""}
                        {formatPrice(Math.abs(change))}
                      </span>
                    ) : (
                      <span className="text-quiet text-xs">— Flat</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
