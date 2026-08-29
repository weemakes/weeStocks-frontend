/**
 * City Types
 * Type definitions for city data and city selection
 */

export interface City {
  id: number;
  name: string;
  slug?: string;
  country_id?: number;
  state_id?: number;
  is_active?: boolean;
  is_capital?: boolean;
  is_popular?: boolean;
  createdAt?: string;
  updatedAt?: string;
  country?: {
    id: number;
    name: string;
    code: string;
    currency?: string;
  };
  state?: {
    id: number;
    name: string;
    code: string;
    slug?: string;
  };
}

export interface CitySearchParams {
  search?: string;
  only_metals?: boolean;
}

export interface PopularCitiesResponse {
  data: City[];
  message?: string;
  status?: number;
}

export interface CitiesResponse {
  data: City[];
  message?: string;
  status?: number;
}
