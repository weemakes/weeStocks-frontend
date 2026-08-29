/**
 * Data Mappers
 * Transform backend API responses to frontend models
 */

import type {
  LatestPriceResponse,
  GoldPriceTableRow,
  SimplePriceTableRow,
  LatestMetalPrice,
  MetalPrice,
  PriceChange,
  PriceDirection,
  Last10DaysResponse,
  MetalLast10Days,
  HistoryDataResponse,
  MetalHistoryData,
  ChartPoint,
} from "../types";

/**
 * Map price direction from backend to frontend
 */
function mapPriceDirection(
  direction?: "up" | "down" | null
): PriceDirection {
  if (!direction) return "neutral";
  return direction;
}

/**
 * Convert gram to unit string
 */
function gramToUnit(gram: number): string {
  if (gram === 1000) return "1kg";
  return `${gram}g`;
}

/**
 * Check if price table is for gold (has purity keys)
 */
function isGoldPriceTable(row: any): row is GoldPriceTableRow {
  return "24K" in row && "22K" in row && "18K" in row;
}

/**
 * Map latest price response to frontend model
 */
export function mapLatestPrice(
  response: LatestPriceResponse
): LatestMetalPrice {
  const prices: MetalPrice[] = [];
  const { data } = response;

  data.priceTable.forEach((row) => {
    if (isGoldPriceTable(row)) {
      // Gold: has purities (24K, 22K, 18K)
      const unit = gramToUnit(row.gram) as any;
      
      // 24K
      prices.push({
        purity: "24K",
        unit,
        price: row["24K"].price,
        change: row["24K"].change !== 0 ? {
          value: row["24K"].change,
          direction: mapPriceDirection(row["24K"].changeDirection),
        } : undefined,
      });

      // 22K
      prices.push({
        purity: "22K",
        unit,
        price: row["22K"].price,
        change: row["22K"].change !== 0 ? {
          value: row["22K"].change,
          direction: mapPriceDirection(row["22K"].changeDirection),
        } : undefined,
      });

      // 18K
      prices.push({
        purity: "18K",
        unit,
        price: row["18K"].price,
        change: row["18K"].change !== 0 ? {
          value: row["18K"].change,
          direction: mapPriceDirection(row["18K"].changeDirection),
        } : undefined,
      });
    } else {
      // Silver/Platinum: no purities
      const simpleRow = row as SimplePriceTableRow;
      const unit = gramToUnit(simpleRow.gram) as any;
      
      const changeDirection: PriceDirection = 
        simpleRow.change > 0 ? "up" : 
        simpleRow.change < 0 ? "down" : 
        "neutral";

      prices.push({
        unit,
        price: simpleRow.today,
        previousPrice: simpleRow.yesterday,
        change: simpleRow.change !== 0 ? {
          value: simpleRow.change,
          direction: changeDirection,
        } : undefined,
      });
    }
  });

  return {
    metal: data.metal as any,
    cityId: parseInt(data.cityId),
    cityName: data.cityName,
    date: data.lastUpdatedAt,
    prices,
  };
}

/**
 * Map last 10 days response to frontend model
 */
export function mapLast10Days(
  response: any,
  metal: string,
  cityId: number
): MetalLast10Days {
  console.log("mapLast10Days input:", { response, metal, cityId });
  
  // For now, return a placeholder structure until we see the actual API response
  return {
    metal: metal as any,
    cityId: cityId,
    data: response.data?.data || response.data || [],
  };
}

/**
 * Map history data response to frontend model
 */
export function mapHistoryData(
  response: HistoryDataResponse
): MetalHistoryData {
  // Handle nested data structure: response.data.data contains the array
  const historyData = (response as any).data?.data || response.data || [];
  
  const chartData: ChartPoint[] = Array.isArray(historyData) 
    ? historyData.map((point: any) => ({
        date: point.date,
        value: point.price,
      }))
    : [];

  return {
    metal: (response as any).data?.metal || response.metal,
    citySlug: (response as any).data?.cityName || response.city_slug,
    unit: (response as any).data?.unit || response.unit,
    purity: (response as any).data?.purity || response.purity,
    duration: (response as any).data?.range || response.duration,
    data: chartData,
  };
}
