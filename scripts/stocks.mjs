import fs from 'node:fs';
const write=(p,s)=>fs.writeFileSync(p,s.trimStart());
let types=fs.readFileSync('features/stocks/types.ts','utf8');
types=types.replace("'compliant' | 'non_compliant' | 'doubtful'", "'compliant' | 'non_compliant' | 'doubtful' | 'unknown'");
const end=types.indexOf('export type StockSortField');
types=types.slice(0,end).replaceAll(': number;', ': number | null;').replaceAll("'pass' | 'fail'", "'pass' | 'fail' | 'unknown'").replace("'Large Cap' | 'Mid Cap' | 'Small Cap'", "'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Unknown'")+types.slice(end);
write('features/stocks/types.ts',types);
let mapper=fs.readFileSync('features/stocks/utils/mappers.ts','utf8');
mapper=mapper.slice(0,mapper.indexOf('export function mapBackendStockToStockItem'))+`
export function numeric(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value); return Number.isFinite(n) ? n : null;
}
export function mapBackendStockToStockItem(item: StockListItem, country?: string): StockItem {
  const raw = item.shariah_compliance?.status?.toUpperCase();
  const complianceStatus: ComplianceStatus = raw === 'HALAL' ? 'compliant' : raw === 'NON_HALAL' ? 'non_compliant' : raw === 'DOUBTFUL' ? 'doubtful' : 'unknown';
  const debt = numeric(item.shariah_compliance?.debt_to_market_cap);
  const mcap = numeric(item.metrics?.market_cap);
  const actualCountry = item.country || country;
  const percent = (value: unknown) => { const n = numeric(value); return n === null ? null : n * 100; };
  const check = (value?: boolean) => value === true ? 'pass' as const : value === false ? 'fail' as const : 'unknown' as const;
  return {
    id: item.id, symbol: item.symbol, name: item.company_name, logo_url: item.logo_url,
    exchange: item.exchange, country: actualCountry, currency: item.currency,
    currencySymbol: getCurrencySymbol(item.currency || actualCountry), sector: item.sector || 'Unclassified', industry: item.industry || 'Unclassified',
    price: numeric(item.latest_price), change: numeric(item.change), changePercent: numeric(item.change_percentage), volume: item.volume,
    marketCapCr: mcap === null ? null : mcap / 10000000,
    marketCapCategory: mcap === null || actualCountry !== 'India' ? 'Unknown' : mcap >= 200000000000 ? 'Large Cap' : mcap >= 50000000000 ? 'Mid Cap' : 'Small Cap',
    halalScore: null, complianceStatus, statusReason: item.shariah_compliance?.notes?.join(' ') || 'Review the reported screening details and methodology.',
    shariah: { businessActivityStatus: check(item.shariah_compliance?.is_sector_compliant), nonHalalRevenuePercent: null, debtRatioPercent: debt === null ? null : debt * 100,
      debtRatioStatus: check(item.shariah_compliance?.is_debt_compliant), cashAndSecuritiesRatioPercent: null, cashRatioStatus: 'unknown', purificationPercent: null },
    fundamentals: { peRatio: numeric(item.metrics?.pe_ratio), pbRatio: numeric(item.metrics?.price_to_book), roePercent: percent(item.metrics?.roe), rocePercent: null,
      debtToEquity: null, freeCashFlowCr: null, dividendYield: percent(item.metrics?.dividend_yield), week52High: numeric(item.metrics?.fifty_two_week_high), week52Low: numeric(item.metrics?.fifty_two_week_low) },
    lastUpdated: item.market_date || 'Date unavailable',
  };
}
`;
mapper=mapper.replace('ComplianceStatus, StockCountry','ComplianceStatus');
write('features/stocks/utils/mappers.ts',mapper);
write('features/stocks/components/StockTableView.tsx',`
'use client';
import { ArrowUpDown, ArrowUpRight } from 'lucide-react';
import type { StockItem, StockSortField, SortDirection } from '../types';
import { formatCurrencyAmount, formatMarketCap } from '../utils/mappers';
import { ComplianceBadge } from './ComplianceBadge';
export interface StockTableProps { stocks: StockItem[]; sortField: StockSortField; sortDirection: SortDirection; onSort: (field: StockSortField) => void; onSelectStock: (stock: StockItem) => void; }
export default function StockTableView({stocks,sortField,sortDirection,onSort,onSelectStock}:StockTableProps) {
  const head=(label:string,field:StockSortField)=><th aria-sort={sortField===field?(sortDirection==='asc'?'ascending':'descending'):'none'}><button onClick={()=>onSort(field)} className="inline-flex items-center gap-2">{label}<ArrowUpDown size={12}/></button></th>;
  return <div className="surface overflow-x-auto"><table className="stock-table"><thead><tr>{head('Company','symbol')}{head('Price','price')}{head('Market cap','marketCapCr')}{head('P/E','pe_ratio')}<th>Debt / market cap</th><th>Screening</th><th><span className="sr-only">Details</span></th></tr></thead><tbody>{stocks.map(stock=><tr key={stock.id}><td><button onClick={()=>onSelectStock(stock)} className="company-cell"><span className="company-avatar">{stock.symbol.slice(0,2)}</span><span><strong>{stock.symbol}</strong><small>{stock.name}</small></span></button></td><td><strong>{formatCurrencyAmount(stock.price,stock.currencySymbol)}</strong><small className={stock.changePercent===null?'text-muted':stock.changePercent>=0?'text-positive':'text-negative'}>{stock.changePercent===null?'Change unavailable':(stock.changePercent>0?'+':'')+stock.changePercent.toFixed(2)+'%'}</small></td><td>{formatMarketCap(stock.marketCapCr===null?null:stock.marketCapCr*10000000,stock.country)}</td><td>{stock.fundamentals.peRatio?.toFixed(2)??'—'}</td><td>{stock.shariah.debtRatioPercent===null?'—':stock.shariah.debtRatioPercent.toFixed(2)+'%'}</td><td><ComplianceBadge status={stock.complianceStatus}/></td><td><button onClick={()=>onSelectStock(stock)} className="icon-button" aria-label={'View '+stock.symbol+' details'}><ArrowUpRight size={17}/></button></td></tr>)}</tbody></table></div>;
}
`);
write('features/stocks/components/StockCardView.tsx',`
'use client';
import { ArrowUpRight } from 'lucide-react';
import type { StockItem } from '../types';
import { formatCurrencyAmount, formatMarketCap } from '../utils/mappers';
import { ComplianceBadge } from './ComplianceBadge';
export default function StockCardView({stocks,onSelectStock}:{stocks:StockItem[];onSelectStock:(stock:StockItem)=>void}) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{stocks.map(stock=><button className="surface stock-card text-left" key={stock.id} onClick={()=>onSelectStock(stock)}><div className="flex items-center justify-between mb-5"><span className="company-avatar">{stock.symbol.slice(0,2)}</span><ComplianceBadge status={stock.complianceStatus}/></div><h3>{stock.symbol}</h3><p className="text-muted text-xs mt-1 truncate">{stock.name}</p><div className="flex justify-between items-end my-5"><strong className="text-2xl text-ink tracking-tight">{formatCurrencyAmount(stock.price,stock.currencySymbol)}</strong><span className={stock.changePercent!==null&&stock.changePercent<0?'text-negative':'text-positive'}>{stock.changePercent===null?'—':(stock.changePercent>0?'+':'')+stock.changePercent.toFixed(2)+'%'}</span></div><div className="flex justify-between border-t border-line pt-4 text-xs"><span className="text-muted">{formatMarketCap(stock.marketCapCr===null?null:stock.marketCapCr*10000000,stock.country)}</span><span className="text-accent inline-flex gap-1">Explore <ArrowUpRight size={14}/></span></div></button>)}</div>;
}
`);
write('features/stocks/components/StockSummaryStrip.tsx',`
'use client';
import type { StockItem, ComplianceStatus } from '../types';
export default function StockSummaryStrip({stocks}: {stocks:StockItem[];activeStatusFilter?:ComplianceStatus|'all'|'zero_debt'|'nifty50';onSelectStatus?:(status:ComplianceStatus|'all'|'zero_debt'|'nifty50')=>void}) {
  const items=[{label:'On this page',value:stocks.length},{label:'Reported Halal',value:stocks.filter(s=>s.complianceStatus==='compliant').length},{label:'Under review',value:stocks.filter(s=>s.complianceStatus==='doubtful').length},{label:'Not screened',value:stocks.filter(s=>s.complianceStatus==='unknown').length}];
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">{items.map(i=><div key={i.label} className="surface px-5 py-4"><p className="text-xs text-muted mb-1">{i.label}</p><strong className="text-2xl font-semibold tracking-tight text-ink tabular-nums">{i.value}</strong></div>)}</div>;
}
`);
// Retire obsolete controls; their replacement is colocated with server-supported screener filters.
write('features/stocks/components/StockFilterBar.tsx',`export { default } from './StockSummaryStrip';\n`);
