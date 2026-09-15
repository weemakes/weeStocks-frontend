import fs from 'node:fs';
const write=(p,s)=>fs.writeFileSync(p,s);
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
for(const p of ['app','features','components','lib'].flatMap(walk).filter(p=>/\.tsx?$/.test(p))) {
  let s=fs.readFileSync(p,'utf8').replaceAll('\r\n','\n');
  const map={'from-slate-950':'from-canvas','via-slate-950':'via-canvas','to-slate-950':'to-canvas','from-slate-900':'from-panel','via-slate-900':'via-panel','to-slate-900':'to-panel','divide-slate-800':'divide-line','divide-gray-800':'divide-line','from-gray-900':'from-panel','to-gray-900':'to-panel','from-gray-950':'from-canvas','to-gray-950':'to-canvas','bg-slate-750':'bg-elevated','bg-slate-850':'bg-elevated'};
  for(const [a,b] of Object.entries(map))s=s.replaceAll(a,b);
  s=s.replaceAll('10g (Tola)','10g').replaceAll('10 Grams (1 Tola / Benchmark)','10 Grams (Benchmark)').replaceAll('10g tola','10g').replaceAll('10g Tola','10g').replaceAll('Tola Weight','10-gram benchmark');
  write(p,s);
}
let ipo=fs.readFileSync('app/ipo/[companyName]/page.tsx','utf8');
const from=ipo.indexOf('                        ) : (\n                          <>',ipo.indexOf('id="lotsize"'));
const to=ipo.indexOf('\n                        )}',from);
if(from>=0&&to>=0)ipo=ipo.slice(0,from)+`                        ) : (<tr><td colSpan={4} className="p-5 text-muted">Application categories and limits are not supplied by the source. Check the offer document.</td></tr>`+ipo.slice(to);
const start=ipo.indexOf('    // Chittorgarh standard lot applications');const end=ipo.indexOf('\n    return (',start);
if(start>=0)ipo=ipo.slice(0,start)+ipo.slice(end);
ipo=ipo.replace('    const isSme = profile.type?.toLowerCase().includes(\'sme\');\n','');
write('app/ipo/[companyName]/page.tsx',ipo);
let about=fs.readFileSync('app/about/page.tsx','utf8').replace("world's",'world’s').replace("We're",'We’re');write('app/about/page.tsx',about);
let filter=fs.readFileSync('app/ipo/components/IPOFilters.tsx','utf8').replace('(currentParams as any)[k] === (preset.params as any)[k]','(currentParams as Record<string,unknown>)[k] === (preset.params as Record<string,unknown>)[k]');write('app/ipo/components/IPOFilters.tsx',filter);
let ipotypes=fs.readFileSync('features/ipo/types/index.ts','utf8').replace('Array<Record<string, any>>','Array<{category?: string; day_1?: number | string | null; day_2?: number | string | null; day_3?: number | string | null}>').replace('peer_comparison?: any[]','peer_comparison?: unknown[]');write('features/ipo/types/index.ts',ipotypes);
let sub=fs.readFileSync('features/ipo/components/SubscriptionTabsSection.tsx','utf8').replace('(item: any, idx: number)','(item, idx)');write('features/ipo/components/SubscriptionTabsSection.tsx',sub);
write('features/metals/components/GoldCalculator.tsx',`import { SmartMetalCalculator } from './SmartMetalCalculator';\nexport function GoldCalculator({prices}:{prices:{'24K':number;'22K':number;'18K':number}}){return <SmartMetalCalculator metal="gold" cityName="" prices={prices}/>;}\n`);
let debug=fs.readFileSync('app/debug/page.tsx','utf8').replace('import { notFound }',"import Link from 'next/link';\nimport { notFound }").replace('<a className=', '<Link prefetch={false} className=').replace('</a>','</Link>');write('app/debug/page.tsx',debug);
let broker=fs.readFileSync('features/ipo/components/BrokerConsensusSection.tsx','utf8').replace('const reviews = brokerReviews || [];','const reviews = useMemo(() => brokerReviews || [], [brokerReviews]);');write('features/ipo/components/BrokerConsensusSection.tsx',broker);
let mapper=fs.readFileSync('features/stocks/utils/mappers.ts','utf8').replace('item: StockListItem,','item: Partial<StockListItem>,').replace('id: item.id, symbol: item.symbol, name: item.company_name,','id: item.id || item.symbol || "", symbol: item.symbol || "", name: item.company_name || item.symbol || "",').replace('exchange: item.exchange,','exchange: item.exchange || "",');write('features/stocks/utils/mappers.ts',mapper);
// Restore market movers with an unknown placeholder until the detail request resolves.
let stocks=fs.readFileSync('app/stocks/page.tsx','utf8').replace('StockTableView, StockCardView','StockMarketMovers, StockTableView, StockCardView');
stocks=stocks.replace('    {!loading&&!result?.error&&<StockSummaryStrip stocks={stocks}/>}',`    {!loading&&!result?.error&&<StockSummaryStrip stocks={stocks}/>}\n    <StockMarketMovers country={country} onSelectStock={symbol=>setSelected(stocks.find(s=>s.symbol===symbol)||mapBackendStockToStockItem({id:symbol,symbol,company_name:symbol,country}))}/>`);
write('app/stocks/page.tsx',stocks);
let exports=fs.readFileSync('features/stocks/components/index.ts','utf8').replace(/^.*StockFilterBar.*\n/gm,'');write('features/stocks/components/index.ts',exports);
// Label the unused legacy preview as illustrative if it is reused later.
let preview=fs.readFileSync('components/home/HeroScannerPreview.tsx','utf8').replace('Live Screening','Illustrative screening').replace('Live Scanner','Demo scanner');write('components/home/HeroScannerPreview.tsx',preview);
