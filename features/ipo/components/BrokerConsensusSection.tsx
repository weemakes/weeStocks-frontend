'use client';

import { useState, useMemo } from 'react';
import { IPOBrokerReview } from '../types';
import { Award, ExternalLink, CheckCircle2, MinusCircle, XCircle, HelpCircle, ThumbsUp } from 'lucide-react';

interface BrokerConsensusSectionProps {
  companyName: string;
  brokerReviews?: IPOBrokerReview[] | null;
}

export function BrokerConsensusSection({ companyName, brokerReviews }: BrokerConsensusSectionProps) {
  const [filter, setFilter] = useState<'ALL' | 'Apply' | 'Neutral' | 'Avoid' | 'Not Rated'>('ALL');

  const reviews = useMemo(() => brokerReviews || [], [brokerReviews]);

  const counts = useMemo(() => {
    const apply = reviews.filter((r) => r.recommendation?.toLowerCase() === 'apply').length;
    const neutral = reviews.filter((r) => r.recommendation?.toLowerCase() === 'neutral').length;
    const avoid = reviews.filter((r) => r.recommendation?.toLowerCase() === 'avoid').length;
    const notRated = reviews.filter(
      (r) =>
        r.recommendation?.toLowerCase() === 'not rated' ||
        r.recommendation?.toLowerCase() === 'not_rated' ||
        !r.recommendation
    ).length;
    const total = reviews.length;

    return { apply, neutral, avoid, notRated, total };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (filter === 'ALL') return reviews;
    return reviews.filter((r) => {
      const rec = r.recommendation?.toLowerCase();
      if (filter === 'Apply') return rec === 'apply';
      if (filter === 'Neutral') return rec === 'neutral';
      if (filter === 'Avoid') return rec === 'avoid';
      if (filter === 'Not Rated') return rec === 'not rated' || rec === 'not_rated' || !rec;
      return true;
    });
  }, [reviews, filter]);

  if (reviews.length === 0) {
    return null;
  }

  const applyPct = counts.total > 0 ? Math.round((counts.apply / counts.total) * 100) : 0;
  const neutralPct = counts.total > 0 ? Math.round((counts.neutral / counts.total) * 100) : 0;
  const avoidPct = counts.total > 0 ? Math.round((counts.avoid / counts.total) * 100) : 0;

  return (
    <section id="broker-reviews" className="scroll-mt-28 bg-panel/90 border border-line rounded-2xl p-5 md:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-positive" />
          <div>
            <h2 className="text-lg font-bold text-ink">{companyName} IPO Broker Consensus &amp; Reviews</h2>
            <span className="text-xs text-muted">
              Institutional and brokerage house recommendations with verified review reports
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-canvas/70 border border-line px-3 py-1.5 rounded-xl text-xs">
          <ThumbsUp className="w-3.5 h-3.5 text-positive" />
          <span className="text-muted">Consensus:</span>
          <span className="font-bold text-positive">
            {applyPct > 50 ? applyPct+'% Apply' : avoidPct > 50 ? avoidPct+'% Avoid' : neutralPct > 50 ? neutralPct+'% Neutral' : 'Mixed / no majority'}
          </span>
        </div>
      </div>

      {/* Consensus Breakdown Meter */}
      <div className="bg-canvas/60 border border-line/80 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between text-xs mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-positive font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Apply: {counts.apply} ({applyPct}%)
            </span>
            <span className="inline-flex items-center gap-1.5 text-warning font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Neutral: {counts.neutral} ({neutralPct}%)
            </span>
            {counts.avoid > 0 && (
              <span className="inline-flex items-center gap-1.5 text-negative font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Avoid: {counts.avoid} ({avoidPct}%)
              </span>
            )}
            {counts.notRated > 0 && (
              <span className="inline-flex items-center gap-1.5 text-muted font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                Not Rated: {counts.notRated}
              </span>
            )}
          </div>
          <span className="text-quiet font-medium">Total: {counts.total} Analysts</span>
        </div>

        {/* Visual Bar */}
        <div className="w-full h-3 bg-well rounded-full overflow-hidden flex gap-0.5">
          {counts.apply > 0 && (
            <div
              className="bg-emerald-500 hover:opacity-90 transition-all"
              style={{ width: `${(counts.apply / counts.total) * 100}%` }}
              title={`Apply: ${counts.apply}`}
            />
          )}
          {counts.neutral > 0 && (
            <div
              className="bg-amber-500 hover:opacity-90 transition-all"
              style={{ width: `${(counts.neutral / counts.total) * 100}%` }}
              title={`Neutral: ${counts.neutral}`}
            />
          )}
          {counts.avoid > 0 && (
            <div
              className="bg-rose-500 hover:opacity-90 transition-all"
              style={{ width: `${(counts.avoid / counts.total) * 100}%` }}
              title={`Avoid: ${counts.avoid}`}
            />
          )}
          {counts.notRated > 0 && (
            <div
              className="bg-elevated hover:opacity-90 transition-all"
              style={{ width: `${(counts.notRated / counts.total) * 100}%` }}
              title={`Not Rated: ${counts.notRated}`}
            />
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1 text-xs">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            filter === 'ALL'
              ? 'bg-sky-500/20 text-accent border border-sky-500/40'
              : 'bg-well/80 text-muted hover:text-ink border border-line-strong/60'
          }`}
        >
          All Reviews ({counts.total})
        </button>
        <button
          onClick={() => setFilter('Apply')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            filter === 'Apply'
              ? 'bg-emerald-500/20 text-positive border border-emerald-500/40'
              : 'bg-well/80 text-muted hover:text-positive border border-line-strong/60'
          }`}
        >
          Apply ({counts.apply})
        </button>
        <button
          onClick={() => setFilter('Neutral')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            filter === 'Neutral'
              ? 'bg-amber-500/20 text-warning border border-amber-500/40'
              : 'bg-well/80 text-muted hover:text-warning border border-line-strong/60'
          }`}
        >
          Neutral ({counts.neutral})
        </button>
        {counts.avoid > 0 && (
          <button
            onClick={() => setFilter('Avoid')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              filter === 'Avoid'
                ? 'bg-rose-500/20 text-negative border border-rose-500/40'
                : 'bg-well/80 text-muted hover:text-negative border border-line-strong/60'
            }`}
          >
            Avoid ({counts.avoid})
          </button>
        )}
        {counts.notRated > 0 && (
          <button
            onClick={() => setFilter('Not Rated')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              filter === 'Not Rated'
                ? 'bg-elevated text-ink border border-slate-600'
                : 'bg-well/80 text-muted hover:text-ink border border-line-strong/60'
            }`}
          >
            Not Rated ({counts.notRated})
          </button>
        )}
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-line rounded-xl overflow-hidden divide-y divide-line">
          <thead className="bg-canvas text-[11px] font-semibold text-muted uppercase">
            <tr>
              <th className="py-2.5 px-4">Broker / Research Firm</th>
              <th className="py-2.5 px-4 text-center">Recommendation</th>
              <th className="py-2.5 px-4 text-right">Research Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/80">
            {filteredReviews.map((review, idx) => {
              const recLower = review.recommendation?.toLowerCase();
              const isApply = recLower === 'apply';
              const isNeutral = recLower === 'neutral';
              const isAvoid = recLower === 'avoid';

              return (
                <tr key={idx} className="hover:bg-well/30 transition-colors">
                  <td className="py-2.5 px-4 text-ink font-semibold">
                    {review.reviewer}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {isApply && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-positive text-xs font-bold border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Apply
                      </span>
                    )}
                    {isNeutral && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-warning text-xs font-bold border border-amber-500/30">
                        <MinusCircle className="w-3.5 h-3.5" /> Neutral
                      </span>
                    )}
                    {isAvoid && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-negative text-xs font-bold border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" /> Avoid
                      </span>
                    )}
                    {!isApply && !isNeutral && !isAvoid && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-well text-muted text-xs font-medium border border-line-strong">
                        <HelpCircle className="w-3.5 h-3.5" /> {review.recommendation || 'Not Rated'}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {review.file_url ? (
                      <a
                        href={review.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-well hover:bg-elevated text-accent hover:text-accent border border-line-strong font-semibold text-xs transition-colors"
                      >
                        <span>View Review</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-quiet text-[11px]">Report via Media</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
