import 'server-only';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://weestox.com').replace(/\/$/, '');
const BACKEND = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://webapi.weestox.com').replace(/\/$/, '');

export async function fetchInventory<T>(path: string): Promise<T> {
  const response = await fetch(`${BACKEND}${path}`, {
    next: { revalidate: 3600 }, signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`SEO inventory request failed: ${response.status}`);
  const result = await response.json();
  if (result.status === 0) throw new Error('SEO inventory is unavailable');
  return result as T;
}

export interface StockInventory {
  data: { symbol: string; company_name: string; latest_price: number | null }[];
  meta: { totalPages: number };
}
export interface MetalCity {
  id: number; slug: string; name: string;
  rates: { metal: string; last_updated_at?: string }[];
}

// Bound concurrency so large inventories do not flood the backend.
export async function collectBatches<T, R>(items: T[], run: (item: T) => Promise<R>, size = 5): Promise<R[]> {
  const results: R[] = [];
  for (let start = 0; start < items.length; start += size) {
    const batch = await Promise.allSettled(items.slice(start, start + size).map(run));
    for (const result of batch) {
      if (result.status === 'fulfilled') results.push(result.value);
      else console.error('SEO inventory batch failed:', result.reason);
    }
  }
  return results;
}
export function validDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.getTime() <= Date.now() ? date : undefined;
}

export async function getMetalCities(): Promise<MetalCity[]> {
  type CityPage = { data: { cities: { id: number; slug: string; name: string }[]; totalPages: number } };
  const path = '/cities?only_metals=true&limit=100';
  const first = await fetchInventory<CityPage>(`${path}&page=1`);
  const rest = await collectBatches(
    Array.from({ length: Math.max(0, first.data.totalPages - 1) }, (_, i) => i + 2),
    (page) => fetchInventory<CityPage>(`${path}&page=${page}`),
  );
  const cities = [...new Map([first, ...rest].flatMap((page) => page.data.cities)
    .filter((city) => city.slug?.trim()).map((city) => [city.id, city])).values()];
  return collectBatches(cities, async (city) => {
    const detail = await fetchInventory<{ data: { latestMetalRates: MetalCity['rates'] } }>(`/cities/${city.id}`);
    return { ...city, rates: detail.data.latestMetalRates || [] };
  });
}
