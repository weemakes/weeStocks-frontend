"use client";

/**
 * CitySelector Component
 * Dropdown for selecting cities with search functionality
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, ChevronDown } from "lucide-react";
import type { City, Metal } from "../types";

interface CitySelectorProps {
  currentCity: City;
  popularCities: City[];
  metal: Metal;
}

export function CitySelector({
  currentCity,
  popularCities,
  metal,
}: CitySelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute display cities based on search query
  const displayCities = useMemo(() => {
    return searchQuery ? searchResults : popularCities;
  }, [searchQuery, searchResults, popularCities]);

  // Search cities
  useEffect(() => {
    if (searchQuery.length < 2) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/cities/search?query=${encodeURIComponent(searchQuery)}`
        );
        const result = await response.json();
        setSearchResults(result.data?.cities || []);
      } catch (error) {
        console.error("Failed to search cities:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCitySelect = (city: City) => {
    setIsOpen(false);
    setSearchQuery("");
    router.push(`/${metal}/${city.slug}`);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors"
      >
        <MapPin className="h-5 w-5 text-white" />
        <span className="font-medium text-white">{currentCity.name}</span>
        <ChevronDown
          className={`h-4 w-4 text-white transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* City List */}
          <div className="max-h-80 overflow-y-auto">
            {!searchQuery && (
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Popular Cities
              </div>
            )}

            {isSearching ? (
              <div className="p-4 text-center text-gray-400">Searching...</div>
            ) : displayCities.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                {searchQuery ? "No cities found" : "No popular cities"}
              </div>
            ) : (
              <ul>
                {displayCities.map((city) => (
                  <li key={city.id}>
                    <button
                      onClick={() => handleCitySelect(city)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors ${
                        city.id === currentCity.id ? "bg-gray-800" : ""
                      }`}
                    >
                      <div className="font-medium text-white">
                        {city.name}
                      </div>
                      {city.state && (
                        <div className="text-sm text-gray-400">
                          {typeof city.state === 'string' ? city.state : city.state.name}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
