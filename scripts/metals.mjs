import fs from 'node:fs';
const write=(p,s)=>fs.writeFileSync(p,s.trimStart());
let page=fs.readFileSync('app/(metals)/[metal]/[citySlug]/page.tsx','utf8');
page="import { Suspense } from 'react';\nimport { CityRatesSection } from '@/features/metals/components/CityRatesSection';\nimport { normalizedPrice } from '@/features/metals/utils/prices';\n"+page;
let a=page.indexOf('  // Fetch comparison rates');let b=page.indexOf('  const mainChange',a);
page=page.slice(0,a)+`  const isGold = metal === 'gold';
  const rate1g_24K = normalizedPrice(latestPrice.prices,'1g','24K');
  const rate10g_24K = normalizedPrice(latestPrice.prices,'10g','24K');
  const rate10g_22K = normalizedPrice(latestPrice.prices,'10g','22K');
  const rate10g_18K = normalizedPrice(latestPrice.prices,'10g','18K');
  const rate8g_24K = normalizedPrice(latestPrice.prices,'8g','24K');
  const rate100g_24K = normalizedPrice(latestPrice.prices,'100g','24K');
  const rateSilver1g = normalizedPrice(latestPrice.prices,'1g');
  const rateSilver10g = normalizedPrice(latestPrice.prices,'10g');
  const rateSilver1kg = normalizedPrice(latestPrice.prices,'1kg');
`+page.slice(b);
page=page.replaceAll('rateSilver1g * 100', "normalizedPrice(latestPrice.prices,'100g')").replaceAll('rateSilver1g * 595', 'rateSilver1g === undefined ? undefined : rateSilver1g * 595');
page=page.replace('getMetalLast10Days(city.id, metal),', 'getMetalLast10Days(city.id, metal).catch(() => ({ metal, cityId: city.id, data: [] })),');
page=page.replace('citySlug: city?.slug || "",','citySlug: city.slug,');
page=page.replace('latestPrice.prices.find((p) => p.purity === "22K" && p.unit === "1g")?.price',"normalizedPrice(latestPrice.prices,'1g','22K')").replace('latestPrice.prices.find((p) => p.purity === "18K" && p.unit === "1g")?.price',"normalizedPrice(latestPrice.prices,'1g','18K')");
page=page.replace(/\{comparisonCities.length > 0 && \([\s\S]*?\n          \)\}/, '<Suspense fallback={<div className="skeleton h-48" />}><CityRatesSection cities={popularCities} metal={metal} citySlug={city.slug}/></Suspense>');
page=page.replace('<HistoryChartSection','<HistoryChartSection key={metal+city.slug}');
// The 595g benchmark is not applicable to platinum.
page=page.replace('Nisab', 'Reference').replace('Tola Weight','10-gram benchmark');
page=page.replace('Live 24K, 22K, 18K Prices', 'Prices').replace('Real-time 24K, 22K & 18K per gram, 10g tola, and 8g sovereign rates.', 'Reported per-gram and multi-weight rates.');
write('app/(metals)/[metal]/[citySlug]/page.tsx',page);
let format=fs.readFileSync('features/metals/utils/format.ts','utf8').replace('formatPrice(price: number)', 'formatPrice(price: number | null | undefined)').replace('  return new Intl.NumberFormat("en-IN", {','  if (price == null || !Number.isFinite(price)) return "—";\n  return new Intl.NumberFormat("en-IN", {');
format=format.replaceAll('maximumFractionDigits: 0','maximumFractionDigits: 2').replace('const sign = change > 0 ? "+" : "";', 'const sign = change > 0 ? "+" : change < 0 ? "−" : "";');
write('features/metals/utils/format.ts',format);
write('features/metals/components/HistoryChartSection.tsx',`
'use client';
import { useState,useEffect } from 'react';
import { HistoryChart } from './HistoryChart';
import { HistoryControls } from './HistoryControls';
import { METAL_CONFIG,CHART_DURATIONS } from '../types';
import type { Metal,MetalPurity,MetalUnit,ChartDuration,ChartPoint } from '../types';
interface Props { metal:Metal; citySlug:string; initialData:ChartPoint[]; initialPurity?:MetalPurity; initialUnit:MetalUnit; initialDuration:ChartDuration; }
export function HistoryChartSection({metal,citySlug,initialData,initialPurity,initialUnit,initialDuration}:Props) {
  const [purity,setPurity]=useState(initialPurity);const [unit,setUnit]=useState(initialUnit);const [duration,setDuration]=useState(initialDuration);const [retry,setRetry]=useState(0);
  const initialKey=[metal,citySlug,initialUnit,initialDuration,initialPurity||'',0].join('|');
  const key=[metal,citySlug,unit,duration,purity||'',retry].join('|');
  const [result,setResult]=useState<{key:string;data:ChartPoint[];error:boolean}>({key:initialKey,data:initialData,error:false});
  const isInitial=key===initialKey&&initialData.length>0;
  const loading=!isInitial&&result.key!==key;
  const data=isInitial?initialData:result.key===key?result.data:[];
  useEffect(()=>{if(isInitial)return;const controller=new AbortController();const p=new URLSearchParams({metal,citySlug,unit,duration});if(metal==='gold'&&purity)p.set('purity',purity);
    fetch('/api/metals/history?'+p.toString(),{signal:controller.signal}).then(async r=>{if(!r.ok)throw new Error('History unavailable');const json=await r.json();if(!Array.isArray(json.data))throw new Error('Invalid history');if(!controller.signal.aborted)setResult({key,data:json.data,error:false})}).catch(()=>{if(!controller.signal.aborted)setResult({key,data:[],error:true})});return()=>controller.abort();
  },[metal,citySlug,unit,duration,purity,key,isInitial]);
  const config=METAL_CONFIG[metal];
  return <section><div className="mb-5"><span className="eyebrow">THE BIGGER PICTURE</span><h2 className="text-xl mt-2 mb-1">{config.displayName} price history</h2><p className="text-xs text-muted">Reported prices · {unit}{purity?' · '+purity:''}</p></div><HistoryControls purities={metal==='gold'?config.purityOptions:undefined} selectedPurity={purity} onPurityChange={metal==='gold'?setPurity:undefined} units={config.historyUnits||config.units} selectedUnit={unit} onUnitChange={setUnit} durations={metal==='platinum'?['9m','1y']:CHART_DURATIONS} selectedDuration={duration} onDurationChange={setDuration}/>{!loading&&!isInitial&&result.error?<div className="empty-state"><p>Price history is unavailable for this selection.</p><button className="btn btn-outline" onClick={()=>setRetry(v=>v+1)}>Try again</button></div>:<div className="mt-5"><HistoryChart data={data} loading={loading} metal={metal}/></div>}</section>;
}
`);
let client=fs.readFileSync('features/metals/api/api-client.ts','utf8');
client="import 'server-only';\n"+client;
client=client.replace('method: options.method || "GET",','method: options.method || "GET",\n    signal: AbortSignal.timeout(12000),').replace('options.revalidate ?','options.revalidate !== undefined ?');
write('features/metals/api/api-client.ts',client);
write('features/metals/api/cities.server.ts',`
import { apiRequest,buildQueryString } from './api-client';
import { ensureCitySlugs,generateSlug } from '../utils';
import type { City,CitySearchParams } from '../types';
function extract(value:unknown):City[] {
  const obj=value as {data?:{cities?:unknown}|unknown[]};
  const raw=Array.isArray(value)?value:Array.isArray(obj?.data)?obj.data:(obj?.data as {cities?:unknown})?.cities;
  if(!Array.isArray(raw))throw new Error('Invalid cities response');
  return ensureCitySlugs(raw.filter((c):c is City=>!!c&&typeof c==='object'&&typeof c.id==='number'&&typeof c.name==='string'));
}
export async function getPopularCities():Promise<City[]> { return extract(await apiRequest<unknown>('/cities/popular',{revalidate:3600})); }
export async function searchCities(params:CitySearchParams):Promise<City[]> { return extract(await apiRequest<unknown>('/cities'+buildQueryString({search:params.search,only_metals:params.only_metals}),{cache:'no-store'})); }
export async function getCityBySlug(slug:string):Promise<City|null> {
  const cities=await searchCities({search:slug.replaceAll('-',' '),only_metals:true});
  return cities.find(c=>c.slug===slug||generateSlug(c.name)===slug)||null;
}
`);
