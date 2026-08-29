/**
 * Last10DaysTable Component
 * Displays price data for the last 10 days
 */

import type { MetalLast10Days, MetalPurity, Metal } from "../types";
import { METAL_CONFIG } from "../types";
import { formatDate, formatPrice } from "../utils";

interface Last10DaysTableProps {
  data: MetalLast10Days;
}

export function Last10DaysTable({ data }: Last10DaysTableProps) {
  // Safety check for data
  if (!data || !data.metal) {
    console.error("Last10DaysTable: Invalid data", data);
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-red-600">Unable to display historical data</p>
      </div>
    );
  }
  
  // Normalize metal name to lowercase to match METAL_CONFIG keys
  const metalKey = data.metal.toLowerCase() as Metal;
  const metalConfig = METAL_CONFIG[metalKey];
  
  if (!metalConfig) {
    console.error("Invalid metal type:", data.metal);
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
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

  // Get columns based on metal type
  const columns: { purity?: MetalPurity; unit?: string; label: string }[] = [];

  if (data.data.length > 0) {
    if (hasGoldPurity) {
      // For gold, show 24K and 22K
      const purities: MetalPurity[] = ["24K", "22K"];
      purities.forEach((purity) => {
        columns.push({
          purity,
          label: purity,
        });
      });
    } else {
      // For silver/platinum, show 1g, 10g, 100g
      const units = ["1g", "10g", "100g"];
      units.forEach((unit) => {
        columns.push({
          unit,
          label: unit,
        });
      });
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className={`text-xl font-bold ${metalHeaderStyle}`}>
          {metalConfig.displayName} Price - Last 10 Days
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-950 border-b border-gray-800">
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Date
              </th>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-right text-sm font-semibold text-white"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.data.map((day: any) => {
              return (
                <tr key={day.date} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {day.displayDate || formatDate(day.date)}
                  </td>
                  {columns.map((col, idx) => {
                    let price = null;
                    
                    if (hasGoldPurity && col.purity) {
                      // For gold: access day['24K'] or day['22K']
                      const priceData = day[col.purity];
                      price = priceData?.price;
                    } else if (col.unit) {
                      // For silver/platinum: access day['1g'], day['10g'], day['100g']
                      const priceData = day[col.unit];
                      price = priceData?.price;
                    }

                    return (
                      <td
                        key={idx}
                        className="px-6 py-4 text-sm text-right font-medium text-blue-400"
                      >
                        {price ? formatPrice(price) : "—"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
