'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  PieChart,
  Users,
  Compass,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  X,
  Check,
  Trophy,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  Globe,
  Building2,
  DollarSign,
} from 'lucide-react';
import { StockMasterDetail, StockCandle } from '../types';
import StockCandleChart from './StockCandleChart';
import { getStockChart } from '../api';
import {
  getCurrencySymbol,
  formatMarketCap,
  formatSafeNumber,
  formatSafePrice,
  formatSafePct,
  formatSafeVolume,
} from '../utils/mappers';
import CompanyLogo from './CompanyLogo';

const CHART_RANGES = [
  { label: '1D',  range: '1D',  interval: '5m'  },
  { label: '1W',  range: '1W',  interval: '1h'  },
  { label: '1M',  range: '1M',  interval: '1d'  },
  { label: '3M',  range: '3M',  interval: '1d'  },
  { label: '6M',  range: '6M',  interval: '1d'  },
  { label: '1Y',  range: '1Y',  interval: '1wk' },
  { label: '5Y',  range: '5Y',  interval: '1mo' },
] as const;
type ChartRangeLabel = typeof CHART_RANGES[number]['label'];

interface StockDetailContentProps {
  detail: StockMasterDetail;
  onSelectPeer?: (symbol: string) => void;
  isStandalonePage?: boolean;
}

// ─── Inline mini bar for financial trend ────────────────────────────────────
function TrendBar({
  value,
  max,
  positive,
}: {
  value: number;
  max: number;
  positive: boolean;
}) {
  const pct = max > 0 ? Math.min(100, Math.abs((value / max) * 100)) : 0;
  return (
    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
      <div
        className={`h-full rounded-full transition-all duration-700 ${
          positive ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Score ring (SVG circle) ─────────────────────────────────────────────────
function ScoreRing({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: string;
}) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(100, Number(score || 0)) / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-900 dark:text-slate-100 tabular-nums">
          {Math.round(Number(score || 0))}
        </span>
      </div>
      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── Section heading ─────────────────────────────────────────────────────────
function SectionHeading({
  icon,
  title,
  subtitle,
  id,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  id: string;
}) {
  return (
    <div id={id} className="flex items-start gap-3 mb-5 scroll-mt-28">
      <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-sky-500">{icon}</span>
      </div>
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Metric tile ─────────────────────────────────────────────────────────────
function MetricTile({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: 'green' | 'red' | 'amber' | 'sky';
}) {
  const colors = {
    green: 'text-emerald-600 dark:text-emerald-400',
    red: 'text-rose-600 dark:text-rose-400',
    amber: 'text-amber-600 dark:text-amber-400',
    sky: 'text-sky-600 dark:text-sky-400',
  };
  return (
    <div className="flex flex-col gap-0.5 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 min-w-0">
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
        {label}
      </span>
      <span
        className={`text-sm sm:text-base font-black tabular-nums truncate ${
          highlight ? colors[highlight] : 'text-slate-900 dark:text-slate-100'
        }`}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate">
          {sub}
        </span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StockDetailContent({
  detail,
  onSelectPeer,
}: StockDetailContentProps) {
  const [finPeriod, setFinPeriod] = useState<'quarterly' | 'annual'>('quarterly');
  const [activeSection, setActiveSection] = useState('chart');
  const navRef = useRef<HTMLDivElement>(null);

  // Chart timeframe state
  const [chartRange, setChartRange] = useState<ChartRangeLabel>('3M');
  const [chartCandles, setChartCandles] = useState<StockCandle[] | null>(null);
  const [chartLoading, setChartLoading] = useState(false);

  const {
    company,
    quote,
    metrics,
    scores,
    flags,
    thesis,
    technicals,
    delivery_conviction,
    quarterly_financials,
    annual_financials,
    shareholding_pattern,
    peers,
    shariah_compliance,
    trader_insights,
    chart,
  } = detail;

  const fetchChartData = useCallback(
    async (rangeLabel: ChartRangeLabel) => {
      const cfg = CHART_RANGES.find((r) => r.label === rangeLabel);
      if (!cfg) return;
      setChartLoading(true);
      try {
        const data = await getStockChart(
          company.symbol,
          cfg.range,
          cfg.interval,
          company.country
        );
        if (data?.candles) {
          setChartCandles(
            data.candles.map((c) => ({
              date: c.date,
              open: Number(c.open || 0),
              high: Number(c.high || 0),
              low: Number(c.low || 0),
              close: Number(c.close || 0),
              volume: Number(c.volume || 0),
            }))
          );
        }
      } catch {
        // silently fall back to default chart data
      } finally {
        setChartLoading(false);
      }
    },
    [company.symbol, company.country]
  );

  useEffect(() => {
    if (chartRange !== '3M') {
      fetchChartData(chartRange);
    }
  }, [chartRange, fetchChartData]);

  const currencySym = getCurrencySymbol(company.country || company.currency);
  const changePctNum = Number(quote.change_percentage || 0);
  const isPositive = changePctNum >= 0;
  const isCompliant =
    shariah_compliance.status?.toUpperCase() === 'HALAL' ||
    shariah_compliance.status?.toUpperCase() === 'PASS';
  const isDoubtful = shariah_compliance.status?.toUpperCase() === 'DOUBTFUL';

  // Default candles from master detail payload (3M worth)
  const defaultCandles: StockCandle[] = (chart || []).map((c) => ({
    date: c.date,
    open: Number(c.open || 0),
    high: Number(c.high || 0),
    low: Number(c.low || 0),
    close: Number(c.close || 0),
    volume: Number(c.volume || 0),
  }));
  // Use dynamically fetched candles if available, else fall back to default
  const candleList = chartCandles ?? defaultCandles;

  const low52 = Number(metrics.fifty_two_week_low || 0);
  const high52 = Number(metrics.fifty_two_week_high || 0);
  const currentPrice = Number(quote.price || 0);
  let range52Pct =
    trader_insights?.range_52w_position !== undefined &&
    trader_insights?.range_52w_position !== null
      ? Number(trader_insights.range_52w_position)
      : 50;
  if (high52 > low52 && currentPrice >= low52) {
    range52Pct = Math.round(((currentPrice - low52) / (high52 - low52)) * 100);
  }
  range52Pct = Math.min(100, Math.max(0, range52Pct));

  // Financial trend data
  const finData = finPeriod === 'quarterly' ? quarterly_financials || [] : annual_financials || [];
  const maxRevenue = Math.max(...finData.map((r) => Number(r.revenue || 0)), 1);
  const maxNetIncome = Math.max(
    ...finData.map((r) => Math.abs(Number(r.net_income || 0))),
    1
  );

  // Delivery avg
  const avgDelivery =
    delivery_conviction && delivery_conviction.length > 0
      ? delivery_conviction.slice(0, 10).reduce((s, d) => s + Number(d.delivery_percentage || 0), 0) /
        Math.min(10, delivery_conviction.length)
      : null;

  const navSections = [
    { id: 'chart', label: 'Chart' },
    { id: 'financials', label: 'Financials' },
    { id: 'thesis', label: 'Thesis' },
    { id: 'shariah', label: 'Shariah' },
    { id: 'ownership', label: 'Ownership' },
    { id: 'peers', label: 'Peers' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-0">

      {/* ═══════════════════════════════════════════════════════
          HERO BLOCK — Company Identity + Live Price
      ═══════════════════════════════════════════════════════ */}
      <div className="relative rounded-3xl overflow-hidden mb-4">
        {/* Background gradient */}
        <div
          className={`absolute inset-0 ${
            isPositive
              ? 'bg-gradient-to-br from-emerald-500/8 via-slate-50 to-slate-100 dark:from-emerald-500/10 dark:via-slate-950 dark:to-slate-900'
              : 'bg-gradient-to-br from-rose-500/8 via-slate-50 to-slate-100 dark:from-rose-500/10 dark:via-slate-950 dark:to-slate-900'
          }`}
        />
        <div className="relative border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 lg:p-7">

          {/* Top row: Company identity + Price */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 pb-5 border-b border-slate-200/80 dark:border-slate-800/60">

            {/* Company Brand */}
            <div className="flex items-start gap-4">
              <CompanyLogo
                src={company.logo_url}
                symbol={company.symbol}
                name={company.name}
                size="xl"
                className="w-14 h-14 sm:w-16 sm:h-16 !rounded-2xl shadow-lg shadow-sky-500/10"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                    {company.name}
                  </h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-extrabold text-xs text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20">
                    {company.symbol}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {company.exchange}
                  </span>
                  {trader_insights?.market_tier && (
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 uppercase tracking-wider">
                      {trader_insights.market_tier.replace('_', ' ')}
                    </span>
                  )}
                  {trader_insights?.rank_in_country && (
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      <Trophy className="w-3 h-3" />
                      #{trader_insights.rank_in_country}
                    </span>
                  )}
                  {/* Shariah badge inline */}
                  {isCompliant ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      Halal
                    </span>
                  ) : isDoubtful ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      Doubtful
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      <XCircle className="w-3 h-3" />
                      Non-Halal
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {company.country}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {company.sector}
                  </span>
                  {company.industry && (
                    <>
                      <span>•</span>
                      <span>{company.industry}</span>
                    </>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      IR Portal
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Price Block */}
            <div className="shrink-0 lg:text-right">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tabular-nums tracking-tight">
                {formatSafePrice(quote.price, currencySym)}
              </div>
              <div
                className={`inline-flex items-center gap-1.5 mt-1.5 text-sm font-bold tabular-nums px-3 py-1 rounded-xl ${
                  isPositive
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {isPositive ? '+' : ''}
                {formatSafeNumber(quote.change, 2)} ({formatSafePct(quote.change_percentage)})
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-2 lg:justify-end">
                <span>Prev Close: <strong className="text-slate-600 dark:text-slate-400">{formatSafePrice(quote.previous_close, currencySym)}</strong></span>
                <span>•</span>
                <span>Vol: <strong className="text-slate-600 dark:text-slate-400">{formatSafeVolume(quote.volume)}</strong></span>
              </div>
            </div>
          </div>

          {/* ── 8-Metric Strip ── */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-4">
            <MetricTile
              label="Mkt Cap"
              value={formatMarketCap(metrics.market_cap, company.country)}
            />
            <MetricTile
              label="P/E"
              value={formatSafeNumber(metrics.pe_ratio, 1)}
              sub={metrics.forward_pe ? `Fwd: ${formatSafeNumber(metrics.forward_pe, 1)}` : undefined}
            />
            <MetricTile
              label="P/B"
              value={formatSafeNumber(metrics.price_to_book, 2)}
            />
            <MetricTile
              label="ROE"
              value={metrics.roe ? formatSafePct(Number(metrics.roe) * 100, false) : '—'}
              highlight={Number(metrics.roe || 0) > 0.15 ? 'green' : undefined}
            />
            <MetricTile
              label="ROCE"
              value={metrics.roce ? formatSafePct(Number(metrics.roce) * 100, false) : '—'}
              highlight={Number(metrics.roce || 0) > 0.15 ? 'green' : undefined}
            />
            <MetricTile
              label="EPS"
              value={formatSafePrice(metrics.eps, currencySym)}
            />
            <MetricTile
              label="D/E"
              value={formatSafeNumber(metrics.debt_to_equity, 2)}
              highlight={Number(metrics.debt_to_equity || 0) > 1 ? 'red' : 'green'}
            />
            <MetricTile
              label="Div Yield"
              value={
                metrics.dividend_yield
                  ? formatSafePct(Number(metrics.dividend_yield) * 100, false)
                  : '0.00%'
              }
              highlight={Number(metrics.dividend_yield || 0) > 0.01 ? 'sky' : undefined}
            />
          </div>

          {/* ── Range Bars ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-1">
            {/* Day Range */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                <span>DAY LOW <strong className="text-slate-700 dark:text-slate-300 text-xs">{formatSafePrice(quote.day_low, currencySym)}</strong></span>
                <span className="font-semibold text-[10px] text-slate-400">Intraday</span>
                <span>DAY HIGH <strong className="text-slate-700 dark:text-slate-300 text-xs">{formatSafePrice(quote.day_high, currencySym)}</strong></span>
              </div>
              <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{
                    width:
                      quote.day_high && quote.day_low && quote.day_high > quote.day_low
                        ? `${Math.min(100, Math.max(0, ((currentPrice - quote.day_low) / (quote.day_high - quote.day_low)) * 100))}%`
                        : '50%',
                  }}
                />
              </div>
            </div>

            {/* 52W Range */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                <span>52W LOW <strong className="text-slate-700 dark:text-slate-300 text-xs">{formatSafePrice(low52, currencySym)}</strong></span>
                <span className="font-bold text-sky-600 dark:text-sky-400 text-[10px]">{range52Pct}%</span>
                <span>52W HIGH <strong className="text-slate-700 dark:text-slate-300 text-xs">{formatSafePrice(high52, currencySym)}</strong></span>
              </div>
              <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"
                  style={{ width: `${range52Pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          STICKY SECTION NAV
      ═══════════════════════════════════════════════════════ */}
      <div
        ref={navRef}
        className="sticky top-14 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-1 flex items-center gap-1 overflow-x-auto no-scrollbar mb-5 shadow-sm"
      >
        {navSections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeSection === s.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          § 1 — PRICE CHART
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 mb-4">
        {/* Chart header: title + timeframe picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4" id="chart">
          <div className="flex items-center gap-2.5 scroll-mt-28">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Price Performance
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {chartRange === '1D' ? 'Intraday 5-min candles' :
                 chartRange === '1W' ? 'Last 7 days, 1-hour bars' :
                 chartRange === '1M' ? 'Last 30 days, daily bars' :
                 chartRange === '3M' ? 'Last 90 days, daily bars' :
                 chartRange === '6M' ? 'Last 6 months, daily bars' :
                 chartRange === '1Y' ? 'Last 12 months, weekly bars' :
                 'Last 5 years, monthly bars'}
              </p>
            </div>
          </div>

          {/* Timeframe pill buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shrink-0">
            {CHART_RANGES.map((r) => (
              <button
                key={r.label}
                type="button"
                disabled={chartLoading}
                onClick={() => setChartRange(r.label)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  chartRange === r.label
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
                } disabled:opacity-50`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <StockCandleChart candles={candleList} currencySymbol={currencySym} loading={chartLoading} />

        {/* CPR + MA strip below chart */}
        {(technicals?.cpr || technicals?.classical_pivots || technicals?.moving_averages) && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {technicals?.cpr && (
              <>
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-rose-500 block mb-1">CPR Top (TC)</span>
                  <span className="font-black text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatSafePrice(technicals.cpr.tc, currencySym)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-sky-500 block mb-1">
                    Pivot (P) {technicals.cpr.nature && `· ${technicals.cpr.nature}`}
                  </span>
                  <span className="font-black text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatSafePrice(technicals.cpr.pivot, currencySym)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-500 block mb-1">CPR Bottom (BC)</span>
                  <span className="font-black text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatSafePrice(technicals.cpr.bc, currencySym)}
                  </span>
                </div>
              </>
            )}
            {technicals?.classical_pivots && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">R1 / S1</span>
                <span className="font-black text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatSafePrice(technicals.classical_pivots.r1, currencySym)} /
                  {formatSafePrice(technicals.classical_pivots.s1, currencySym)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          § 2 — FINANCIAL STATEMENTS
      ═══════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 mb-4">
        <div className="flex items-start justify-between gap-3 mb-5">
          <SectionHeading
            id="financials"
            icon={<FileText className="w-4 h-4" />}
            title="Financial Statements"
            subtitle="Revenue, profitability and balance sheet"
          />
          <div className="shrink-0 inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => setFinPeriod('quarterly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                finPeriod === 'quarterly'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Quarterly
            </button>
            <button
              type="button"
              onClick={() => setFinPeriod('annual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                finPeriod === 'annual'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {finData.length > 0 ? (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-left border-collapse text-xs min-w-[600px]">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-tl-xl">Period</th>
                  <th className="px-4 py-3 text-center">Revenue</th>
                  <th className="px-4 py-3 text-center">Oper. Profit</th>
                  <th className="px-4 py-3 text-center">Net Income</th>
                  <th className="px-4 py-3 text-center">EPS</th>
                  {finPeriod === 'annual' && (
                    <>
                      <th className="px-4 py-3 text-center">Total Assets</th>
                      <th className="px-4 py-3 text-center">Free Cash Flow</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {finPeriod === 'quarterly'
                  ? (quarterly_financials || []).map((q, idx) => {
                      const rev = Number(q.revenue || 0);
                      const ni = Number(q.net_income || 0);
                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors group"
                        >
                          <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                            Q{q.fiscal_quarter} FY{q.fiscal_year}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="block font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                              {formatMarketCap(rev, company.country)}
                            </span>
                            <TrendBar value={rev} max={maxRevenue} positive={true} />
                          </td>
                          <td className="px-4 py-3 text-center font-medium tabular-nums text-slate-600 dark:text-slate-400">
                            {q.operating_income ? formatMarketCap(q.operating_income, company.country) : '—'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`block font-bold tabular-nums ${
                                ni >= 0
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {formatMarketCap(ni, company.country)}
                            </span>
                            <TrendBar value={Math.abs(ni)} max={maxNetIncome} positive={ni >= 0} />
                          </td>
                          <td className="px-4 py-3 text-center font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                            {formatSafePrice(q.diluted_eps, currencySym)}
                          </td>
                        </tr>
                      );
                    })
                  : (annual_financials || []).map((a, idx) => {
                      const rev = Number(a.revenue || 0);
                      const ni = Number(a.net_income || 0);
                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                            FY {a.fiscal_year}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="block font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                              {formatMarketCap(rev, company.country)}
                            </span>
                            <TrendBar value={rev} max={maxRevenue} positive={true} />
                          </td>
                          <td className="px-4 py-3 text-center font-medium tabular-nums text-slate-600 dark:text-slate-400">
                            {a.operating_income ? formatMarketCap(a.operating_income, company.country) : '—'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`block font-bold tabular-nums ${
                                ni >= 0
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {formatMarketCap(ni, company.country)}
                            </span>
                            <TrendBar value={Math.abs(ni)} max={maxNetIncome} positive={ni >= 0} />
                          </td>
                          <td className="px-4 py-3 text-center font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                            {formatSafePrice(a.diluted_eps, currencySym)}
                          </td>
                          <td className="px-4 py-3 text-center font-medium tabular-nums text-slate-600 dark:text-slate-400">
                            {a.total_assets ? formatMarketCap(a.total_assets, company.country) : '—'}
                          </td>
                          <td className="px-4 py-3 text-center font-medium tabular-nums text-sky-600 dark:text-sky-400">
                            {a.free_cash_flow ? formatMarketCap(a.free_cash_flow, company.country) : '—'}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
            Financial statements not available for this ticker.
          </p>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          § 3 — QUANT SCORES + THESIS + FLAGS  (two-col on desktop)
      ═══════════════════════════════════════════════════════ */}
      <div
        id="thesis"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 scroll-mt-28"
      >
        {/* Quant Scores */}
        {scores && (
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Quant Scores</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ScoreRing
                score={scores.overall}
                label="Overall"
                color="#0EA5E9"
              />
              <ScoreRing
                score={scores.valuation}
                label="Valuation"
                color="#10B981"
              />
              <ScoreRing
                score={scores.profitability}
                label="Profitability"
                color="#8B5CF6"
              />
              <ScoreRing
                score={scores.financial_health}
                label="Fin Health"
                color="#14B8A6"
              />
            </div>

            {/* Delivery conviction strip */}
            {avgDelivery !== null && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    Avg Delivery
                  </span>
                  <span
                    className={`font-bold ${
                      avgDelivery >= 50
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {avgDelivery.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      avgDelivery >= 50 ? 'bg-emerald-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${Math.min(100, avgDelivery)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {avgDelivery >= 50 ? 'High conviction — institutional accumulation signal' : 'Below 50% — elevated intraday speculation'}
                </p>
              </div>
            )}

            {/* Momentum status */}
            {trader_insights?.momentum_status && (
              <div className="mt-3 flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <Activity className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Momentum: {trader_insights.momentum_status}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Bull & Bear Thesis */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bull Case */}
          {thesis?.bull_case && thesis.bull_case.length > 0 && (
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40 rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-emerald-200/50 dark:border-emerald-800/40">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Bull Case
                </h3>
              </div>
              <ul className="space-y-2.5">
                {thesis.bull_case.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bear Case */}
          {thesis?.bear_case && thesis.bear_case.length > 0 && (
            <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-800/40 rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-rose-200/50 dark:border-rose-800/40">
                <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <h3 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  Bear Case / Risks
                </h3>
              </div>
              <ul className="space-y-2.5">
                {thesis.bear_case.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
                    <X className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Flip Conditions */}
          {thesis?.flip_conditions && thesis.flip_conditions.length > 0 && (
            <div className="sm:col-span-2 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-amber-200/50 dark:border-amber-800/40">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Thesis Flip Triggers — Watch For
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {thesis.flip_conditions.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                    <Target className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Green + Red Flags */}
          {flags && (flags.green_flags?.length > 0 || flags.red_flags?.length > 0) && (
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Positive Signals
                </p>
                <div className="space-y-1.5">
                  {(flags.green_flags || []).map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Risk Signals
                </p>
                <div className="space-y-1.5">
                  {(flags.red_flags || []).map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          § 4 — SHARIAH COMPLIANCE AUDIT
      ═══════════════════════════════════════════════════════ */}
      <div
        id="shariah"
        className="scroll-mt-28 mb-4"
      >
        <div
          className={`rounded-3xl border p-5 sm:p-6 ${
            isCompliant
              ? 'bg-emerald-500/8 dark:bg-emerald-500/5 border-emerald-400/30 dark:border-emerald-700/40'
              : isDoubtful
              ? 'bg-amber-500/8 dark:bg-amber-500/5 border-amber-400/30 dark:border-amber-700/40'
              : 'bg-rose-500/8 dark:bg-rose-500/5 border-rose-400/30 dark:border-rose-700/40'
          }`}
        >
          {/* Verdict Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200/60 dark:border-slate-700/40">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isCompliant
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : isDoubtful
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}
              >
                {isCompliant ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : isDoubtful ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {isCompliant
                    ? 'Shariah Compliant — AAOIFI Standard 21'
                    : isDoubtful
                    ? 'Under Active Supervisory Review'
                    : 'Non-Compliant (Impermissible)'}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Screened against AAOIFI S21 — debt leverage, business activity & cash purity thresholds
                </p>
              </div>
            </div>
            {shariah_compliance.score && (
              <div className="shrink-0 flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-slate-400">AAOIFI Purity</span>
                <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatSafeNumber(shariah_compliance.score, 0)}%
                </span>
              </div>
            )}
          </div>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Pillar 1 */}
            <div className="bg-white/70 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Business Activity</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                    shariah_compliance.is_sector_compliant !== false
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {shariah_compliance.is_sector_compliant !== false ? '✓ PASS' : '✗ FAIL'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Core sector <strong className="text-slate-800 dark:text-slate-200">{company.sector}</strong>. Non-halal revenue &lt;5%.
              </p>
            </div>

            {/* Pillar 2 — Debt */}
            <div className="bg-white/70 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Interest Debt</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                    shariah_compliance.is_debt_compliant !== false
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {shariah_compliance.is_debt_compliant !== false ? '✓ PASS' : '✗ FAIL'}
                </span>
              </div>
              {shariah_compliance.debt_to_market_cap !== undefined && (
                <>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-slate-500">Debt/MCap</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatSafePct(Number(shariah_compliance.debt_to_market_cap || 0) * 100, false)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        Number(shariah_compliance.debt_to_market_cap || 0) > 0.33
                          ? 'bg-rose-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (Number(shariah_compliance.debt_to_market_cap || 0) / 0.33) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Max 33%</p>
                </>
              )}
            </div>

            {/* Pillar 3 — Cash */}
            <div className="bg-white/70 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Cash Purity</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                    shariah_compliance.is_cash_compliant !== false
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {shariah_compliance.is_cash_compliant !== false ? '✓ PASS' : '✗ FAIL'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Liquid cash &amp; interest-bearing deposits &lt;33% of market cap.
              </p>
            </div>

            {/* Pillar 4 — Purification */}
            <div className="bg-white/70 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Div. Purification</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400">
                  Advisory
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Donate <strong className="text-sky-600 dark:text-sky-400">0.25–0.50%</strong> of gross dividends to charity to purify ancillary interest income.
              </p>
            </div>
          </div>

          {/* Notes */}
          {shariah_compliance.notes && (
            <div className="mt-4 p-4 bg-white/60 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 text-xs text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200 block mb-1.5">Supervisory Notes:</strong>
              {Array.isArray(shariah_compliance.notes) ? (
                shariah_compliance.notes.map((note, idx) => <p key={idx} className="mb-1">• {note}</p>)
              ) : (
                <p>{shariah_compliance.notes}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          § 5 — INSTITUTIONAL OWNERSHIP (Shareholding)
      ═══════════════════════════════════════════════════════ */}
      {shareholding_pattern && shareholding_pattern.length > 0 && (
        <div
          id="ownership"
          className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 mb-4 scroll-mt-28"
        >
          <SectionHeading
            id="ownership-head"
            icon={<PieChart className="w-4 h-4" />}
            title="Shareholding Pattern — Smart Money Tracker"
            subtitle="Who owns this stock — latest quarter breakdown"
          />

          {/* Latest quarter big cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {shareholding_pattern[0] && (
              <>
                {[
                  { label: 'Promoter', value: shareholding_pattern[0].promoter, color: '#8B5CF6', bg: 'from-purple-500/10 to-purple-500/5' },
                  { label: 'FII / Foreign', value: shareholding_pattern[0].fii, color: '#0EA5E9', bg: 'from-sky-500/10 to-sky-500/5' },
                  { label: 'DII / Domestic', value: shareholding_pattern[0].dii, color: '#10B981', bg: 'from-emerald-500/10 to-emerald-500/5' },
                  { label: 'Retail / Public', value: shareholding_pattern[0].public, color: '#F59E0B', bg: 'from-amber-500/10 to-amber-500/5' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`p-4 rounded-2xl bg-gradient-to-b ${item.bg} border border-slate-200 dark:border-slate-800 text-center`}
                  >
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                      {item.label}
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums block">
                      {formatSafePct(item.value, false)}
                    </span>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, Math.abs(Number(item.value || 0)))}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    {shareholding_pattern[0].pledged !== undefined &&
                      item.label === 'Promoter' && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
                          Pledged: {formatSafePct(shareholding_pattern[0].pledged, false)}
                        </p>
                      )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Historical table */}
          {shareholding_pattern.length > 1 && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs min-w-[480px]">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5">Quarter</th>
                    <th className="px-4 py-2.5 text-right">Promoter</th>
                    <th className="px-4 py-2.5 text-right">FII</th>
                    <th className="px-4 py-2.5 text-right">DII</th>
                    <th className="px-4 py-2.5 text-right">Public</th>
                    <th className="px-4 py-2.5 text-right">Pledged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {shareholding_pattern.map((sh, idx) => {
                    const prev = shareholding_pattern[idx + 1];
                    const fiiDelta = prev ? Number(sh.fii || 0) - Number(prev.fii || 0) : null;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300">{sh.quarter}</td>
                        <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                          {formatSafePct(sh.promoter, false)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {formatSafePct(sh.fii, false)}
                          </span>
                          {fiiDelta !== null && Math.abs(fiiDelta) > 0.01 && (
                            <span
                              className={`ml-1 text-[10px] font-bold ${
                                fiiDelta > 0
                                  ? 'text-emerald-500'
                                  : 'text-rose-500'
                              }`}
                            >
                              {fiiDelta > 0 ? '▲' : '▼'}
                              {Math.abs(fiiDelta).toFixed(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                          {formatSafePct(sh.dii, false)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-600 dark:text-slate-400">
                          {formatSafePct(sh.public, false)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold tabular-nums">
                          {sh.pledged !== undefined ? (
                            <span className={Number(sh.pledged) > 20 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500'}>
                              {formatSafePct(sh.pledged, false)}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          § 6 — DELIVERY CONVICTION (institutional accumulation)
      ═══════════════════════════════════════════════════════ */}
      {delivery_conviction && delivery_conviction.length > 0 && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 mb-4">
          <SectionHeading
            id="delivery-head"
            icon={<Flame className="w-4 h-4 text-amber-500" />}
            title="Delivery Conviction — Recent Sessions"
            subtitle="High delivery % (>50%) = institutional holding, not intraday speculation"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {delivery_conviction.slice(0, 8).map((d, i) => {
              const pct = Number(d.delivery_percentage || 0);
              const isHigh = pct >= 50;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  <div className="shrink-0 w-16 text-right">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">{d.date}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHigh ? 'bg-emerald-500' : 'bg-sky-500'}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>{formatSafeVolume(d.delivery_quantity)} delivered</span>
                      <span>{formatSafeVolume(d.traded_quantity)} traded</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={`text-xs font-black tabular-nums px-2 py-0.5 rounded-lg ${
                        isHigh
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                      }`}
                    >
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          § 7 — PEER COMPARISON
      ═══════════════════════════════════════════════════════ */}
      {peers && peers.length > 0 && (
        <div
          id="peers"
          className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden mb-4 scroll-mt-28"
        >
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
            <SectionHeading
              id="peers-head"
              icon={<Users className="w-4 h-4" />}
              title="Sector Peer Comparison"
              subtitle={`${company.name} vs ${peers.length} sector peers`}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3 text-right">Mkt Cap</th>
                  <th className="px-5 py-3 text-right">P/E</th>
                  <th className="px-5 py-3 text-right">P/B</th>
                  <th className="px-5 py-3 text-right">ROE</th>
                  <th className="px-5 py-3 text-right">ROCE</th>
                  <th className="px-5 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {/* Current stock row (highlighted) */}
                <tr className="bg-sky-50/60 dark:bg-sky-950/20">
                  <td className="px-5 py-3">
                    <div>
                      <span className="font-black text-sky-600 dark:text-sky-400">{company.symbol}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">(this stock)</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[160px]">{company.name}</div>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                    {formatMarketCap(metrics.market_cap, company.country)}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                    {formatSafeNumber(metrics.pe_ratio, 1)}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                    {formatSafeNumber(metrics.price_to_book, 2)}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                    {metrics.roe ? formatSafePct(Number(metrics.roe) * 100, false) : '—'}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                    {metrics.roce ? formatSafePct(Number(metrics.roce) * 100, false) : '—'}
                  </td>
                  <td className="px-5 py-3 text-right" />
                </tr>
                {peers.map((peer) => (
                  <tr
                    key={peer.symbol}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{peer.symbol}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[160px]">{peer.company_name}</div>
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-600 dark:text-slate-400">
                      {formatMarketCap(peer.market_cap, company.country)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-600 dark:text-slate-400">
                      {formatSafeNumber(peer.pe_ratio, 1)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-600 dark:text-slate-400">
                      {formatSafeNumber(peer.price_to_book, 2)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-600 dark:text-slate-400">
                      {peer.roe ? formatSafePct(Number(peer.roe) * 100, false) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-600 dark:text-slate-400">
                      {peer.roce ? formatSafePct(Number(peer.roce) * 100, false) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectPeer && onSelectPeer(peer.symbol)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                      >
                        Analyze
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Footer disclaimer ── */}
      <div className="text-center py-4 text-[10px] text-slate-400 dark:text-slate-600 leading-relaxed">
        Data sourced from exchange feeds. Not financial advice. Always conduct your own due diligence before investing.
        Shariah screening based on AAOIFI Standard No. 21 methodology.
      </div>
    </div>
  );
}
