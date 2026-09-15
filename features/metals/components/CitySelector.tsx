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
    return searchQuery.length >= 2 ? searchResults : popularCities;
  }, [searchQuery, searchResults, popularCities]);

  // Search cities
  useEffect(() => {
    if (searchQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/cities/search?query=${encodeURIComponent(searchQuery)}`, { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Search unavailable");
        const result = await response.json();
        if (controller.signal.aborted) return;
        setSearchResults(result.data?.cities || []);
      } catch (error) {
        console.error("Failed to search cities:", error);
        if (!controller.signal.aborted) setSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 300);

    return () => { clearTimeout(timeoutId); controller.abort(); };
  }, [searchQuery]);

  const handleCitySelect = (city: City) => {
    setIsOpen(false);
    setSearchQuery("");
    router.push(`/${metal}/${city.slug}`);
  };

  return (
    <div ref={dropdownRef} className="relative" onKeyDown={e=>{if(e.key==="Escape")setIsOpen(false)}}>
      {/* Trigger Button */}
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {setIsSearching(false);setIsOpen(!isOpen)}}
        className="flex items-center gap-2 px-3.5 py-2 border border-line-strong/80 rounded-xl bg-panel/90 hover:bg-well text-xs sm:text-sm font-semibold text-ink transition-colors shadow-sm"
      >
        <MapPin className="h-4 w-4 text-accent shrink-0" />
        <span>{currentCity.name}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-panel border border-line-strong/90 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-line bg-canvas/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                aria-label="Search cities"
                placeholder="Search any Indian city..."
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value);setSearchResults([]);setIsSearching(e.target.value.length>=2)}}
                className="w-full pl-9 pr-3 py-2 border border-line-strong/80 rounded-xl bg-panel text-xs text-ink placeholder-quiet focus:outline-none focus:border-sky-500"
                autoFocus
              />
            </div>
          </div>

          {/* City List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-line/60">
            {!searchQuery && (
              <div className="px-3.5 py-2 text-[10px] font-bold text-muted uppercase tracking-wider bg-canvas/40">
                Major Business Hubs
              </div>
            )}

            {isSearching ? (
              <div className="p-4 text-center text-xs text-muted">Searching...</div>
            ) : displayCities.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted">
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
                        className={`w-full px-3.5 py-2.5 text-left hover:bg-well/60 transition-colors flex items-center justify-between ${
                          isSelected ? "bg-sky-500/10 text-accent font-bold" : "text-ink"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{city.name}</div>
                          {city.state && (
                            <div className="text-[10px] text-muted">
                              {typeof city.state === "string" ? city.state : city.state.name}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-accent">
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
