/**
 * MetalPriceTable Component
 * Displays comprehensive price table for all units and purities
 */

import type { LatestMetalPrice, Metal } from "../types";
import { METAL_CONFIG } from "../types";
import { formatPrice } from "../utils";

interface MetalPriceTableProps {
  data: LatestMetalPrice;
}

export function MetalPriceTable({ data }: MetalPriceTableProps) {
  const metalKey = (data.metal as string).toLowerCase() as Metal;
  const metalConfig = METAL_CONFIG[metalKey];

  if (!metalConfig) {
    console.error("Invalid metal type. data.metal:", data.metal, "metalKey:", metalKey);
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <p className="text-red-600">Unable to display price table for metal: {data.metal}</p>
      </div>
    );
  }

  // Metal-specific header colors
  const metalHeaderStyle = {
    gold: 'text-yellow-500',
    silver: 'text-gray-300',
    platinum: 'text-blue-300',
  }[metalKey] || 'text-white';

  const hasGoldPurity = metalConfig.purityOptions.length > 0;

  // Organize prices by unit and purity with change data
  const priceMap = new Map<string, Map<string, { price: number; change?: number; changeDirection?: 'up' | 'down' | null }>>();

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

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className={`text-xl font-bold ${metalHeaderStyle}`}>
          Today {metalConfig.displayName} Price Per Gram in India (INR)
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Prices as of {new Date(data.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-950 border-b border-gray-800">
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                GRAM
              </th>
              {hasGoldPurity ? (
                purities.map((purity) => (
                  <th
                    key={purity}
                    className="px-6 py-3 text-center text-sm font-semibold text-white"
                  >
                    {purity}
                  </th>
                ))
              ) : (
                <th className="px-6 py-3 text-center text-sm font-semibold text-white">
                  Today&apos;s Price
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {units.map((unit) => {
              const unitPrices = priceMap.get(unit);
              if (!unitPrices) return null;

              return (
                <tr key={unit} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {unit.replace('g', '')}
                  </td>
                  {hasGoldPurity ? (
                    purities.map((purity) => {
                      const priceData = unitPrices.get(purity);
                      return (
                        <td
                          key={purity}
                          className="px-6 py-4 text-center"
                        >
                          {priceData ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-lg font-semibold text-white">
                                {formatPrice(priceData.price)}
                              </span>
                              {priceData.change !== undefined && priceData.change !== 0 && (
                                <span className={`text-sm font-medium flex items-center gap-0.5 ${
                                  priceData.changeDirection === 'up' ? 'text-green-500' :
                                  priceData.changeDirection === 'down' ? 'text-red-500' :
                                  'text-gray-400'
                                }`}>
                                  {priceData.changeDirection === 'up' ? '▲' : priceData.changeDirection === 'down' ? '▼' : ''}
                                  ({priceData.change})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                      );
                    })
                  ) : (
                    <td className="px-6 py-4 text-center">
                      {unitPrices.get("price") ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg font-semibold text-white">
                            {formatPrice(unitPrices.get("price")!.price)}
                          </span>
                          {unitPrices.get("price")!.change !== undefined &&
                            unitPrices.get("price")!.change !== 0 && (
                              <span className={`text-sm font-medium flex items-center gap-0.5 ${
                                unitPrices.get("price")!.changeDirection === 'up' ? 'text-green-500' :
                                unitPrices.get("price")!.changeDirection === 'down' ? 'text-red-500' :
                                'text-gray-400'
                              }`}>
                                {unitPrices.get("price")!.changeDirection === 'up' ? '▲' : unitPrices.get("price")!.changeDirection === 'down' ? '▼' : ''}
                                ({unitPrices.get("price")!.change})
                              </span>
                            )}
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
