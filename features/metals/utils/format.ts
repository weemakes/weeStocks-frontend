/**
 * Formatting Utilities
 * Functions for formatting metal prices, dates, and other display values
 */

/**
 * Format price in Indian Rupees
 */
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) return '—';
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price without currency symbol
 */
export function formatPriceValue(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) return '—';
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format date for chart tooltip
 */
export function formatChartDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Format change value with sign
 */
export function formatChange(change: number): string {
  const sign = change > 0 ? "+" : "";
  return `${sign}${formatPriceValue(Math.abs(change))}`;
}

/**
 * Format metal unit for display
 */
export function formatUnit(unit: string): string {
  return unit.toLowerCase();
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
