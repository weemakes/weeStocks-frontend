import { Flame, Star } from "lucide-react";
import type { IPOGmpHistoryData, IPOGmpHistoryItem } from "../types";
import { GMPDisclaimer } from "./GMPDisclaimer";
import { GMPHistoryModal } from "./GMPHistoryModal";
import { getEstimatedProfit, getGMPMovement } from "./gmpHistoryUtils";

function formatDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function Movement({ item, older }: { item: IPOGmpHistoryItem; older?: IPOGmpHistoryItem }) {
  const movement = getGMPMovement(item, older);
  const style = movement === 'up' ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30' : movement === 'down' ? 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-500/30' : 'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700';
  return <span className={`inline-flex rounded-full border px-2 py-0.5 font-semibold ${style}`}>{movement === 'up' ? '↑ Up' : movement === 'down' ? '↓ Down' : 'Flat'}</span>;
}

export function GMPHistorySection({ slug, companyName, rating, data, lotSize }: { slug: string; companyName: string; rating: number; data: IPOGmpHistoryData | null; lotSize?: number | null }) {
  const recent = [...(data?.history ?? [])].sort((a, b) => b.snapshot_date.localeCompare(a.snapshot_date)).slice(0, 7);

  return (
    <section id="market-data" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-lg md:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500 dark:text-amber-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{companyName} IPO GMP History</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Genuine daily snapshots retained by the WeeStox backend</span>
          </div>
        </div>
        <span className="hidden items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300 sm:flex">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />{rating}/5 Rating
        </span>
      </div>

      <GMPDisclaimer className="mb-4 border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60" />

      {recent.length ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr><th className="px-4 py-2.5">GMP date</th><th className="px-4 py-2.5 text-right">IPO price</th><th className="px-4 py-2.5 text-right">GMP</th><th className="px-4 py-2.5 text-right">Premium</th><th className="px-4 py-2.5 text-right">Est. profit / lot</th><th className="px-4 py-2.5 text-center">Subscription</th><th className="px-4 py-2.5 text-center">Movement</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recent.map((item, index) => (
                <tr key={item.snapshot_date} className={index === 0 ? "bg-emerald-50/40 dark:bg-emerald-500/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"}>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{formatDate(item.snapshot_date)}</td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{data?.price_band_upper == null ? "—" : `₹${data.price_band_upper}`}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{item.gmp_value > 0 ? "+" : ""}₹{item.gmp_value}</td>
                  <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.gmp_percentage == null ? "—" : `${item.gmp_percentage.toFixed(2)}%`}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-700 dark:text-slate-200">{getEstimatedProfit(item.gmp_value, lotSize) == null ? "—" : `${getEstimatedProfit(item.gmp_value, lotSize)! >= 0 ? '+' : ''}₹${getEstimatedProfit(item.gmp_value, lotSize)!.toLocaleString('en-IN')}`}</td>
                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{item.subscription_display || "—"}</td>
                  <td className="px-4 py-3 text-center"><Movement item={item} older={recent[index + 1]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/60">No GMP history has been recorded for this IPO yet.</div>
      )}

      <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-950/60">
        <div><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Explore the complete GMP movement</p><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Open the chart and all available daily records.</p></div>
        <GMPHistoryModal slug={slug} companyName={companyName} initialData={data} lotSize={lotSize} />
      </div>
    </section>
  );
}
