import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import {
  getBreadcrumbSchema,
  getSoftwareAppSchema,
} from '@/components/seo/siteSchemas';

export const metadata: Metadata = {
  title: 'Stock Screener, Share Prices & Financial Ratios',
  description:
    'Compare stocks by share price, market capitalization, valuation, financial ratios and sector. Explore company financials, peer comparisons and Shariah screening.',
  keywords: [
    'halal stock screener',
    'shariah compliant stocks nse',
    'bse halal stocks',
    'aaoifi standard 21 screener',
    'debt to market cap',
    'dividend purification calculator',
    'islamic stock screening india',
  ],
  alternates: {
    canonical: '/stocks',
  },
  openGraph: {
    title: 'Stock Screener, Share Prices & Financial Ratios',
    description:
      'Compare share prices, valuation ratios, sectors and company financials with the WeeStox stock screener.',
    url: '/stocks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stock Screener, Share Prices & Financial Ratios',
    description:
      'Compare stocks, financial ratios and company reports on WeeStox.',
  },
};

export default function StocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const softwareSchema = getSoftwareAppSchema({
    name: 'WeeStox Stock Screener',
    description:
      'Stock screener for market data, valuation, financial ratios and Shariah screening.',
    applicationCategory: 'FinanceApplication',
    path: '/stocks',
  });
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Stock Intelligence', path: '/stocks' },
  ]);

  return (
    <>
      <JsonLd data={[softwareSchema, breadcrumbs]} />
      {children}
    </>
  );
}
