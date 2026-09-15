import fs from 'node:fs';
fs.writeFileSync('app/stocks/page.tsx', `
'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, Search, RotateCcw, LayoutGrid, List, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { getAvailableCountries, getStocksList, getMarketOverview } from '@/features/stocks/api';
import { mapBackendStockToStockItem } from '@/features/stocks/utils/mappers';
import type { StockCountry, StockItem, StockSortField, SortDirection } from '@/features/stocks/types';
import { StockTableView, StockCardView, StockDetailModal, StockSummaryStrip } from '@/features/stocks/components';
import { exportStocksCsv } from '@/features/stocks/utils/export';

function Screener() {
  const params=useSearchParams(); const router=useRouter();
  const country=params.get('country')||'India';
  const query=params.get('search')||'';
  const status=params.get('status')||'all';
  const sector=params.get('sector')||'All';
  const page=Math.max(1,Number(params.get('page'))||1);
  const validSorts:StockSortField[]=['marketCapCr','price','pe_ratio','volume','symbol'];
  const rawSort=params.get('sort') as StockSortField;
  const sort=validSorts.includes(rawSort)?rawSort:'marketCapCr';
  const direction:SortDirection=params.get('direction')==='asc'?'asc':'desc';
  const [search,setSearch]=useState(query);
  const [countries,setCountries]=useState<StockCountry[]>([]);
  const [sectors,setSectors]=useState<string[]>([]);
  const [view,setView]=useState<'table'|'cards'>('table');
  const [selected,setSelected]=useState<StockItem|null>(null);
  const [retry,setRetry]=useState(0);
  const [result,setResult]=useState<{key:string;stocks:StockItem[];total:number;pages:number;error:string|null}|null>(null);
  const key=[country,query,status,sector,page,sort,direction,retry].join('|');
  const loading=result?.key!==key;
  const stocks=loading?[]:result?.stocks||[];
  const change=(values:Record<string,string>)=>{const next=new URLSearchParams(params.toString()); next.delete('page'); Object.entries(values).forEach(([k,v])=>{if(v&&v!=='all'&&v!=='All')next.set(k,v);else next.delete(k)});router.replace('/stocks?'+next.toString(),{scroll:false});};
  useEffect(()=>{let active=true;getAvailableCountries().then(data=>{if(active)setCountries(data)});return()=>{active=false}},[]);
  useEffect(()=>{let active=true;getMarketOverview(country).then(data=>{if(active)setSectors(data?.top_sectors?.map(s=>s.sector)||[])});return()=>{active=false}},[country]);
  useEffect(()=>{
    const controller=new AbortController();
    const sortMap={marketCapCr:'market_cap',price:'price',pe_ratio:'pe_ratio',volume:'volume',symbol:'symbol'} as const;
    getStocksList({country,search:query,sector,halal_status:status==='compliant'?'HALAL':status==='non_compliant'?'NON_HALAL':status==='doubtful'?'DOUBTFUL':'ALL',sort_by:sortMap[sort as keyof typeof sortMap],sort_order:direction==='asc'?'ASC':'DESC',page,limit:20},controller.signal)
      .then(response=>{if(controller.signal.aborted)return;if(!Array.isArray(response.data))throw new Error('Invalid stock response');setResult({key,stocks:response.data.map(s=>mapBackendStockToStockItem(s,country)),total:response.meta?.total??response.data.length,pages:response.meta?.totalPages??1,error:null})})
      .catch(()=>{if(!controller.signal.aborted)setResult({key,stocks:[],total:0,pages:1,error:'We could not load market data. Please try again in a moment.'})});
    return()=>controller.abort();
  },[country,query,status,sector,page,sort,direction,key]);
  const sectorOptions=useMemo(()=>Array.from(new Set([...sectors,...(sector!=='All'?[sector]:[])])).sort(),[sectors,sector]);
  const onSort=(field:StockSortField)=>change({sort:field,direction:sort===field&&direction==='desc'?'asc':'desc'});
  return <div className="container py-9 pb-16">
    <div className="page-heading"><div><span className="eyebrow">MARKET EXPLORER</span><h1>Find your next idea.</h1><p>Explore companies, compare fundamentals, and review reported Shariah screening.</p></div><button className="btn btn-outline" disabled={loading||!stocks.length} onClick={()=>exportStocksCsv(stocks,country)}><Download size={15}/> Export this page</button></div>
    <div className="country-tabs" role="group" aria-label="Stock market">{(countries.length?countries.map(c=>c.country):['India','Saudi Arabia','United Arab Emirates','Japan']).map(c=><button key={c} aria-pressed={country===c} onClick={()=>{setSearch('');change({country:c,search:'',sector:'',status:''})}}><span>{c==='India'?'🇮🇳':c==='Japan'?'🇯🇵':c==='Saudi Arabia'?'🇸🇦':'🇦🇪'}</span>{c==='United Arab Emirates'?'UAE':c}</button>)}</div>
    <div className="surface p-5 mb-5"><div className="flex flex-wrap gap-3 items-center justify-between">
      <form className="screener-search" onSubmit={e=>{e.preventDefault();change({search:search.trim()})}}><Search size={17}/><input key={query} aria-label="Search stocks" placeholder="Company name or symbol…" defaultValue={query} onChange={e=>setSearch(e.target.value)}/><button type="submit">Search</button></form>
      <div className="flex items-center gap-2"><span className="text-muted text-xs mr-1">View</span><button className="view-button" aria-label="Table view" aria-pressed={view==='table'} onClick={()=>setView('table')}><List size={17}/></button><button className="view-button" aria-label="Card view" aria-pressed={view==='cards'} onClick={()=>setView('cards')}><LayoutGrid size={17}/></button></div>
    </div><div className="flex flex-wrap items-center gap-3 pt-4 mt-4 border-t border-line"><SlidersHorizontal size={15} className="text-muted"/>
      <select className="filter-select" aria-label="Screening status" value={status} onChange={e=>change({status:e.target.value})}><option value="all">All screening results</option value="compliant">Halal</option><option value="doubtful">Under review</option><option value="non_compliant">Non-Halal</option></select>
      <select className="filter-select" aria-label="Sector" value={sector} onChange={e=>change({sector:e.target.value})}><option value="All">All sectors</option>{sectorOptions.map(s=><option key={s}>{s}</option>)}</select>
      <select className="filter-select" aria-label="Sort stocks" value={sort} onChange={e=>change({sort:e.target.value})}><option value="marketCapCr">Market cap</option><option value="price">Price</option><option value="pe_ratio">P/E ratio</option><option value="volume">Volume</option><option value="symbol">Symbol</option></select>
      <button className="filter-select inline-flex items-center gap-2" onClick={()=>change({direction:direction==='asc'?'desc':'asc'})}><ArrowUpDown size={13}/>{direction==='asc'?'Ascending':'Descending'}</button>
      <button className="text-xs text-muted inline-flex gap-1.5 items-center ml-auto" onClick={()=>{setSearch('');router.replace('/stocks?country='+encodeURIComponent(country),{scroll:false})}}><RotateCcw size={13}/> Reset</button>
    </div></div>
    {!loading&&!result?.error&&<StockSummaryStrip stocks={stocks}/>}
    <div className="flex justify-between items-center mb-3 text-xs text-muted"><span>{loading?'Loading companies…':result?.error?'Market data unavailable':(result?.total??0).toLocaleString()+' companies match your search'}</span><span>Prices in local currency</span></div>
    {loading?<div className="surface p-5 space-y-4" role="status" aria-label="Loading stocks">{[0,1,2,3,4,5].map(i=><div key={i} className="skeleton h-12"/>)}<span className="sr-only">Loading market data</span></div>:result?.error?<div className="surface empty-state" role="alert"><div className="empty-icon"><ChartIcon/></div><h2>A brief pause in the data.</h2><p>{result.error}</p><button className="btn btn-primary" onClick={()=>setRetry(v=>v+1)}><RotateCcw size={15}/>Try again</button></div>:stocks.length===0?<div className="surface empty-state"><Search size={30}/><h2>No matching companies.</h2><p>Try another symbol or broaden your screening filters.</p></div>:view==='table'?<StockTableView stocks={stocks} sortField={sort} sortDirection={direction} onSort={onSort} onSelectStock={setSelected}/>:<StockCardView stocks={stocks} onSelectStock={setSelected}/>}
    {!loading&&!result?.error&&result&&result.pages>1&&<div className="pagination"><span>Page {page} of {result.pages}</span><div className="flex gap-2"><button className="btn btn-outline" disabled={page<=1} onClick={()=>change({page:String(page-1)})}><ChevronLeft size={14}/>Previous</button><button className="btn btn-outline" disabled={page>=result.pages} onClick={()=>change({page:String(page+1)})}>Next<ChevronRight size={14}/></button></div></div>}
    <p className="text-xs text-muted mt-6 leading-relaxed max-w-4xl">Screening results reflect reported source data and may change. A missing metric is shown as —, not as zero. Research information only; not investment advice.</p>
    {selected&&<StockDetailModal key={selected.country+':'+selected.id} stock={selected} onClose={()=>setSelected(null)}/>}
  </div>;
}
function ChartIcon(){return <SlidersHorizontal size={27}/>}
export default function StocksPage(){return <Suspense fallback={<div className="container py-12"><div className="skeleton h-96"/></div>}><Screener/></Suspense>}
`.trimStart());
let api=fs.readFileSync('features/stocks/api/index.ts','utf8');
api=api.replace('params: StockListParams = {}): Promise<StockListResponse>', 'params: StockListParams = {}, signal?: AbortSignal): Promise<StockListResponse>');
api=api.replace("const url = \u0060\u0024{getBaseUrl()}?\u0024{p.toString()}\u0060;\n  const res = await fetch(url, { cache: 'no-store' });", "const url = \u0060\u0024{getBaseUrl()}?\u0024{p.toString()}\u0060;\n  const res = await fetch(url, { cache: 'no-store', signal });");
// Country counts must never be invented during an outage.
const fallbackStart=api.indexOf('    // Fallback list');
const fallbackEnd=api.indexOf('\n  }\n}',fallbackStart);
api=api.slice(0,fallbackStart)+'    return [];'+api.slice(fallbackEnd);
api=api.replace('getStockHalalAudit(identifier: string)', 'getStockHalalAudit(identifier: string, country?: string)');
api=api.replace('/halal-screening\u0060','/halal-screening?\u0024{new URLSearchParams(country ? { country } : {}).toString()}\u0060');
api=api.replaceAll("{ cache: 'no-store' }", "{ cache: 'no-store', signal: AbortSignal.timeout(15000) }");
fs.writeFileSync('features/stocks/api/index.ts',api);
