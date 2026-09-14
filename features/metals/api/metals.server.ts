/**
 * Metals API
 * Server-side API functions for metal price data
 */

import { apiRequest, buildQueryString } from "./api-client";
import { mapLatestPrice, mapLast10Days, mapHistoryData } from "../utils";
import type {
  Metal,
  MetalPurity,
  MetalUnit,
  ChartDuration,
  LatestPriceResponse,
  LatestMetalPrice,
  Last10DaysResponse,
  MetalLast10Days,
  HistoryDataResponse,
  MetalHistoryData,
} from "../types";

/**
 * Get latest metal price for a city
 */
export async function getLatestMetalPrice(
  cityId: number,
  metal: Metal
): Promise<LatestMetalPrice> {
  try {
    const query = buildQueryString({
      city_id: cityId,
      metal,
    });

    const response = await apiRequest<LatestPriceResponse>(
      `/metals/latest-price${query}`,
      {
        revalidate: 300, // Cache for 5 minutes (prices update frequently)
      }
    );

    return mapLatestPrice(response);
  } catch (error) {
    console.error(
      `Failed to fetch latest price for ${metal} in city ${cityId}:`,
      error
    );
    throw error;
  }
}

/**
 * Get last 10 days of metal prices for a city
 */
export async function getMetalLast10Days(
  cityId: number,
  metal: Metal
): Promise<MetalLast10Days> {
  try {
    const query = buildQueryString({
      city_id: cityId,
      metal,
    });

    const response = await apiRequest<any>(
      `/metals/last-10days-data${query}`,
      {
        revalidate: 3600, // Cache for 1 hour (historical data doesn't change often)
      }
    );

    console.log("Last10Days API response:", response);

    return mapLast10Days(response, metal, cityId);
  } catch (error) {
    console.error(
      `Failed to fetch last 10 days for ${metal} in city ${cityId}:`,
      error
    );
    throw error;
  }
}

/**
 * Get metal history chart data
 */
export async function getMetalHistoryData(params: {
  citySlug: string;
  metal: Metal;
  unit: MetalUnit;
  purity?: MetalPurity;
  duration: ChartDuration;
}): Promise<MetalHistoryData> {
  try {
    const effectiveDuration =
      params.metal === "platinum" && params.duration !== "1y"
        ? "9m"
        : params.duration;

    const query = buildQueryString({
      city_slug: params.citySlug,
      metal: params.metal,
      unit: params.unit,
      purity: params.metal === "gold" ? params.purity : undefined,
      duration: effectiveDuration,
    });

    const response = await apiRequest<HistoryDataResponse>(
      `/metals/fetch-history-data${query}`,
      {
        revalidate: 1800, // Cache for 30 minutes
      }
    );

    return mapHistoryData(response);
  } catch (error) {
    console.error(
      `Failed to fetch history data for ${params.metal} in ${params.citySlug}:`,
      error
    );
    throw error;
  }
}
