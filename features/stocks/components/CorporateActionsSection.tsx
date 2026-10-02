'use client';

import { useMemo, useState } from 'react';
import { CalendarCheck2, Gift, Landmark, Scissors, TicketCheck, WalletCards } from 'lucide-react';
import type { StockCorporateAction } from '../types';
import { formatSafePrice } from '../utils/mappers';

type Filter = 'ALL' | 'DIVIDEND' | 'BONUS' | 'SPLIT' | 'RIGHTS' | 'OTHER';

function formatDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function actionName(action: StockCorporateAction) {
  const type = String(action.action_type || action.type || 'OTHER').toUpperCase();
  if (type === 'DIVIDEND') return 'Dividend';
  if (type === 'BONUS') return 'Bonus issue';
  if (type === 'SPLIT') return 'Stock split';
  if (type === 'RIGHTS') return 'Rights issue';
  return action.details || action.notes || 'Other corporate action';
}

function actionMeta(type: string) {
  if (type === 'DIVIDEND') return { icon: <WalletCards className="h-4 w-4" />, tone: 'border-amber-300 bg-amber-100 text-amber-600 dark:border-amber-800 dark:bg-amber-950' };
  if (type === 'BONUS') return { icon: <Gift className="h-4 w-4" />, tone: 'border-violet-300 bg-violet-100 text-violet-600 dark:border-violet-800 dark:bg-violet-950' };
  if (type === 'SPLIT') return { icon: <Scissors className="h-4 w-4" />, tone: 'border-sky-300 bg-sky-100 text-sky-600 dark:border-sky-800 dark:bg-sky-950' };
  if (type === 'RIGHTS') return { icon: <TicketCheck className="h-4 w-4" />, tone: 'border-emerald-300 bg-emerald-100 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950' };
  return { icon: <Landmark className="h-4 w-4" />, tone: 'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300' };
}

function actionInformation(action: StockCorporateAction, currency: string) {
  const type = String(action.action_type || action.type || 'OTHER').toUpperCase();
  if (type === 'DIVIDEND' && action.dividend_amount != null) return `${formatSafePrice(action.dividend_amount, currency)} / share`;
  if (type === 'BONUS' && action.bonus_ratio) return `${action.bonus_ratio} bonus ratio`;
  if (type === 'SPLIT' && action.split_ratio) return `${action.split_ratio} split ratio`;
  return action.notes || action.details || '—';
}

export default function CorporateActionsSection({ actions, currency }: { actions: StockCorporateAction[]; currency: string }) {
  const [filter, setFilter] = useState<Filter>('ALL');
  const sorted = useMemo(() => [...actions].sort((a, b) => String(b.record_date || b.ex_date || b.announcement_date || '').localeCompare(String(a.record_date || a.ex_date || a.announcement_date || ''))), [actions]);
  const visible = filter === 'ALL' ? sorted : sorted.filter((action) => {
    const type = String(action.action_type || action.type || 'OTHER').toUpperCase();
    return filter === 'OTHER' ? !['DIVIDEND', 'BONUS', 'SPLIT', 'RIGHTS'].includes(type) : type === filter;
  });
  const availableTypes = new Set(sorted.map((action) => String(action.action_type || action.type || 'OTHER').toUpperCase()));
  const filters: Filter[] = ['ALL', 'DIVIDEND', 'BONUS', 'SPLIT', 'RIGHTS', 'OTHER'];
  const shownFilters = filters.filter((item) => item === 'ALL' || (item === 'OTHER' ? [...availableTypes].some((type) => !['DIVIDEND', 'BONUS', 'SPLIT', 'RIGHTS'].includes(type)) : availableTypes.has(item)));

  return <section id="actions" className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div><div className="flex items-center gap-2 text-sm font-black"><CalendarCheck2 className="h-4 w-4 text-sky-600" />Corporate Action</div><p className="mt-1 text-[10px] text-slate-500">Complete dividend, bonus, split, rights and other action history</p></div>
      {shownFilters.length > 2 && <div className="flex flex-wrap rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-950">{shownFilters.map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`rounded-md px-2.5 py-1 text-[9px] font-bold transition-colors ${filter === item ? 'bg-sky-600 text-white' : 'text-slate-500 hover:bg-white hover:text-sky-600 dark:hover:bg-slate-800'}`}>{item === 'ALL' ? 'All' : item.charAt(0) + item.slice(1).toLowerCase()}</button>)}</div>}
    </div>
    <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-800"><table className="w-full min-w-[860px] text-[11px]"><thead className="bg-slate-50 text-left text-[9px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-950"><tr><th className="px-5 py-3">Record date</th><th className="px-5 py-3">Corporate action</th><th className="px-5 py-3">Information</th><th className="px-5 py-3">Announcement date</th><th className="px-5 py-3">Ex-date</th></tr></thead><tbody>{visible.map((action, index) => { const type = String(action.action_type || action.type || 'OTHER').toUpperCase(); const meta = actionMeta(type); return <tr key={action.id || `${type}-${action.ex_date}-${index}`} className="border-t border-slate-100 transition-colors hover:bg-sky-50/60 dark:border-slate-800 dark:hover:bg-sky-950/20"><td className="px-5 py-3.5 font-medium tabular-nums text-slate-700 dark:text-slate-200">{formatDate(action.record_date)}</td><td className="px-5 py-3.5"><span className="inline-flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"><i className={`flex h-8 w-8 items-center justify-center rounded-full border ${meta.tone}`}>{meta.icon}</i>{actionName(action)}</span></td><td className="max-w-sm px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-200">{actionInformation(action, currency)}</td><td className="px-5 py-3.5 tabular-nums text-slate-600 dark:text-slate-300">{formatDate(action.announcement_date)}</td><td className="px-5 py-3.5 font-medium tabular-nums text-slate-700 dark:text-slate-200">{formatDate(action.ex_date)}</td></tr>; })}</tbody></table>{!visible.length && <p className="p-8 text-center text-xs text-slate-500">No {filter.toLowerCase()} actions are available.</p>}</div>
  </section>;
}
