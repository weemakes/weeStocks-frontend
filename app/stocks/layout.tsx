import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import {
  getBreadcrumbSchema,
  getSoftwareAppSchema,
} from '@/components/seo/siteSchemas';

export const metadata: Metadata = {
  title: 'NSE & BSE Halal Stock Screener | AAOIFI Shariah Compliance | WeeStox',
  description:
    'Screen over 1,500+ Indian equities for AAOIFI Standard No. 21 compliance, debt-to-market-cap ratio (≤33%), interest securities (<33%), non-halal income (<5%), and automated dividend purification.',
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
    title: 'NSE & BSE Halal Stock Screener | AAOIFI Shariah Compliance | WeeStox',
    description:
      'Screen over 1,500+ Indian equities for AAOIFI Standard No. 21 compliance, debt-to-market-cap ratio (≤33%), and automated dividend purification.',
    url: '/stocks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NSE & BSE Halal Stock Screener | AAOIFI Shariah Compliance | WeeStox',
    description:
      'Screen over 1,500+ Indian equities for AAOIFI Standard No. 21 compliance and dividend purification.',
  },
};

export default function StocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const softwareSchema = getSoftwareAppSchema({
    name: 'WeeStox Halal Equities Screener',
    description:
      'Institutional stock screening engine for AAOIFI Shariah compliance, financial leverage, and automated purification.',
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
