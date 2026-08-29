/**
 * Price Types
 * Type definitions for metal prices and price data
 */

import type { Metal, MetalPurity, MetalUnit } from "./metal.types";

export type PriceDirection = "up" | "down" | "neutral";

export interface PriceChange {
  value: number;
  direction: PriceDirection;
}

/**
 * Backend API Response: Latest Price for Gold
 */
export interface GoldPriceTableRow {
  gram: number;
  "24K": {
    price: number;
    change: number;
    changeDirection: "up" | "down" | null;
  };
  "22K": {
    price: number;
    change: number;
    changeDirection: "up" | "down" | null;
  };
  "18K": {
    price: number;
    change: number;
    changeDirection: "up" | "down" | null;
  };
}

/**
 * Backend API Response: Latest Price for Silver/Platinum
 */
export interface SimplePriceTableRow {
  gram: number;
  today: number;
  yesterday: number;
  change: number;
}

export interface LatestPriceResponse {
  status: number;
  message: string;
  data: {
    metal: string;
    cityId: string;
    cityName: string;
    currency: string;
    lastUpdatedAt: string;
    priceTable: GoldPriceTableRow[] | SimplePriceTableRow[];
  };
}

/**
 * Frontend Model: Latest Price
 */
export interface MetalPrice {
  purity?: MetalPurity;
  unit: MetalUnit;
  price: number;
  previousPrice?: number;
  change?: PriceChange;
}

export interface LatestMetalPrice {
  metal: Metal;
  cityId: number;
  cityName: string;
  date: string;
  prices: MetalPrice[];
}

/**
 * Backend API Response: Last 10 Days
 */
export interface Last10DaysResponse {
  metal: Metal;
  city_id: number;
  data: {
    date: string;
    prices: {
      purity?: MetalPurity;
      unit: MetalUnit;
      price: number;
    }[];
  }[];
}

/**
 * Frontend Model: Last 10 Days
 */
export interface DailyPrice {
  date: string;
  prices: {
    purity?: MetalPurity;
    unit: MetalUnit;
    price: number;
  }[];
}

export interface MetalLast10Days {
  metal: Metal;
  cityId: number;
  data: DailyPrice[];
}

/**
 * Backend API Response: History Chart Data
 */
export interface HistoryDataResponse {
  metal: Metal;
  city_slug: string;
  unit: MetalUnit;
  purity?: MetalPurity;
  duration: string;
  data: {
    date: string;
    price: number;
  }[];
}

/**
 * Frontend Model: Chart Data
 */
export interface ChartPoint {
  date: string;
  value: number;
}

export interface MetalHistoryData {
  metal: Metal;
  citySlug: string;
  unit: MetalUnit;
  purity?: MetalPurity;
  duration: string;
  data: ChartPoint[];
}
