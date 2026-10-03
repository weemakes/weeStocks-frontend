import type { MetadataRoute } from 'next';
import { getIPOList } from '@/features/ipo/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://weestox.com';
const METALS = ['gold', 'silver', 'platinum'] as const;
const CITIES = [
  'delhi',
  'mumbai',
  'bangalore',
  'chennai',
  'kolkata',
  'hyderabad',
  'ahmedabad',
  'pune',
  'jaipur',
  'lucknow',
  'chandigarh',
  'surat',
] as const;

// Fallback high-profile Indian stocks for sitemap inclusion
const POPULAR_STOCKS = [
  'TCS',
  'RELIANCE',
  'INFY',
  'HDFCBANK',
  'TATAMOTORS',
  'SBIN',
  'ITC',
  'BHARTIARTL',
  'HINDUNILVR',
  'ICICIBANK',
  'LT',
  'WIPRO',
  'MARUTI',
  'BAJFINANCE',
  'ASIANPAINT',
  'TITAN',
  'SUNPHARMA',
  'HCLTECH',
  'KOTAKBANK',
  'TECHM',
  'ULTRACEMCO',
  'POWERGRID',
  'NTPC',
  'ONGC',
  'NESTLEIND',
  'ADANIENT',
  'ADANIPORTS',
  'JSWSTEEL',
  'TATASTEEL',
  'COALINDIA',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/stocks`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/ipo`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/zakat`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const metalIndexPages: MetadataRoute.Sitemap = METALS.map((metal) => ({
    url: `${SITE_URL}/${metal}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const metalPages: MetadataRoute.Sitemap = METALS.flatMap((metal) =>
    CITIES.map((city) => ({
      url: `${SITE_URL}/${metal}/${city}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  );

  // Dynamic Stocks Pages
  let stockPages: MetadataRoute.Sitemap = [];
  try {
    const backend = process.env.BACKEND_API_URL || 'https://webapi.weestox.com';
    const res = await fetch(`${backend}/stocks?country=India&limit=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const stocks = Array.isArray(data?.data) ? data.data : [];
      if (stocks.length > 0) {
        stockPages = stocks.map((s: { symbol: string }) => ({
          url: `${SITE_URL}/stocks/${encodeURIComponent(s.symbol)}`,
          lastModified: now,
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }));
      }
    }
  } catch {
    // If backend is unreachable, fallback to popular stocks
  }

  if (stockPages.length === 0) {
    stockPages = POPULAR_STOCKS.map((symbol) => ({
      url: `${SITE_URL}/stocks/${symbol}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    }));
  }

  // Dynamic IPO Pages
  let ipoPages: MetadataRoute.Sitemap = [];
  try {
    const firstPage = await getIPOList({ page: 1, limit: 100, sort: 'newest' });
    const remaining =
      firstPage.data.total_pages > 1
        ? await Promise.all(
            Array.from({ length: firstPage.data.total_pages - 1 }, (_, index) =>
              getIPOList({ page: index + 2, limit: 100, sort: 'newest' })
            )
          )
        : [];
    const ipos = [firstPage, ...remaining].flatMap((response) => response.data.ipos);
    ipoPages = Array.from(new Map(ipos.map((ipo) => [ipo.slug, ipo])).values()).map((ipo) => ({
      url: `${SITE_URL}/ipo/${encodeURIComponent(ipo.slug)}`,
      lastModified: now,
      changeFrequency: ipo.status.toLowerCase() === 'listed' ? 'weekly' : 'daily',
      priority: ipo.status.toLowerCase() === 'listed' ? 0.6 : 0.85,
    }));
  } catch {
    // Upstream fallback
  }

  return [...staticPages, ...metalIndexPages, ...metalPages, ...stockPages, ...ipoPages];
}
