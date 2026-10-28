import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import PageFaq from '@/components/seo/PageFaq';
import { ZAKAT_FAQS } from '@/lib/seo/faqs';
import { getBreadcrumbSchema, getSoftwareAppSchema, getFaqSchema } from '@/components/seo/siteSchemas';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://weestox.com';
const description = 'Calculate your 2.5% Zakat online for cash, bank balances, gold, silver, shares and business assets. Check today’s live Nisab threshold and Islamic wealth guidelines.';
export const metadata: Metadata = {
  title: 'Zakat Calculator 2026: Calculate Zakat on Cash, Gold, Silver & Shares | WeeStox',
  description,
  alternates: { canonical: '/zakat' },
  openGraph: {
    title: 'Zakat Calculator 2026: Calculate Zakat on Cash, Gold, Silver & Shares | WeeStox',
    description,
    url: '/zakat',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'WeeStox Zakat Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zakat Calculator 2026 | WeeStox',
    description,
    images: [`${SITE_URL}/og-image.png`],
  },
};
export default function ZakatLayout({ children }: { children: React.ReactNode }) {
  return <>
    <JsonLd data={[
      getSoftwareAppSchema({ name: 'WeeStox Zakat Calculator', description, applicationCategory: 'FinanceApplication', path: '/zakat' }),
      getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Zakat Calculator', path: '/zakat' }]),
      getFaqSchema(ZAKAT_FAQS),
    ]} />
    {children}
    <PageFaq title="Zakat calculation, Nisab, gold and shares FAQs" items={ZAKAT_FAQS} links={[{ label: 'Gold rates and valuation', href: '/gold' }, { label: 'Silver rates', href: '/silver' }, { label: 'Company research', href: '/stocks' }]} />
    <p className="mx-auto max-w-6xl px-4 pb-10 text-xs leading-6 text-muted">Further guidance: <a href="https://islamic-relief.org.za/zakat/calculator/faqs/" className="text-accent underline">Islamic Relief Zakat FAQs</a>. Nisab conventions, jewellery, investments and deductible debts can require qualified guidance. This estimate does not establish eligibility.</p>
  </>;
}
