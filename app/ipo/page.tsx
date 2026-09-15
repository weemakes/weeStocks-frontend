import { queryUrl } from '@/lib/query';
import Link from 'next/link';
import {
  Rocket,
  Clock,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Flame,
  ArrowUpDown,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import { getIPOList } from '@/features/ipo/api';
import { IPOQueryParams, IPOV2ListItem } from '@/features/ipo/types';
import { GMPDisclaimer } from '@/features/ipo/components';
import IPOFilters from './components/IPOFilters';

export const metadata = {
  title: 'Live IPO GMP Today & Subscription Status (NSE & BSE) | WeeStox',
  description: 'Complete Indian IPO intelligence: Real-time Grey Market Premium (GMP), subscription demand status, allotment dates, and Shariah compliance screening.',
};

interface IPOPageProps {
  searchParams: Promise<IPOQueryParams>;
}

function getStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'bg-emerald-500/15 text-positive border border-emerald-500/30';
    case 'upcoming':
      return 'bg-sky-500/15 text-accent border border-sky-500/30';
    case 'closed':
      return 'bg-amber-500/15 text-warning border border-amber-500/30';
    case 'listed':
      return 'bg-elevated/40 text-muted border border-line-strong/60';
    default:
      return 'bg-well text-body border border-line-strong';
  }
}

function getHalalBadge(status: string | null) {
  switch (status?.toLowerCase()) {
    case 'halal':
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-500/15 text-positive text-[10px] font-bold border border-emerald-500/30">
          <ShieldCheck className="w-2.5 h-2.5" /> Halal
        </span>
      );
    case 'doubtful':
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-500/15 text-warning text-[10px] font-bold border border-amber-500/30">
          <AlertTriangle className="w-2.5 h-2.5" /> Review
        </span>
      );
    case 'not_halal':
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-rose-500/15 text-negative text-[10px] font-bold border border-rose-500/30">
          <XCircle className="w-2.5 h-2.5" /> Non-Halal
        </span>
      );
    default:
      return null;
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
  if (!gmp || gmp.value === 0 || gmp.value === null || !gmp.value) {
    return {
      hasGmp: false,
      text: '—',
      range: null,
      color: 'text-quiet',
      isHot: false,
    };
  }

  const isPositive = gmp.value > 0;
  const isHot = (gmp.percentage ?? 0) >= 40;
  const range = formatGmpRange(gmp.sub_display, gmp.value);

  return {
    hasGmp: true,
    text: gmp.display || `₹${gmp.value}${gmp.percentage !== null && gmp.percentage !== undefined ? ` (${Number(gmp.percentage).toFixed(2)}%)` : ''}`,
    range,
    color: isPositive ? 'text-positive' : 'text-negative',
    isHot,
  };
}

export default async function IPOPage({ searchParams }: IPOPageProps) {
  const params = await searchParams;


    const ipoListData = await getIPOList({
      status: params.status || 'all',
      type: params.type,
      category: params.category,
      search: params.search,
      sort: params.sort || 'newest',
      snapshot_date: params.snapshot_date,
      halal: params.halal,
      page: Math.max(1,Math.min(100000,parseInt(String(params.page))||1)),
      limit: Math.max(1,Math.min(100,parseInt(String(params.limit))||20)),
    });

    const { ipos, summary, total, page, total_pages, snapshot_date } = ipoListData.data;

    const getSortUrl = (sortKey:string) => queryUrl('/ipo',params as Record<string,unknown>,{sort:sortKey,page:1});

    return (
      <div className="bg-canvas py-6 md:py-8 pb-8">
        <div className="container mx-auto">
          {/* Breadcrumb & Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted mb-1.5">
                <Link href="/" className="hover:text-ink transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-ink font-medium">IPO Intelligence</span>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-ink tracking-tight flex items-center gap-2.5">
                  <Rocket className="w-7 h-7 text-negative shrink-0" />
                  IPO Grey Market Premium (GMP)
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-negative border border-rose-500/20">
                  Live Snapshot
                </span>
              </div>

              <p className="text-xs md:text-sm text-muted mt-1 max-w-2xl">
                Track latest GMP, expected listing price, and subscription status for upcoming and live IPOs.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted bg-panel border border-line px-3 py-1.5 rounded-lg shrink-0">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>Snapshot: <strong className="text-ink">{snapshot_date || 'Today'}</strong></span>
            </div>
          </div>

          {/* SEBI Compliance / Educational Disclaimer */}
          <GMPDisclaimer className="mb-6" />

          {/* 1. Clickable Summary Cards (StockeZee-style KPI Strip) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6">
            {/* Total */}
            <Link
              href="/ipo"
              className={`bg-panel/80 border rounded-lg p-3 text-left transition-all hover:border-line-strong ${
                !params.status || params.status === 'all'
                  ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-950/20'
                  : 'border-line'
              }`}
            >
              <span className="text-xs font-medium text-muted block mb-1">Total IPOs</span>
              <div className="text-xl font-bold text-ink tabular-nums">{summary?.total ?? total}</div>
              <div className="text-[10px] text-quiet mt-0.5">Tracked this cycle</div>
            </Link>

            {/* Open */}
            <Link
              href="/ipo?status=open"
              className={`bg-panel/80 border rounded-lg p-3 text-left transition-all hover:border-line-strong ${
                params.status === 'open'
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-950/20'
                  : 'border-line'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted">Open Now</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-xl font-bold text-positive tabular-nums">{summary?.open ?? 0}</div>
              <div className="text-[10px] text-quiet mt-0.5">Accepting bids</div>
            </Link>

            {/* Upcoming */}
            <Link
              href="/ipo?status=upcoming"
              className={`bg-panel/80 border rounded-lg p-3 text-left transition-all hover:border-line-strong ${
                params.status === 'upcoming'
                  ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-950/20'
                  : 'border-line'
              }`}
            >
              <span className="text-xs font-medium text-muted block mb-1">Upcoming</span>
              <div className="text-xl font-bold text-accent tabular-nums">{summary?.upcoming ?? 0}</div>
              <div className="text-[10px] text-quiet mt-0.5">Launching soon</div>
            </Link>

            {/* Closed */}
            <Link
              href="/ipo?status=closed"
              className={`bg-panel/80 border rounded-lg p-3 text-left transition-all hover:border-line-strong ${
                params.status === 'closed'
                  ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-950/20'
                  : 'border-line'
              }`}
            >
              <span className="text-xs font-medium text-muted block mb-1">Closed</span>
              <div className="text-xl font-bold text-warning tabular-nums">{summary?.closed ?? 0}</div>
              <div className="text-[10px] text-quiet mt-0.5">Awaiting allotment</div>
            </Link>

            {/* Listed */}
            <Link
              href="/ipo?status=listed"
              className={`bg-panel/80 border rounded-lg p-3 text-left transition-all hover:border-line-strong ${
                params.status === 'listed'
                  ? 'border-slate-600 ring-2 ring-slate-600/20 bg-elevated'
                  : 'border-line'
              }`}
            >
              <span className="text-xs font-medium text-muted block mb-1">Listed</span>
              <div className="text-xl font-bold text-body tabular-nums">{summary?.listed ?? 0}</div>
              <div className="text-[10px] text-quiet mt-0.5">Trading on exchange</div>
            </Link>

            {/* Mainboard */}
            <Link
              href="/ipo?category=mainboard"
              className={`bg-panel/80 border rounded-lg p-3 text-left transition-all hover:border-line-strong ${
                params.category === 'mainboard'
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-950/20'
                  : 'border-line'
              }`}
            >
              <span className="text-xs font-medium text-muted block mb-1">Mainboard</span>
              <div className="text-xl font-bold text-accent tabular-nums">{summary?.mainboard ?? 0}</div>
              <div className="text-[10px] text-quiet mt-0.5">NSE / BSE Main</div>
            </Link>

            {/* SME */}
            <Link
              href="/ipo?category=sme"
              className={`bg-panel/80 border rounded-lg p-3 text-left transition-all hover:border-line-strong ${
                params.category === 'sme'
                  ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-950/20'
                  : 'border-line'
              }`}
            >
              <span className="text-xs font-medium text-muted block mb-1">SME Board</span>
              <div className="text-xl font-bold text-purple-400 tabular-nums">{summary?.sme ?? 0}</div>
              <div className="text-[10px] text-quiet mt-0.5">NSE Emerge / BSE SME</div>
            </Link>
          </div>

          {/* 2. Filters & Presets Bar */}
          <IPOFilters key={JSON.stringify(params)} currentParams={params} totalResults={total} />

          {/* 3. High-Density Pro Table (StockeZee-style) */}
          {ipos && ipos.length > 0 ? (
            <div className="bg-panel/90 border border-line rounded-xl overflow-hidden shadow-xl mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-canvas/95 backdrop-blur-md z-20 border-b border-line">
                    <tr className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                      <th className="px-4 py-3">Company & Type</th>
                      <th className="px-3 py-3 text-center whitespace-nowrap">Bidding Dates</th>
                      <th className="px-3 py-3 text-right whitespace-nowrap">Issue Price</th>
                      <th className="px-4 py-3 text-right whitespace-nowrap hidden sm:table-cell">Lot & Min Inv.</th>
                      <th className="px-4 py-3 text-left whitespace-nowrap">
                        <Link
                          href={getSortUrl(params.sort === 'gmp_desc' ? 'gmp_asc' : 'gmp_desc')}
                          className="inline-flex items-center gap-1 hover:text-ink transition-colors group cursor-pointer"
                          title="Sort by GMP"
                        >
                          <span>GMP</span>
                          <ArrowUpDown className="w-3 h-3 text-quiet group-hover:text-body" />
                        </Link>
                      </th>
                      <th className="px-4 py-3 text-right whitespace-nowrap hidden md:table-cell">Est. Listing / Profit</th>
                      <th className="px-3 py-3 text-center whitespace-nowrap hidden lg:table-cell">Sub. Demand</th>
                      <th className="px-3 py-3 text-center whitespace-nowrap hidden xl:table-cell">Listing Date</th>
                      <th className="px-4 py-3 text-right">Details</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-line/60 text-xs">
                    {ipos.map((ipo) => {
                      const gmpInfo = getGmpDisplay(ipo.gmp);
                      const isSme = ipo.type?.toLowerCase().includes('sme');

                      return (
                        <tr
                          key={ipo.id}
                          className="hover:bg-well/40 transition-colors group cursor-pointer"
                        >
                          {/* Company Name, Type, Halal Status */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-well border border-line-strong/80 flex items-center justify-center font-bold text-xs text-accent group-hover:border-sky-500/50 transition-all shrink-0">
                                {ipo.company_name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <Link
                                    href={`/ipo/${ipo.slug}`}
                                    className="font-bold text-ink text-sm tracking-wide hover:text-accent transition-colors"
                                  >
                                    {ipo.company_name}
                                  </Link>
                                  {gmpInfo.isHot && (
                                    <span className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-rose-500/15 text-negative text-[9px] font-bold rounded">
                                      <Flame className="w-2.5 h-2.5" /> Hot
                                    </span>
                                  )}
                                  {getHalalBadge(ipo.halal_status)}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${getStatusBadge(ipo.status)}`}>
                                    {ipo.status}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                      isSme
                                        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                        : 'bg-blue-500/15 text-accent border border-blue-500/30'
                                    }`}
                                  >
                                    {ipo.type || (isSme ? 'SME' : 'Mainboard')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Bidding Dates */}
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            <div className="text-ink font-medium tabular-nums">
                              {ipo.open_close || `${ipo.open_date} → ${ipo.close_date}`}
                            </div>
                            <div className="text-[10px] text-quiet">Updated: {ipo.updated_on}</div>
                          </td>

                          {/* Issue Price */}
                          <td className="px-3 py-3 text-right whitespace-nowrap">
                            <div className="font-bold text-ink tabular-nums">
                              {ipo.issue_price_display || (ipo.issue_price ? `₹${ipo.issue_price}` : '–')}
                            </div>
                            {ipo.ipo_size_display && (
                              <div className="text-[10px] text-quiet tabular-nums">
                                Size: {ipo.ipo_size_display}
                              </div>
                            )}
                          </td>

                          {/* Lot Size & Min Investment */}
                          <td className="px-4 py-3 text-right whitespace-nowrap hidden sm:table-cell">
                            <div className="text-ink font-medium tabular-nums">
                              {ipo.min_investment_display || (ipo.min_investment ? `₹${ipo.min_investment.toLocaleString('en-IN')}` : '–')}
                            </div>
                            <div className="text-[10px] text-quiet tabular-nums">
                              {ipo.lot_size_display || (ipo.lot_size ? `${ipo.lot_size} Shares` : '–')}
                            </div>
                          </td>

                          {/* Live GMP */}
                          <td className="px-4 py-3 text-left whitespace-nowrap">
                            {gmpInfo.hasGmp ? (
                              <div className="flex flex-col items-start">
                                <div className={`font-bold tabular-nums text-sm ${gmpInfo.color}`}>
                                  {gmpInfo.text}
                                </div>
                                {gmpInfo.range && (
                                  <div className="text-[11px] text-muted tabular-nums font-medium mt-0.5">
                                    {gmpInfo.range}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-quiet font-medium text-sm tabular-nums">
                                —
                              </div>
                            )}
                          </td>

                          {/* Est Listing & Profit */}
                          <td className="px-4 py-3 text-right whitespace-nowrap hidden md:table-cell">
                            <div className="text-ink font-medium tabular-nums">
                              {ipo.est_listing_display || (ipo.est_listing ? `₹${ipo.est_listing}` : '–')}
                            </div>
                            <div className="text-[10px] text-positive font-semibold tabular-nums">
                              {ipo.est_profit_display ? `+${ipo.est_profit_display}/lot` : '–'}
                            </div>
                          </td>

                          {/* Subscription Demand */}
                          <td className="px-3 py-3 text-center whitespace-nowrap hidden lg:table-cell">
                            <div className="text-ink font-bold tabular-nums">
                              {ipo.subscription_display || (ipo.subscription_times ? `${ipo.subscription_times}x` : '–')}
                            </div>
                            <div className="text-[10px] text-quiet">
                              {ipo.has_anchor ? 'Anchor In' : 'No Anchor'}
                            </div>
                          </td>

                          {/* Listing Date */}
                          <td className="px-3 py-3 text-center whitespace-nowrap hidden xl:table-cell">
                            <div className="text-ink font-medium">
                              {ipo.listing_date_display || ipo.listing_date || '–'}
                            </div>
                            <div className="text-[10px] text-quiet">Tentative</div>
                          </td>

                          {/* Action Button */}
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <Link
                              href={`/ipo/${ipo.slug}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-accent bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-lg transition-all"
                            >
                              <span>Audit</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              {total_pages > 1 && (
                <div className="px-4 py-3 bg-canvas/80 border-t border-line flex items-center justify-between text-xs text-muted">
                  <div>
                    Page <strong className="text-ink">{page}</strong> of{' '}
                    <strong className="text-ink">{total_pages}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    {page > 1 && (
                      <Link
                        href={queryUrl('/ipo',params as Record<string,unknown>,{page:page-1})}
                        className="px-2.5 py-1 bg-panel hover:bg-well rounded border border-line text-body flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                      </Link>
                    )}
                    {page < total_pages && (
                      <Link
                        href={queryUrl('/ipo',params as Record<string,unknown>,{page:page+1})}
                        className="px-2.5 py-1 bg-panel hover:bg-well rounded border border-line text-body flex items-center gap-1"
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-panel border border-line rounded-xl p-12 text-center">
              <AlertTriangle className="w-10 h-10 text-warning mx-auto mb-3 opacity-80" />
              <h3 className="text-base font-semibold text-ink mb-1">No IPOs found for selected filters</h3>
              <p className="text-xs text-quiet max-w-md mx-auto mb-4">
                Try clearing your search keyword or switching between Mainboard and SME tabs.
              </p>
              <Link
                href="/ipo"
                className="btn btn-primary text-xs"
              >
                Reset All Filters
              </Link>
            </div>
          )}

          {/* Educational Information Footer */}
          <div className="mt-8 bg-panel/60 border border-line rounded-xl p-5">
            <h3 className="text-sm font-bold text-ink mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Understanding IPO GMP & Shariah Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
              <div className="bg-canvas p-3 rounded-lg border border-line">
                <span className="font-semibold text-ink block mb-0.5">What is Grey Market Premium (GMP)?</span>
                <span className="text-muted leading-relaxed">
                  GMP is the unofficial premium at which an IPO share is traded prior to listing, indicating market demand and retail sentiment.
                </span>
              </div>
              <div className="bg-canvas p-3 rounded-lg border border-line">
                <span className="font-semibold text-ink block mb-0.5">Why Screen IPOs for Halal?</span>
                <span className="text-muted leading-relaxed">
                  Companies must be screened for non-halal revenue sources and excessive interest debt before applying to ensure Shariah compliance.
                </span>
              </div>
              <div className="bg-canvas p-3 rounded-lg border border-line">
                <span className="font-semibold text-ink block mb-0.5">Estimated Listing Calculation</span>
                <span className="text-muted leading-relaxed">
                  Estimated listing price equals the upper price band plus current GMP. This provides an expected listing gain benchmark.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

}
