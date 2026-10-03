import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, SITE_URL } from '@/components/seo/siteSchemas';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol: rawSymbol } = await params;
  const symbol = decodeURIComponent(rawSymbol || '').toUpperCase();
  const title = `${symbol} Share Price, AAOIFI Shariah Compliance & Analysis | WeeStox`;
  const description = `Live ${symbol} stock price, AAOIFI Standard No. 21 Shariah screening status, debt-to-market-cap leverage, interest revenue threshold, and dividend purification breakdown on WeeStox.`;
  const canonical = `/stocks/${encodeURIComponent(symbol)}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function StockDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ symbol: string }>;
}) {
  const { symbol: rawSymbol } = await params;
  const symbol = decodeURIComponent(rawSymbol || '').toUpperCase();
  const canonical = `/stocks/${encodeURIComponent(symbol)}`;

  const financialProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `${symbol} Equity`,
    tickerSymbol: symbol,
    url: `${SITE_URL}${canonical}`,
    description: `AAOIFI Shariah compliance and institutional financial audit for ${symbol} on Indian and global exchanges.`,
    provider: {
      '@type': 'Organization',
      name: 'WeeStox',
      url: SITE_URL,
    },
  };

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Stock Intelligence', path: '/stocks' },
    { name: symbol, path: canonical },
  ]);

  return (
    <>
      <JsonLd data={[financialProductSchema, breadcrumbs]} />
      {children}
    </>
  );
}
