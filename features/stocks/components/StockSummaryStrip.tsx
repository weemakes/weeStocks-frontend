'use client';
import type { StockItem, ComplianceStatus } from '../types';
export default function StockSummaryStrip({stocks}: {stocks:StockItem[];activeStatusFilter?:ComplianceStatus|'all'|'zero_debt'|'nifty50';onSelectStatus?:(status:ComplianceStatus|'all'|'zero_debt'|'nifty50')=>void}) {
  const items=[{label:'On this page',value:stocks.length},{label:'Reported Halal',value:stocks.filter(s=>s.complianceStatus==='compliant').length},{label:'Under review',value:stocks.filter(s=>s.complianceStatus==='doubtful').length},{label:'Not screened',value:stocks.filter(s=>s.complianceStatus==='unknown').length}];
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">{items.map(i=><div key={i.label} className="surface px-5 py-4"><p className="text-xs text-muted mb-1">{i.label}</p><strong className="text-2xl font-semibold tracking-tight text-ink tabular-nums">{i.value}</strong></div>)}</div>;
}
