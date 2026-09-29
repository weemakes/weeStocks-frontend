import type { IPOGmpHistoryItem } from '../types';

export type GMPMovement = 'up' | 'down' | 'flat';

export function getGMPMovement(item: IPOGmpHistoryItem, older?: IPOGmpHistoryItem): GMPMovement {
  if (!older || item.gmp_value === older.gmp_value) return 'flat';
  return item.gmp_value > older.gmp_value ? 'up' : 'down';
}

export function getEstimatedProfit(gmpValue: number, lotSize?: number | null): number | null {
  if (!lotSize || lotSize <= 0 || !Number.isFinite(gmpValue)) return null;
  return gmpValue * lotSize;
}
