import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerStockDetail, stockPath } from '@/features/stocks/api/detail.server';
import StockReport from '@/features/stocks/components/StockReport';
import JsonLd from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, SITE_URL } from '@/components/seo/siteSchemas';

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
export async function generateMetadata(props: Props): Promise<Metadata> {
  const detail = await readReport(props);
  const { company } = detail;
  const title = `${company.name} (${company.symbol}) Share Price & Financials`;
  const description = `Research ${company.name} share price, financial statements, valuation ratios, price history, peer comparisons and Shariah screening on WeeStox.`;
  const canonical = stockPath(company.symbol, company.country);
  return { title, description, alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}
export default async function StockDetailPage(props: Props) {
  const detail = await readReport(props);
  const canonical = stockPath(detail.company.symbol, detail.company.country);
  return <div className="min-h-screen bg-canvas">
    <JsonLd data={[
      getBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Stocks', path: '/stocks' }, { name: detail.company.name, path: canonical }]),
      { '@context': 'https://schema.org', '@type': 'WebPage', name: `${detail.company.name} Share Price & Financials`, url: `${SITE_URL}${canonical}` },
    ]} />
    <div className="mx-auto max-w-[1500px] px-3 py-3 sm:px-6 sm:py-5">
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
        <Link href="/stocks" className="text-accent">Stocks</Link> / {detail.company.name}
      </nav>
      <StockReport detail={detail} />
      <p className="mt-4 text-xs text-muted">Market data may be delayed. Quote date: {detail.quote.date || 'Not supplied'}. Financial figures relate to their stated reporting periods. This information is for research and is not a recommendation to buy or sell.</p>
    </div>
  </div>;
}
