/**
 * MetalPriceTable Component
 * Displays comprehensive price table for all units and purities
 */

import type { LatestMetalPrice, Metal } from "../types";
import { METAL_CONFIG } from "../types";
import { formatPrice } from "../utils";
import { Table, Layers, ArrowUp, ArrowDown } from "lucide-react";

interface MetalPriceTableProps {
  data: LatestMetalPrice;
}

export function MetalPriceTable({ data }: MetalPriceTableProps) {
  const metalKey = (data.metal as string).toLowerCase() as Metal;
  const metalConfig = METAL_CONFIG[metalKey];

  if (!metalConfig) {
    console.error("Invalid metal type. data.metal:", data.metal, "metalKey:", metalKey);
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-rose-400 text-xs">Unable to display price table for metal: {data.metal}</p>
      </div>
    );
  }

  const hasGoldPurity = metalConfig.purityOptions.length > 0;

  // Organize prices by unit and purity with change data
  const priceMap = new Map<
    string,
    Map<string, { price: number; change?: number; changeDirection?: "up" | "down" | "neutral" | null }>
  >();

  data.prices.forEach((price) => {
    const unit = price.unit;
    const purity = price.purity || "price";

    if (!priceMap.has(unit)) {
      priceMap.set(unit, new Map());
    }

    priceMap.get(unit)!.set(purity, {
      price: price.price,
      change: price.change?.value,
      changeDirection: price?.change?.direction,
    });
  });

  const units = metalConfig.units;
  const purities = hasGoldPurity ? metalConfig.purityOptions : [];

  const getUnitDescription = (unitStr: string) => {
    switch (unitStr) {
      case "1g":
        return "Standard Spot";
      case "8g":
        return "1 Sovereign (Pavan)";
      case "10g":
        return "1 Tola (Benchmark)";
      case "100g":
        return "Minted Bullion Bar";
      case "1kg":
        return "Commercial 1kg Bar";
      default:
        return unitStr;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
                Today {metalConfig.displayName} Rate Matrix by Weight (INR)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live benchmark rates across purities and weights
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
            As of: <strong className="text-slate-800 dark:text-slate-200">{new Date(data.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4 w-[28%]">Weight Unit</th>
                {hasGoldPurity ? (
                  purities.map((purity) => (
                    <th key={purity} className="py-2.5 px-3 text-right">
                      {purity} Rate
                    </th>
                  ))
                ) : (
                  <th className="py-2.5 px-4 text-right">Today&apos;s Price</th>
                )}
                <th className="py-2.5 px-4 text-center">Net Daily Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {units.map((unit, idx) => {
                const unitPrices = priceMap.get(unit);
                if (!unitPrices) return null;

                // Extract representative change from 24K or single price
                const mainPriceData = hasGoldPurity
                  ? unitPrices.get("24K") || unitPrices.get(purities[0])
                  : unitPrices.get("price");

                const change = mainPriceData?.change;
                const dir = mainPriceData?.changeDirection;
                const isUp = dir === "up";
                const isDown = dir === "down";

                return (
                  <tr key={unit} className={idx % 2 === 1 ? "bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/30" : "hover:bg-slate-100/70 dark:hover:bg-slate-800/30"}>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      <span className="text-sm font-extrabold">{unit}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal block whitespace-nowrap">
                        {getUnitDescription(unit)}
                      </span>
                    </td>

                    {hasGoldPurity ? (
                      purities.map((purity) => {
                        const priceData = unitPrices.get(purity);
                        const is24K = purity === "24K";
                        return (
                          <td key={purity} className="py-3 px-3 text-right">
                            {priceData ? (
                              <div>
                                <span className={`text-sm font-bold tabular-nums ${is24K ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"}`}>
                                  {formatPrice(priceData.price)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">—</span>
                            )}
                          </td>
                        );
                      })
                    ) : (
                      <td className="py-3 px-4 text-right">
                        {unitPrices.get("price") ? (
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                            {formatPrice(unitPrices.get("price")!.price)}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">—</span>
                        )}
                      </td>
                    )}

                    <td className="py-3 px-4 text-center tabular-nums">
                      {change !== undefined && change !== 0 ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
                            isUp
                              ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                              : isDown
                              ? "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {isUp ? <ArrowUp className="w-3 h-3" /> : isDown ? <ArrowDown className="w-3 h-3" /> : null}
                          {isUp ? "+" : ""}
                          {formatPrice(Math.abs(change))}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-xs">— No Change</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benchmark Source Footnote balancing vertical height */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Live spot benchmarks sourced from Indian Bullion Associations (IBJA)
        </span>
        <span className="text-slate-400 dark:text-slate-500">Excl. retail making charges &amp; 3% GST</span>
      </div>
    </div>
  );
}
