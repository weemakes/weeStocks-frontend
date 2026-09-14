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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 border border-slate-700/80 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-100 transition-colors shadow-sm"
      >
        <MapPin className="h-4 w-4 text-sky-400 shrink-0" />
        <span>{currentCity.name}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-800 bg-slate-950/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search any Indian city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-700/80 rounded-xl bg-slate-900 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                autoFocus
              />
            </div>
          </div>

          {/* City List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
            {!searchQuery && (
              <div className="px-3.5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                Major Business Hubs
              </div>
            )}

            {isSearching ? (
              <div className="p-4 text-center text-xs text-slate-400">Searching...</div>
            ) : displayCities.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                {searchQuery ? "No cities found matching query" : "No popular cities"}
              </div>
            ) : (
              <ul>
                {displayCities.map((city) => {
                  const isSelected = city.id === currentCity.id;
                  return (
                    <li key={city.id}>
                      <button
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className={`w-full px-3.5 py-2.5 text-left hover:bg-slate-800/60 transition-colors flex items-center justify-between ${
                          isSelected ? "bg-sky-500/10 text-sky-300 font-bold" : "text-slate-200"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{city.name}</div>
                          {city.state && (
                            <div className="text-[10px] text-slate-400">
                              {typeof city.state === "string" ? city.state : city.state.name}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400">
                            Selected
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
