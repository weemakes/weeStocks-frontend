import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, SITE_URL } from '@/components/seo/siteSchemas';

export const metadata: Metadata = {
  title: 'About WeeStox | Shariah Financial Intelligence & Ethical Investing',
  description:
    'Learn about WeeStox, our AAOIFI Standard No. 21 Shariah screening methodology, and our mission to provide institutional-grade tools for ethical and conscious investors.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About WeeStox | Shariah Financial Intelligence & Ethical Investing',
    description:
      'Learn about WeeStox, our AAOIFI Standard No. 21 screening methodology, and our mission for ethical investors.',
    url: '/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About WeeStox | Ethical Market Intelligence',
    description:
      'Empowering conscious investors with institutional-grade tools and Shariah-compliant screening intelligence.',
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
