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

  return (
    <section id="strengths-risks" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Strengths Column */}
      {hasStrengths && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-100">{companyName} Strengths &amp; Positives</h3>
                <span className="text-[11px] text-slate-400">Competitive advantages &amp; operational merits</span>
              </div>
            </div>

            <ul className="space-y-3">
              {strengths!.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {strength}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Risks Column */}
      {hasRisks && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-100">{companyName} Key Risks &amp; Concerns</h3>
                <span className="text-[11px] text-slate-400">Business vulnerabilities &amp; market sensitivities</span>
              </div>
            </div>

            <ul className="space-y-3">
              {risks!.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-rose-500/20">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {risk}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
