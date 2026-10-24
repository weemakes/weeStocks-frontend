'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IPOSubscriptionCategory, IPOSubscriptionSummary } from '../types';
import { TrendingUp, Layers, PieChart, Calendar, Coins, Clock, ArrowUpRight, CheckCircle2, Flame, RefreshCw } from 'lucide-react';

interface SubscriptionTabsSectionProps {
  companyName: string;
  slug?: string;
  ipoId?: number | string;
  subscriptions?: IPOSubscriptionCategory[];
  subscriptionSummary?: IPOSubscriptionSummary | null;
  overallTimes?: number | null;
  overallDisplay?: string | null;
  fundingInterestCost?: Record<string, number> | null;
}

interface SanitizedShareItem {
  category: string;
  offered: number | null;
  applied: number | null;
  times: number;
  isTotal: boolean;
  isSubCategory: boolean;
}

export function SubscriptionTabsSection({
  companyName,
  slug,
  ipoId,
  subscriptions = [],
  subscriptionSummary,
  overallTimes,
  overallDisplay,
  fundingInterestCost,
}: SubscriptionTabsSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'shares' | 'demand' | 'applications' | 'daywise' | 'funding'>('shares');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSync = async () => {
    const target = slug || (ipoId ? String(ipoId) : null);
    if (!target || isSyncing) return;
    setIsSyncing(true);
    setSyncFeedback('Syncing...');
    try {
      const res = await fetch(`/api/ipo/${encodeURIComponent(target)}/enrich`, { method: 'POST' });
      const json = await res.json();
      if (json.status === 1) {
        setSyncFeedback('Updated!');
        router.refresh();
      } else {
        setSyncFeedback('Synced');
      }
    } catch {
      setSyncFeedback('Retry');
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setSyncFeedback(null);
      }, 2500);
    }
  };

  // 1. Sanitize "By Shares" data to eliminate duplicate rows, duplicate totals, and leaked ₹ Cr institutional rows
  const sanitizedShares = useMemo<SanitizedShareItem[]>(() => {
    const rawItems = subscriptionSummary?.by_shares || [];

    if (rawItems.length > 0) {
      const result: SanitizedShareItem[] = [];
      const seenCategories = new Set<string>();

      for (const item of rawItems) {
        const cat = item.category?.trim() || '';
        const lowerCat = cat.toLowerCase();

        // Institutional sub-categories (FIIs, DIIs, Mutual funds, Others) belong to the Demand tab, not Shares
        if (['fiis', 'diis', 'mutual funds', 'others'].includes(lowerCat)) {
          continue;
        }

        const isTotal = lowerCat.includes('total');

        // Prevent duplicate categories
        if (seenCategories.has(cat)) {
          // If we encounter a second Total or repeat category, the array has a duplicate batch; stop or skip
          if (isTotal) break;
          continue;
        }
        seenCategories.add(cat);

        const isSubCategory = cat.startsWith('HNIs ') || cat.startsWith('↳') || lowerCat.includes('bnii') || lowerCat.includes('snii');

        result.push({
          category: cat.replace(/^↳\s*/, ''),
          offered: item.offered ?? null,
          applied: item.applied ?? null,
          times: Number(item.times ?? 0),
          isTotal,
          isSubCategory,
        });

        // Once the first genuine Total row is processed, stop to avoid duplicate appended tables
        if (isTotal) break;
      }

      if (result.length > 0) return result;
    }

    // Fallback from subscriptions array if by_shares is empty
    const fallbackList = subscriptions
      .filter((s) => !s.sub_type || s.sub_type === 'shares')
      .filter((s, idx, arr) => arr.findIndex((t) => t.category === s.category) === idx);

    return fallbackList.map((sub) => {
      const isTotal = sub.category.toLowerCase().includes('total');
      const isSubCategory = sub.category.startsWith('HNIs ') || sub.category.startsWith('↳');
      return {
        category: sub.category.replace(/^↳\s*/, ''),
        offered: sub.shares_offered ?? null,
        applied: sub.shares_applied ?? null,
        times: Number(sub.subscription_times ?? 0),
        isTotal,
        isSubCategory,
      };
    });
  }, [subscriptionSummary?.by_shares, subscriptions]);

  // 2. Sanitize "Demand in ₹ Cr" data
  const sanitizedDemand = useMemo(() => {
    const rawDemand = subscriptionSummary?.by_demand_cr || [];
    if (rawDemand.length > 0) {
      // Deduplicate by category
      const seen = new Set<string>();
      return rawDemand.filter((item) => {
        const cat = item.category?.trim();
        if (!cat || seen.has(cat)) return false;
        seen.add(cat);
        return true;
      });
    }

    // If by_demand_cr was not directly provided, check if institutional rows leaked into by_shares
    const leakedInstitutional = (subscriptionSummary?.by_shares || []).filter((item) =>
      ['FIIs', 'DIIs', 'Mutual funds', 'Others'].includes(item.category?.trim())
    );

    if (leakedInstitutional.length > 0) {
      return leakedInstitutional.map((item) => ({
        category: item.category,
        offered_cr: item.offered,
        applied_cr: item.applied,
        times: item.times,
      }));
    }

    return [];
  }, [subscriptionSummary?.by_demand_cr, subscriptionSummary?.by_shares]);

  const hasDemand = sanitizedDemand.length > 0;
  const hasApplications = Boolean(subscriptionSummary?.by_applications && subscriptionSummary.by_applications.length > 0);
  const hasDayWise = Boolean(subscriptionSummary?.day_wise && subscriptionSummary.day_wise.length > 0);
  const fundingCosts = fundingInterestCost || subscriptionSummary?.funding_interest_cost;
  const hasFunding = Boolean(fundingCosts && Object.keys(fundingCosts).length > 0);

  const totalRow = sanitizedShares.find((s) => s.isTotal);
  const numericTotalTimes = totalRow?.times != null && totalRow.times > 0 ? totalRow.times : (overallTimes ?? 0);
  const displayTimes = totalRow?.times != null && totalRow.times > 0
    ? `${totalRow.times.toFixed(2)}x`
    : (overallDisplay || (overallTimes ? `${overallTimes}x` : '–'));

  return (
    <section id="subscription" className="scroll-mt-28 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-lg">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/15 border border-sky-200/80 dark:border-sky-500/30">
            <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{companyName} IPO Live Subscription Status</h2>
              {numericTotalTimes >= 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Fully Subscribed
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Live bidding demand breakdown across QIB, HNI/NII, Retail, and Employee quotas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-center">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs shadow-2xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Overall Demand:</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-sm tabular-nums flex items-center gap-1">
              {displayTimes}
              {numericTotalTimes >= 3 && <Flame className="w-3.5 h-3.5 text-amber-500 inline fill-amber-500" />}
            </span>
          </div>

          {subscriptionSummary?.last_updated_at && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <Clock className="w-3 h-3 text-sky-500" />
              <span>Updated: {new Date(subscriptionSummary.last_updated_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}

          {(slug || ipoId) && (
            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              title="Trigger deep enrichment for latest live bidding quotas"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-600 dark:text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{syncFeedback || 'Sync Live Bids'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Segmented Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 overflow-x-auto no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('shares')}
          className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'shares'
              ? 'bg-sky-500 text-white shadow-xs font-bold'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>By Shares</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 dark:bg-white/10">
            {sanitizedShares.filter((s) => !s.isTotal).length}
          </span>
        </button>

        {hasDemand && (
          <button
            type="button"
            onClick={() => setActiveTab('demand')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'demand'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Demand in ₹ Cr (FII / DII)</span>
          </button>
        )}

        {hasApplications && (
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-purple-600 text-white shadow-xs font-bold'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>By Applications (Lottery Odds)</span>
          </button>
        )}

        {hasDayWise && (
          <button
            type="button"
            onClick={() => setActiveTab('daywise')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'daywise'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Day-wise Demand Progress</span>
          </button>
        )}

        {hasFunding && (
          <button
            type="button"
            onClick={() => setActiveTab('funding')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'funding'
                ? 'bg-cyan-600 text-white shadow-xs font-bold'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>HNI Funding Cost</span>
          </button>
        )}
      </div>

      {/* TAB 1: By Shares */}
      {activeTab === 'shares' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[700px] text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-1/3 min-w-[180px]">Investor Category</th>
                <th className="py-3 px-4 text-right min-w-[130px]">Shares Offered</th>
                <th className="py-3 px-4 text-right min-w-[130px]">Shares Bidded</th>
                <th className="py-3 px-4 text-right min-w-[120px]">Subscription (Times)</th>
                <th className="py-3 px-4 text-right min-w-[140px] hidden md:table-cell">Demand Gauge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
              {sanitizedShares.map((item, idx) => {
                const times = item.times;
                const gaugeWidth = Math.min(100, Math.max(times > 0 ? 6 : 0, times * 20));

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      item.isTotal
                        ? 'bg-slate-100/90 dark:bg-slate-950 font-bold border-t-2 border-slate-300 dark:border-slate-700'
                        : item.isSubCategory
                        ? 'bg-slate-50/60 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <td className={`py-2.5 px-4 font-semibold ${item.isSubCategory ? 'pl-8' : ''}`}>
                      <div className="flex items-center gap-1.5">
                        {item.isSubCategory && (
                          <span className="text-slate-400 dark:text-slate-500 font-normal">↳</span>
                        )}
                        <span className={item.isTotal ? 'text-slate-950 dark:text-white font-extrabold text-[13px]' : ''}>
                          {item.category}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {item.offered != null && item.offered > 0 ? item.offered.toLocaleString('en-IN') : '–'}
                    </td>

                    <td className={`py-2.5 px-4 text-right tabular-nums font-semibold ${item.isTotal ? 'text-slate-950 dark:text-white' : 'text-slate-900 dark:text-slate-200'}`}>
                      {item.applied != null && item.applied > 0 ? item.applied.toLocaleString('en-IN') : '–'}
                    </td>

                    <td className={`py-2.5 px-4 text-right tabular-nums font-extrabold ${
                      item.isTotal
                        ? 'text-sky-600 dark:text-sky-400 text-sm'
                        : times >= 3
                        ? 'text-purple-600 dark:text-purple-400'
                        : times >= 1
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {times.toFixed(2)}x
                    </td>

                    <td className="py-2.5 px-4 text-right hidden md:table-cell">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              times >= 10
                                ? 'bg-purple-600'
                                : times >= 3
                                ? 'bg-emerald-500'
                                : times >= 1
                                ? 'bg-sky-500'
                                : times > 0
                                ? 'bg-amber-500'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${gaugeWidth}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums w-8 text-right">
                          {times >= 1 ? `${Math.round(times * 100)}%` : `${Math.round(times * 100)}%`}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: By Demand in ₹ Cr */}
      {activeTab === 'demand' && hasDemand && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[650px] text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Investor Group</th>
                <th className="py-3 px-4 text-right">Offered (₹ Cr)</th>
                <th className="py-3 px-4 text-right">Demand Applied (₹ Cr)</th>
                <th className="py-3 px-4 text-right">Times (x)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
              {sanitizedDemand.map((item, idx) => {
                const isTotal = item.category?.toLowerCase().includes('total');
                const isInstitutionalSub = ['FIIs', 'DIIs', 'Mutual funds', 'Others'].includes(item.category);
                return (
                  <tr
                    key={idx}
                    className={`${
                      isTotal
                        ? 'bg-slate-100/90 dark:bg-slate-950 font-bold border-t-2 border-slate-300 dark:border-slate-700'
                        : isInstitutionalSub
                        ? 'bg-slate-50/50 dark:bg-slate-950/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    } transition-colors`}
                  >
                    <td className={`py-2.5 px-4 text-slate-800 dark:text-slate-200 font-semibold ${isInstitutionalSub ? 'pl-8 text-sky-600 dark:text-sky-300' : ''}`}>
                      {isInstitutionalSub ? `↳ ${item.category}` : item.category}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-500 dark:text-slate-400">
                      {item.offered_cr != null && item.offered_cr > 0 ? `₹${item.offered_cr.toFixed(2)} Cr` : '–'}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">
                      {item.applied_cr != null && item.applied_cr > 0 ? `₹${item.applied_cr.toFixed(2)} Cr` : '–'}
                    </td>
                    <td className={`py-2.5 px-4 text-right tabular-nums font-extrabold ${isTotal ? 'text-sky-600 dark:text-sky-400 text-sm' : 'text-slate-900 dark:text-slate-100'}`}>
                      {item.times != null && item.times > 0 ? `${item.times.toFixed(2)}x` : '–'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: By Applications (Allotment Odds) */}
      {activeTab === 'applications' && hasApplications && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[650px] text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Application Category</th>
                <th className="py-3 px-4 text-right">Applications Reserved</th>
                <th className="py-3 px-4 text-right">Applications Applied</th>
                <th className="py-3 px-4 text-right">Application Demand (Times)</th>
                <th className="py-3 px-4 text-center">Estimated Allotment Chance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
              {subscriptionSummary!.by_applications!.map((item, idx) => {
                const times = item.times ?? 0;
                const oddsText = times > 1 ? `1 in ${Math.round(times)} applicants` : '100% (All receive)';
                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">{item.category}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {item.reserved != null ? item.reserved.toLocaleString('en-IN') : '–'}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-purple-700 dark:text-purple-300 font-bold">
                      {item.applied != null ? item.applied.toLocaleString('en-IN') : '–'}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-sky-600 dark:text-sky-400 font-extrabold">
                      {item.times != null ? `${item.times.toFixed(2)}x` : '–'}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                        times <= 1
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                          : times <= 5
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                      }`}>
                        {oddsText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: Day-wise Progress */}
      {activeTab === 'daywise' && hasDayWise && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[650px] text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Day 1</th>
                <th className="py-3 px-4 text-center">Day 2</th>
                <th className="py-3 px-4 text-center">Day 3 (Final)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
              {subscriptionSummary!.day_wise!.map((item: any, idx: number) => {
                const isTotal = item.category?.toLowerCase().includes('total');
                return (
                  <tr
                    key={idx}
                    className={`${isTotal ? 'bg-slate-100/90 dark:bg-slate-950 font-bold text-sky-600 dark:text-sky-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'} transition-colors`}
                  >
                    <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">{item.category}</td>
                    <td className="py-2.5 px-4 text-center tabular-nums font-bold text-slate-700 dark:text-slate-300">
                      {item.day_1 != null ? `${Number(item.day_1).toFixed(2)}x` : '–'}
                    </td>
                    <td className="py-2.5 px-4 text-center tabular-nums font-bold text-slate-800 dark:text-slate-200">
                      {item.day_2 != null ? `${Number(item.day_2).toFixed(2)}x` : '–'}
                    </td>
                    <td className="py-2.5 px-4 text-center tabular-nums font-bold text-amber-600 dark:text-amber-400">
                      {item.day_3 != null ? `${Number(item.day_3).toFixed(2)}x` : '–'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: HNI Funding Interest Cost */}
      {activeTab === 'funding' && hasFunding && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Estimated per-share cost of funding for High Net-worth Individuals (HNIs) applying through leverage at various interest rates.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(fundingCosts!).map(([rate, cost]) => (
              <div key={rate} className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-center shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Interest @ {rate}</span>
                <span className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 tabular-nums">
                  ₹{typeof cost === 'number' ? cost.toFixed(2) : cost}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">per share cost</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
