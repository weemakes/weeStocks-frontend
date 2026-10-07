import 'server-only';
import { cache } from 'react';
import { normalizeStockDetail, getStockShareholding, getStockCorporateActions } from './index';

const BACKEND = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://webapi.weestox.com').replace(/\/$/, '');

export const getServerStockDetail = cache(async (symbol: string, country: string) => {
  const query = new URLSearchParams({ country });
  const response = await fetch(`${BACKEND}/stocks/${encodeURIComponent(symbol)}?${query}`, {
    next: { revalidate: 60 }, signal: AbortSignal.timeout(15000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Stock report temporarily unavailable (${response.status})`);
  const payload = await response.json();
  if (payload.status === 0) throw new Error('Stock report temporarily unavailable');
  const detail = normalizeStockDetail(payload.data);
  if (!detail) throw new Error('Stock report response is incomplete');
  const [shareholding, actions] = await Promise.all([
    detail.shareholding_pattern?.length ? null : getStockShareholding(symbol, country),
    detail.corporate_actions?.length ? null : getStockCorporateActions(symbol, 20),
  ]);
  if (shareholding?.length) detail.shareholding_pattern = shareholding;
  if (actions?.length) detail.corporate_actions = actions;
  return detail;
});

export function stockPath(symbol: string, country = 'India') {
  const path = `/stocks/${encodeURIComponent(symbol.toUpperCase())}`;
  return country === 'India' ? path : `${path}?${new URLSearchParams({ country })}`;
}
