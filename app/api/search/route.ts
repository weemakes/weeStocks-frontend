import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

interface SearchResult {
  id: string;
  type: 'stock' | 'ipo' | 'metal';
  title: string;
  subtitle: string;
  href: string;
  logoUrl?: string | null;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() || '';
  if (!query) return NextResponse.json({ data: [] satisfies SearchResult[] });

  const encoded = encodeURIComponent(query);
  const [stockResponse, ipoResponse] = await Promise.allSettled([
    fetch(`${BACKEND_API_URL}/stocks?search=${encoded}&page=1&limit=6`, { cache: 'no-store', headers: { Accept: 'application/json' } }).then((response) => response.ok ? response.json() : null),
    fetch(`${BACKEND_API_URL}/v2/ipos?search=${encoded}&page=1&limit=5`, { cache: 'no-store', headers: { Accept: 'application/json' } }).then((response) => response.ok ? response.json() : null),
  ]);

  const results: SearchResult[] = [];
  if (stockResponse.status === 'fulfilled') {
    const payload = record(stockResponse.value);
    const rows = Array.isArray(payload.data) ? payload.data : Array.isArray(record(payload.data).stocks) ? record(payload.data).stocks as unknown[] : [];
    for (const item of rows.slice(0, 6)) {
      const row = record(item);
      const symbol = String(row.symbol || '');
      if (!symbol) continue;
      const country = String(row.country || 'India');
      results.push({ id: `stock-${row.id || symbol}`, type: 'stock', title: String(row.company_name || symbol), subtitle: `${symbol} · ${row.exchange || country}`, href: `/stocks/${encodeURIComponent(symbol)}?country=${encodeURIComponent(country)}`, logoUrl: typeof row.logo_url === 'string' ? row.logo_url : null });
    }
  }

  if (ipoResponse.status === 'fulfilled') {
    const payload = record(ipoResponse.value);
    const rows = record(payload.data).ipos;
    if (Array.isArray(rows)) for (const item of rows.slice(0, 5)) {
      const row = record(item);
      const slug = String(row.slug || '');
      if (!slug) continue;
      results.push({ id: `ipo-${row.id || slug}`, type: 'ipo', title: String(row.company_name || slug), subtitle: `${row.status || 'IPO'} · ${row.type || 'IPO'}`, href: `/ipo/${encodeURIComponent(slug)}`, logoUrl: typeof row.logo_url === 'string' ? row.logo_url : null });
    }
  }

  const normalized = query.toLowerCase();
  const metals = [
    { id: 'metal-gold', type: 'metal' as const, title: 'Gold', subtitle: '24K and 22K live rates', href: '/gold' },
    { id: 'metal-silver', type: 'metal' as const, title: 'Silver', subtitle: 'Live silver rates', href: '/silver' },
    { id: 'metal-platinum', type: 'metal' as const, title: 'Platinum', subtitle: 'Live platinum rates', href: '/platinum' },
  ];
  results.push(...metals.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(normalized)));

  return NextResponse.json({ data: results.slice(0, 10) });
}
