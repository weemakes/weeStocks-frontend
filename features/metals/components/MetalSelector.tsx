"use client";

/**
 * MetalSelector Component
 * Navigation between different precious metals
 */

import Link from "next/link";
import { Sparkles, Coins, Gem } from "lucide-react";
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

  const getIcon = (metal: Metal) => {
    switch (metal) {
      case "gold":
        return <Coins className="w-4 h-4" />;
      case "silver":
        return <Sparkles className="w-4 h-4" />;
      case "platinum":
        return <Gem className="w-4 h-4" />;
    }
  };

  return (
    <div className="inline-flex rounded-xl border border-slate-800 bg-slate-950/80 p-1">
      {metals.map((metal) => {
        const isActive = metal === currentMetal;
        const config = METAL_CONFIG[metal];

        const activeStyles = {
          gold: "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-extrabold",
          silver: "bg-slate-200 text-slate-950 shadow-lg shadow-slate-300/20 font-extrabold",
          platinum: "bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20 font-extrabold",
        }[metal];

        return (
          <Link
            key={metal}
            href={getMetalPath(metal)}
            className={`
              flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all
              ${
                isActive
                  ? activeStyles
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
              }
            `}
          >
            {getIcon(metal)}
            <span>{config.displayName}</span>
          </Link>
        );
      })}
    </div>
  );
}
