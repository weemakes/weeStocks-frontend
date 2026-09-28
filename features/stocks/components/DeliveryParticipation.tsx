'use client';

import { useMemo, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, ChartColumn, Table2, TrendingDown, TrendingUp } from 'lucide-react';
import type { StockMasterDetail } from '../types';
import { formatSafePct, formatSafeVolume } from '../utils/mappers';

type DeliveryRow = NonNullable<StockMasterDetail['delivery_conviction']>[number];

interface Props {
  rows: DeliveryRow[];
}

function dateLabel(value: string, includeYear = false) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', includeYear
    ? { day: '2-digit', month: 'short', year: 'numeric' }
    : { day: '2-digit', month: 'short' });
}

export default function DeliveryParticipation({ rows }: Props) {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const sessions = useMemo(() => [...rows]
    .filter((row) => row.date && row.delivery_percentage != null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-20)
    .map((row, index, all) => ({
      ...row,
      label: dateLabel(row.date),
      change: index === 0 ? null : Number(row.delivery_percentage) - Number(all[index - 1].delivery_percentage),
    })), [rows]);

  if (!sessions.length) return null;

  const latest = sessions.at(-1)!;
  const average = sessions.reduce((total, row) => total + Number(row.delivery_percentage || 0), 0) / sessions.length;
  const averageVolume = sessions.reduce((total, row) => total + Number(row.traded_quantity || 0), 0) / sessions.length;
  const highest = sessions.reduce((best, row) => Number(row.delivery_percentage) > Number(best.delivery_percentage) ? row : best, sessions[0]);
  const latestVsAverage = Number(latest.delivery_percentage) - average;
  const strengthening = latestVsAverage >= 0;

  return (
    <section id="delivery" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
            <BarChart3 className="h-4 w-4 text-sky-600" />
            Delivery participation
          </div>
          <p className="mt-1 text-[10px] text-slate-500">Traded volume and delivery percentage across the latest {sessions.length} sessions</p>
        </div>
        <div className="inline-flex w-fit rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-950">
          <button type="button" onClick={() => setView('chart')} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold ${view === 'chart' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500'}`}><ChartColumn className="h-3.5 w-3.5" />Chart</button>
          <button type="button" onClick={() => setView('table')} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold ${view === 'table' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500'}`}><Table2 className="h-3.5 w-3.5" />Table</button>
        </div>
      </div>

      <div className="mb-4 grid overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-950/30">
        <Metric label={`Average delivery (${sessions.length}D)`} value={formatSafePct(average, false)} note={`${formatSafePct(latestVsAverage)} latest vs average`} positive={strengthening} />
        <Metric label="Highest delivery" value={formatSafePct(highest.delivery_percentage, false)} note={`on ${dateLabel(highest.date)}`} />
        <Metric label={`Average volume (${sessions.length}D)`} value={formatSafeVolume(averageVolume)} note="Trading-session average" />
        <Metric label="Conviction trend" value={strengthening ? 'Strengthening' : 'Weakening'} note={`${formatSafePct(latestVsAverage)} latest reading`} positive={strengthening} icon={strengthening ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />} />
      </div>

      {view === 'chart' ? (
        <div className="h-[330px] w-full rounded-xl border border-slate-100 p-2 dark:border-slate-800 sm:p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sessions} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} interval={sessions.length > 12 ? 1 : 0} axisLine={false} tickLine={false} />
              <YAxis yAxisId="volume" tickFormatter={(value) => formatSafeVolume(value)} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
              <YAxis yAxisId="delivery" orientation="right" domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#cbd5e1', fontSize: 11 }} labelFormatter={(_, payload) => payload?.[0]?.payload?.date ? dateLabel(payload[0].payload.date, true) : ''} formatter={(value, name) => name === 'Delivery %' ? [formatSafePct(Number(value), false), name] : [formatSafeVolume(Number(value)), name]} />
              <Bar yAxisId="volume" dataKey="traded_quantity" name="Traded volume" fill="#bae6fd" stroke="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={44} />
              <Line yAxisId="delivery" type="monotone" dataKey="delivery_percentage" name="Delivery %" stroke="#10b981" strokeWidth={2.5} dot={{ r: 2.5, fill: '#10b981' }} activeDot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="max-h-[430px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[720px] text-[11px]">
            <thead className="sticky top-0 bg-slate-50 text-[9px] uppercase tracking-wide text-slate-400 dark:bg-slate-950"><tr><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-right">Traded volume</th><th className="px-4 py-3 text-right">Delivered quantity</th><th className="px-4 py-3 text-right">Delivery %</th><th className="px-4 py-3 text-right">Session change</th><th className="px-4 py-3 text-right">Conviction</th></tr></thead>
            <tbody>{[...sessions].reverse().map((row) => <tr key={row.date} className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-3 font-semibold">{dateLabel(row.date, true)}</td><td className="px-4 py-3 text-right tabular-nums">{formatSafeVolume(row.traded_quantity)}</td><td className="px-4 py-3 text-right tabular-nums">{formatSafeVolume(row.delivery_quantity)}</td><td className="px-4 py-3 text-right font-black tabular-nums">{formatSafePct(row.delivery_percentage, false)}</td><td className={`px-4 py-3 text-right font-bold tabular-nums ${row.change == null ? 'text-slate-400' : row.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{row.change == null ? '—' : formatSafePct(row.change)}</td><td className="px-4 py-3 text-right">{row.conviction || '—'}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value, note, positive, icon }: { label: string; value: string; note: string; positive?: boolean; icon?: React.ReactNode }) {
  return <div className="border-slate-200 px-4 py-3 not-last:border-b sm:nth-[odd]:border-r lg:border-b-0 lg:not-last:border-r dark:border-slate-800"><span className="block text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</span><strong className="mt-1 flex items-center gap-1.5 text-sm tabular-nums text-slate-900 dark:text-white">{icon}{value}</strong><span className={`mt-0.5 block text-[9px] ${positive == null ? 'text-slate-500' : positive ? 'text-emerald-600' : 'text-rose-600'}`}>{note}</span></div>;
}
