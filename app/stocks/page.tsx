import type { Metadata } from 'next';
import PageFaq from '@/components/seo/PageFaq';
import { STOCK_FAQS } from '@/lib/seo/faqs';
import { getStocksList } from '@/features/stocks/api';
import StocksScreener from '@/features/stocks/components/StocksScreener';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://weestox.com';

export const revalidate = 300;

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  const country = typeof query.country === 'string' ? query.country : 'India';
  const canonical = country === 'India' ? '/stocks' : '/stocks?' + new URLSearchParams({ country });
  const title = `${country} Stock Screener, Share Prices & Financial Ratios`;
  const description = `Screen ${country} stocks, analyse financial statements, valuation metrics, price charts, and AAOIFI Shariah compliance on WeeStox.`;
  const ogImageUrl = `${SITE_URL}/og-image.png`;
  return {
    title,
    description,
    alternates: { canonical },
    robots: query.search ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${country} Stock Screener - WeeStox`,
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
export default async function StocksPage({ searchParams }: Props) {
  const query = await searchParams;
  const country = typeof query.country === 'string' && query.country.trim() ? query.country.trim() : 'India';
  const search = typeof query.search === 'string' ? query.search : undefined;
  const initialData = await getStocksList({ country, search, limit: 20, page: 1, sort_by: 'market_cap', sort_order: 'DESC' });
  return <><StocksScreener key={country} initialData={initialData} initialCountry={country} /><PageFaq title="Stock research and screener FAQs" items={STOCK_FAQS} links={[{ label: 'IPO research', href: '/ipo' }, { label: 'About our data', href: '/about' }]} /></>;
}
