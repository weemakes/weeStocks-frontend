/**
 * City Utilities
 * Helper functions for city data processing
 */

import type { City } from "../types";

/**
 * Generate a slug from a city name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}

/**
 * Ensure a city has a slug (generate from name if missing)
 */
export function ensureCitySlug(city: City): City {
  if (city.slug) {
    return city;
  }

  return {
    ...city,
    slug: generateSlug(city.name),
  };
}

/**
 * Ensure all cities in an array have slugs
 */
export function ensureCitySlugs(cities: City[]): City[] {
  // Safety check: ensure cities is an array
  if (!Array.isArray(cities)) {
    console.error("ensureCitySlugs: cities is not an array:", cities);
    return [];
  }
  
  return cities?.map(ensureCitySlug) || []
}
