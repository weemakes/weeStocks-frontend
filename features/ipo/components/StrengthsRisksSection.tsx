'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, TrendingUp } from 'lucide-react';

interface StrengthsRisksSectionProps {
  companyName: string;
  strengths?: string[] | null;
  risks?: string[] | null;
}

type AnalysisTab = 'strengths' | 'risks';

export function StrengthsRisksSection({ companyName, strengths, risks }: StrengthsRisksSectionProps) {
  const strengthItems = strengths ?? [];
  const riskItems = risks ?? [];
  const hasStrengths = strengthItems.length > 0;
  const hasRisks = riskItems.length > 0;
  const [tab, setTab] = useState<AnalysisTab>(hasStrengths ? 'strengths' : 'risks');

  if (!hasStrengths && !hasRisks) return null;

  const showingStrengths = tab === 'strengths' && hasStrengths;
  const items = showingStrengths ? strengthItems : riskItems;

  return (
    <section id="strengths-risks" className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-lg">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{companyName} IPO Analysis</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Review the company&apos;s key advantages and material business risks.</p>
        </div>

        {hasStrengths && hasRisks ? (
          <div className="grid w-full grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-950 md:w-auto md:min-w-72" role="tablist" aria-label="IPO strengths and risks">
            <button type="button" role="tab" aria-selected={tab === 'strengths'} onClick={() => setTab('strengths')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all ${tab === 'strengths' ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>
              <TrendingUp className="h-3.5 w-3.5" />Strengths <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">{strengthItems.length}</span>
            </button>
            <button type="button" role="tab" aria-selected={tab === 'risks'} onClick={() => setTab('risks')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all ${tab === 'risks' ? 'bg-white text-rose-700 shadow-sm dark:bg-slate-800 dark:text-rose-300' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>
              <ShieldAlert className="h-3.5 w-3.5" />Risks <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">{riskItems.length}</span>
            </button>
          </div>
        ) : (
          <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${hasStrengths ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300' : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'}`}>
            {hasStrengths ? <TrendingUp className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}{items.length} {hasStrengths ? 'Strengths' : 'Risks'}
          </span>
        )}
      </div>

      <div className="p-4 md:p-5">
        <div className={`mb-3 flex items-center gap-2 rounded-xl border px-4 py-3 ${showingStrengths ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/25 dark:bg-emerald-500/10' : 'border-rose-200 bg-rose-50/70 dark:border-rose-500/25 dark:bg-rose-500/10'}`}>
          {showingStrengths ? <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
          <div>
            <h3 className={`text-sm font-bold ${showingStrengths ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200'}`}>{showingStrengths ? 'Strengths & Positives' : 'Key Risks & Concerns'}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{showingStrengths ? 'Competitive advantages and operational merits' : 'Business vulnerabilities and market sensitivities'}</p>
          </div>
        </div>

        <ul role="tabpanel" className="grid max-h-[390px] grid-cols-1 gap-2.5 overflow-y-auto pr-1 md:grid-cols-2">
          {items.map((item, index) => (
            <li key={`${tab}-${index}`} className={`flex items-start gap-3 rounded-xl border p-3.5 ${showingStrengths ? 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60' : 'border-rose-200 bg-rose-50/40 dark:border-rose-500/20 dark:bg-slate-950/60'}`}>
              {showingStrengths ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />}
              <p className="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
