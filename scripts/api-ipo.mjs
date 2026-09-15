import fs from 'node:fs';
const write=(p,s)=>fs.writeFileSync(p,s.trimStart());
write('app/api/stocks/route.ts',`import { NextRequest } from 'next/server';\nimport { proxyStocks } from '@/lib/stock-proxy';\nexport async function GET(request:NextRequest){return proxyStocks(request)}\n`);
write('app/api/stocks/[...path]/route.ts',`import { NextRequest } from 'next/server';\nimport { proxyStocks } from '@/lib/stock-proxy';\nexport async function GET(request:NextRequest,context:{params:Promise<{path:string[]}>}){return proxyStocks(request,(await context.params).path)}\n`);
write('app/api/test-backend/route.ts',`import { NextResponse } from 'next/server';\nexport async function GET(){if(process.env.NODE_ENV!=='development')return NextResponse.json({message:'Not found'},{status:404});try{const response=await fetch((process.env.BACKEND_API_URL||'http://localhost:3000')+'/cities/popular',{signal:AbortSignal.timeout(5000),cache:'no-store'});return NextResponse.json({available:response.ok})}catch{return NextResponse.json({available:false},{status:502})}}\n`);
write('app/debug/page.tsx',`import { notFound } from 'next/navigation';\nexport default function DebugPage(){if(process.env.NODE_ENV!=='development')notFound();return <div className="container py-12"><h1 className="text-2xl">Development diagnostics</h1><p className="mt-4 text-muted">Use the <a className="text-accent underline" href="/api/test-backend">connectivity check</a> to check the backend. Server configuration is not exposed.</p></div>}\n`);
let api=fs.readFileSync('features/ipo/api/index.ts','utf8');
api="import 'server-only';\n"+api;
api=api.replaceAll("cache: 'no-store',","cache: 'no-store',\n    signal: AbortSignal.timeout(12000),");
api=api.replace('`Failed to fetch IPO list from \u0024{url}: \u0024{response.status} \u0024{response.statusText}`',"'IPO listings are temporarily unavailable'");
write('features/ipo/api/index.ts',api);
for(const file of ['app/ipo/page.tsx','app/ipo/[companyName]/page.tsx']) {
  let s=fs.readFileSync(file,'utf8');
  // Errors now reach the route boundary; JSX is outside fetch exception handling.
  const start=s.indexOf('  try {',s.indexOf('export default async function'));
  const finish=s.lastIndexOf('  } catch (error: any)');
  s=s.slice(0,start)+s.slice(start+8,finish)+'\n}\n';
  if(file==='app/ipo/page.tsx') {
    s="import { queryUrl } from '@/lib/query';\n"+s;
    const a=s.indexOf('    const getSortUrl');const b=s.indexOf('\n    return (',a);
    s=s.slice(0,a)+`    const getSortUrl = (sortKey:string) => queryUrl('/ipo',params as Record<string,unknown>,{sort:sortKey,page:1});\n`+s.slice(b);
    s=s.replace(/href=\{\u0060\/ipo\?page=\u0024\{page - 1\}[\s\S]*?\u0060\}/,"href={queryUrl('/ipo',params as Record<string,unknown>,{page:page-1})}");
    s=s.replace(/href=\{\u0060\/ipo\?page=\u0024\{page \+ 1\}[\s\S]*?\u0060\}/,"href={queryUrl('/ipo',params as Record<string,unknown>,{page:page+1})}");
    s=s.replace("page: params.page ? parseInt(String(params.page)) : 1", "page: Math.max(1,Math.min(100000,parseInt(String(params.page))||1))").replace("limit: params.limit ? parseInt(String(params.limit)) : 20", "limit: Math.max(1,Math.min(100,parseInt(String(params.limit))||20))");
    s=s.replace('<IPOFilters','<IPOFilters key={JSON.stringify(params)}');
  } else {
    const a=s.indexOf('    // Synthesize historical');const b=s.indexOf('\n    return (',a);
    s=s.slice(0,a)+s.slice(b);
    const c=s.indexOf('            <section id="market-data"');const d=s.indexOf('            </section>',c);
    s=s.slice(0,c)+`            <section id="market-data" className="surface p-6"><span className="eyebrow">REPORTED MARKET SNAPSHOT</span><h2 className="text-xl mt-2 mb-4">Grey market premium</h2><GMPDisclaimer/><div className="grid sm:grid-cols-3 gap-5 mt-5"><div><p className="text-xs text-muted">Reported GMP</p><strong className="text-2xl text-ink">{gmp?.value==null?'—':'₹'+gmp.value}</strong></div><div><p className="text-xs text-muted">Reported estimated listing</p><strong className="text-2xl text-ink">{estimates?.est_listing==null?'—':'₹'+estimates.est_listing}</strong></div><div><p className="text-xs text-muted">Snapshot date</p><strong className="text-base text-ink">{formatDate(gmp?.snapshot_date)}</strong></div></div><p className="text-xs text-muted mt-5">Historical observations are not provided by the current data source. No historical prices are inferred from this snapshot.</p></section>`+s.slice(d+'            </section>'.length);
    s=s.replaceAll("decodeURIComponent(companyName)",'companyName');
    s=s.replace('issue_details?.price_band_upper || issue_details?.price_band_lower || 100','issue_details?.price_band_upper || issue_details?.price_band_lower || 0');
    // Avoid fabricated lot categories when source lot distributions are unavailable.
    s=s.replace('Math.floor(200000 / (lotSize * upperPrice))','(upperPrice > 0 ? Math.floor(200000 / (lotSize * upperPrice)) : 0)').replace('Math.floor(1000000 / (lotSize * upperPrice))','(upperPrice > 0 ? Math.floor(1000000 / (lotSize * upperPrice)) : 0)');
    s=s.replace('100% Halal','Halal');
  }
  write(file,s);
}
let broker=fs.readFileSync('features/ipo/components/BrokerConsensusSection.tsx','utf8');
broker=broker.replace("{applyPct >= 50 ? \u0060\u0024{applyPct}% Positive (Apply)\u0060 : \u0060\u0024{neutralPct}% Neutral\u0060}", "{applyPct > 50 ? applyPct+'% Apply' : avoidPct > 50 ? avoidPct+'% Avoid' : neutralPct > 50 ? neutralPct+'% Neutral' : 'Mixed / no majority'}");
write('features/ipo/components/BrokerConsensusSection.tsx',broker);
