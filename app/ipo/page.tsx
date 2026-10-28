import Link from 'next/link';
import PageFaq from '@/components/seo/PageFaq';
import { IPO_FAQS } from '@/lib/seo/faqs';
import {
  Banknote,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Flame,
  ArrowUpDown,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import { getIPOList, getIPOCountsMatrix } from '@/features/ipo/api';
import { IPOQueryParams, IPOV2ListItem } from '@/features/ipo/types';
import { GMPDisclaimer, IpoCompanyLogo } from '@/features/ipo/components';
import IPOFilters from './components/IPOFilters';
import type { Metadata } from 'next';
import { displayValue, displayDateRange, displayNumber } from '@/features/ipo/utils/display';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://weestox.com';

interface IPOPageProps {
  searchParams: Promise<IPOQueryParams>;
}

export const revalidate = 15;

export async function generateMetadata({ searchParams }: IPOPageProps): Promise<Metadata> {
  const params = await searchParams;
  const status = typeof params.status === 'string' && params.status !== 'all' ? params.status : null;
  const category = typeof params.category === 'string' && params.category !== 'all' ? params.category : null;
  const page = Number(params.page) > 1 ? Number(params.page) : null;
  const canonicalParams = new URLSearchParams();
  if (status) canonicalParams.set('status', status);
  if (category) canonicalParams.set('category', category);
  if (page) canonicalParams.set('page', String(page));
  const qualifier = status
    ? `${status.charAt(0).toUpperCase() + status.slice(1)}`
    : category
      ? `${category.toUpperCase()}`
      : null;
  const canonical = `/ipo${canonicalParams.size ? `?${canonicalParams}` : ''}`;
  const title = `${qualifier ? `${qualifier} IPOs — ` : ''}Live IPO GMP Today, Subscription Status & Allotment Updates | WeeStox`;
  const description = 'Track live Indian IPO Grey Market Premium (GMP) today, expected listing prices, QIB/NII/Retail subscription demand, allotment dates and AAOIFI Shariah compliance screening.';
  const hasNonCanonicalFilter = Boolean(params.search || params.sort || params.halal || params.snapshot_date || params.type);
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: hasNonCanonicalFilter ? { index: false, follow: true } : { index: true, follow: true },
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
          alt: 'WeeStox IPO Grey Market Premium (GMP) & Updates',
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

function getStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30';
    case 'upcoming':
      return 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30';
    case 'closed':
      return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30';
    case 'listed':
      return 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-700/40 dark:text-slate-400 dark:border-slate-700/60';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

function formatGmpRange(subDisplay?: string, gmpValue?: number): string | null {
  if (subDisplay && subDisplay.includes('/')) {
    const parts = subDisplay.split('/').map((p) => p.trim());
    if (parts.length === 2) {
      const lowNum = parseFloat(parts[0]);
      const highNum = parseFloat(parts[1]);
      if (!isNaN(lowNum) && !isNaN(highNum) && (lowNum > 0 || highNum > 0)) {
        const lowStr = lowNum % 1 === 0 ? lowNum.toFixed(0) : lowNum.toString();
        const highStr = highNum % 1 === 0 ? highNum.toFixed(0) : highNum.toString();
        return `${lowStr} ↓ / ${highStr} ↑`;
      }
    }
  }
  if (gmpValue && gmpValue > 0) {
    return `${gmpValue} ↓ / ${gmpValue} ↑`;
  }
  return null;
}

function getGmpDisplay(gmp: IPOV2ListItem['gmp']) {
  if (!gmp || gmp.value == null || !Number.isFinite(Number(gmp.value))) {
    return {
      hasGmp: false,
      text: '—',
      range: null,
      color: 'text-slate-500',
      isHot: false,
    };
  }

  const isPositive = gmp.value > 0;
  const isHot = (gmp.percentage ?? 0) >= 40;
  const range = formatGmpRange(gmp.sub_display, gmp.value);

  return {
    hasGmp: true,
    text: displayValue(gmp.display, `₹${gmp.value}${gmp.percentage != null && Number.isFinite(Number(gmp.percentage)) ? ` (${Number(gmp.percentage).toFixed(2)}%)` : ''}`),
    range,
    color: isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
    isHot,
  };
}

export default async function IPOPage({ searchParams }: IPOPageProps) {
  const params = await searchParams;

  const [ipoListData, filterCounts] = await Promise.all([
    getIPOList({
      status: params.status || 'all',
      type: params.type,
      category: params.category,
      search: params.search,
      sort: params.sort || 'newest',
      snapshot_date: params.snapshot_date,
      halal: params.halal,
      page: params.page ? parseInt(String(params.page)) : 1,
      limit: params.limit ? parseInt(String(params.limit)) : 20,
    }),
    getIPOCountsMatrix(undefined, { halal: params.halal }),
  ]);

  const { ipos, summary, total, page, total_pages, snapshot_date } = ipoListData.data;
  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Indian IPO GMP and subscription status',
    url: `${SITE_URL}/ipo`,
    numberOfItems: total,
    itemListElement: ipos.map((ipo, index) => ({
      '@type': 'ListItem',
      position: (page - 1) * 20 + index + 1,
      name: `${ipo.company_name} IPO`,
      url: `${SITE_URL}/ipo/${encodeURIComponent(ipo.slug)}`,
    })),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: IPO_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const getSortUrl = (sortKey: string) => {
    const p = new URLSearchParams();
    if (params.status && params.status !== 'all') p.set('status', params.status);
    if (params.type && params.type !== 'all') p.set('type', params.type);
    if (params.category && params.category !== 'all') p.set('category', params.category);
    if (params.search) p.set('search', params.search);
    if (params.halal) p.set('halal', params.halal);
    p.set('sort', sortKey);
    return `/ipo?${p.toString()}`;
  };

  return (
    <div className="bg-canvas min-h-screen py-6 md:py-4 pb-8 text-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([listJsonLd, faqJsonLd]).replace(/</g, '\\u003c') }}
      />
      <div className="mx-auto max-w-[1740px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
              <span className="text-slate-800 dark:text-slate-200 font-medium">IPO Intelligence</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
                <Banknote className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                IPO Grey Market Premium (GMP)
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                Live Snapshot
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Track latest GMP, expected listing price, and subscription status for upcoming and live IPOs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg shrink-0 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Last Updated: <strong className="text-slate-800 dark:text-slate-200">{snapshot_date || 'Today'}</strong></span>
            </div>
          </div>
        </div>

        {/* SEBI Compliance / Educational Disclaimer */}
        <GMPDisclaimer className="mb-4" />

        {/* Filters Toolbar with Integrated Segmented Pills & Toggles */}
        <IPOFilters
          currentParams={params}
          totalResults={total}
          page={page}
          totalPages={total_pages}
          limit={20}
          summary={summary}
          filterCounts={filterCounts}
        />

        {/* 3. High-Density Pro Table (StockeZee-style) */}
        {(() => {
          const displayIpos = params.active_gmp === 'true'
            ? ipos.filter((ipo) => ipo.gmp?.value != null && Number(ipo.gmp.value) > 0)
            : ipos;

          return displayIpos && displayIpos.length > 0 ? (
            <div className="mb-6">
              {/* Horizontally Scrollable High-Density Pro Table (StockeZee-style on mobile & desktop) */}
              <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs dark:shadow-xl">
                <div className="overflow-x-auto scroll-smooth">
                  <table className="w-full text-left border-collapse min-w-[1020px]">
                    <thead className="sticky top-0 bg-slate-50/90 dark:bg-slate-950/95 backdrop-blur-md z-20 border-b border-slate-200 dark:border-slate-800">
                      <tr className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <th className="px-3.5 py-2.5 text-left">Company & Type</th>
                        <th className="px-3.5 py-2.5 text-left whitespace-nowrap">Bidding Dates</th>
                        <th className="px-3.5 py-2.5 text-left whitespace-nowrap">Issue Price</th>
                        <th className="px-3.5 py-2.5 text-left whitespace-nowrap">Lot & Min Inv.</th>
                        <th className="px-3.5 py-2.5 text-left whitespace-nowrap">
                          <Link
                            href={getSortUrl(params.sort === 'gmp_desc' ? 'gmp_asc' : 'gmp_desc')}
                            className="inline-flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors group cursor-pointer"
                            title="Sort by GMP"
                          >
                            <span>GMP</span>
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                          </Link>
                        </th>
                        <th className="px-3.5 py-2.5 text-left whitespace-nowrap">Est. Listing / Profit</th>
                        <th className="px-3.5 py-2.5 text-left whitespace-nowrap">Sub. Demand</th>
                        <th className="px-3.5 py-2.5 text-left whitespace-nowrap">Listing Date</th>
                        <th className="px-3.5 py-2.5 text-left whitespace-nowrap">Allotment</th>
                        <th className="px-3.5 py-2.5 text-right">Details</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {displayIpos.map((ipo) => {
                        const gmpInfo = getGmpDisplay(ipo.gmp);
                        const isSme = ipo.type?.toLowerCase().includes('sme');

                        return (
                          <tr
                            key={ipo.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                          >
                            {/* Company Name, Type, Halal Status */}
                            <td className="px-3.5 py-3 text-left">
                              <div className="flex items-center gap-2.5">
                                <IpoCompanyLogo
                                  src={ipo.logo_url}
                                  name={ipo.company_name}
                                  size="md"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <Link
                                      href={`/ipo/${ipo.slug}`}
                                      className="font-bold text-slate-900 dark:text-slate-100 text-[15px] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors tracking-tight"
                                    >
                                      {displayValue(ipo.company_name)}
                                    </Link>
                                    {gmpInfo.isHot && (
                                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-0 text-[10px] font-bold rounded">
                                        <Flame className="w-2.5 h-2.5" /> Hot
                                      </span>
                                    )}
                                    {ipo.halal_status === 'halal' && (
                                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 text-[11px] font-bold rounded">
                                        <ShieldCheck className="w-3 h-3" /> Halal
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${getStatusBadge(ipo.status)}`}>
                                      {displayValue(ipo.status)}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${isSme
                                          ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30'
                                          : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30'
                                        }`}
                                    >
                                      {displayValue(ipo.type)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Bidding Dates */}
                            <td className="px-3.5 py-3 text-left whitespace-nowrap">
                              <div className="text-slate-900 dark:text-slate-100 font-semibold text-xs tabular-nums">
                                {displayDateRange(ipo.open_close, ipo.open_date, ipo.close_date)}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Updated: {displayValue(ipo.updated_on)}</div>
                            </td>

                            {/* Issue Price */}
                            <td className="px-3.5 py-3 text-left whitespace-nowrap">
                              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                                {displayValue(ipo.issue_price_display, displayNumber(ipo.issue_price, '₹'))}
                              </div>
                              {ipo.ipo_size_display && (
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal tabular-nums mt-0.5">
                                  Size: {displayValue(ipo.ipo_size_display)}
                                </div>
                              )}
                            </td>

                            {/* Lot Size & Min Investment */}
                            <td className="px-3.5 py-3 text-left whitespace-nowrap">
                              <div className="text-slate-900 dark:text-slate-100 font-bold text-sm tabular-nums">
                                {displayValue(ipo.min_investment_display, displayNumber(ipo.min_investment, '₹'))}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal tabular-nums mt-0.5">
                                {displayValue(ipo.lot_size_display, displayNumber(ipo.lot_size, '', ' Shares'))}
                              </div>
                            </td>

                            {/* Live GMP */}
                            <td className="px-3.5 py-3 text-left whitespace-nowrap">
                              {gmpInfo.hasGmp ? (
                                <div className="flex flex-col items-start">
                                  <div className={`font-bold tabular-nums text-sm ${gmpInfo.color}`}>
                                    {gmpInfo.text}
                                  </div>
                                  {gmpInfo.range && (
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums font-normal mt-0.5">
                                      {gmpInfo.range}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-slate-400 dark:text-slate-500 font-medium text-xs tabular-nums">
                                  —
                                </div>
                              )}
                            </td>

                            {/* Est Listing & Profit */}
                            <td className="px-3.5 py-3 text-left whitespace-nowrap">
                              <div className="text-slate-900 dark:text-slate-100 font-bold text-sm tabular-nums">
                                {displayValue(ipo.est_listing_display, displayNumber(ipo.est_listing, '₹'))}
                              </div>
                              <div className="text-[12px] text-emerald-600 dark:text-emerald-400 font-bold tabular-nums mt-0.5">
                                {displayValue(ipo.est_profit_display, '') ? `+${displayValue(ipo.est_profit_display)}/lot` : '–'}
                              </div>
                            </td>

                            {/* Subscription Demand */}
                            <td className="px-3.5 py-3 text-left whitespace-nowrap">
                              <div className="text-slate-900 dark:text-slate-100 font-bold text-sm tabular-nums">
                                {displayValue(ipo.subscription_display, displayNumber(ipo.subscription_times, '', 'x'))}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                                {ipo.has_anchor == null ? '–' : ipo.has_anchor ? 'Anchor In' : 'No Anchor'}
                              </div>
                            </td>

                            {/* Listing Date */}
                            <td className="px-3.5 py-3 text-left whitespace-nowrap">
                              <div className="text-slate-900 dark:text-slate-100 font-semibold text-xs">
                                {displayValue(ipo.listing_date_display, displayValue(ipo.listing_date))}
                              </div>
                              <div className="text-[11px] text-slate-400 font-normal mt-0.5">Tentative</div>
                            </td>

                            {/* Allotment Status */}
                            <td className="px-3.5 py-3 text-left whitespace-nowrap">
                              {ipo.is_allotment_out ? (
                                <div className="flex flex-col items-start gap-1">
                                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    <ShieldCheck className="h-3 w-3" />Out
                                  </span>
                                  {(ipo.allotment_url || ipo.registrar_url) && (
                                    <a href={ipo.allotment_url || ipo.registrar_url || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
                                      Check <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-300 dark:text-slate-700 font-medium text-xs">—</span>
                              )}
                            </td>

                            {/* Action Button */}
                            <td className="px-3.5 py-3 text-right whitespace-nowrap">
                              <Link
                                href={`/ipo/${ipo.slug}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-all"
                              >
                                <span>Audit</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Bar */}
              {total_pages > 1 && (
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    Page <strong className="text-slate-800 dark:text-slate-200">{page}</strong> of{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{total_pages}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    {page > 1 && (
                      <Link
                        href={`/ipo?page=${page - 1}${params.status ? `&status=${params.status}` : ''}${params.category ? `&category=${params.category}` : ''}`}
                        className="px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 shadow-xs"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                      </Link>
                    )}
                    {page < total_pages && (
                      <Link
                        href={`/ipo?page=${page + 1}${params.status ? `&status=${params.status}` : ''}${params.category ? `&category=${params.category}` : ''}`}
                        className="px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 shadow-xs"
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-80" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">No IPOs found for selected filters</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Try clearing your search keyword or switching between Mainboard and SME tabs.
              </p>
              <Link
                href="/ipo"
                className="btn btn-primary text-xs"
              >
                Reset All Filters
              </Link>
            </div>
          );
        })()}

        {/* Educational Information Footer */}
        <div className="mt-8 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            Understanding IPO GMP & Shariah Compliance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">What is Grey Market Premium (GMP)?</span>
              <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                GMP is the unofficial premium at which an IPO share is traded prior to listing, indicating market demand and retail sentiment.
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Why Screen IPOs for Halal?</span>
              <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Companies must be screened for non-halal revenue sources and excessive interest debt before applying to ensure Shariah compliance.
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Estimated Listing Calculation</span>
              <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Estimated listing price equals the upper price band plus current GMP. This provides an expected listing gain benchmark.
              </span>
            </div>
          </div>
        </div>
      </div>
      <PageFaq title="IPO GMP, subscription and allotment FAQs" items={IPO_FAQS} schema={false} links={[{ label: 'Stock screener', href: '/stocks' }]} />
    </div>
  );
}
