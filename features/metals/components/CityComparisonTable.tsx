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
    <div className="bg-panel/90 border border-line rounded-2xl p-5 md:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-ink capitalize">
              {metal} Rates Across Major Indian Cities
            </h2>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Compare live 10-gram benchmark prices across major business hubs in India
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search city (e.g. Mumbai, Delhi)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-canvas/80 border border-line-strong/80 rounded-xl text-xs text-ink placeholder-quiet focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-line rounded-xl overflow-hidden divide-y divide-line">
          <thead className="bg-canvas text-[11px] font-semibold text-muted uppercase tracking-wider">
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
          <tbody className="divide-y divide-line/80">
            {filteredCities.length > 0 ? (
              filteredCities.map((item) => {
                const isCurrent = item.slug.toLowerCase() === currentCitySlug.toLowerCase();
                const isUp = item.changeDirection === "up";
                const isDown = item.changeDirection === "down";

                return (
                  <tr
                    key={item.slug}
                    className={`transition-colors ${
                      isCurrent ? "bg-sky-500/10 font-medium" : "hover:bg-well/40"
                    }`}
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink">{item.name}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-accent border border-sky-500/40">
                            Current
                          </span>
                        )}
                      </div>
                    </td>

                    {isGold ? (
                      <>
                        <td className="py-2.5 px-4 text-right font-bold text-warning tabular-nums">
                          {item.price24K ? formatPrice(item.price24K) : "–"}
                        </td>
                        <td className="py-2.5 px-4 text-right font-semibold text-ink tabular-nums">
                          {item.price22K ? formatPrice(item.price22K) : "–"}
                        </td>
                        <td className="py-2.5 px-4 text-right text-body tabular-nums">
                          {item.price18K ? formatPrice(item.price18K) : "–"}
                        </td>
                      </>
                    ) : (
                      <td className="py-2.5 px-4 text-right font-bold text-ink tabular-nums">
                        {item.singlePrice ? formatPrice(item.singlePrice) : "–"}
                      </td>
                    )}

                    <td className="py-2.5 px-4 text-center tabular-nums">
                      {item.change !== undefined && item.change !== 0 ? (
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-semibold ${
                            isUp
                              ? "text-positive bg-emerald-500/10"
                              : isDown
                              ? "text-negative bg-rose-500/10"
                              : "text-muted bg-well"
                          }`}
                        >
                          {isUp ? <ArrowUp className="w-3 h-3" /> : isDown ? <ArrowDown className="w-3 h-3" /> : null}
                          {isUp ? "+" : ""}
                          {formatPrice(Math.abs(item.change))}
                        </span>
                      ) : (
                        <span className="text-quiet font-medium">₹0.00</span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <Link
                        href={`/${metal}/${item.slug}`}
                        className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent font-medium"
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
                <td colSpan={isGold ? 6 : 4} className="py-6 text-center text-quiet">
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
