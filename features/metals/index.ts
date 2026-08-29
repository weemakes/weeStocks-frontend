/**
 * Metals Feature
 * Central export for the precious metals feature
 */

// Types
export * from "./types";

// API (Server-side only)
export * from "./api";

// Utilities
export * from "./utils";

// Components (selective export to avoid naming conflicts)
export { MetalSelector } from "./components/MetalSelector";
export { CitySelector } from "./components/CitySelector";
export { PriceChange as PriceChangeComponent } from "./components/PriceChange";
export { MetalPriceCard } from "./components/MetalPriceCard";
export { MetalPriceTable } from "./components/MetalPriceTable";
export { Last10DaysTable } from "./components/Last10DaysTable";
export { HistoryChart } from "./components/HistoryChart";
export { HistoryControls } from "./components/HistoryControls";
export { HistoryChartSection } from "./components/HistoryChartSection";
