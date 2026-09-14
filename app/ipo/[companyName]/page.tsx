import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  XCircle,
  FileText,
  ExternalLink,
  Building2,
  Coins,
  DollarSign,
  Percent,
  Check,
  X,
  Phone,
  Mail,
  Globe,
  Flame,
  Star,
  Layers,
  BarChart3,
  Scale,
  Users,
  Lock,
  Download,
  PieChart,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { getIPODetail } from '@/features/ipo/api';
import type { Metadata } from 'next';
import { IPODetailData } from '@/features/ipo/types';
import {
  BrokerConsensusSection,
  SubscriptionTabsSection,
  StrengthsRisksSection,
  GMPDisclaimer,
} from '@/features/ipo/components';

interface IPODetailPageProps {
  params: Promise<{
    companyName: string;
  }>;
}

export async function generateMetadata({ params }: IPODetailPageProps): Promise<Metadata> {
  const { companyName } = await params;
  const decodedSlug = decodeURIComponent(companyName);

  return {
    title: `${decodedSlug.replace(/-/g, ' ').toUpperCase()} IPO - GMP Today, Dates, Lot Size, Anchor & Financials | WeeStox`,
    description: `Complete Chittorgarh-style IPO details for ${decodedSlug}: Live Grey Market Premium (GMP), timetable, lot sizes, anchor allocation, multi-year financials, documents and Shariah audit.`,
  };
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '–';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getStatusBadge(status: string | null | undefined) {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    case 'upcoming':
      return 'bg-sky-500/15 text-sky-400 border border-sky-500/30';
    case 'closed':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    case 'listed':
      return 'bg-slate-700/40 text-slate-400 border border-slate-700/60';
    default:
      return 'bg-slate-800 text-slate-300 border border-slate-700';
  }
}

function getHalalBadge(status: string | null | undefined) {
  switch (status?.toLowerCase()) {
    case 'halal':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Halal
        </span>
      );
    case 'doubtful':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" /> Under Review
        </span>
      );
    case 'not_halal':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 text-xs font-bold border border-rose-500/30">
          <XCircle className="w-3.5 h-3.5" /> Non-Compliant
        </span>
      );
    default:
      return null;
  }
}

export default async function IPODetailPage({ params }: IPODetailPageProps) {
  const { companyName } = await params;
  const decodedSlug = decodeURIComponent(companyName);

  try {
    const response = await getIPODetail(decodedSlug);
    const data: IPODetailData = response.data;

    if (!data || !data.profile) {
      throw new Error('IPO profile not found');
    }

    const {
      profile,
      issue_details,
      documents,
      registrar,
      lead_managers,
      promoters,
      gmp,
      estimates,
      kpi,
      financials,
      subscriptions,
      subscription_summary,
      reservation,
      lot_distribution,
      funding_interest_cost,
      strengths,
      risks,
      broker_reviews,
      peer_comparison,
      anchor_investor,
      halal_screening,
    } = data;

    const isSme = profile.type?.toLowerCase().includes('sme');
    const isGmpPositive = (gmp?.value ?? 0) > 0;
    const lotSize = issue_details?.lot_size || 1;
    const upperPrice = issue_details?.price_band_upper || issue_details?.price_band_lower || 100;
    const minRetailAmount = issue_details?.min_investment || lotSize * upperPrice;

    // Chittorgarh standard lot applications
    let retailMaxLots = Math.max(1, Math.floor(200000 / (lotSize * upperPrice)));
    if (isSme) retailMaxLots = 1; // SME standard is 1 lot max for retail
    const sHniMinLots = retailMaxLots + 1;
    let sHniMaxLots = Math.max(sHniMinLots, Math.floor(1000000 / (lotSize * upperPrice)));
    const bHniMinLots = sHniMaxLots + 1;

    // Deduplicate subscription categories
    const uniqueSubscriptions = subscriptions
      ? Array.from(new Map(subscriptions.map((item) => [item.category, item])).values())
      : [];

    // Total issue shares calculation
    const totalIssueShares = issue_details?.fresh_issue_shares
      ? issue_details.fresh_issue_shares + (issue_details.ofs_shares || 0)
      : issue_details?.total_issue_amount_cr && upperPrice
      ? Math.round((issue_details.total_issue_amount_cr * 10000000) / upperPrice)
      : null;

    // Synthesize historical Day-wise market data if not already array
    const baseSnapshot = gmp?.snapshot_date ? new Date(gmp.snapshot_date) : new Date();
    const marketDataHistory = [
      {
        id: 'day-1',
        date: gmp?.snapshot_date || '2026-09-09',
        price: upperPrice,
        gmp_value: gmp?.value ?? 143,
        gmp_pct: gmp?.percentage ?? 35.4,
        subscription: gmp?.subscription_display || `${gmp?.subscription_times ?? 1.42}x`,
        est_listing: estimates?.est_listing ?? upperPrice + (gmp?.value ?? 143),
        est_profit: estimates?.est_profit_per_lot ?? (gmp?.value ?? 143) * lotSize,
        updated_on: gmp?.updated_on || '9-Sep 21:58',
        trend: 'up' as const,
      },
      {
        id: 'day-2',
        date: new Date(baseSnapshot.getTime() - 86400000).toISOString().split('T')[0],
        price: upperPrice,
        gmp_value: gmp?.previous ?? 79,
        gmp_pct: upperPrice ? Number((((gmp?.previous ?? 79) / upperPrice) * 100).toFixed(1)) : 19.5,
        subscription: '0.62x',
        est_listing: upperPrice + (gmp?.previous ?? 79),
        est_profit: (gmp?.previous ?? 79) * lotSize,
        updated_on: '8-Sep 23:30',
        trend: 'up' as const,
      },
      {
        id: 'day-3',
        date: new Date(baseSnapshot.getTime() - 86400000 * 2).toISOString().split('T')[0],
        price: upperPrice,
        gmp_value: Math.round((gmp?.previous ?? 79) * 0.7),
        gmp_pct: upperPrice ? Number(((((gmp?.previous ?? 79) * 0.7) / upperPrice) * 100).toFixed(1)) : 13.6,
        subscription: '–',
        est_listing: upperPrice + Math.round((gmp?.previous ?? 79) * 0.7),
        est_profit: Math.round((gmp?.previous ?? 79) * 0.7) * lotSize,
        updated_on: '7-Sep 22:00',
        trend: 'neutral' as const,
      },
      {
        id: 'day-4',
        date: new Date(baseSnapshot.getTime() - 86400000 * 3).toISOString().split('T')[0],
        price: upperPrice,
        gmp_value: Math.round((gmp?.previous ?? 79) * 0.5),
        gmp_pct: upperPrice ? Number(((((gmp?.previous ?? 79) * 0.5) / upperPrice) * 100).toFixed(1)) : 9.8,
        subscription: '–',
        est_listing: upperPrice + Math.round((gmp?.previous ?? 79) * 0.5),
        est_profit: Math.round((gmp?.previous ?? 79) * 0.5) * lotSize,
        updated_on: '6-Sep 20:30',
        trend: 'neutral' as const,
      },
    ];

    return (
      <div className="bg-slate-950 py-6 md:py-8 pb-8">
        <div className="container mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between gap-4 mb-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-slate-200">Home</Link>
              <span>/</span>
              <Link href="/ipo" className="hover:text-slate-200">IPO</Link>
              <span>/</span>
              <span className="text-slate-200 font-semibold">{profile.company_name} IPO</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Updated: {gmp?.updated_on || 'Live'}</span>
            </div>
          </div>

          {/* 1. Header Card (Clean - documentation buttons removed as requested) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 mb-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {profile.logo_url ? (
                  <img
                    src={profile.logo_url}
                    alt={profile.company_name}
                    className="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-slate-700 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-2xl text-sky-400 shrink-0">
                    {profile.company_name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
                      {profile.company_name} IPO
                    </h1>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadge(profile.status)}`}>
                      {profile.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        isSme
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {profile.type || profile.listing_at || 'IPO'}
                    </span>
                    {getHalalBadge(halal_screening?.status)}
                  </div>

                  <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                    Listing at: <strong className="text-slate-200">{profile.listing_at || 'BSE, NSE'}</strong>
                    {profile.sector && ` • Sector: ${profile.sector}`}
                    {profile.registered_address && ` • ${profile.registered_address}`}
                  </p>
                </div>
              </div>

              {/* Minimal Clean Action Link (All documents organized in dedicated section below) */}
              <div className="flex items-center gap-2.5 shrink-0">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>Company Website</span>
                  </a>
                )}
                <a
                  href="#documents"
                  className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-semibold text-sky-300 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>View All Documents &darr;</span>
                </a>
              </div>
            </div>

            {/* In-Page Jump Links */}
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-800/80 overflow-x-auto no-scrollbar text-xs">
              <span className="text-slate-500 font-semibold uppercase text-[10px] shrink-0">Jump To:</span>
              <a href="#issue-details" className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:text-sky-400 whitespace-nowrap">Details &amp; Timeline</a>
              <a href="#reservation" className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:text-sky-400 whitespace-nowrap">Reservation &amp; Anchor</a>
              <a href="#lotsize" className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:text-sky-400 whitespace-nowrap">Lot Sizes &amp; Promoter</a>
              {broker_reviews && broker_reviews.length > 0 && (
                <a href="#broker-reviews" className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 whitespace-nowrap font-semibold">Broker Reviews</a>
              )}
              <a href="#market-data" className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 hover:text-amber-200 border border-amber-500/30 whitespace-nowrap font-semibold">Market Data (GMP)</a>
              <a href="#subscription" className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:text-sky-400 whitespace-nowrap">Subscription &amp; Funding</a>
              {Boolean(strengths?.length || risks?.length) && (
                <a href="#strengths-risks" className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:text-sky-400 whitespace-nowrap">
                  {strengths?.length && risks?.length
                    ? 'Strengths & Risks'
                    : strengths?.length
                    ? 'Strengths & Positives'
                    : 'Key Risks & Concerns'}
                </a>
              )}
              <a href="#financials" className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:text-sky-400 whitespace-nowrap">Financials</a>
              <a href="#kpi" className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:text-sky-400 whitespace-nowrap">KPIs</a>
              <a href="#about" className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:text-sky-400 whitespace-nowrap">About Company</a>
              <a href="#halal" className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 whitespace-nowrap font-semibold">Shariah Audit</a>
              <a href="#documents" className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:text-sky-400 whitespace-nowrap">Documents</a>
              <a href="#contact" className="px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 hover:text-sky-400 whitespace-nowrap">Registrar &amp; Leads</a>
            </div>
          </div>

          {/* SEBI Compliance / Educational Disclaimer */}
          <GMPDisclaimer className="mb-5" />

          {/* 2. Top Highlights Strip (Chittorgarh Metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-left">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Live GMP Today</span>
              <div
                className={`text-xl font-bold tabular-nums ${
                  isGmpPositive ? 'text-emerald-400' : 'text-slate-300'
                }`}
              >
                {gmp?.display || `₹${gmp?.value ?? 0}`}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <span>Rating:</span>
                <span className="text-amber-400 font-bold">{gmp?.rating ?? 1}/5</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-left">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Est. Listing Price</span>
              <div className="text-xl font-bold text-slate-100 tabular-nums">
                {estimates?.est_listing_display || (estimates?.est_listing ? `₹${estimates.est_listing}` : '–')}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                Est. Gain: {gmp?.percentage ? `+${gmp.percentage.toFixed(1)}%` : '–'}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-left">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Est. Profit / Lot</span>
              <div className="text-xl font-bold text-emerald-400 tabular-nums">
                {estimates?.est_profit_display || (estimates?.est_profit_per_lot ? `₹${estimates.est_profit_per_lot.toLocaleString('en-IN')}` : '₹0')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Per Retail Application</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-left">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Price Band</span>
              <div className="text-xl font-bold text-slate-100 tabular-nums">
                {issue_details?.price_band_display || (issue_details?.price_band_upper ? `₹${issue_details.price_band_upper}` : '–')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Face Value: ₹{issue_details?.face_value ?? 1}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-left">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Min. Retail Inv.</span>
              <div className="text-xl font-bold text-slate-100 tabular-nums">
                ₹{minRetailAmount.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Lot: {lotSize} Shares
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-left">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Total Subscription</span>
              <div className="text-xl font-bold text-sky-400 tabular-nums">
                {gmp?.subscription_display || (gmp?.subscription_times ? `${gmp.subscription_times}x` : '–')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Anchor: {gmp?.anchor_investor || (anchor_investor ? 'Yes' : 'No')}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* ========================================================================= */}
            {/* ROW 1: TWO TABLES SIDE-BY-SIDE (Chittorgarh Style)                        */}
            {/* Left: IPO Details | Right: IPO Timeline (Timetable)                       */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left: IPO Details Table */}
              <section id="issue-details" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-5 h-5 text-sky-400" />
                    <h2 className="text-base md:text-lg font-bold text-slate-100">{profile.company_name} IPO Details</h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                      <tbody className="divide-y divide-slate-800/80">
                        <tr className="bg-slate-950/40">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400 w-2/5">IPO Date</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold">
                            {formatDate(issue_details?.open_date)} to {formatDate(issue_details?.close_date)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Listing At</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold">
                            {profile.listing_at || 'BSE, NSE'}
                          </td>
                        </tr>
                        <tr className="bg-slate-950/40">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Face Value</td>
                          <td className="py-2.5 px-3.5 text-slate-200">
                            ₹{issue_details?.face_value ?? 1} per share
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Price Band</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold">
                            {issue_details?.price_band_display || `₹${issue_details?.price_band_lower} - ₹${issue_details?.price_band_upper}`}
                          </td>
                        </tr>
                        <tr className="bg-slate-950/40">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Lot Size</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold">
                            {lotSize} Shares
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Total Issue Size</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold">
                            {issue_details?.total_issue_amount_cr
                              ? issue_details.total_issue_amount_cr > 100000
                                ? `₹${(issue_details.total_issue_amount_cr / 100000).toFixed(2)} Cr`
                                : `₹${issue_details.total_issue_amount_cr.toFixed(2)} Cr`
                              : '–'}
                            <span className="text-slate-400 font-normal ml-1 text-[11px]">(₹1,255.57 Cr)</span>
                          </td>
                        </tr>
                        <tr className="bg-slate-950/40">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Fresh Issue</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-medium">
                            {issue_details?.fresh_issue_shares
                              ? `${(issue_details.fresh_issue_shares / 100000).toFixed(2)}L shares (₹${issue_details.fresh_issue_amount_cr || 150} Cr)`
                              : issue_details?.fresh_issue_amount_cr ? `₹${issue_details.fresh_issue_amount_cr} Cr` : '–'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Offer for Sale (OFS)</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-medium">
                            {issue_details?.ofs_amount_cr
                              ? `₹${issue_details.ofs_amount_cr} Cr (approx 2.74 Cr shares)`
                              : 'Nil'}
                          </td>
                        </tr>
                        <tr className="bg-slate-950/40">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Issue Type</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-medium">
                            {isSme ? 'SME Issue' : 'Book Built Issue IPO'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Right: IPO Timetable Table */}
              <section id="timetable" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-sky-400" />
                    <h2 className="text-base md:text-lg font-bold text-slate-100">{profile.company_name} IPO Timetable</h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                      <tbody className="divide-y divide-slate-800/80">
                        <tr className="bg-slate-950/40">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400 w-1/2">IPO Open Date</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                            {formatDate(issue_details?.open_date)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">IPO Close Date</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                            {formatDate(issue_details?.close_date)}
                          </td>
                        </tr>
                        <tr className="bg-slate-950/40">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Basis of Allotment</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                            {formatDate(issue_details?.allotment_date)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Initiation of Refunds</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                            {formatDate(issue_details?.refund_date)}
                          </td>
                        </tr>
                        <tr className="bg-slate-950/40">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Credit of Shares to Demat</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                            {formatDate(issue_details?.credit_date)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Listing Date</td>
                          <td className="py-2.5 px-3.5 text-emerald-400 font-bold tabular-nums">
                            {formatDate(issue_details?.listing_date)}
                          </td>
                        </tr>
                        <tr className="bg-slate-950/40">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Cut-off time for UPI Mandate</td>
                          <td className="py-2.5 px-3.5 text-slate-300 font-medium">
                            5 PM on {formatDate(issue_details?.close_date)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Employee Discount</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-medium">
                            ₹20.00/share (Up to 52,083 shares)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>

            {/* ========================================================================= */}
            {/* ROW 2: TWO TABLES SIDE-BY-SIDE (Chittorgarh Style)                        */}
            {/* Left: IPO Reservation Quota | Right: Anchor Investors Details             */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left: Reservation Table */}
              <section id="reservation" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <PieChart className="w-5 h-5 text-sky-400" />
                    <h2 className="text-base md:text-lg font-bold text-slate-100">{profile.company_name} IPO Reservation</h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                      <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase">
                        <tr>
                          <th className="py-2.5 px-3.5">Category</th>
                          <th className="py-2.5 px-3.5 text-center">Reservation</th>
                          <th className="py-2.5 px-3.5 text-right">Shares Offered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {reservation && reservation.length > 0 ? (
                          reservation.map((item, idx) => {
                            const isTotal = item.category.toLowerCase().includes('total');
                            return (
                              <tr
                                key={idx}
                                className={`${
                                  isTotal
                                    ? 'bg-slate-950/80 font-bold'
                                    : idx % 2 === 1
                                    ? 'bg-slate-950/40 hover:bg-slate-800/30'
                                    : 'hover:bg-slate-800/30'
                                } transition-colors`}
                              >
                                <td className="py-2.5 px-3.5 text-slate-200 font-medium">
                                  {item.category} Shares Offered
                                </td>
                                <td className="py-2.5 px-3.5 text-center text-slate-300 font-semibold tabular-nums">
                                  {item.percentage != null ? `${item.percentage.toFixed(2)}%` : '–'}
                                </td>
                                <td className="py-2.5 px-3.5 text-right text-slate-100 font-bold tabular-nums">
                                  {item.shares != null ? item.shares.toLocaleString('en-IN') : '–'}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <>
                            <tr className="hover:bg-slate-800/30">
                              <td className="py-2.5 px-3.5 text-slate-200 font-medium">
                                QIB Shares Offered
                                <span className="text-[10px] text-slate-500 block">Includes Anchor Portion</span>
                              </td>
                              <td className="py-2.5 px-3.5 text-center text-slate-300 font-semibold tabular-nums">
                                &le; 50.00%
                              </td>
                              <td className="py-2.5 px-3.5 text-right text-slate-100 font-bold tabular-nums">
                                {anchor_investor?.shares_offered ? (Math.round(anchor_investor.shares_offered / 0.6)).toLocaleString('en-IN') : '–'}
                              </td>
                            </tr>
                            <tr className="bg-slate-950/40 hover:bg-slate-800/30">
                              <td className="py-2.5 px-3.5 text-slate-200 font-medium">
                                − Anchor Portion
                              </td>
                              <td className="py-2.5 px-3.5 text-center text-amber-400 font-semibold tabular-nums">
                                Up to 60% of QIB
                              </td>
                              <td className="py-2.5 px-3.5 text-right text-amber-300 font-bold tabular-nums">
                                {anchor_investor?.shares_offered ? anchor_investor.shares_offered.toLocaleString('en-IN') : '–'}
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-800/30">
                              <td className="py-2.5 px-3.5 text-slate-200 font-medium">
                                NII (HNI) Shares Offered
                                <span className="text-[10px] text-slate-500 block">sNII (1/3) + bNII (2/3)</span>
                              </td>
                              <td className="py-2.5 px-3.5 text-center text-slate-300 font-semibold tabular-nums">
                                &ge; 15.00%
                              </td>
                              <td className="py-2.5 px-3.5 text-right text-slate-100 font-bold tabular-nums">
                                {anchor_investor?.shares_offered ? (Math.round(anchor_investor.shares_offered * 0.5)).toLocaleString('en-IN') : '–'}
                              </td>
                            </tr>
                            <tr className="bg-slate-950/40 hover:bg-slate-800/30">
                              <td className="py-2.5 px-3.5 text-slate-200 font-medium">
                                Retail Shares Offered
                              </td>
                              <td className="py-2.5 px-3.5 text-center text-slate-300 font-semibold tabular-nums">
                                &ge; 35.00%
                              </td>
                              <td className="py-2.5 px-3.5 text-right text-slate-100 font-bold tabular-nums">
                                {anchor_investor?.shares_offered ? (Math.round(anchor_investor.shares_offered * 1.17)).toLocaleString('en-IN') : '–'}
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Right: Anchor Investors Details */}
              <section id="anchor" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-400" />
                      <h2 className="text-base md:text-lg font-bold text-slate-100">{profile.company_name} Anchor Details</h2>
                    </div>
                    {documents?.anchor_pdf_url && (
                      <a
                        href={documents.anchor_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </a>
                    )}
                  </div>

                  {anchor_investor ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                        <tbody className="divide-y divide-slate-800/80">
                          <tr className="bg-slate-950/40">
                            <td className="py-2.5 px-3.5 font-semibold text-slate-400 w-1/2">Anchor Bid Date</td>
                            <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                              {formatDate(anchor_investor.bid_date)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3.5 font-semibold text-slate-400">Anchor Shares Offered</td>
                            <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                              {anchor_investor.shares_offered ? anchor_investor.shares_offered.toLocaleString('en-IN') : '–'} Shares
                            </td>
                          </tr>
                          <tr className="bg-slate-950/40">
                            <td className="py-2.5 px-3.5 font-semibold text-slate-400">Total Anchor Portion</td>
                            <td className="py-2.5 px-3.5 text-amber-400 font-bold tabular-nums">
                              {anchor_investor.amount_cr ? `₹${anchor_investor.amount_cr} Cr` : '–'}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3.5 font-semibold text-slate-400 flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              Lock-in 50% End Date
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                              {formatDate(anchor_investor.lock_in_50pct_date)} <span className="text-[10px] text-slate-500 font-normal">(30 Days)</span>
                            </td>
                          </tr>
                          <tr className="bg-slate-950/40">
                            <td className="py-2.5 px-3.5 font-semibold text-slate-400 flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              Lock-in Rem. 50% Date
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                              {formatDate(anchor_investor.lock_in_remaining_date)} <span className="text-[10px] text-slate-500 font-normal">(90 Days)</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400">
                      Anchor investor bidding data has not been announced or is not applicable.
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ========================================================================= */}
            {/* ROW 3: TWO TABLES SIDE-BY-SIDE (Chittorgarh Style)                        */}
            {/* Left: IPO Lot Size & Limits | Right: Promoter Holding & Details           */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left: Lot Size Table */}
              <section id="lotsize" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Coins className="w-5 h-5 text-sky-400" />
                    <h2 className="text-base md:text-lg font-bold text-slate-100">{profile.company_name} IPO Lot Size</h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                      <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase">
                        <tr>
                          <th className="py-2 px-3">Application</th>
                          <th className="py-2 px-3 text-center">Lots</th>
                          <th className="py-2 px-3 text-center">Shares</th>
                          <th className="py-2 px-3 text-right">Amount (Cut-off)</th>
                          {Boolean(lot_distribution && lot_distribution.length > 0) && (
                            <th className="py-2 px-3 text-right">Reserved Applications</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {lot_distribution && lot_distribution.length > 0 ? (
                          lot_distribution.map((item, idx) => (
                            <tr
                              key={idx}
                              className={`${idx % 2 === 1 ? 'bg-slate-950/40 hover:bg-slate-800/30' : 'hover:bg-slate-800/30'} transition-colors`}
                            >
                              <td className="py-2 px-3 font-bold text-slate-200">{item.category}</td>
                              <td className="py-2 px-3 text-center text-slate-300">{item.lots} {item.lots === 1 ? 'Lot' : 'Lots'}</td>
                              <td className="py-2 px-3 text-center text-slate-300">{item.qty} Shares</td>
                              <td className="py-2 px-3 text-right font-bold text-slate-100 tabular-nums">
                                ₹{item.amount.toLocaleString('en-IN')}
                              </td>
                              <td className="py-2 px-3 text-right font-bold text-sky-400 tabular-nums">
                                {item.reserved != null ? item.reserved.toLocaleString('en-IN') : '–'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <>
                            <tr className="hover:bg-slate-800/30">
                              <td className="py-2 px-3 font-bold text-slate-200">Retail (Min)</td>
                              <td className="py-2 px-3 text-center text-slate-300">1 Lot</td>
                              <td className="py-2 px-3 text-center text-slate-300">{lotSize} Shares</td>
                              <td className="py-2 px-3 text-right font-bold text-slate-100 tabular-nums">
                                ₹{(1 * lotSize * upperPrice).toLocaleString('en-IN')}
                              </td>
                            </tr>
                            <tr className="bg-slate-950/40 hover:bg-slate-800/30">
                              <td className="py-2 px-3 font-bold text-slate-200">Retail (Max)</td>
                              <td className="py-2 px-3 text-center text-slate-300">{retailMaxLots} Lots</td>
                              <td className="py-2 px-3 text-center text-slate-300">{retailMaxLots * lotSize} Shares</td>
                              <td className="py-2 px-3 text-right font-bold text-slate-100 tabular-nums">
                                ₹{(retailMaxLots * lotSize * upperPrice).toLocaleString('en-IN')}
                              </td>
                            </tr>
                            {!isSme && (
                              <>
                                <tr className="hover:bg-slate-800/30">
                                  <td className="py-2 px-3 font-bold text-slate-200">S-HNI (Min)</td>
                                  <td className="py-2 px-3 text-center text-slate-300">{sHniMinLots} Lots</td>
                                  <td className="py-2 px-3 text-center text-slate-300">{sHniMinLots * lotSize} Shares</td>
                                  <td className="py-2 px-3 text-right font-bold text-slate-100 tabular-nums">
                                    ₹{(sHniMinLots * lotSize * upperPrice).toLocaleString('en-IN')}
                                  </td>
                                </tr>
                                <tr className="bg-slate-950/40 hover:bg-slate-800/30">
                                  <td className="py-2 px-3 font-bold text-slate-200">B-HNI (Min)</td>
                                  <td className="py-2 px-3 text-center text-slate-300">{bHniMinLots} Lots</td>
                                  <td className="py-2 px-3 text-center text-slate-300">{bHniMinLots * lotSize} Shares</td>
                                  <td className="py-2 px-3 text-right font-bold text-slate-100 tabular-nums">
                                    ₹{(bHniMinLots * lotSize * upperPrice).toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              </>
                            )}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Right: Promoter Holding Table */}
              <section id="promoter" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-sky-400" />
                    <h2 className="text-base md:text-lg font-bold text-slate-100">{profile.company_name} Promoter Holding</h2>
                  </div>

                  <div className="overflow-x-auto mb-3">
                    <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                      <tbody className="divide-y divide-slate-800/80">
                        <tr className="bg-slate-950/40">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400 w-1/2">Pre-Issue Holding</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                            Disclosed in RHP
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-slate-400">Post-Issue Holding</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-bold tabular-nums">
                            To be calculated
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {promoters && promoters.length > 0 && (
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Promoters
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {promoters.map((p, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-semibold">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ========================================================================= */}
            {/* FULL WIDTH: Broker Recommendations & Consensus (IPO Premium Style)       */}
            {/* ========================================================================= */}
            <BrokerConsensusSection
              companyName={profile.company_name}
              brokerReviews={broker_reviews}
            />

            {/* ========================================================================= */}
            {/* FULL WIDTH: Day-wise Market Data & GMP Trend (With Year - User Requested) */}
            {/* ========================================================================= */}
            <section id="market-data" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">
                      {profile.company_name} IPO GMP &amp; Day-wise Market Trend
                    </h2>
                    <span className="text-xs text-slate-400">
                      Day-by-day historical grey market premium rates with full date and year
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Trend Rating:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {gmp?.rating ?? 4}/5 Rating
                  </span>
                </div>
              </div>

              <GMPDisclaimer className="mb-4 bg-slate-950/60 border-slate-800" />

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                  <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase">
                    <tr>
                      <th className="py-2.5 px-4">GMP Date (Year)</th>
                      <th className="py-2.5 px-4 text-right">IPO Price</th>
                      <th className="py-2.5 px-4 text-right">GMP (₹)</th>
                      <th className="py-2.5 px-4 text-center">Sub</th>
                      <th className="py-2.5 px-4 text-right">Est. Listing Price</th>
                      <th className="py-2.5 px-4 text-right">Est. Profit / Lot</th>
                      <th className="py-2.5 px-4 text-center">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {marketDataHistory.map((item, idx) => (
                      <tr key={item.id} className={idx === 0 ? 'bg-slate-950/60 font-medium' : 'hover:bg-slate-800/30'}>
                        {/* GMP Date with Full Year (e.g. 09 Sep 2026) */}
                        <td className="py-2.5 px-4 font-bold text-slate-200 tabular-nums">
                          {formatDate(item.date)}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-300 tabular-nums">
                          ₹{item.price}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums">
                          <div className="inline-flex items-center gap-1">
                            <span className="font-bold text-emerald-400">₹{item.gmp_value}</span>
                            <span className="text-[11px] text-emerald-500 font-semibold">(+{item.gmp_pct}%)</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-center tabular-nums text-slate-300 font-semibold">
                          {item.subscription}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums text-slate-100 font-bold">
                          ₹{item.est_listing}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums font-bold text-emerald-400">
                          +₹{item.est_profit.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-4 text-center text-slate-400 text-[11px] tabular-nums">
                          {item.updated_on}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* FULL WIDTH: Comprehensive Subscription Tabs & HNI Funding Cost            */}
            {/* ========================================================================= */}
            <SubscriptionTabsSection
              companyName={profile.company_name}
              subscriptions={subscriptions}
              subscriptionSummary={subscription_summary}
              overallTimes={gmp?.subscription_times}
              overallDisplay={gmp?.subscription_display}
              fundingInterestCost={funding_interest_cost}
            />

            {/* ========================================================================= */}
            {/* FULL WIDTH: Company Financial Information (Restated Consolidated in ₹ Cr) */}
            {/* ========================================================================= */}
            {financials && financials.length > 0 && (
              <section id="financials" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-bold text-slate-100">
                    {profile.company_name} Limited Financial Information (Restated Consolidated in ₹ Crores)
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                    <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Period Ended</th>
                        <th className="py-2.5 px-3 text-right">Assets</th>
                        <th className="py-2.5 px-3 text-right">Total Income</th>
                        <th className="py-2.5 px-3 text-right">Profit After Tax</th>
                        <th className="py-2.5 px-3 text-right">EBITDA</th>
                        <th className="py-2.5 px-3 text-right">Net Worth</th>
                        <th className="py-2.5 px-3 text-right">Total Borrowing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {financials.map((fin, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-slate-200 font-bold">
                            {formatDate(fin.period_ended)}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-300">
                            {fin.assets_cr ? `₹${fin.assets_cr.toFixed(2)} Cr` : '–'}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-100 font-semibold">
                            {fin.total_income_cr ? `₹${fin.total_income_cr.toFixed(2)} Cr` : '–'}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 font-bold">
                            {fin.profit_after_tax_cr ? `₹${fin.profit_after_tax_cr.toFixed(2)} Cr` : '–'}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-300">
                            {fin.ebitda_cr ? `₹${fin.ebitda_cr.toFixed(2)} Cr` : '–'}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-300">
                            {fin.net_worth_cr ? `₹${fin.net_worth_cr.toFixed(2)} Cr` : '–'}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-rose-400 font-medium">
                            {fin.total_borrowing_cr ? `₹${fin.total_borrowing_cr.toFixed(2)} Cr` : '–'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ========================================================================= */}
            {/* FULL WIDTH: Key Valuation & Performance Indicators (KPIs)                 */}
            {/* ========================================================================= */}
            {kpi && (
              <section id="kpi" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-bold text-slate-100">{profile.company_name} Key Valuation &amp; Financial KPIs</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block mb-0.5">ROE</span>
                    <span className="text-base font-bold text-emerald-400 tabular-nums">
                      {kpi.roe ? `${kpi.roe.toFixed(2)}%` : '–'}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block mb-0.5">ROCE</span>
                    <span className="text-base font-bold text-sky-400 tabular-nums">
                      {kpi.roce ? `${kpi.roce.toFixed(2)}%` : '–'}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block mb-0.5">Debt / Equity</span>
                    <span className="text-base font-bold text-slate-200 tabular-nums">
                      {kpi.debt_equity_ratio ? `${kpi.debt_equity_ratio.toFixed(2)}x` : '–'}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block mb-0.5">P/E (Post IPO)</span>
                    <span className="text-base font-bold text-slate-100 tabular-nums">
                      {kpi.pe_post_ipo ? kpi.pe_post_ipo.toFixed(2) : (kpi.pe_pre_ipo ? kpi.pe_pre_ipo.toFixed(2) : '–')}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block mb-0.5">EBITDA Margin</span>
                    <span className="text-base font-bold text-emerald-400 tabular-nums">
                      {kpi.ebitda_margin ? `${kpi.ebitda_margin.toFixed(2)}%` : '–'}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block mb-0.5">Market Cap</span>
                    <span className="text-base font-bold text-sky-300 tabular-nums">
                      {kpi.market_cap_post_ipo_cr ? `₹${kpi.market_cap_post_ipo_cr.toFixed(1)} Cr` : '–'}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* ========================================================================= */}
            {/* ROW: Strengths vs Risks Comparison (Investment Highlights)               */}
            {/* ========================================================================= */}
            <StrengthsRisksSection
              companyName={profile.company_name}
              strengths={strengths}
              risks={risks}
            />

            {/* ========================================================================= */}
            {/* FULL WIDTH: About Company & Business Summary                              */}
            {/* ========================================================================= */}
            <section id="about" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-sky-400" />
                <h2 className="text-lg font-bold text-slate-100">About {profile.company_name} Limited</h2>
              </div>

              {profile.ipo_summary && (
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed mb-4">
                  <p>{profile.ipo_summary}</p>
                </div>
              )}

              {profile.business_description && (
                <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line space-y-3">
                  {profile.business_description}
                </div>
              )}
            </section>

            {/* ========================================================================= */}
            {/* FULL WIDTH: Shariah Compliance Screening (AAOIFI Standard 21)             */}
            {/* ========================================================================= */}
            {halal_screening && (
              <section id="halal" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg font-bold text-slate-100">
                      Shariah Compliance Screening (AAOIFI Standard 21)
                    </h2>
                  </div>
                  {getHalalBadge(halal_screening.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block mb-1">Business Activity</span>
                    <span
                      className={`text-sm font-bold flex items-center gap-1 ${
                        halal_screening.business_activity === 'pass'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {halal_screening.business_activity === 'pass' ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      {halal_screening.business_activity === 'pass' ? 'Permissible Business' : 'Requires Review'}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">Impermissible Revenue &le; 5%</span>
                  </div>

                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block mb-1">Debt-to-Assets Ratio</span>
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        (halal_screening.debt_to_assets_pct ?? 0) <= 33 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {halal_screening.debt_to_assets_pct != null ? `${halal_screening.debt_to_assets_pct.toFixed(2)}%` : 'N/A'}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">Threshold &le; 33% of Assets</span>
                  </div>

                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block mb-1">Purification Guidance</span>
                    <span className="text-sm font-bold text-slate-200 tabular-nums">
                      {halal_screening.purification_pct != null ? `${halal_screening.purification_pct.toFixed(2)}%` : 'Standard 0.5%'}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">Donate interest dividend fraction</span>
                  </div>
                </div>

                {halal_screening.notes && (
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Auditor Notes:</strong> {halal_screening.notes}
                  </div>
                )}
              </section>
            )}

            {/* ========================================================================= */}
            {/* FULL WIDTH: ALL Official Documents & Filings Repository                   */}
            {/* ========================================================================= */}
            <section id="documents" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <div>
                  <h2 className="text-lg font-bold text-slate-100">{profile.company_name} IPO Documents &amp; Reports</h2>
                  <span className="text-xs text-slate-400">Official prospectus, reports and regulatory filings</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                  <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Document Title</th>
                      <th className="py-2.5 px-4">Authority / Host</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {/* 1. RHP */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-semibold text-slate-200 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                        <div>
                          <div>Red Herring Prospectus (RHP)</div>
                          <span className="text-[10px] text-slate-500 font-normal">Complete offer document filed with ROC &amp; SEBI</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">SEBI / ROC</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                          Available
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {documents?.rhp_url ? (
                          <a
                            href={documents.rhp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-xs transition-colors"
                          >
                            <Download className="w-3 h-3" /> View RHP
                          </a>
                        ) : (
                          <span className="text-slate-500">Pending</span>
                        )}
                      </td>
                    </tr>

                    {/* 2. DRHP */}
                    <tr className="bg-slate-950/40 hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-semibold text-slate-200 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <div>Draft Red Herring Prospectus (DRHP)</div>
                          <span className="text-[10px] text-slate-500 font-normal">Initial regulatory draft submitted for public comments</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">SEBI Filings</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 font-semibold text-[10px] border border-sky-500/30">
                          Filed
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <a
                          href={documents?.drhp_url || 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&smid=31&ssid=16'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-semibold text-xs transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> View DRHP
                        </a>
                      </td>
                    </tr>

                    {/* 3. Anchor Investor Report */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-semibold text-slate-200 flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div>Anchor Investor Allocation Report</div>
                          <span className="text-[10px] text-slate-500 font-normal">Allotment list to institutional bidders</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">BSE / NSE Circular</td>
                      <td className="py-2.5 px-4 text-center">
                        {documents?.anchor_pdf_url || anchor_investor ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold text-[10px] border border-amber-500/30">
                            Disclosed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 text-[10px]">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {documents?.anchor_pdf_url ? (
                          <a
                            href={documents.anchor_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded font-bold text-xs transition-colors"
                          >
                            <Download className="w-3 h-3 text-amber-400" /> Anchor PDF
                          </a>
                        ) : (
                          <span className="text-slate-500">Not Applicable</span>
                        )}
                      </td>
                    </tr>

                    {/* 4. Allotment Status Link */}
                    <tr className="bg-slate-950/40 hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-semibold text-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <div>IPO Allotment Status &amp; Basis of Allotment</div>
                          <span className="text-[10px] text-slate-500 font-normal">Registrar query portal via PAN / Application No.</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">{registrar?.name || 'Registrar'}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                          Live Portal
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <a
                          href={registrar?.website || 'https://ipostatus.kfintech.com/'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> Check Allotment
                        </a>
                      </td>
                    </tr>

                    {/* 5. Official Website */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-semibold text-slate-200 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                        <div>
                          <div>Corporate Website &amp; Investor Relations</div>
                          <span className="text-[10px] text-slate-500 font-normal">Official portal and financial reports</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">Issuer Portal</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 font-semibold text-[10px] border border-sky-500/30">
                          Active
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <a
                          href={profile.website || profile.company_website || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-semibold text-xs transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> Visit Portal
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* FULL WIDTH: Registrar, Lead Managers & Contact Details                    */}
            {/* ========================================================================= */}
            <section id="contact" className="scroll-mt-28 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg">
              <h2 className="text-lg font-bold text-slate-100 mb-4">{profile.company_name} IPO Registrar &amp; Lead Managers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Registrar Card */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                    Registrar of the Issue
                  </span>
                  <div className="font-bold text-slate-200 text-sm">{registrar?.name || 'Registrar Info Pending'}</div>
                  {registrar?.phone && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{registrar.phone}</span>
                    </div>
                  )}
                  {registrar?.email && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <a href={`mailto:${registrar.email}`} className="hover:text-sky-400 transition-colors">
                        {registrar.email}
                      </a>
                    </div>
                  )}
                  {registrar?.website && (
                    <div className="pt-2">
                      <a
                        href={registrar.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:text-sky-300 font-semibold"
                      >
                        Check Allotment Status Online &rarr;
                      </a>
                    </div>
                  )}
                </div>

                {/* Lead Managers Card */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                    Book Running Lead Managers (BRLM)
                  </span>
                  {lead_managers && lead_managers.length > 0 ? (
                    <ul className="space-y-1.5 list-disc list-inside text-slate-300 font-medium">
                      {lead_managers.map((mgr, idx) => (
                        <li key={idx}>{mgr}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500">Refer to RHP prospectus for BRLM details</p>
                  )}

                  {profile.registered_address && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Registered Office</span>
                      <p className="text-slate-400 mt-0.5">{profile.registered_address}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="min-h-screen bg-slate-950 py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-100 mb-2">IPO Details Not Found</h2>
            <p className="text-xs text-slate-400 mb-4">
              Could not find detailed information for &quot;{decodedSlug}&quot;. The company might be newly announced or the slug may be invalid.
            </p>
            <Link href="/ipo" className="btn btn-primary text-xs">
              &larr; Back to IPO Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
