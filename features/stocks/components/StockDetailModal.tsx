'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart3,
  FileText,
  DollarSign,
  Layers,
  Globe,
  ExternalLink,
  Info,
  Loader2,
  Scale,
} from 'lucide-react';
import {
  StockItem,
  StockDetailData,
  StockChartData,
  StockFinancialsData,
  StockHalalAuditData,
} from '../types';
import {
  getStockDetail,
  getStockChart,
  getStockFinancials,
  getStockHalalAudit,
} from '../api';
import StockCandleChart from './StockCandleChart';
import { getCurrencySymbol, formatMarketCap } from '../utils/mappers';

interface StockDetailModalProps {
  stock: StockItem | null;
  onClose: () => void;
}

const CHART_RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'ALL'];

export default function StockDetailModal({ stock, onClose }: StockDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'financials'>('overview');
  const [chartRange, setChartRange] = useState<string>('1M');
  const [financialPeriod, setFinancialPeriod] = useState<'ANNUAL' | 'QUARTERLY'>('ANNUAL');

  // Async data states
  const [detailData, setDetailData] = useState<StockDetailData | null>(null);
  const [chartData, setChartData] = useState<StockChartData | null>(null);
  const [auditData, setAuditData] = useState<StockHalalAuditData | null>(null);
  const [financialsData, setFinancialsData] = useState<StockFinancialsData | null>(null);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [loadingFinancials, setLoadingFinancials] = useState(false);

  // Load stock detail on open
  useEffect(() => {
    if (!stock) return;
    const currentStock = stock;
    let isMounted = true;

    async function loadInitial() {
      setLoadingDetail(true);
      try {
        const res = await getStockDetail(currentStock.symbol, currentStock.country);
        if (isMounted && res) {
          setDetailData(res);
        }
      } catch (err) {
        console.error('Failed to load stock detail:', err);
      } finally {
        if (isMounted) setLoadingDetail(false);
      }
    }

    loadInitial();
    return () => {
      isMounted = false;
    };
  }, [stock]);

  // Load chart data whenever chartRange changes
  useEffect(() => {
    if (!stock) return;
    const currentStock = stock;
    let isMounted = true;

    async function loadChart() {
      setLoadingChart(true);
      try {
        const res = await getStockChart(currentStock.symbol, chartRange, '1d', currentStock.country);
        if (isMounted) setChartData(res);
      } catch (err) {
        console.error('Failed to load chart:', err);
        if (isMounted) setChartData(null);
      } finally {
        if (isMounted) setLoadingChart(false);
      }
    }

    loadChart();
    return () => {
      isMounted = false;
    };
  }, [stock, chartRange]);

  // Load deep audit data on tab selection
  useEffect(() => {
    if (!stock || activeTab !== 'audit' || auditData) return;
    const currentStock = stock;
    let isMounted = true;

    async function loadAudit() {
      setLoadingAudit(true);
      try {
        const res = await getStockHalalAudit(currentStock.symbol);
        if (isMounted) setAuditData(res);
      } catch (err) {
        console.error('Failed to load audit:', err);
      } finally {
        if (isMounted) setLoadingAudit(false);
      }
    }

    loadAudit();
    return () => {
      isMounted = false;
    };
  }, [stock, activeTab, auditData]);

  // Load financials on tab selection or period change
  useEffect(() => {
    if (!stock || activeTab !== 'financials') return;
    const currentStock = stock;
    let isMounted = true;

    async function loadFin() {
      setLoadingFinancials(true);
      try {
        const res = await getStockFinancials(currentStock.symbol, financialPeriod, 5, currentStock.country);
        if (isMounted) setFinancialsData(res);
      } catch (err) {
        console.error('Failed to load financials:', err);
      } finally {
        if (isMounted) setLoadingFinancials(false);
      }
    }

    loadFin();
    return () => {
      isMounted = false;
    };
  }, [stock, activeTab, financialPeriod]);

  if (!stock) return null;

  const currencySym = getCurrencySymbol(stock.country || stock.currency);
  const isCompliant = stock.complianceStatus === 'compliant';
  const isDoubtful = stock.complianceStatus === 'doubtful';

  const currentPrice = Number(detailData?.quote?.price ?? stock.price);
  const currentChange = Number(detailData?.quote?.change ?? stock.change);
  const currentChangePct = Number(detailData?.quote?.change_percentage ?? stock.changePercent);
  const isPositive = currentChange >= 0;

  const debtRatioPct = Number(
    (auditData?.audit?.debt_to_market_cap != null
      ? Number(auditData.audit.debt_to_market_cap) * 100
      : detailData?.shariah_compliance?.debt_to_market_cap != null
        ? Number(detailData.shariah_compliance.debt_to_market_cap) * 100
        : stock.shariah.debtRatioPercent).toFixed(2)
  );

  const cashRatioPct = Number(
    (auditData?.audit?.cash_to_market_cap != null
      ? Number(auditData.audit.cash_to_market_cap) * 100
      : stock.shariah.cashAndSecuritiesRatioPercent).toFixed(2)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-950/95 backdrop-blur-md px-5 py-4 border-b border-slate-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-base text-sky-400 shrink-0">
              {stock.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">{stock.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  {stock.exchange}
                </span>
                {stock.country && (
                  <span className="text-xs text-slate-400 font-medium">
                    • {stock.country}
                  </span>
                )}
                {isCompliant ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" /> Halal
                  </span>
                ) : isDoubtful ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30">
                    <AlertTriangle className="w-3 h-3" /> Review
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 text-xs font-bold border border-rose-500/30">
                    <XCircle className="w-3 h-3" /> Non-Halal
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                {detailData?.profile?.company_name || stock.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-base font-bold text-slate-100 tabular-nums">
                {currencySym}{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div
                className={`text-xs font-semibold tabular-nums ${isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
              >
                {isPositive ? '+' : ''}{currentChange?.toFixed(2)} ({isPositive ? '+' : ''}{currentChangePct?.toFixed(2)}%)
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Regulatory & Educational Disclaimer Bar */}
        <div className="bg-slate-950/80 border-b border-slate-800/80 px-5 py-2 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="w-1 h-3.5 bg-amber-500 rounded-full shrink-0" />
          <span>
            <strong className="text-slate-200">Disclaimer:</strong> Data is strictly for educational &amp; informational purposes. WeeStox is not a SEBI registered investment advisor. All audits follow AAOIFI Standard 21.
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'overview'
              ? 'border-sky-500 text-sky-400 bg-sky-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview &amp; Chart</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'audit'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>AAOIFI Shariah Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'financials'
              ? 'border-sky-500 text-sky-400 bg-sky-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            <FileText className="w-4 h-4" />
            <span>Financial Statements</span>
          </button>
        </div>

        {/* Modal Body Tabs Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* TAB 1: OVERVIEW & CHART */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Interactive Candlestick / Area Chart Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Price Movement ({chartRange})
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      High-frequency historical candlesticks
                    </span>
                  </div>

                  {/* Range Toggles */}
                  <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
                    {CHART_RANGES.map((r) => (
                      <button
                        key={r}
                        onClick={() => setChartRange(r)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${chartRange === r
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                          }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <StockCandleChart
                  candles={chartData?.candles || []}
                  currencySymbol={currencySym}
                  loading={loadingChart}
                />
              </div>

              {/* Key Pro Trader Valuation Multiples Grid */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Institutional Valuation &amp; Trading Metrics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Market Cap</span>
                    <span className="text-sm font-bold text-slate-100 tabular-nums">
                      {formatMarketCap(detailData?.metrics?.market_cap || stock.marketCapCr * 10000000, stock.country)}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">P/E Ratio (TTM)</span>
                    <span className="text-sm font-bold text-slate-100 tabular-nums">
                      {detailData?.metrics?.pe_ratio != null ? Number(detailData.metrics.pe_ratio).toFixed(2) : stock.fundamentals.peRatio ? stock.fundamentals.peRatio.toFixed(2) : '–'}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Price to Book (P/B)</span>
                    <span className="text-sm font-bold text-slate-100 tabular-nums">
                      {detailData?.metrics?.price_to_book != null ? Number(detailData.metrics.price_to_book).toFixed(2) : stock.fundamentals.pbRatio ? stock.fundamentals.pbRatio.toFixed(2) : '–'}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Return on Equity (ROE)</span>
                    <span className="text-sm font-bold text-emerald-400 tabular-nums">
                      {detailData?.metrics?.roe != null ? `${(Number(detailData.metrics.roe) * 100).toFixed(2)}%` : stock.fundamentals.roePercent ? `${stock.fundamentals.roePercent}%` : '–'}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">52-Week High</span>
                    <span className="text-sm font-bold text-slate-100 tabular-nums">
                      {currencySym}{(detailData?.metrics?.fifty_two_week_high ? Number(detailData.metrics.fifty_two_week_high) : stock.fundamentals.week52High)?.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">52-Week Low</span>
                    <span className="text-sm font-bold text-slate-100 tabular-nums">
                      {currencySym}{(detailData?.metrics?.fifty_two_week_low ? Number(detailData.metrics.fifty_two_week_low) : stock.fundamentals.week52Low)?.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Dividend Yield</span>
                    <span className="text-sm font-bold text-slate-100 tabular-nums">
                      {detailData?.metrics?.dividend_yield != null ? `${(Number(detailData.metrics.dividend_yield) * 100).toFixed(2)}%` : stock.fundamentals.dividendYield ? `${stock.fundamentals.dividendYield}%` : '0.00%'}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Trading Volume</span>
                    <span className="text-sm font-bold text-slate-100 tabular-nums">
                      {(detailData?.quote?.volume || stock.volume)?.toLocaleString() || '–'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Description & Profile */}
              {detailData?.profile?.description && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Business Overview
                    </h3>
                    {detailData.profile.website && (
                      <a
                        href={detailData.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        Official Website
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {detailData.profile.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AAOIFI SHARIAH COMPLIANCE DEEP AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-5">
              {loadingAudit ? (
                <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Fetching audited Shariah metrics...</span>
                </div>
              ) : (
                <>
                  {/* Status Verdict Header Card */}
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3.5 ${isCompliant
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : isDoubtful
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                      }`}
                  >
                    {isCompliant ? (
                      <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
                    ) : isDoubtful ? (
                      <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-sm text-slate-100 mb-0.5">
                        {auditData?.audit?.status === 'HALAL'
                          ? '100% Shariah Compliant Verdict'
                          : auditData?.audit?.status === 'DOUBTFUL'
                            ? 'Doubtful / Borderline Status'
                            : 'Non-Compliant with AAOIFI Standard'}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Methodology: <strong className="text-slate-100">{auditData?.audit?.methodology || 'AAOIFI Shariah Standard No. 21'}</strong>. Screened across core business operations, leverage ratios, and liquidity thresholds.
                      </p>
                    </div>
                  </div>

                  {/* 3 Core AAOIFI Screening Criteria Meters */}
                  <div className="space-y-3">
                    {/* Criterion 1: Business Activities */}
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-200">1. Core Business Activity Screening</span>
                        <span
                          className={`font-semibold px-2 py-0.2 rounded text-[11px] ${auditData?.audit?.is_sector_compliant !== false
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-rose-500/15 text-rose-400'
                            }`}
                        >
                          {auditData?.audit?.is_sector_compliant !== false ? 'PASSED (Permissible)' : 'FAILED (Impermissible)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Company derives primary revenue from ethical activities: {stock.sector} / {stock.industry}. Alcohol, gambling, weapons, conventional banking interest, and adult entertainment are absent.
                      </p>
                    </div>

                    {/* Criterion 2: Debt to Market Cap */}
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-200">2. Debt to Market Cap Ratio</span>
                        <span
                          className={`font-semibold tabular-nums ${debtRatioPct <= 33 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                        >
                          {debtRatioPct}% (AAOIFI Threshold: &le; 33%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden my-1.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${debtRatioPct <= 33 ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          style={{ width: `${Math.min(debtRatioPct, 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Total interest-bearing debt divided by market capitalization. Must not exceed 33% to prevent toxic leverage risk.
                      </p>
                    </div>

                    {/* Criterion 3: Cash & Interest Securities to Market Cap */}
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-200">3. Cash &amp; Liquid Interest Securities</span>
                        <span
                          className={`font-semibold tabular-nums ${cashRatioPct <= 33 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                        >
                          {cashRatioPct}% (AAOIFI Threshold: &le; 33%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden my-1.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${cashRatioPct <= 33 ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          style={{ width: `${Math.min(cashRatioPct, 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Cash plus interest-generating securities divided by market cap. Ratios over 33% violate the liquidity rule.
                      </p>
                    </div>
                  </div>

                  {/* Audit Findings Bullet Notes */}
                  {auditData?.audit?.notes && auditData.audit.notes.length > 0 && (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                        Audit Notes &amp; Findings
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                        {auditData.audit.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 3: FINANCIAL STATEMENTS */}
          {activeTab === 'financials' && (
            <div className="space-y-5">
              {/* Period Toggle Header */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Financial Statements &amp; Performance
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Balance sheet leverage, revenues, and free cash flows
                  </span>
                </div>

                <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
                  <button
                    onClick={() => setFinancialPeriod('ANNUAL')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${financialPeriod === 'ANNUAL'
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    Annual
                  </button>
                  <button
                    onClick={() => setFinancialPeriod('QUARTERLY')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${financialPeriod === 'QUARTERLY'
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    Quarterly
                  </button>
                </div>
              </div>

              {loadingFinancials ? (
                <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Loading financial statements...</span>
                </div>
              ) : financialsData?.snapshots && financialsData.snapshots.length > 0 ? (
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs divide-y divide-slate-800">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[11px]">
                      <tr>
                        <th className="px-4 py-2.5">Statement Metric</th>
                        {financialsData.snapshots.map((s) => (
                          <th key={s.id || s.fiscal_year} className="px-3 py-2.5 text-right whitespace-nowrap">
                            FY {s.fiscal_year}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {/* Income Statement */}
                      <tr className="bg-slate-900/60 font-semibold text-slate-300">
                        <td colSpan={financialsData.snapshots.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-sky-400">
                          Income Statement
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-300 font-medium">Total Revenue</td>
                        {financialsData.snapshots.map((s) => (
                          <td key={s.id} className="px-3 py-2 text-right tabular-nums text-slate-100 font-bold">
                            {formatMarketCap(s.income_statement?.revenue, stock.country)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-400">Operating Income (EBIT)</td>
                        {financialsData.snapshots.map((s) => (
                          <td key={s.id} className="px-3 py-2 text-right tabular-nums text-slate-300">
                            {formatMarketCap(s.income_statement?.operating_income, stock.country)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-300 font-medium">Net Income (Profit)</td>
                        {financialsData.snapshots.map((s) => (
                          <td key={s.id} className="px-3 py-2 text-right tabular-nums text-emerald-400 font-bold">
                            {formatMarketCap(s.income_statement?.net_income, stock.country)}
                          </td>
                        ))}
                      </tr>

                      {/* Balance Sheet */}
                      <tr className="bg-slate-900/60 font-semibold text-slate-300">
                        <td colSpan={financialsData.snapshots.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-sky-400">
                          Balance Sheet
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-300 font-medium">Total Assets</td>
                        {financialsData.snapshots.map((s) => (
                          <td key={s.id} className="px-3 py-2 text-right tabular-nums text-slate-100">
                            {formatMarketCap(s.balance_sheet?.total_assets, stock.country)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-400">Total Interest Debt</td>
                        {financialsData.snapshots.map((s) => (
                          <td key={s.id} className="px-3 py-2 text-right tabular-nums text-rose-400 font-semibold">
                            {formatMarketCap(s.balance_sheet?.total_debt, stock.country)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-400">Cash &amp; Equivalents</td>
                        {financialsData.snapshots.map((s) => (
                          <td key={s.id} className="px-3 py-2 text-right tabular-nums text-sky-400">
                            {formatMarketCap(s.balance_sheet?.cash_and_equivalents, stock.country)}
                          </td>
                        ))}
                      </tr>

                      {/* Cash Flow */}
                      <tr className="bg-slate-900/60 font-semibold text-slate-300">
                        <td colSpan={financialsData.snapshots.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-sky-400">
                          Cash Flow
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-300">Operating Cash Flow</td>
                        {financialsData.snapshots.map((s) => (
                          <td key={s.id} className="px-3 py-2 text-right tabular-nums text-slate-200">
                            {formatMarketCap(s.cash_flow?.operating_cash_flow, stock.country)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-slate-300 font-medium">Free Cash Flow</td>
                        {financialsData.snapshots.map((s) => (
                          <td key={s.id} className="px-3 py-2 text-right tabular-nums text-emerald-400 font-bold">
                            {formatMarketCap(s.cash_flow?.free_cash_flow, stock.country)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
                  Financial statements currently unavailable for this entity.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
