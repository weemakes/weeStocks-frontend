import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, SITE_URL } from '@/components/seo/siteSchemas';

export const metadata: Metadata = {
  title: 'About WeeStox — Stock Research & Market Data',
  description:
    'Learn about WeeStox stock research, IPO updates, metal-price tools and Shariah screening.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About WeeStox — Stock Research & Market Data',
    description:
      'Learn about WeeStox stock research, IPO updates and metal-price tools.',
    url: '/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About WeeStox — Stock Research & Market Data',
    description:
      'Research tools for stock financials, IPOs, metal rates and Shariah screening.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About WeeStox',
    description:
      'Institutional financial intelligence platform for AAOIFI Shariah-compliant equities, live gold/silver rates across India, real-time IPO GMP, and Islamic wealth tools.',
    url: `${SITE_URL}/about`,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  };

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About WeeStox', path: '/about' },
  ]);

  return (
    <>
      <JsonLd data={[aboutSchema, breadcrumbs]} />
      {children}
    </>
  );
}
