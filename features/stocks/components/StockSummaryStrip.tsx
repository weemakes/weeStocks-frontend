'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, TrendingUp, Sparkles, Percent } from 'lucide-react';
import { ComplianceStatus, StockItem } from '../types';

interface StockSummaryStripProps {
  stocks: StockItem[];
  activeStatusFilter: ComplianceStatus | 'all' | 'zero_debt' | 'nifty50';
  onSelectStatus: (filter: ComplianceStatus | 'all' | 'zero_debt' | 'nifty50') => void;
}

export default function StockSummaryStrip({
  stocks,
  activeStatusFilter,
  onSelectStatus,
}: StockSummaryStripProps) {
  const total = stocks.length;
  const compliantCount = stocks.filter((s) => s.complianceStatus === 'compliant').length;
  const doubtfulCount = stocks.filter((s) => s.complianceStatus === 'doubtful').length;
  const nonCompliantCount = stocks.filter((s) => s.complianceStatus === 'non_compliant').length;
  const zeroDebtCount = stocks.filter((s) => s.shariah.debtRatioPercent === 0).length;

  // Average debt of compliant stocks
  const compliantStocks = stocks.filter((s) => s.complianceStatus === 'compliant');
  const avgDebtOfCompliant = compliantStocks.length > 0
    ? (compliantStocks.reduce((acc, s) => acc + s.shariah.debtRatioPercent, 0) / compliantStocks.length).toFixed(1)
    : '0.0';

  const cards = [
    {
      id: 'all' as const,
      label: 'All Monitored',
      value: total,
      sublabel: 'Equities Tracked',
      icon: TrendingUp,
      color: 'text-slate-100',
      activeBorder: 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-950/20',
      iconColor: 'text-sky-400',
    },
    {
      id: 'compliant' as const,
      label: '100% Halal',
      value: compliantCount,
      sublabel: `${Math.round((compliantCount / total) * 100)}% of universe`,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-950/20',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'doubtful' as const,
      label: 'Under Review',
      value: doubtfulCount,
      sublabel: 'Debt ~33% ceiling',
      icon: AlertTriangle,
      color: 'text-amber-400',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-950/20',
      iconColor: 'text-amber-400',
    },
    {
      id: 'non_compliant' as const,
      label: 'Non-Compliant',
      value: nonCompliantCount,
      sublabel: 'Riba / Haram Revenue',
      icon: XCircle,
      color: 'text-rose-400',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-950/20',
      iconColor: 'text-rose-400',
    },
    {
      id: 'zero_debt' as const,
      label: 'Zero Debt Giants',
      value: zeroDebtCount,
      sublabel: 'Net-cash balance sheet',
      icon: Sparkles,
      color: 'text-cyan-300',
      activeBorder: 'border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-950/20',
      iconColor: 'text-cyan-400',
    },
    {
      id: 'metric' as const,
      label: 'Avg Halal Debt',
      value: `${avgDebtOfCompliant}%`,
      sublabel: 'Max allowed: 33%',
      icon: Percent,
      color: 'text-blue-400',
      activeBorder: '',
      iconColor: 'text-blue-400',
      isStatOnly: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatusFilter === card.id;

        if (card.isStatOnly) {
          return (
            <div
              key={card.label}
              className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-left transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">{card.label}</span>
                <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
              </div>
              <div className={`text-xl font-bold tabular-nums ${card.color}`}>
                {card.value}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{card.sublabel}</div>
            </div>
          );
        }

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => {
              if (card.id !== 'metric') {
                onSelectStatus(card.id);
              }
            }}
            className={`bg-slate-900/80 border rounded-lg p-3 text-left transition-all hover:border-slate-700 hover:bg-slate-850/60 ${
              isActive ? card.activeBorder : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-400">{card.label}</span>
              <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
            </div>
            <div className={`text-xl font-bold tabular-nums ${card.color}`}>
              {card.value}
            </div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5">{card.sublabel}</div>
          </button>
        );
      })}
    </div>
  );
}
