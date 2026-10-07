import type { MetadataRoute } from 'next';
import { collectBatches, fetchInventory, getMetalCities, SITE_URL, validDate, type StockInventory } from '@/lib/seo/inventory';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = ['', '/stocks', '/ipo', '/zakat', '/about']
    .map((path) => ({ url: `${SITE_URL}${path}` }));
  const sections = await Promise.allSettled([
    (async () => {
      const path = '/stocks?country=India&limit=100&sort_by=symbol&sort_order=ASC';
      const first = await fetchInventory<StockInventory>(`${path}&page=1`);
      const rest = await collectBatches(
        Array.from({ length: Math.max(0, first.meta.totalPages - 1) }, (_, i) => i + 2),
        (page) => fetchInventory<StockInventory>(`${path}&page=${page}`),
      );
      return [first, ...rest].flatMap((page) => page.data)
        .filter((stock) => stock.symbol?.trim() && stock.company_name?.trim() && Number(stock.latest_price) > 0)
        .map((stock) => ({ url: `${SITE_URL}/stocks/${encodeURIComponent(stock.symbol.trim().toUpperCase())}` }));
    })(),
    (async () => {
      type IPOPage = { data: { total_pages: number; ipos: { slug: string }[] } };
      const path = '/v2/ipos?limit=100&sort=newest';
      const first = await fetchInventory<IPOPage>(`${path}&page=1`);
      const rest = await collectBatches(
        Array.from({ length: Math.max(0, first.data.total_pages - 1) }, (_, i) => i + 2),
        (page) => fetchInventory<IPOPage>(`${path}&page=${page}`),
      );
      // List timestamps can represent GMP alone; do not invent a page-update date.
      return [first, ...rest].flatMap((page) => page.data.ipos).filter((ipo) => ipo.slug?.trim())
        .map((ipo) => ({ url: `${SITE_URL}/ipo/${encodeURIComponent(ipo.slug.trim())}` }));
    })(),
    (async () => (await getMetalCities()).flatMap((city) => ['gold', 'silver', 'platinum'].flatMap((metal) => {
      const rates = city.rates.filter((rate) => rate.metal === metal);
      if (!rates.length) return [];
      const dates = rates.map((rate) => validDate(rate.last_updated_at)).filter((date): date is Date => Boolean(date));
      return [{ url: `${SITE_URL}/${metal}/${encodeURIComponent(city.slug)}`,
        ...(dates.length ? { lastModified: new Date(Math.max(...dates.map((date) => date.getTime()))) } : {}),
      }];
    })))(),
  ]);
  for (const section of sections) {
    if (section.status === 'fulfilled') entries.push(...section.value);
    else console.error('Sitemap section unavailable:', section.reason);
  }
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
