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
    <div className="space-y-3">
      {/* Search and Filter Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-muted font-medium">
          Showing <span className="text-ink font-bold">{filteredCities.length}</span> cities across India
        </div>

        {/* Search input */}
        <div className="relative w-full max-w-xs">
          <Search className="w-4 h-4 text-quiet absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search city (e.g. Mumbai, Bangalore)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-panel/70 border border-line/80 rounded-lg text-xs text-ink placeholder:text-quiet outline-none focus:outline-none focus:border-accent transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line/70 bg-panel/30">
        <table className="w-full text-left text-xs divide-y divide-line/70">
          <thead className="bg-panel/70 text-[11px] font-semibold text-muted uppercase tracking-wider">
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
          <tbody className="divide-y divide-line/70">
            {filteredCities.length > 0 ? (
              filteredCities.map((item) => {
                const isCurrent = item.slug.toLowerCase() === currentCitySlug.toLowerCase();
                const isUp = item.changeDirection === "up";
                const isDown = item.changeDirection === "down";

                return (
                  <tr
                    key={item.slug}
                    className={`transition-colors ${
                      isCurrent ? "bg-accent/10 font-medium" : "hover:bg-well/50"
                    }`}
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink">{item.name}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-accent/15 text-accent border border-accent/30">
                            Current
                          </span>
                        )}
                      </div>
                    </td>

                    {isGold ? (
                      <>
                        <td className="py-2.5 px-4 text-right font-black text-[#B68214] dark:text-[#FCD34D] tabular-nums">
                          {item.price24K ? formatPrice(item.price24K) : "–"}
                        </td>
                        <td className="py-2.5 px-4 text-right font-semibold text-body tabular-nums">
                          {item.price22K ? formatPrice(item.price22K) : "–"}
                        </td>
                        <td className="py-2.5 px-4 text-right text-muted tabular-nums">
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
                              : "text-muted bg-panel"
                          }`}
                        >
                          {isUp ? <ArrowUp className="w-3 h-3" /> : isDown ? <ArrowDown className="w-3 h-3" /> : null}
                          {isUp ? "+" : ""}
                          {formatPrice(Math.abs(item.change))}
                        </span>
                      ) : item.change === 0 ? (
                        <span className="text-muted font-medium">Flat</span>
                      ) : (
                        <span className="text-quiet font-medium" aria-label="Change not reported">—</span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <Link
                        href={`/${metal}/${item.slug}`}
                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-medium"
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
                <td colSpan={isGold ? 6 : 4} className="py-6 text-center text-muted">
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
