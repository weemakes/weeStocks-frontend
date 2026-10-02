'use client';

import { ArrowDown, ArrowUp, ChevronRight, Users } from 'lucide-react';
import type { StockPeer } from '../types';
import CompanyLogo from './CompanyLogo';

function number(value?: number | null, digits = 2) {
  return value == null || !Number.isFinite(value) ? '—' : value.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function crore(value?: number | null) {
  if (value == null || !Number.isFinite(value)) return '—';
  const absolute = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (absolute >= 100000) return `${sign}₹${(absolute / 100000).toFixed(2)}L`;
  return `${sign}₹${absolute.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Growth({ value }: { value?: number | null }) {
  if (value == null || !Number.isFinite(value)) return <span className="text-slate-400">—</span>;
  if (value === 0) return <span className="font-semibold text-slate-500">Flat</span>;
  const positive = value > 0;
  return <span className={`inline-flex items-center justify-end gap-1 font-bold tabular-nums ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>{positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{positive ? '+' : ''}{number(value)}%</span>;
}

export default function PeerComparison({ peers, onSelect }: { peers: StockPeer[]; onSelect?: (symbol: string) => void }) {
  return <section id="peers" className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-start justify-between gap-3 px-4 py-4 sm:px-5"><div><div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white"><Users className="h-4 w-4 text-sky-600" />Peer comparison</div><p className="mt-1 text-[10px] text-slate-500">Compare valuation, latest quarterly performance and year-on-year growth</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500 dark:bg-slate-800">{peers.length} companies</span></div>
    <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-800"><table className="w-full min-w-[1260px] text-[10px]"><thead className="bg-slate-50 text-left text-[8px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-950"><tr><th className="sticky left-0 z-20 min-w-[290px] bg-inherit px-4 py-3">Company name</th><th className="px-3 py-3 text-right">Market cap <span className="text-slate-400">₹ Cr</span></th><th className="px-3 py-3 text-right">P/E ratio</th><th className="px-3 py-3 text-right">Dividend yield %</th><th className="px-3 py-3 text-right">Quarterly sales <span className="text-slate-400">₹ Cr</span></th><th className="px-3 py-3 text-right">Profit after tax <span className="text-slate-400">₹ Cr</span></th><th className="px-3 py-3 text-right">Sales growth %</th><th className="px-4 py-3 text-right">Profit growth %</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{peers.map((peer) => <tr key={peer.id || peer.symbol} className={`transition-colors ${peer.is_current ? 'bg-emerald-50/80 dark:bg-emerald-950/20' : 'hover:bg-sky-50/60 dark:hover:bg-sky-950/20'}`}><td className={`sticky left-0 z-10 px-4 py-3 ${peer.is_current ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-white dark:bg-slate-900'}`}><div className="flex items-center gap-2.5"><CompanyLogo src={peer.logo_url} symbol={peer.symbol} name={peer.company_name} size="sm" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><strong className="truncate text-[11px] text-slate-900 dark:text-white">{peer.company_name}</strong><span className="shrink-0 text-[8px] font-semibold text-slate-400">{peer.symbol}</span></div>{peer.is_current ? <span className="mt-0.5 block text-[8px] font-black uppercase tracking-wider text-emerald-600">Current stock</span> : <button type="button" onClick={() => onSelect?.(peer.symbol)} className="mt-0.5 inline-flex items-center gap-0.5 text-[8px] font-bold text-sky-600 hover:text-sky-700">Open analysis <ChevronRight className="h-2.5 w-2.5" /></button>}</div></div></td><td className="px-3 py-3 text-right font-semibold tabular-nums" title={peer.market_cap_cr == null ? undefined : `₹${number(peer.market_cap_cr)} Cr`}>{crore(peer.market_cap_cr)}</td><td className="px-3 py-3 text-right tabular-nums">{number(peer.pe_ratio)}</td><td className="px-3 py-3 text-right tabular-nums">{peer.dividend_yield == null ? '—' : `${number(peer.dividend_yield)}%`}</td><td className="px-3 py-3 text-right font-semibold tabular-nums" title={peer.quarterly_sales_cr == null ? undefined : `₹${number(peer.quarterly_sales_cr)} Cr`}>{crore(peer.quarterly_sales_cr)}</td><td className={`px-3 py-3 text-right font-semibold tabular-nums ${Number(peer.profit_after_tax_cr) < 0 ? 'text-rose-600' : ''}`} title={peer.profit_after_tax_cr == null ? undefined : `₹${number(peer.profit_after_tax_cr)} Cr`}>{crore(peer.profit_after_tax_cr)}</td><td className="px-3 py-3 text-right"><Growth value={peer.sales_growth_pct} /></td><td className="px-4 py-3 text-right"><Growth value={peer.profit_growth_pct} /></td></tr>)}</tbody></table></div>
  </section>;
}
