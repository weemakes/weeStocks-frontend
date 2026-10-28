import type { Metadata } from 'next';
import PageFaq from '@/components/seo/PageFaq';
import { companyFaqs } from '@/lib/seo/faqs';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerStockDetail, stockPath } from '@/features/stocks/api/detail.server';
import StockReport from '@/features/stocks/components/StockReport';
import JsonLd from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFaqSchema, SITE_URL } from '@/components/seo/siteSchemas';

type Props = {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ country?: string | string[] }>;
};
async function readReport({ params, searchParams }: Props) {
  const [{ symbol }, query] = await Promise.all([params, searchParams]);
  const country = typeof query.country === 'string' && query.country.trim() ? query.country.trim() : 'India';
  // Route params can retain URL escapes during development rendering.
  // Normalize once before the API layer encodes the stock identifier.
  let identifier = symbol;
  try { identifier = decodeURIComponent(symbol); } catch { notFound(); }
  const detail = await getServerStockDetail(identifier.toUpperCase(), country);
  if (!detail) notFound();
  return detail;
}

export const revalidate = 300;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const detail = await readReport(props);
  const { company, shariah_compliance, header, shariah_audit } = detail;
  const isHalal = shariah_compliance?.status === 'HALAL' || shariah_audit?.overall_result === 'PASS' || header?.is_shariah_compliant;
  const statusLabel = isHalal ? 'Halal (Shariah Compliant)' : 'Shariah Audit';
  const title = `${company.name} (${company.symbol}) Share Price Today, Financials & ${statusLabel} | WeeStox`;
  const description = `Check ${company.name} (${company.symbol}) live share price today, valuation ratios, quarterly financials, debt-to-market-cap leverage, dividend purification and AAOIFI Shariah compliance audit on WeeStox.`;
  const canonical = stockPath(company.symbol, company.country);
  const ogImageUrl = company.logo_url || `${SITE_URL}/og-image.png`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${company.name} Share Price & Financials`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
export default async function StockDetailPage(props: Props) {
  const detail = await readReport(props);
  const canonical = stockPath(detail.company.symbol, detail.company.country);
  const isHalal = detail.shariah_compliance?.status === 'HALAL' || detail.shariah_audit?.overall_result === 'PASS' || detail.header?.is_shariah_compliant;
  const stockFaqsList = detail.investor_faqs?.length
    ? detail.investor_faqs
    : companyFaqs(detail.company.name, detail.company.symbol, detail.company.country, isHalal);

  const corporationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    name: detail.company.name,
    tickerSymbol: `${detail.company.exchange || 'NSE'}:${detail.company.symbol}`,
    url: `${SITE_URL}${canonical}`,
    logo: detail.company.logo_url || undefined,
  };

  return <div className="min-h-screen bg-canvas">
    <JsonLd data={[
      getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Stocks', path: '/stocks' }, { name: detail.company.name, path: canonical }]),
      corporationSchema,
      { '@context': 'https://schema.org', '@type': 'WebPage', name: `${detail.company.name} Share Price & Financials`, url: `${SITE_URL}${canonical}` },
      getFaqSchema(stockFaqsList),
    ]} />
    <div className="mx-auto max-w-[1740px] px-4 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-5">
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
        <Link href="/stocks" className="text-accent">Stocks</Link> / {detail.company.name}
      </nav>
      <StockReport detail={detail} />
      <PageFaq title={`${detail.company.name} Share Price & Halal Screening FAQs`} items={stockFaqsList} schema={false} links={[{ label: 'Compare stocks', href: '/stocks' }]} />
      <p className="mt-4 text-xs text-muted">Market data may be delayed. Quote date: {detail.quote.date || 'Not supplied'}. Financial figures relate to their stated reporting periods. This information is for research and is not a recommendation to buy or sell.</p>
    </div>
  </div>;
}
