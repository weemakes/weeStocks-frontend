/**
 * PriceChange Component
 * Displays price change with direction indicator
 */

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PriceChange as PriceChangeType } from "../types";
import { formatChange } from "../utils";

interface PriceChangeProps {
  change: PriceChangeType;
  showIcon?: boolean;
  className?: string;
}

export function PriceChange({
  change,
  showIcon = true,
  className = "",
}: PriceChangeProps) {
  const { value, direction } = change;

  const colorClass =
    direction === "up"
      ? "text-positive"
      : direction === "down"
        ? "text-red-500"
        : "text-quiet";

  const Icon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
        ? TrendingDown
        : Minus;

  const arrowSymbol =
    direction === "up" ? "↑" : direction === "down" ? "↓" : "—";

  return (
    <span className={`inline-flex items-center gap-1 ${colorClass} ${className}`}>
      {showIcon && <Icon className="h-4 w-4" />}
      <span className="font-medium">
        {arrowSymbol} ₹{formatChange(value)}
      </span>
    </span>
  );
}
