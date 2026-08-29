/**
 * MetalPriceCard Component
 * Displays current price for a specific purity/unit combination
 */

import type { MetalPrice } from "../types";
import { formatPrice } from "../utils";
import { PriceChange } from "./PriceChange";

interface MetalPriceCardProps {
  price: MetalPrice;
  metalName: string;
  isHighlighted?: boolean;
}

export function MetalPriceCard({
  price,
  metalName,
  isHighlighted = false,
}: MetalPriceCardProps) {
  return (
    <div
      className={`
      rounded-lg border p-6 transition-all hover:shadow-lg
      ${
        isHighlighted
          ? "border-blue-500 bg-gradient-to-br from-blue-950/30 to-gray-900 shadow-blue-500/20"
          : "border-gray-800 bg-gray-900 hover:border-blue-500/50"
      }
    `}
    >
      <div className="text-sm font-medium text-gray-400 mb-1">
        {price.purity || metalName}
      </div>
      <div className="text-3xl font-bold text-white mb-2">
        {formatPrice(price.price)}
        <span className="text-base font-normal text-gray-400 ml-2">
          / {price.unit}
        </span>
      </div>
      {price.change && (
        <div className="flex items-center gap-2">
          <PriceChange change={price.change} />
          {price.previousPrice && (
            <span className="text-sm text-gray-500">
              vs {formatPrice(price.previousPrice)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
