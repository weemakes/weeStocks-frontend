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
