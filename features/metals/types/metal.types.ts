/**
 * Metal Types
 * Core type definitions for precious metals (Gold, Silver, Platinum)
 */

export type Metal = "gold" | "silver" | "platinum";

export type MetalPurity = "24K" | "22K" | "18K";

export type MetalUnit = "1g" | "8g" | "10g" | "100g" | "1kg";

export type ChartDuration = "1d" | "1w" | "1m" | "3m" | "6m" | "9m" | "1y";

export interface MetalConfig {
  name: string;
  displayName: string;
  purityOptions: MetalPurity[];
  units: MetalUnit[];
  historyUnits?: MetalUnit[];
  historyEnabled: boolean;
  defaultPurity?: MetalPurity;
  defaultUnit: MetalUnit;
  defaultDuration: ChartDuration;
}

export const METAL_CONFIG: Record<Metal, MetalConfig> = {
  gold: {
    name: "gold",
    displayName: "Gold",
    purityOptions: ["24K", "22K", "18K"],
    units: ["1g", "8g", "10g", "100g"],
    historyUnits: ["1g", "8g", "10g", "100g"],
    historyEnabled: true,
    defaultPurity: "24K",
    defaultUnit: "1g",
    defaultDuration: "1w",
  },
  silver: {
    name: "silver",
    displayName: "Silver",
    purityOptions: [],
    units: ["1g", "8g", "10g", "100g", "1kg"],
    historyUnits: ["10g"],
    historyEnabled: true,
    defaultUnit: "10g",
    defaultDuration: "1w",
  },
  platinum: {
    name: "platinum",
    displayName: "Platinum",
    purityOptions: [],
    units: ["1g", "8g", "10g", "100g", "1kg"],
    historyUnits: ["1g"],
    historyEnabled: true,
    defaultUnit: "1g",
    defaultDuration: "9m",
  },
};

export const CHART_DURATIONS: ChartDuration[] = [
  "1d",
  "1w",
  "1m",
  "3m",
  "6m",
  "9m",
  "1y",
];

export const DURATION_LABELS: Record<ChartDuration, string> = {
  "1d": "1D",
  "1w": "1W",
  "1m": "1M",
  "3m": "3M",
  "6m": "6M",
  "9m": "9M",
  "1y": "1Y",
};
