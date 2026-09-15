import fs from 'node:fs';
const write=(p,s)=>fs.writeFileSync(p,s.trimStart());
write('features/metals/utils/mappers.ts',`
import type { LatestMetalPrice, MetalPrice, MetalLast10Days, MetalHistoryData, Metal, MetalUnit, MetalPurity } from '../types';
import { UNIT_GRAMS } from './prices';
type Obj=Record<string,unknown>;
const obj=(value:unknown):Obj=>value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Obj:{};
const number=(value:unknown):number|undefined=>value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value))?Number(value):undefined;
const unit=(value:unknown):MetalUnit|undefined=>typeof value==='string'&&Object.hasOwn(UNIT_GRAMS,value)?value as MetalUnit:undefined;
const purities:MetalPurity[]=['24K','22K','18K'];
const metalName=(value:unknown):Metal=>{const key=String(value).toLowerCase();if(!['gold','silver','platinum'].includes(key))throw new Error('Invalid metal');return key as Metal};
function extractPrice(value:unknown,weight:MetalUnit,purity?:MetalPurity):MetalPrice|undefined {
  const record=obj(value);const price=number(record.price??value);if(price===undefined||price<=0)return;
  const change=number(record.change);const direction=record.changeDirection;
  return {unit:weight,purity,price,change:change===undefined?undefined:{value:direction==='down'?-Math.abs(change):change,direction:direction==='down'||change<0?'down':direction==='up'||change>0?'up':'neutral'}};
}
export function mapLatestPrice(response:unknown):LatestMetalPrice {
  const data=obj(obj(response).data);if(!Array.isArray(data.priceTable))throw new Error('Invalid price table');
  const metal=metalName(data.metal);const prices:MetalPrice[]=[];
  for(const value of data.priceTable){const row=obj(value);const weight=unit(Number(row.gram)===1000?'1kg':String(row.gram)+'g');if(!weight)continue;
    if(metal==='gold'){for(const purity of purities){const p=extractPrice(row[purity],weight,purity);if(p)prices.push(p)}}
    else{const p=extractPrice({price:row.today,change:row.change},weight);if(p)prices.push({...p,previousPrice:number(row.yesterday)})}
  }
  return {metal,cityId:Number(data.cityId),cityName:String(data.cityName||''),date:String(data.lastUpdatedAt||''),prices};
}
export function mapLast10Days(response:unknown,metal:Metal,cityId:number):MetalLast10Days {
  const envelope=obj(response);const nested=obj(envelope.data);const raw=Array.isArray(nested.data)?nested.data:Array.isArray(envelope.data)?envelope.data:[];
  const data=raw.flatMap(value=>{const day=obj(value);if(typeof day.date!=='string'||!Number.isFinite(Date.parse(day.date)))return [];const prices:MetalPrice[]=[];
    if(Array.isArray(day.prices)){for(const value of day.prices){const p=obj(value);const weight=unit(p.unit);const purity=purities.includes(p.purity as MetalPurity)?p.purity as MetalPurity:undefined;if(weight){const result=extractPrice(p,weight,purity);if(result)prices.push(result)}}}
    else if(metal==='gold'){for(const purity of purities){const p=extractPrice(day[purity],unit(nested.unit)||'1g',purity);if(p)prices.push(p)}}
    else{for(const weight of Object.keys(UNIT_GRAMS) as MetalUnit[]){const p=extractPrice(day[weight],weight);if(p)prices.push(p)}}
    return [{date:day.date,prices}];
  }).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)).slice(0,10);
  return {metal,cityId,data};
}
export function mapHistoryData(response:unknown):MetalHistoryData {
  const root=obj(response);const nested=obj(root.data);const raw=Array.isArray(nested.data)?nested.data:Array.isArray(root.data)?root.data:Array.isArray(root.result)?root.result:[];
  const data=raw.flatMap(value=>{const p=obj(value);const date=p.date??p.timestamp??p.time??p.created_at;const price=number(p.price??p.value??p.rate??p.close);return typeof date==='string'&&Number.isFinite(Date.parse(date))&&price!==undefined&&price>0?[{date,value:price}]:[]}).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
  return {metal:metalName(nested.metal??root.metal),citySlug:String(nested.city_slug??root.city_slug??''),unit:unit(nested.unit??root.unit)||'1g',purity:purities.includes((nested.purity??root.purity) as MetalPurity)?(nested.purity??root.purity) as MetalPurity:undefined,duration:String(nested.duration??nested.range??root.duration??''),data};
}
`);
// Old table expected an undocumented, untyped envelope. Render the normalized model.
write('features/metals/components/Last10DaysTable.tsx',`
import type { MetalLast10Days,MetalPurity,MetalUnit } from '../types';
import { formatPrice } from '../utils';
import { normalizedPrice } from '../utils/prices';
export function Last10DaysTable({data}:{data:MetalLast10Days}){
  const columns:{label:string;unit:MetalUnit;purity?:MetalPurity}[]=data.metal==='gold'?(['24K','22K','18K'] as MetalPurity[]).map(p=>({label:p+' · 1g',unit:'1g',purity:p})):[{label:'1 gram',unit:'1g'},{label:'10 grams',unit:'10g'},{label:'100 grams',unit:'100g'}];
  return <section className="surface p-6"><span className="eyebrow">RECENT HISTORY</span><h2 className="text-xl mt-2 mb-5">The last 10 reported days</h2>{!data.data.length?<p className="notice">Historical prices are currently unavailable.</p>:<div className="overflow-x-auto"><table className="stock-table"><thead><tr><th>Date</th>{columns.map(c=><th key={c.label}>{c.label}</th>)}</tr></thead><tbody>{data.data.map(day=><tr key={day.date}><td>{new Date(day.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kolkata'})}</td>{columns.map(c=><td key={c.label}>{formatPrice(normalizedPrice(day.prices,c.unit,c.purity))}</td>)}</tr>)}</tbody></table></div>}</section>;
}
`);
let page=fs.readFileSync('app/(metals)/[metal]/[citySlug]/page.tsx','utf8').replaceAll('citySlug: city.slug,','citySlug,').replace('citySlug={city.slug}','citySlug={citySlug}');
write('app/(metals)/[metal]/[citySlug]/page.tsx',page);
let compare=fs.readFileSync('features/metals/components/CityRatesSection.tsx','utf8').replace("import { normalizedPrice }", "import { generateSlug } from '../utils/city';\nimport { normalizedPrice }").replace('slug:city.slug','slug:city.slug||generateSlug(city.name)');write('features/metals/components/CityRatesSection.tsx',compare);
let metals=fs.readFileSync('features/metals/api/metals.server.ts','utf8').replace('apiRequest<any>','apiRequest<unknown>');
// The request already knows the metadata; some history responses omit it.
metals=metals.replace('return mapHistoryData(response);','return mapHistoryData({ ...response, metal: params.metal, city_slug: params.citySlug, unit: params.unit, duration: effectiveDuration, purity: params.purity });');
write('features/metals/api/metals.server.ts',metals);
let selector=fs.readFileSync('features/metals/components/CitySelector.tsx','utf8');
selector=selector.replace('return searchQuery ? searchResults : popularCities;', 'return searchQuery.length >= 2 ? searchResults : popularCities;');
selector=selector.replace('    const timeoutId = setTimeout(async () => {', '    const controller = new AbortController();\n    const timeoutId = setTimeout(async () => {');
selector=selector.replace('`/api/cities/search?query=\u0024{encodeURIComponent(searchQuery)}`','`/api/cities/search?query=\u0024{encodeURIComponent(searchQuery)}`, { signal: controller.signal }');
selector=selector.replace('        const result = await response.json();','        if (!response.ok) throw new Error("Search unavailable");\n        const result = await response.json();\n        if (controller.signal.aborted) return;');
selector=selector.replace('        setSearchResults([]);','        if (!controller.signal.aborted) setSearchResults([]);').replace('        setIsSearching(false);','        if (!controller.signal.aborted) setIsSearching(false);').replace('return () => clearTimeout(timeoutId);','return () => { clearTimeout(timeoutId); controller.abort(); };');
selector=selector.replace('onClick={() => setIsOpen(!isOpen)}','aria-expanded={isOpen}\n        onClick={() => {setIsSearching(false);setIsOpen(!isOpen)}}').replace('<div ref={dropdownRef} className="relative">','<div ref={dropdownRef} className="relative" onKeyDown={e=>{if(e.key==="Escape")setIsOpen(false)}}>').replace('placeholder="Search any Indian city..."','aria-label="Search cities"\n                placeholder="Search any Indian city..."').replace('onChange={(e) => setSearchQuery(e.target.value)}','onChange={(e) => {setSearchQuery(e.target.value);setSearchResults([]);setIsSearching(e.target.value.length>=2)}}');
write('features/metals/components/CitySelector.tsx',selector);
let ipo=fs.readFileSync('app/ipo/[companyName]/page.tsx','utf8');
const from=ipo.indexOf('                        ) : (\n                          <>',ipo.indexOf('id="lotsize"'));
const to=ipo.indexOf('\n                        )}',from);
if(from>=0&&to>=0)ipo=ipo.slice(0,from)+`                        ) : (<tr><td colSpan={4} className="p-5 text-muted">Application categories and limits are not supplied by the source. Check the offer document.</td></tr>`+ipo.slice(to);
write('app/ipo/[companyName]/page.tsx',ipo);
