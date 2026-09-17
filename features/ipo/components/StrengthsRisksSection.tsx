'use client';

import { CheckCircle2, AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';

interface StrengthsRisksSectionProps {
  companyName: string;
  strengths?: string[] | null;
  risks?: string[] | null;
}

export function StrengthsRisksSection({ companyName, strengths, risks }: StrengthsRisksSectionProps) {
  const hasStrengths = Boolean(strengths && strengths.length > 0);
  const hasRisks = Boolean(risks && risks.length > 0);

  if (!hasStrengths && !hasRisks) {
    return null;
  }

  // Case 1: Both Strengths and Risks exist - side-by-side 2-column comparison
  if (hasStrengths && hasRisks) {
    return (
      <section id="strengths-risks" className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Strengths Column */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-lg h-full">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">{companyName} Strengths &amp; Positives</h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Competitive advantages &amp; operational merits</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold text-[11px] border border-emerald-200 dark:border-emerald-500/30 shrink-0">
              {strengths!.length} {strengths!.length === 1 ? 'Point' : 'Points'}
            </span>
          </div>

          <ul className="space-y-2.5">
            {strengths!.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {strength}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks Column */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-lg h-full">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">{companyName} Key Risks &amp; Concerns</h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Business vulnerabilities &amp; market sensitivities</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 font-semibold text-[11px] border border-rose-200 dark:border-rose-500/30 shrink-0">
              {risks!.length} {risks!.length === 1 ? 'Point' : 'Points'}
            </span>
          </div>

          <ul className="space-y-2.5">
            {risks!.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-rose-50/50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-rose-200 dark:border-rose-500/20">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {risk}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // Case 2: Only Strengths exist (No negative points) - Spans full width, arranges points in responsive grid
  if (hasStrengths) {
    const isSingle = strengths!.length === 1;

    return (
      <section id="strengths-risks" className="scroll-mt-28 w-full">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-lg">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">{companyName} Strengths &amp; Positives</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Competitive advantages &amp; key operational highlights</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold text-xs border border-emerald-200 dark:border-emerald-500/30 shrink-0">
              {strengths!.length} Key {strengths!.length === 1 ? 'Strength' : 'Strengths'}
            </span>
          </div>

          <ul className={isSingle ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-3'}>
            {strengths!.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 transition-colors">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {strength}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // Case 3: Only Risks exist (No positive points) - Spans full width, arranges points in responsive grid
  const isSingle = risks!.length === 1;

  return (
    <section id="strengths-risks" className="scroll-mt-28 w-full">
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">{companyName} Key Risks &amp; Concerns</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Business vulnerabilities &amp; market sensitivities</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 font-semibold text-xs border border-rose-200 dark:border-rose-500/30 shrink-0">
            {risks!.length} Key {risks!.length === 1 ? 'Risk' : 'Risks'}
          </span>
        </div>

        <ul className={isSingle ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-3'}>
          {risks!.map((risk, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-rose-50/50 dark:bg-slate-950/60 p-4 rounded-xl border border-rose-200 dark:border-rose-500/20 hover:border-rose-300 dark:hover:border-rose-500/30 transition-colors">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {risk}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
