'use client';

import React from 'react';
import { X, ShieldCheck, AlertTriangle, XCircle, Check, HelpCircle, ExternalLink, Calculator } from 'lucide-react';
import { StockItem } from '../types';

interface StockDetailModalProps {
  stock: StockItem | null;
  onClose: () => void;
}

export default function StockDetailModal({ stock, onClose }: StockDetailModalProps) {
  if (!stock) return null;

  const isCompliant = stock.complianceStatus === 'compliant';
  const isDoubtful = stock.complianceStatus === 'doubtful';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-950/95 backdrop-blur-md px-5 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-base text-sky-400">
              {stock.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">{stock.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {stock.exchange}
                </span>
                {stock.isNifty50 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-500/20 text-blue-400 rounded">
                    NIFTY 50
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{stock.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-sm">
          {/* Status Verdict Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isCompliant
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : isDoubtful
                ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
            }`}
          >
            {isCompliant ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : isDoubtful ? (
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm text-slate-100 mb-0.5">
                {isCompliant
                  ? '100% Shariah Compliant (AAOIFI Standard 21)'
                  : isDoubtful
                  ? 'Borderline / Under Active Review'
                  : 'Non-Compliant Equity'}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{stock.statusReason}</p>
            </div>
          </div>

          {/* Core Financial Snapshot */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Financial Health & Market Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-500 block">Price (CMP)</span>
                <span className="text-base font-bold text-slate-100 tabular-nums">
                  ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`text-[11px] font-semibold tabular-nums block ${
                    stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {stock.changePercent >= 0 ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-500 block">Market Cap</span>
                <span className="text-base font-bold text-slate-100 tabular-nums">
                  ₹{(stock.marketCapCr / 1000).toFixed(1)}k Cr
                </span>
                <span className="text-[11px] text-slate-400 block">{stock.marketCapCategory}</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-500 block">Valuation (P/E)</span>
                <span className="text-base font-bold text-slate-100 tabular-nums">
                  {stock.fundamentals.peRatio.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  P/B: {stock.fundamentals.pbRatio.toFixed(1)}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-500 block">Profitability (ROE)</span>
                <span className="text-base font-bold text-slate-100 tabular-nums">
                  {stock.fundamentals.roePercent.toFixed(1)}%
                </span>
                <span className="text-[11px] text-slate-400 block">
                  ROCE: {stock.fundamentals.rocePercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Shariah Screening Criteria */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              AAOIFI Shariah Screening Audit
            </h3>
            <div className="bg-slate-950/80 rounded-xl border border-slate-800 divide-y divide-slate-800/80">
              {/* Criterion 1: Business Activity */}
              <div className="p-3.5 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    1. Primary Business Activity
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Sector: {stock.sector} &bull; Industry: {stock.industry}
                  </p>
                  {stock.shariah.nonHalalRevenueSource && (
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      Impermissible revenue source: {stock.shariah.nonHalalRevenueSource}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                      stock.shariah.businessActivityStatus === 'pass'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {stock.shariah.businessActivityStatus === 'pass' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {stock.shariah.nonHalalRevenuePercent.toFixed(2)}% (Max 5%)
                  </span>
                </div>
              </div>

              {/* Criterion 2: Interest Debt */}
              <div className="p-3.5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    2. Interest-Bearing Debt / Market Cap
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Total interest-bearing debt must not exceed 33% of 36-month average market capitalization.
                  </p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        stock.shariah.debtRatioPercent > 33
                          ? 'bg-rose-500'
                          : stock.shariah.debtRatioPercent > 25
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{
                        width: `${Math.min(100, (stock.shariah.debtRatioPercent / 33) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                      stock.shariah.debtRatioPercent <= 33
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {stock.shariah.debtRatioPercent <= 33 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {stock.shariah.debtRatioPercent.toFixed(1)}% (Max 33%)
                  </span>
                </div>
              </div>

              {/* Criterion 3: Cash & Liquid Securities */}
              <div className="p-3.5 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    3. Interest-Bearing Cash & Investments
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Cash & interest-bearing securities must not exceed 33% of market capitalization.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                      stock.shariah.cashAndSecuritiesRatioPercent <= 33
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {stock.shariah.cashAndSecuritiesRatioPercent <= 33 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {stock.shariah.cashAndSecuritiesRatioPercent.toFixed(1)}% (Max 33%)
                  </span>
                </div>
              </div>

              {/* Criterion 4: Dividend Purification */}
              <div className="p-3.5 flex items-start justify-between gap-4 bg-slate-900/40">
                <div className="flex items-start gap-2">
                  <Calculator className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-200 text-xs">
                      Dividend Purification Rate
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      For every ₹1,000 received in dividends, donate approximately{' '}
                      <strong className="text-sky-300">
                        ₹{(10 * stock.shariah.purificationPercent).toFixed(2)}
                      </strong>{' '}
                      to charity to purify the impermissible interest component.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                    {stock.shariah.purificationPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 52-Week Range & Free Cash Flow */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span>52W Range: </span>
              <strong className="text-slate-200 tabular-nums">
                ₹{stock.fundamentals.week52Low.toFixed(0)} - ₹{stock.fundamentals.week52High.toFixed(0)}
              </strong>
            </div>
            <div>
              <span>Free Cash Flow: </span>
              <strong className="text-emerald-400 tabular-nums">
                ₹{stock.fundamentals.freeCashFlowCr.toLocaleString('en-IN')} Cr
              </strong>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Audit Source: AAOIFI Standard 21 &bull; Updated: {stock.lastUpdated}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
