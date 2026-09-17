"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowUp, ArrowDown, MapPin, ExternalLink } from "lucide-react";
import type { Metal } from "../types";
import { formatPrice } from "../utils";

export interface CityMetalPriceItem {
  id: number;
  name: string;
  slug: string;
  price24K?: number;
  price22K?: number;
  price18K?: number;
  singlePrice?: number;
  change?: number;
  changeDirection?: "up" | "down" | "neutral" | string;
}

interface CityComparisonTableProps {
  metal: Metal;
  currentCitySlug: string;
  cities: CityMetalPriceItem[];
}

export function CityComparisonTable({
  metal,
  currentCitySlug,
  cities,
}: CityComparisonTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return cities;
    const query = searchTerm.toLowerCase().trim();
    return cities.filter((c) => c.name.toLowerCase().includes(query));
  }, [cities, searchTerm]);

  const isGold = metal === "gold";

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">
              {metal} Rates Across Major Indian Cities
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare live 10-gram benchmark prices across major business hubs in India
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search city (e.g. Mumbai, Delhi)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:outline-none focus-visible:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-950 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">City</th>
              {isGold ? (
                <>
                  <th className="py-2.5 px-4 text-right">24K (10g)</th>
                  <th className="py-2.5 px-4 text-right">22K (10g)</th>
                  <th className="py-2.5 px-4 text-right">18K (10g)</th>
                </>
              ) : (
                <th className="py-2.5 px-4 text-right">Price (10g)</th>
              )}
              <th className="py-2.5 px-4 text-center">Today&apos;s Change</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredCities.length > 0 ? (
              filteredCities.map((item) => {
                const isCurrent = item.slug.toLowerCase() === currentCitySlug.toLowerCase();
                const isUp = item.changeDirection === "up";
                const isDown = item.changeDirection === "down";

                return (
                  <tr
                    key={item.slug}
                    className={`transition-colors ${
                      isCurrent ? "bg-sky-500/10 font-medium" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                            Current
                          </span>
                        )}
                      </div>
                    </td>

                    {isGold ? (
                      <>
                        <td className="py-2.5 px-4 text-right font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                          {item.price24K ? formatPrice(item.price24K) : "–"}
                        </td>
                        <td className="py-2.5 px-4 text-right font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                          {item.price22K ? formatPrice(item.price22K) : "–"}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                          {item.price18K ? formatPrice(item.price18K) : "–"}
                        </td>
                      </>
                    ) : (
                      <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {item.singlePrice ? formatPrice(item.singlePrice) : "–"}
                      </td>
                    )}

                    <td className="py-2.5 px-4 text-center tabular-nums">
                      {item.change !== undefined && item.change !== 0 ? (
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-semibold ${
                            isUp
                              ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10"
                              : isDown
                              ? "text-rose-700 dark:text-rose-400 bg-rose-500/10"
                              : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
                          }`}
                        >
                          {isUp ? <ArrowUp className="w-3 h-3" /> : isDown ? <ArrowDown className="w-3 h-3" /> : null}
                          {isUp ? "+" : ""}
                          {formatPrice(Math.abs(item.change))}
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400 font-medium">₹0.00</span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <Link
                        href={`/${metal}/${item.slug}`}
                        className="inline-flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isGold ? 6 : 4} className="py-6 text-center text-slate-500 dark:text-slate-400">
                  No cities found matching &quot;{searchTerm}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
