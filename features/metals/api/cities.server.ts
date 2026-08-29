/**
 * Cities API
 * Server-side API functions for city data
 */

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

    // console.log("getPopularCities response:", response);
    
    // Handle different response structures
    let cities: City[] = [];
    
    if (Array.isArray(response.data?.cities)) {
      // Response has data.cities
      cities = response.data.cities;
    } else if (Array.isArray(response.data)) {
      // Response has data as array directly
      cities = response.data;
    } else if (Array.isArray(response)) {
      // Response itself is the array
      cities = response;
    }
    
    console.log("Popular cities extracted:", cities.length);
    
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
      cache: "no-store", // Don't cache search results
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
 * Get city by slug
 */
export async function getCityBySlug(slug: string): Promise<City | null> {
  try {
    console.log(`\n=== getCityBySlug called with: "${slug}" ===`);
    
    const response = await apiRequest<{ data: { cities: City[] } }>(
      `/cities?search=${slug}`,
      {
        cache: "no-store", // Don't cache for debugging
      }
    );

    // console.log("getCityBySlug response:", response);

    const cities = response.data?.cities || [];
    // console.log("Cities array:", cities);

    if (cities.length === 0) {
      console.log("No cities found");
      return null;
    }

    // Get the first city (backend search should return the most relevant)
    const city = cities[0];
    // console.log("Found city:", city);
    // console.log("=== getCityBySlug complete ===\n");
    
    return city;
    
  } catch (error) {
    console.error(`Error in getCityBySlug for "${slug}":`, error);
    return null;
  }
}
