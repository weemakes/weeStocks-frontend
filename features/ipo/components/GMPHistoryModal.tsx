"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, History, Loader2, Table2, X } from "lucide-react";
import type { IPOGmpHistoryData, IPOGmpHistoryItem } from "../types";

type Range = "3d" | "7d" | "all";

interface GMPHistoryModalProps {
  slug: string;
  companyName: string;
  initialData?: IPOGmpHistoryData | null;
}

function formatSnapshotDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function TrendBadge({ item, previous }: { item: IPOGmpHistoryItem; previous?: IPOGmpHistoryItem }) {
  const trend = item.gmp_trend || (previous
    ? item.gmp_value > previous.gmp_value
      ? "up"
      : item.gmp_value < previous.gmp_value
      ? "down"
      : "flat"
    : "flat");

  if (trend === "up") {
    return <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"><ArrowUp className="h-3 w-3" />Up</span>;
  }
  if (trend === "down") {
    return <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"><ArrowDown className="h-3 w-3" />Down</span>;
  }
  return <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Flat</span>;
}

function HistoryChart({ history }: { history: IPOGmpHistoryItem[] }) {
  const width = 720;
  const height = 250;
  const paddingX = 44;
  const paddingY = 28;
  const values = history.map((item) => item.gmp_value);
  const minimum = Math.min(...values, 0);
  const maximum = Math.max(...values, 1);
  const spread = Math.max(1, maximum - minimum);
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;
  const points = history.map((item, index) => ({
    x: paddingX + (history.length === 1 ? usableWidth / 2 : (index / (history.length - 1)) * usableWidth),
    y: paddingY + ((maximum - item.gmp_value) / spread) * usableHeight,
    item,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${paddingX},${height - paddingY} ${line} ${width - paddingX},${height - paddingY}`;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/60">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 min-w-[620px] w-full" role="img" aria-label="Daily grey market premium history chart">
        <defs>
          <linearGradient id="gmp-history-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = paddingY + ratio * usableHeight;
          const value = maximum - ratio * spread;
          return (
            <g key={ratio}>
              <line x1={paddingX} x2={width - paddingX} y1={y} y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="4 4" />
              <text x={paddingX - 8} y={y + 4} textAnchor="end" className="fill-slate-500 text-[10px]">₹{Math.round(value)}</text>
            </g>
          );
        })}
        <polygon points={area} fill="url(#gmp-history-fill)" />
        <polyline points={line} fill="none" stroke="#10b981" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {points.map(({ x, y, item }, index) => (
          <g key={item.snapshot_date}>
            <circle cx={x} cy={y} r="4" fill="#10b981"><title>{`${formatSnapshotDate(item.snapshot_date)}: ₹${item.gmp_value}`}</title></circle>
            {(index === 0 || index === points.length - 1 || points.length <= 7) && (
              <text x={x} y={height - 8} textAnchor="middle" className="fill-slate-500 text-[10px]">{formatSnapshotDate(item.snapshot_date).replace(/ \d{4}$/, "")}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function GMPHistoryModal({ slug, companyName, initialData = null }: GMPHistoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<Range>("all");
  const [data, setData] = useState<IPOGmpHistoryData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const history = useMemo(() => {
    const all = [...(data?.history ?? [])].sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date));
    return range === "3d" ? all.slice(-3) : range === "7d" ? all.slice(-7) : all;
  }, [data, range]);

  const openHistory = async () => {
    setIsOpen(true);
    if (data || loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ipo/${encodeURIComponent(slug)}/gmp-history`);
      if (!response.ok) throw new Error("Unable to load GMP history");
      const payload = await response.json();
      if (!Array.isArray(payload.data?.history)) throw new Error("GMP history response is invalid");
      setData(payload.data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load GMP history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={openHistory} className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20">
        <History className="h-4 w-4" /> Comprehensive GMP History
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setIsOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="gmp-history-title" className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h2 id="gmp-history-title" className="font-bold text-slate-900 dark:text-slate-100">{companyName} IPO GMP History</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Daily backend snapshots; GMP is unofficial and can change rapidly.</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close GMP history" className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-5 p-4 md:p-5">
              {loading ? (
                <div className="flex min-h-72 items-center justify-center gap-2 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin" />Loading genuine GMP snapshots…</div>
              ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{error}</div>
              ) : history.length ? (
                <>
                  <section>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100"><History className="h-4 w-4 text-emerald-600" />Daily GMP trend</h3>
                      <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950">
                        {(["3d", "7d", "all"] as const).map((option) => (
                          <button key={option} type="button" onClick={() => setRange(option)} className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase ${range === option ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"}`}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <HistoryChart history={history} />
                  </section>

                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/60">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100"><Table2 className="h-4 w-4 text-emerald-600" />GMP entries</h3>
                      <span className="text-xs text-slate-500">{history.length} daily records</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[650px] text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400"><tr><th className="px-4 py-2.5">Date</th><th className="px-4 py-2.5 text-right">GMP</th><th className="px-4 py-2.5 text-right">Premium</th><th className="px-4 py-2.5 text-center">Subscription</th><th className="px-4 py-2.5 text-center">Trend</th></tr></thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {[...history].reverse().map((item, index, reversed) => (
                            <tr key={item.snapshot_date}>
                              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{formatSnapshotDate(item.snapshot_date)}</td>
                              <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{item.gmp_value > 0 ? "+" : ""}₹{item.gmp_value}</td>
                              <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.gmp_percentage == null ? "—" : `${item.gmp_percentage.toFixed(2)}%`}</td>
                              <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{item.subscription_display || "—"}</td>
                              <td className="px-4 py-3 text-center"><TrendBadge item={item} previous={reversed[index + 1]} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950">No GMP history has been recorded for this IPO yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

