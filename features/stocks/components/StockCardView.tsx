'use client';
import { ArrowUpRight } from 'lucide-react';
import type { StockItem } from '../types';
import { formatCurrencyAmount, formatMarketCap } from '../utils/mappers';
import { ComplianceBadge } from './ComplianceBadge';
export default function StockCardView({stocks,onSelectStock}:{stocks:StockItem[];onSelectStock:(stock:StockItem)=>void}) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{stocks.map(stock=><button className="surface stock-card text-left" key={stock.id} onClick={()=>onSelectStock(stock)}><div className="flex items-center justify-between mb-5"><span className="company-avatar">{stock.symbol.slice(0,2)}</span><ComplianceBadge status={stock.complianceStatus}/></div><h3>{stock.symbol}</h3><p className="text-muted text-xs mt-1 truncate">{stock.name}</p><div className="flex justify-between items-end my-5"><strong className="text-2xl text-ink tracking-tight">{formatCurrencyAmount(stock.price,stock.currencySymbol)}</strong><span className={stock.changePercent!==null&&stock.changePercent<0?'text-negative':'text-positive'}>{stock.changePercent===null?'—':(stock.changePercent>0?'+':'')+stock.changePercent.toFixed(2)+'%'}</span></div><div className="flex justify-between border-t border-line pt-4 text-xs"><span className="text-muted">{formatMarketCap(stock.marketCapCr===null?null:stock.marketCapCr*10000000,stock.country)}</span><span className="text-accent inline-flex gap-1">Explore <ArrowUpRight size={14}/></span></div></button>)}</div>;
}
