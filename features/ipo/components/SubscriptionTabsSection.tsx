'use client';

import { useState } from 'react';
import { IPOSubscriptionCategory, IPOSubscriptionSummary } from '../types';
import { TrendingUp, Layers, PieChart, Calendar, Coins, Clock, ArrowUpRight } from 'lucide-react';

interface SubscriptionTabsSectionProps {
  companyName: string;
  subscriptions?: IPOSubscriptionCategory[];
  subscriptionSummary?: IPOSubscriptionSummary | null;
  overallTimes?: number | null;
  overallDisplay?: string | null;
  fundingInterestCost?: Record<string, number> | null;
}

export function SubscriptionTabsSection({
  companyName,
  subscriptions = [],
  subscriptionSummary,
  overallTimes,
  overallDisplay,
  fundingInterestCost,
}: SubscriptionTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<'shares' | 'demand' | 'applications' | 'daywise' | 'funding'>('shares');

  const hasSummaryShares = Boolean(subscriptionSummary?.by_shares && subscriptionSummary.by_shares.length > 0);
  const hasDemand = Boolean(subscriptionSummary?.by_demand_cr && subscriptionSummary.by_demand_cr.length > 0);
  const hasApplications = Boolean(subscriptionSummary?.by_applications && subscriptionSummary.by_applications.length > 0);
  const hasDayWise = Boolean(subscriptionSummary?.day_wise && subscriptionSummary.day_wise.length > 0);
  const fundingCosts = fundingInterestCost || subscriptionSummary?.funding_interest_cost;
  const hasFunding = Boolean(fundingCosts && Object.keys(fundingCosts).length > 0);

  // Fallback unique subscriptions from subscriptions array if by_shares not directly present
  const fallbackShares = subscriptions
    .filter((s) => !s.sub_type || s.sub_type === 'shares')
    .filter((s, idx, arr) => arr.findIndex((t) => t.category === s.category) === idx);

  const displayTimes = overallDisplay || (overallTimes ? `${overallTimes}x` : '–');

  return (
    <section id="subscription" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-100">{companyName} IPO Live Subscription Status</h2>
            <span className="text-xs text-slate-400">
              Bidding demand breakdown by shares, institutional demand in ₹ Cr, applications &amp; HNI funding cost
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-sky-500/15 border border-sky-500/30 px-3.5 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Overall Demand:</span>
            <span className="font-extrabold text-sky-400 text-sm tabular-nums">{displayTimes}</span>
          </div>
          {subscriptionSummary?.last_updated_at && (
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{new Date(subscriptionSummary.last_updated_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('shares')}
          className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'shares'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>By Shares</span>
        </button>

        {hasDemand && (
          <button
            onClick={() => setActiveTab('demand')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'demand'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            <PieChart className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demand in ₹ Cr (FII / DII)</span>
          </button>
        )}

        {hasApplications && (
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'applications'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-purple-400" />
            <span>By Applications</span>
          </button>
        )}

        {hasDayWise && (
          <button
            onClick={() => setActiveTab('daywise')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'daywise'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Day-wise Demand</span>
          </button>
        )}

        {hasFunding && (
          <button
            onClick={() => setActiveTab('funding')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'funding'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            <span>HNI Funding Cost</span>
          </button>
        )}
      </div>

      {/* TAB 1: By Shares */}
      {activeTab === 'shares' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
            <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="py-2.5 px-4">Investor Category</th>
                <th className="py-2.5 px-4 text-right">Shares Offered</th>
                <th className="py-2.5 px-4 text-right">Shares Bidded</th>
                <th className="py-2.5 px-4 text-right">Subscription Times</th>
                <th className="py-2.5 px-4 text-right hidden md:table-cell">Demand Gauge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {hasSummaryShares
                ? subscriptionSummary!.by_shares!.map((item, idx) => {
                    const isTotal = item.category.toLowerCase().includes('total');
                    const times = item.times ?? 0;
                    return (
                      <tr
                        key={idx}
                        className={`${
                          isTotal
                            ? 'bg-slate-950/80 font-bold'
                            : item.category.startsWith('HNIs') && item.category !== 'HNIs'
                            ? 'bg-slate-950/25 pl-6'
                            : 'hover:bg-slate-800/30'
                        } transition-colors`}
                      >
                        <td className={`py-2.5 px-4 text-slate-200 font-semibold ${item.category.startsWith('HNIs ') ? 'pl-8 text-slate-400' : ''}`}>
                          {item.category.startsWith('HNIs ') ? `↳ ${item.category}` : item.category}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums text-slate-400">
                          {item.offered ? item.offered.toLocaleString('en-IN') : '–'}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums text-slate-200 font-semibold">
                          {item.applied ? item.applied.toLocaleString('en-IN') : '–'}
                        </td>
                        <td className={`py-2.5 px-4 text-right tabular-nums font-extrabold ${isTotal ? 'text-sky-400 text-sm' : 'text-slate-100'}`}>
                          {times.toFixed(2)}x
                        </td>
                        <td className="py-2.5 px-4 text-right hidden md:table-cell">
                          <div className="w-32 ml-auto bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                times >= 5 ? 'bg-purple-500' : times >= 2 ? 'bg-emerald-500' : 'bg-sky-500'
                              }`}
                              style={{ width: `${Math.min(100, times * 15)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : fallbackShares.map((sub, idx) => {
                    const isTotal = sub.category.toLowerCase().includes('total');
                    const times = sub.subscription_times ?? 0;
                    return (
                      <tr
                        key={idx}
                        className={`${isTotal ? 'bg-slate-950/80 font-bold' : 'hover:bg-slate-800/30'} transition-colors`}
                      >
                        <td className="py-2.5 px-4 text-slate-200 font-semibold">{sub.category}</td>
                        <td className="py-2.5 px-4 text-right tabular-nums text-slate-400">
                          {sub.shares_offered ? sub.shares_offered.toLocaleString('en-IN') : '–'}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums text-slate-200 font-semibold">
                          {sub.shares_applied ? sub.shares_applied.toLocaleString('en-IN') : '–'}
                        </td>
                        <td className={`py-2.5 px-4 text-right tabular-nums font-bold ${isTotal ? 'text-sky-400 text-sm' : 'text-slate-100'}`}>
                          {times.toFixed(2)}x
                        </td>
                        <td className="py-2.5 px-4 text-right hidden md:table-cell">
                          <div className="w-32 ml-auto bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-500 rounded-full"
                              style={{ width: `${Math.min(100, times * 15)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: By Demand in ₹ Cr (with Institutional FII & DII) */}
      {activeTab === 'demand' && hasDemand && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
            <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="py-2.5 px-4">Investor Group</th>
                <th className="py-2.5 px-4 text-right">Offered (₹ Cr)</th>
                <th className="py-2.5 px-4 text-right">Demand Applied (₹ Cr)</th>
                <th className="py-2.5 px-4 text-right">Times (x)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {subscriptionSummary!.by_demand_cr!.map((item, idx) => {
                const isTotal = item.category.toLowerCase().includes('total');
                const isInstitutionalSub = ['FIIs', 'DIIs', 'Mutual funds', 'Others'].includes(item.category);
                return (
                  <tr
                    key={idx}
                    className={`${
                      isTotal
                        ? 'bg-slate-950/80 font-bold'
                        : isInstitutionalSub
                        ? 'bg-slate-950/30'
                        : 'hover:bg-slate-800/30'
                    } transition-colors`}
                  >
                    <td className={`py-2.5 px-4 text-slate-200 font-semibold ${isInstitutionalSub ? 'pl-8 text-sky-300' : ''}`}>
                      {isInstitutionalSub ? `↳ ${item.category}` : item.category}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-400">
                      {item.offered_cr != null ? `₹${item.offered_cr.toFixed(2)} Cr` : '–'}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-emerald-400 font-bold">
                      {item.applied_cr != null ? `₹${item.applied_cr.toFixed(2)} Cr` : '–'}
                    </td>
                    <td className={`py-2.5 px-4 text-right tabular-nums font-extrabold ${isTotal ? 'text-sky-400 text-sm' : 'text-slate-100'}`}>
                      {item.times != null ? `${item.times.toFixed(2)}x` : '–'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: By Applications */}
      {activeTab === 'applications' && hasApplications && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
            <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="py-2.5 px-4">Application Category</th>
                <th className="py-2.5 px-4 text-right">Applications Reserved</th>
                <th className="py-2.5 px-4 text-right">Applications Applied</th>
                <th className="py-2.5 px-4 text-right">Application Demand (Times)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {subscriptionSummary!.by_applications!.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-4 text-slate-200 font-semibold">{item.category}</td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-slate-300">
                    {item.reserved != null ? item.reserved.toLocaleString('en-IN') : '–'}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-purple-300 font-bold">
                    {item.applied != null ? item.applied.toLocaleString('en-IN') : '–'}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-sky-400 font-extrabold">
                    {item.times != null ? `${item.times.toFixed(2)}x` : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: Day-wise Progress */}
      {activeTab === 'daywise' && hasDayWise && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
            <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-center">Day 1</th>
                <th className="py-2.5 px-4 text-center">Day 2</th>
                <th className="py-2.5 px-4 text-center">Day 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {subscriptionSummary!.day_wise!.map((item: any, idx: number) => {
                const isTotal = item.category?.toLowerCase().includes('total');
                return (
                  <tr
                    key={idx}
                    className={`${isTotal ? 'bg-slate-950/80 font-bold text-sky-400' : 'hover:bg-slate-800/30'} transition-colors`}
                  >
                    <td className="py-2.5 px-4 text-slate-200 font-semibold">{item.category}</td>
                    <td className="py-2.5 px-4 text-center tabular-nums font-bold text-slate-300">
                      {item.day_1 != null ? `${Number(item.day_1).toFixed(2)}x` : '–'}
                    </td>
                    <td className="py-2.5 px-4 text-center tabular-nums font-bold text-slate-200">
                      {item.day_2 != null ? `${Number(item.day_2).toFixed(2)}x` : '–'}
                    </td>
                    <td className="py-2.5 px-4 text-center tabular-nums font-bold text-amber-400">
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
          <p className="text-xs text-slate-400">
            Estimated per-share cost of funding for High Net-worth Individuals (HNIs) applying through leverage at various interest rates.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(fundingCosts!).map(([rate, cost]) => (
              <div key={rate} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-center">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Interest @ {rate}</span>
                <span className="text-lg font-extrabold text-cyan-400 tabular-nums">
                  ₹{typeof cost === 'number' ? cost.toFixed(2) : cost}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">per share cost</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
