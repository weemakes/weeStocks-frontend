import type { MetalPrice, MetalPurity, MetalUnit } from '../types';
export const UNIT_GRAMS: Record<MetalUnit, number> = { '1g':1,'8g':8,'10g':10,'100g':100,'1kg':1000 };
export function normalizedPrice(prices: MetalPrice[], target: MetalUnit, purity?: MetalPurity): number | undefined {
  const valid = prices.filter(p => p.purity === purity && Number.isFinite(p.price) && p.price > 0 && UNIT_GRAMS[p.unit]);
  const quote = valid.find(p=>p.unit===target) || valid.find(p=>p.unit==='1g') || valid[0];
  return quote ? quote.price / UNIT_GRAMS[quote.unit] * UNIT_GRAMS[target] : undefined;
}
