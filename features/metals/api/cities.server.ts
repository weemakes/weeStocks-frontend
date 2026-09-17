/**
 * Cities API
 * Server-side API functions for city data
 */

import { cache } from "react";
import { apiRequest, buildQueryString } from "./api-client";
import type { City, CitySearchParams } from "../types";
import { ensureCitySlugs, generateSlug } from "../utils";

/**
 * Get popular cities
 */
export async function getPopularCities(): Promise<City[]> {
  try {
    const response = await apiRequest<any>("/cities/popular", {
      revalidate: 3600, // Cache for 1 hour
    });

    // Handle different response structures
    let cities: City[] = [];
    
    if (Array.isArray(response.data?.cities)) {
      cities = response.data.cities;
    } else if (Array.isArray(response.data)) {
      cities = response.data;
    } else if (Array.isArray(response)) {
      cities = response;
    }
    
    // Ensure all cities have slugs
    return ensureCitySlugs(cities);
  } catch (error) {
    console.error("Failed to fetch popular cities:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

/**
 * Search cities
 */
export async function searchCities(
  params: CitySearchParams
): Promise<City[]> {
  try {
    const query = buildQueryString({
      search: params.search,
      only_metals: params.only_metals,
    });

    const response = await apiRequest<{ data: { cities: City[] } }>(`/cities${query}`, {
      revalidate: 300,
    });

    const cities = response.data?.cities || [];
    
    // Ensure all cities have slugs
    return ensureCitySlugs(cities);
  } catch (error) {
    console.error("Failed to search cities:", error);
    // Return empty array instead of throwing
    return [];
  }
}

/**
 * Get city by slug (Cached and deduplicated per-render)
 */
export const getCityBySlug = cache(async function getCityBySlug(slug: string): Promise<City | null> {
  try {
    const response = await apiRequest<{ data: { cities: City[] } }>(
      `/cities?search=${encodeURIComponent(slug)}`,
      {
        revalidate: 86400, // Cache static city info for 24 hours
      }
    );

    const cities = response.data?.cities || [];

    if (cities.length === 0) {
      return null;
    }

    const city = cities[0];
    return city ? ensureCitySlugs([city])[0] : null;
  } catch (error) {
    console.error(`Error in getCityBySlug for "${slug}":`, error);
    return null;
  }
});
