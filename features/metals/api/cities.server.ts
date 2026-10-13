/**
 * Cities API
 * Server-side API functions for city data
 */

import { cache } from "react";
import { ApiError, apiRequest, buildQueryString } from "./api-client";
import type { City, CitySearchParams } from "../types";
import { ensureCitySlugs } from "../utils";

function readCities(response: unknown): City[] {
  if (Array.isArray(response)) return response as City[];
  if (!response || typeof response !== "object" || !("data" in response)) return [];

  const data = response.data;
  if (Array.isArray(data)) return data as City[];
  if (data && typeof data === "object" && "cities" in data && Array.isArray(data.cities)) {
    return data.cities as City[];
  }
  return [];
}

/**
 * Get popular cities
 */
export async function getPopularCities(): Promise<City[]> {
  try {
    const response = await apiRequest<unknown>("/cities/popular", {
      revalidate: 3600, // Cache for 1 hour
    });

    const cities = readCities(response);
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
    const response = await apiRequest<{ data: { city: City } }>(
      `/cities/${encodeURIComponent(slug)}`,
      {
        revalidate: 86400, // Cache static city info for 24 hours
      }
    );

    const city = response.data?.city;
    if (!city || city.is_active === false) return null;
    return ensureCitySlugs([city])[0];
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
});
