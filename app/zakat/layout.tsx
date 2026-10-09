import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import PageFaq from '@/components/seo/PageFaq';
import { ZAKAT_FAQS } from '@/lib/seo/faqs';
import { getBreadcrumbSchema, getSoftwareAppSchema } from '@/components/seo/siteSchemas';
const description = 'Estimate 2.5% Zakat on qualifying cash, savings, gold, silver, shares and business assets. Learn about Nisab, valuation and calculator limitations.';
export const metadata: Metadata = {
  title: 'Zakat Calculator for Cash, Gold, Silver & Shares', description,
  alternates: { canonical: '/zakat' },
  openGraph: { title: 'Zakat Calculator for Cash, Gold, Silver & Shares | WeeStox', description, url: '/zakat', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Zakat Calculator | WeeStox', description },
};
export default function ZakatLayout({ children }: { children: React.ReactNode }) {
  return <>
    <JsonLd data={[
      getSoftwareAppSchema({ name: 'WeeStox Zakat Calculator', description, applicationCategory: 'FinanceApplication', path: '/zakat' }),
      getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Zakat Calculator', path: '/zakat' }]),
    ]} />
    {children}
    <PageFaq title="Zakat calculation, Nisab, gold and shares FAQs" items={ZAKAT_FAQS} links={[{ label: 'Gold rates and valuation', href: '/gold' }, { label: 'Silver rates', href: '/silver' }, { label: 'Company research', href: '/stocks' }]} />
    <p className="mx-auto max-w-6xl px-4 pb-10 text-xs leading-6 text-muted">Further guidance: <a href="https://islamic-relief.org.za/zakat/calculator/faqs/" className="text-accent underline">Islamic Relief Zakat FAQs</a>. Nisab conventions, jewellery, investments and deductible debts can require qualified guidance. This estimate does not establish eligibility.</p>
  </>;
}
