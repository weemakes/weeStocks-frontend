'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Building2, CheckCircle2, FileText, Globe, LineChart, PieChart, ShieldCheck, Sparkles, Target, TrendingUp, WalletCards, XCircle } from 'lucide-react';
import type { StockCandle, StockMasterDetail } from '../types';
import { getStockChart } from '../api';
import { formatMarketCap, formatSafeNumber, formatSafePct, formatSafePrice, formatSafeVolume, getCurrencySymbol } from '../utils/mappers';
import CompanyLogo from './CompanyLogo';
import ShareholdingCharts from './ShareholdingCharts';
import StockCandleChart from './StockCandleChart';
import DeliveryParticipation from './DeliveryParticipation';
import CorporateActionsSection from './CorporateActionsSection';
import FinancialStatements from './FinancialStatements';
import PeerComparison from './PeerComparison';

interface Props { detail: StockMasterDetail; onSelectPeer?: (symbol: string) => void; isStandalonePage?: boolean }
const chartRanges = [{ label: '1D', range: '1D', interval: '5m' }, { label: '1W', range: '1W', interval: '1h' }, { label: '1M', range: '1M', interval: '1d' }, { label: '3M', range: '3M', interval: '1d' }, { label: '6M', range: '6M', interval: '1d' }, { label: '1Y', range: '1Y', interval: '1wk' }, { label: '5Y', range: '5Y', interval: '1mo' }] as const;
type ChartRange = typeof chartRanges[number]['label'];
const panel = 'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900';

function Title({ children, icon, aside }: { children: ReactNode; icon?: ReactNode; aside?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">{icon && <span className="text-sky-600">{icon}</span>}{children}</div>{aside}</div>;
}
function Stat({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/40"><span className="block text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</span><strong className="mt-1 block text-sm tabular-nums text-slate-900 dark:text-white">{value}</strong>{note && <span className="mt-0.5 block text-[9px] text-slate-500">{note}</span>}</div>;
}
function RangeLine({ low, high, current, currency }: { low?: number; high?: number; current?: number; currency: string }) {
  const position = low != null && high != null && current != null && high > low ? Math.max(0, Math.min(100, (current - low) / (high - low) * 100)) : 50;
  return <div><div className="mb-1 flex justify-between text-[10px] font-bold"><span>{formatSafePrice(low, currency)}</span><span>{formatSafePrice(high, currency)}</span></div><div className="relative h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"><i className="absolute top-1/2 h-3 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded bg-emerald-500" style={{ left: `${position}%` }} /></div></div>;
}

export default function StockDetailDashboard({ detail, onSelectPeer }: Props) {
  const { company, quote, metrics, scores, header, today_at_a_glance: glance, price_performance: performance, shariah_audit: audit, valuation_and_sector_context: valuation, growth_and_profitability: growth, financial_health_and_cash_flow: health, technical_analysis: technical, quarterly_financials, annual_financials, shareholding_pattern, delivery_conviction, peers, investor_faqs, flags, thesis, trader_insights, chart } = detail;
  const currency = getCurrencySymbol(company.country || company.currency);
  const positive = Number(quote.change_percentage || 0) >= 0;
  const compliant = audit?.overall_result === 'PASS' || header?.is_shariah_compliant || detail.shariah_compliance.status === 'HALAL';
  const [range, setRange] = useState<ChartRange>('1Y');
  const [activeSection, setActiveSection] = useState('overview');
  const [candles, setCandles] = useState<StockCandle[]>(chart || []);
  const [chartLoading, setChartLoading] = useState(false);
  const first = useRef(true);
  const fetchChart = useCallback(async (selected: ChartRange) => { const config = chartRanges.find((item) => item.label === selected); if (!config) return; setChartLoading(true); const result = await getStockChart(company.symbol, config.range, config.interval, company.country); setCandles(result?.candles || chart || []); setChartLoading(false); }, [chart, company.country, company.symbol]);
  useEffect(() => { if (first.current) { first.current = false; return; } void fetchChart(range); }, [fetchChart, range]);

  const recent = detail.what_changed_recently || [];
  const actions = detail.corporate_actions || [];
  const annualRows = annual_financials || [];
  const quarterlyRows = quarterly_financials || [];
  const holdingRows = (shareholding_pattern || []).filter((row) => row.promoter != null || row.fii != null || row.dii != null || row.public != null);
  const holding = holdingRows[0];
  const rawGrowthSeries = growth?.chart_series || [];
  const growthSeries = Array.from(rawGrowthSeries.reduce((rows, row) => {
    const existing = rows.get(row.period);
    if (!existing || Number(row.revenue || 0) > Number(existing.revenue || 0)) rows.set(row.period, row);
    return rows;
  }, new Map<string, (typeof rawGrowthSeries)[number]>()).values()).sort((a, b) => a.period.localeCompare(b.period));
  const maxRevenue = Math.max(1, ...growthSeries.map((row) => Number(row.revenue || 0)));
  const maxProfit = Math.max(1, ...growthSeries.map((row) => Math.abs(Number(row.net_income || 0))));
  const valuationRows = [['P/E', valuation?.company?.pe_ratio, valuation?.sector_medians?.pe_ratio], ['Forward P/E', valuation?.company?.forward_pe, valuation?.sector_medians?.forward_pe], ['P/B', valuation?.company?.price_to_book, valuation?.sector_medians?.price_to_book], ['EV/EBITDA', valuation?.company?.ev_to_ebitda, valuation?.sector_medians?.ev_to_ebitda], ['PEG', valuation?.company?.peg_ratio, valuation?.sector_medians?.peg_ratio], ['Earnings yield', valuation?.company?.earnings_yield, valuation?.sector_medians?.earnings_yield]] as const;
  const nav = [['overview', 'Overview', true], ['chart', 'Chart', true], ['technical', 'Technical', Boolean(technical)], ['shariah', 'Shariah', Boolean(audit)], ['valuation', 'Ratios', Boolean(valuation)], ['financials', 'Financials', annualRows.length > 0 || quarterlyRows.length > 0], ['ownership', 'Shareholding', Boolean(holding)], ['actions', 'Corporate Actions', actions.length > 0], ['delivery', 'Delivery', Boolean(delivery_conviction?.length)], ['peers', 'Peers', Boolean(peers?.length)], ['about', 'About', Boolean(company.description)]].filter((item) => item[2]);
  const navIds = nav.map(([id]) => String(id)).join('|');
  const topMetrics = [
    ['Market cap', formatMarketCap(metrics.market_cap, company.country)],
    ['Enterprise value', formatMarketCap(metrics.enterprise_value, company.country)],
    ['P/E TTM', formatSafeNumber(metrics.pe_ratio, 2)],
    ['Forward P/E', formatSafeNumber(metrics.forward_pe, 2)],
    ['P/B', formatSafeNumber(metrics.price_to_book, 2)],
    ['EPS TTM', formatSafePrice(metrics.eps, currency)],
    ['Forward EPS', formatSafePrice(metrics.forward_eps, currency)],
    ['ROCE', formatSafePct(metrics.roce, false)],
    ['ROE', formatSafePct(metrics.roe, false)],
    ['ROA', formatSafePct(metrics.roa, false)],
    ['D/E', formatSafeNumber(metrics.debt_to_equity, 2)],
    ['Dividend yield', formatSafePct(metrics.dividend_yield, false)],
    ['PEG', formatSafeNumber(metrics.peg_ratio, 2)],
    ['Face value', formatSafePrice(metrics.face_value, currency)],
    ['52W high', formatSafePrice(metrics.fifty_two_week_high, currency)],
    ['52W low', formatSafePrice(metrics.fifty_two_week_low, currency)],
  ].filter(([, value]) => value !== '—');
  const scoreRows = [
    ['Overall', scores?.overall],
    ['Valuation', scores?.valuation],
    ['Profitability', scores?.profitability],
    ['Financial health', scores?.financial_health],
  ].filter((row): row is [string, number] => typeof row[1] === 'number' && Number.isFinite(row[1]));
  const passedCriteria = audit?.criteria_breakdown?.filter((row) => row.status === 'PASS').length || 0;
  const totalCriteria = audit?.criteria_breakdown?.length || 0;

  useEffect(() => {
    const ids = navIds.split('|').filter(Boolean);
    const sections = ids.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => Math.abs(a.boundingClientRect.top - 132) - Math.abs(b.boundingClientRect.top - 132));
      if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
    }, { rootMargin: '-128px 0px -68% 0px', threshold: [0, 0.05, 0.2] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navIds]);

  const navigateToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    setActiveSection(id);
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 136, behavior: 'smooth' });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Company Overview Hero Card */}
      <section id="overview" className={`${panel} scroll-mt-[140px] overflow-hidden`}>
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Company Identity */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
              <CompanyLogo
                src={company.logo_url}
                symbol={company.symbol}
                name={company.name}
                size="xl"
                className="h-12 w-12 sm:h-14 sm:w-14 !rounded-xl shrink-0 ring-1 ring-slate-200/80 dark:ring-slate-800"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                    {company.name}
                  </h1>
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {company.exchange}: {company.symbol}
                  </span>
                  {/* Shariah Compliance Badge - Clean Meta Pill */}
                  <button
                    type="button"
                    onClick={() => navigateToSection('shariah')}
                    title="Click to view AAOIFI Shariah audit breakdown"
                    className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold border transition-all hover:opacity-90 active:scale-95 cursor-pointer ${compliant
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/90 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 shadow-2xs'
                        : 'bg-rose-50 text-rose-700 border-rose-200/90 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80 shadow-2xs'
                      }`}
                  >
                    {compliant ? (
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                    <span>{audit?.badge_label || header?.shariah_badge || (compliant ? 'Shariah Compliant' : 'Non-Compliant')}</span>
                  </button>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                  {[company.industry, company.sector, trader_insights?.market_tier?.replace('_', ' ')].filter(Boolean).map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-100/90 dark:bg-slate-800/90 px-2 py-0.5 font-medium text-slate-600 dark:text-slate-400">
                      {tag}
                    </span>
                  ))}
                  <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    MCap <strong className="text-slate-800 dark:text-slate-200">{formatMarketCap(metrics.market_cap, company.country)}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Live Price */}
            <div className="pt-2.5 lg:pt-0 border-t border-slate-100 lg:border-t-0 dark:border-slate-800/60 lg:text-right">
              <div className="flex items-baseline gap-2 lg:justify-end">
                <span className="text-2xl sm:text-3xl font-black tabular-nums tracking-tight text-slate-950 dark:text-white">
                  {formatSafePrice(quote.price, currency)}
                </span>
                <span className={`inline-flex items-center text-xs sm:text-sm font-bold ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {formatSafePrice(quote.change, currency)} ({formatSafePct(quote.change_percentage)})
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                {header?.market_status_label || `${company.exchange} market closed`}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Strip */}
        {topMetrics.length > 0 && (
          <div className="overflow-x-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" aria-label="Key stock metrics">
            <div className="flex min-w-max divide-x divide-slate-200/70 dark:divide-slate-800/70 px-2 sm:px-4 py-2">
              {topMetrics.map(([label, value]) => (
                <div key={label} className="min-w-24 sm:min-w-28 px-3 py-1 text-left">
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                  <strong className="mt-0.5 block text-xs font-bold tabular-nums text-slate-900 dark:text-white">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Sticky Navigation Tabs */}
      <nav aria-label="Stock detail sections" className="sticky top-[82px] sm:top-[84px] z-30 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white/95 px-2 py-1 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {nav.map(([id, label]) => {
          const selected = activeSection === String(id);
          return (
            <button
              key={String(id)}
              type="button"
              aria-current={selected ? 'location' : undefined}
              onClick={() => navigateToSection(String(id))}
              className={`shrink-0 border-b-2 px-3 py-2 text-[11px] font-bold transition-colors ${selected
                  ? 'border-sky-600 bg-sky-50/80 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300'
                  : 'border-transparent text-slate-500 hover:border-sky-300 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-300'
                }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* Interactive Price Chart & At A Glance */}
      <div className="grid gap-3 lg:grid-cols-[1.9fr_0.9fr]">
        <section id="chart" className={`${panel} scroll-mt-36 p-4 sm:p-5`}>
          <StockCandleChart
            candles={candles}
            currencySymbol={currency}
            loading={chartLoading}
            range={range}
            chartRanges={chartRanges}
            onRangeChange={setRange}
            performance={performance}
          />
        </section>

        {glance && (
          <section className={`${panel} p-4`}>
            <Title icon={<Activity className="h-4 w-4" />}>Today at a glance</Title>
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-[10px] font-bold text-slate-500">Day range</p>
                <RangeLine low={glance.day_range?.low} high={glance.day_range?.high} current={glance.day_range?.current} currency={currency} />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold text-slate-500">52 week range</p>
                <RangeLine low={glance.fifty_two_week_range?.low} high={glance.fifty_two_week_range?.high} current={quote.price} currency={currency} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Volume" value={formatSafeVolume(glance.volume)} note={`${formatSafeNumber(glance.volume_ratio, 2)}x 20D avg`} />
                <Stat label="Free float" value={formatSafePct(glance.free_float_pct, false)} note={`${formatSafePct(glance.volume_diff_pct)} volume`} />
              </div>
              {glance.narrative_summary && (
                <p className="rounded-xl bg-sky-50 p-3 text-[10px] leading-4 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                  {glance.narrative_summary}
                </p>
              )}
            </div>
          </section>
        )}
      </div>

      {technical && <section id="technical" className={`${panel} scroll-mt-28 p-4`}><Title icon={<Activity className="h-4 w-4" />}>Technical analysis</Title><div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7"><Stat label="RSI (14)" value={formatSafeNumber(technical.rsi_14?.value, 1)} note={technical.rsi_14?.label} /><Stat label="MACD" value={<Signal value={technical.macd?.status} />} note={technical.macd?.label} /><Stat label="ATR (14)" value={formatSafePrice(technical.atr_14?.value, currency)} note={technical.atr_14?.label} />{['sma_20', 'sma_50', 'sma_100', 'sma_200'].map((key) => <Stat key={key} label={key.replace('_', ' ').toUpperCase()} value={formatSafePrice(technical.moving_averages?.[key]?.value, currency)} note={technical.moving_averages?.[key]?.status} />)}</div>{technical.cpr && <div className="mt-3 grid grid-cols-3 gap-2"><Stat label="CPR bottom" value={formatSafePrice(technical.cpr.bottom_central, currency)} /><Stat label="Pivot" value={formatSafePrice(technical.cpr.pivot, currency)} /><Stat label="CPR top" value={formatSafePrice(technical.cpr.top_central, currency)} /></div>}</section>}

      {recent.length > 0 && <section className={`${panel} p-4`}><Title icon={<Sparkles className="h-4 w-4" />}>What changed recently?</Title><div className="grid gap-3 md:grid-cols-3">{recent.slice(0, 3).map((item, index) => <div key={`${item.title}-${index}`} className="flex gap-3 border-slate-200 md:border-r md:pr-4 last:border-0 dark:border-slate-800"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950"><FileText className="h-4 w-4" /></span><div><p className="text-[9px] text-slate-400">{item.date}</p><p className="text-xs font-black">{item.title}</p><p className="mt-1 text-[10px] text-slate-500">{item.details}</p></div></div>)}</div></section>}

      {audit && <section id="shariah" className={`${panel} scroll-mt-28 p-4`}><Title aside={<span className="text-[9px] text-slate-400">Methodology: {audit.methodology}</span>}>Shariah audit</Title><div className="grid gap-5 lg:grid-cols-[200px_1fr]"><div className="flex flex-col items-center justify-center py-2"><div className={`flex h-32 w-32 flex-col items-center justify-center rounded-full border-[10px] bg-white dark:bg-slate-900 ${audit.overall_result === 'PASS' ? 'border-emerald-500' : 'border-rose-500'}`}><strong className="text-xl">{audit.overall_result}</strong><span className="mt-0.5 text-[11px] text-slate-500">{totalCriteria ? `${passedCriteria}/${totalCriteria} criteria` : audit.criteria_summary}</span></div><span className={`mt-4 rounded-lg px-4 py-1.5 text-[11px] font-bold ${audit.overall_result === 'PASS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>{audit.badge_label}</span></div><div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800"><table className="min-w-[700px] w-full text-xs"><thead className="bg-slate-50 text-left text-[9px] uppercase text-slate-400 dark:bg-slate-950"><tr><th className="p-3">Criteria</th><th className="p-3 text-right">Numerator</th><th className="p-3 text-right">Denominator</th><th className="p-3 text-right">Value</th><th className="p-3 text-right">Threshold</th><th className="p-3 text-right">Status</th></tr></thead><tbody>{(audit.criteria_breakdown || []).map((row) => <tr key={row.criteria} className="border-t border-slate-100 dark:border-slate-800"><td className="p-3 font-bold">{row.name}</td><td className="p-3 text-right">{formatMarketCap(row.numerator, company.country)}</td><td className="p-3 text-right">{formatMarketCap(row.denominator, company.country)}</td><td className="p-3 text-right font-black">{formatSafePct(row.value_pct, false)}</td><td className="p-3 text-right">{row.threshold_label}</td><td className={`p-3 text-right font-black ${row.status === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}`}>{row.status}</td></tr>)}</tbody></table></div></div></section>}

      <div className="grid gap-3 lg:grid-cols-2">
        {valuation && <section id="valuation" className={`${panel} scroll-mt-28 p-4`}><Title>Valuation & sector context</Title><div className="grid grid-cols-[1fr_0.7fr_0.7fr_1fr] border-b border-slate-200 pb-2 text-[9px] font-bold uppercase text-slate-400"><span>Metric</span><span className="text-right">Company</span><span className="text-right">Sector</span><span /></div>{valuationRows.map(([label, own, median]) => <div key={label} className="grid grid-cols-[1fr_0.7fr_0.7fr_1fr] items-center border-b border-slate-100 py-2.5 text-xs last:border-0 dark:border-slate-800"><span className="font-bold">{label}</span><span className="text-right font-black">{formatSafeNumber(own, 2)}</span><span className="text-right text-slate-500">{formatSafeNumber(median, 2)}</span><span className="ml-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800"><i className="block h-full rounded-full bg-sky-500" style={{ width: `${own != null && median ? Math.min(100, Number(own) / Number(median) * 65) : 0}%` }} /></span></div>)}</section>}
        {growth && <section className={`${panel} p-4`}><Title icon={<TrendingUp className="h-4 w-4" />} aside={<div className="flex gap-3 text-[9px] text-slate-500"><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-sky-500" />Revenue</span><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-500" />PAT</span></div>}>Growth & profitability</Title><div className="flex h-44 items-end gap-5 border-b border-slate-100 px-3 pb-2 dark:border-slate-800">{growthSeries.map((row) => <div key={row.period} className="flex h-full flex-1 flex-col justify-end text-center"><div className="flex flex-1 items-end justify-center gap-2"><div className="w-8 rounded-t bg-sky-500" style={{ height: `${Math.max(10, Number(row.revenue || 0) / maxRevenue * 100)}%` }} title={`Revenue: ${formatMarketCap(row.revenue, company.country)}`} /><div className={`w-8 rounded-t ${Number(row.net_income || 0) >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ height: `${Math.max(10, Math.abs(Number(row.net_income || 0)) / maxProfit * 72)}%` }} title={`PAT: ${formatMarketCap(row.net_income, company.country)}`} /></div><span className="mt-1 text-[9px] font-bold">{row.period}</span><span className="text-[8px] text-slate-400">PAT margin <b className="text-emerald-600">{formatSafePct(row.pat_margin_pct, false)}</b></span></div>)}</div><p className="mt-1 text-[8px] text-slate-400">Revenue and PAT bars use independent scales to make their year-on-year direction readable.</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"><Stat label="Revenue CAGR 3Y" value={formatSafePct(growth.cagr?.revenue_cagr_3y)} /><Stat label="Revenue CAGR 5Y" value={formatSafePct(growth.cagr?.revenue_cagr_5y)} /><Stat label="PAT CAGR 3Y" value={formatSafePct(growth.cagr?.pat_cagr_3y)} /><Stat label="PAT CAGR 5Y" value={formatSafePct(growth.cagr?.pat_cagr_5y)} /><Stat label="Operating margin" value={formatSafePct(growth.margins?.operating_margin != null && Math.abs(growth.margins.operating_margin) <= 1 ? growth.margins.operating_margin * 100 : growth.margins?.operating_margin, false)} /><Stat label="Net margin" value={formatSafePct(growth.margins?.net_margin != null && Math.abs(growth.margins.net_margin) <= 1 ? growth.margins.net_margin * 100 : growth.margins?.net_margin, false)} /></div></section>}
      </div>

      {health && <section className={`${panel} p-4`}><Title icon={<WalletCards className="h-4 w-4" />}>Financial health & cash flow</Title><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Stat label="Net debt" value={formatMarketCap(health.net_debt, company.country)} note={health.health_status} /><Stat label="Interest coverage" value={`${formatSafeNumber(health.interest_coverage, 2)}x`} note="EBIT / interest" /><Stat label="CFO / PAT" value={`${formatSafeNumber(health.cfo_to_pat_3y, 2)}x`} note="3Y average" /><Stat label="Net debt / EBITDA" value={health.net_debt_to_ebitda == null ? '—' : `${formatSafeNumber(health.net_debt_to_ebitda, 2)}x`} note="Leverage" /></div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"><Stat label="Operating cash flow" value={formatMarketCap(health.cash_flow?.operating_cash_flow, company.country)} /><Stat label="Capital expenditure" value={formatMarketCap(health.cash_flow?.capex, company.country)} /><Stat label="Free cash flow" value={formatMarketCap(health.cash_flow?.free_cash_flow, company.country)} /></div></section>}

      {(annualRows.length > 0 || quarterlyRows.length > 0) && <FinancialStatements annual={annualRows} quarterly={quarterlyRows} country={company.country} currency={currency} />}

      {scoreRows.length > 0 && <section className={`${panel} p-4`} aria-label="Fundamental scores"><Title icon={<Target className="h-4 w-4" />}>Fundamental scorecard</Title><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{scoreRows.map(([label, value]) => <QuantScore key={label} label={label} value={value} />)}</div><p className="mt-2 text-[9px] leading-4 text-slate-400">A 0–100 quantitative summary of reported fundamentals. Use the underlying financials and risks for context; the score is not a buy or sell recommendation.</p></section>}

      {(flags.green_flags.length > 0 || flags.red_flags.length > 0) && <section className={`${panel} p-4`}><Title icon={<Target className="h-4 w-4" />}>Strengths, risks & investment thesis</Title><div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.9fr]"><div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"><h3 className="mb-2 text-xs font-black text-emerald-700">Strengths</h3>{flags.green_flags.map((item) => <p key={item} className="mb-1.5 flex gap-2 text-[10px]"><CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />{item}</p>)}</div><div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900 dark:bg-rose-950/20"><h3 className="mb-2 text-xs font-black text-rose-700">Risks</h3>{flags.red_flags.map((item) => <p key={item} className="mb-1.5 flex gap-2 text-[10px]"><AlertTriangle className="h-3 w-3 shrink-0 text-rose-600" />{item}</p>)}</div><div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><p className="text-[10px] font-black text-emerald-600">Bull case</p><p className="mb-3 mt-1 text-[10px]">{thesis.bull_case[0] || '—'}</p><p className="text-[10px] font-black text-rose-600">Bear case</p><p className="mb-3 mt-1 text-[10px]">{thesis.bear_case[0] || '—'}</p><p className="text-[10px] font-black text-sky-600">Flip condition</p><p className="mt-1 text-[10px]">{thesis.flip_conditions[0] || '—'}</p></div></div></section>}

      {holding && <section id="ownership" className={`${panel} scroll-mt-28 p-4 sm:p-5`}>
        <Title icon={<PieChart className="h-4 w-4" />}>Shareholding pattern</Title>
        <ShareholdingCharts rows={holdingRows} />
      </section>}

      {actions.length > 0 && <CorporateActionsSection actions={actions} currency={currency} />}

      {delivery_conviction?.length ? <DeliveryParticipation rows={delivery_conviction} /> : null}

      {peers?.length ? <PeerComparison peers={peers} onSelect={onSelectPeer} country={company.country} /> : null}

      <div className="grid gap-3 lg:grid-cols-2">
        {company.description && <section id="about" className={`${panel} scroll-mt-28 p-4`}><Title icon={<Building2 className="h-4 w-4" />}>About {company.name}</Title><div className="flex gap-4"><CompanyLogo src={company.logo_url} symbol={company.symbol} name={company.name} size="lg" /><div><p className="text-xs leading-5 text-slate-600 dark:text-slate-300">{company.description}</p><p className="mt-3 flex gap-3 text-[10px] text-slate-500"><span><Globe className="mr-1 inline h-3 w-3" />{company.country}</span><span>{company.sector}</span></p></div></div></section>}
        {investor_faqs?.length ? <section className={`${panel} p-4`}><Title>Questions investors ask</Title><div className="divide-y divide-slate-100 dark:divide-slate-800">{investor_faqs.map((faq) => <details key={faq.question} className="py-2"><summary className="cursor-pointer text-[11px] font-bold">{faq.question}</summary><p className="mt-2 text-[10px] leading-4 text-slate-500">{faq.answer}</p></details>)}</div></section> : null}
      </div>
      <p className="py-3 text-center text-[9px] text-slate-400">Market data is informational and may be delayed. Shariah screening follows the displayed methodology. This is not investment advice.</p>
    </div>
  );
}

function QuantScore({ label, value }: { label: string; value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  const tone = safeValue >= 75 ? 'bg-emerald-500' : safeValue >= 55 ? 'bg-sky-500' : 'bg-amber-500';
  return <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"><div className="flex items-baseline justify-between gap-3"><span className="text-[10px] font-bold text-slate-500">{label}</span><strong className="text-lg tabular-nums text-slate-950 dark:text-white">{safeValue}<span className="text-[9px] font-medium text-slate-400">/100</span></strong></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><span className={`block h-full rounded-full ${tone}`} style={{ width: `${safeValue}%` }} /></div></div>;
}

function Signal({ value }: { value?: string }) {
  const normalized = value?.toLowerCase() || '';
  const tone = normalized.includes('bull') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : normalized.includes('bear') ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
  return <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wide ${tone}`}>{value || 'Neutral'}</span>;
}
