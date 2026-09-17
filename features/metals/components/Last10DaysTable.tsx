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
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
              {metalConfig.displayName} Price Trend — Last 10 Days
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily historical movement and price adjustments{data.cityName ? ` in ${data.cityName}` : ""}
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
          Unit: {data.unit || "1g"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-950 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
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
                  className={idx === 0 ? "bg-sky-50/50 dark:bg-slate-950/60 font-semibold" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"}
                >
                  <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                    {formatHistoricalDate(day.date)}
                  </td>

                  {columns.map((col, colIdx) => {
                    const priceInfo = col.purity ? day[col.purity] : day[col.unit!];
                    const price = priceInfo?.price !== undefined ? priceInfo.price : priceInfo;
                    const is24K = col.purity === "24K";

                    return (
                      <td key={colIdx} className="py-2.5 px-4 text-right tabular-nums">
                        {price !== undefined ? (
                          <span className={`font-bold ${is24K ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"}`}>
                            {formatPrice(price)}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">—</span>
                        )}
                      </td>
                    );
                  })}

                  <td className="py-2.5 px-4 text-center tabular-nums">
                    {change !== undefined && change !== 0 ? (
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-semibold ${
                          isUp
                            ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                            : isDown
                            ? "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10"
                            : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
                        }`}
                      >
                        {isUp ? <ArrowUp className="w-3 h-3" /> : isDown ? <ArrowDown className="w-3 h-3" /> : null}
                        {isUp ? "+" : ""}
                        {formatPrice(Math.abs(change))}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs">— Flat</span>
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
