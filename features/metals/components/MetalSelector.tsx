"use client";

/**
 * MetalSelector Component
 * Navigation between different precious metals
 */

import Link from "next/link";
import type { Metal } from "../types";
import { METAL_CONFIG } from "../types";

interface MetalSelectorProps {
  currentMetal: Metal;
  citySlug?: string;
}

export function MetalSelector({ currentMetal, citySlug }: MetalSelectorProps) {
  const metals: Metal[] = ["gold", "silver", "platinum"];

  const getMetalPath = (metal: Metal): string => {
    if (citySlug) {
      return `/${metal}/${citySlug}`;
    }
    return `/${metal}`;
  };

  const getMetalActiveStyle = (metal: Metal) => {
    switch (metal) {
      case 'gold':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-gray-900';
      case 'silver':
        return 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-900';
      case 'platinum':
        return 'bg-gradient-to-r from-blue-400 to-blue-300 text-gray-900';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  return (
    <div className="inline-flex rounded-lg border border-gray-700 bg-gray-900 p-1">
      {metals.map((metal) => {
        const isActive = metal === currentMetal;
        const config = METAL_CONFIG[metal];

        return (
          <Link
            key={metal}
            href={getMetalPath(metal)}
            className={`
              px-6 py-2 rounded-md text-sm font-bold transition-all
              ${
                isActive
                  ? getMetalActiveStyle(metal)
                  : "text-white hover:bg-gray-800"
              }
            `}
          >
            {config.displayName}
          </Link>
        );
      })}
    </div>
  );
}
