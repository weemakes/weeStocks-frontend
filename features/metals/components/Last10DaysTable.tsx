import type { MetalLast10Days,MetalPurity,MetalUnit } from '../types';
import { formatPrice } from '../utils';
import { normalizedPrice } from '../utils/prices';
export function Last10DaysTable({data}:{data:MetalLast10Days}){
  const columns:{label:string;unit:MetalUnit;purity?:MetalPurity}[]=data.metal==='gold'?(['24K','22K','18K'] as MetalPurity[]).map(p=>({label:p+' · 1g',unit:'1g',purity:p})):[{label:'1 gram',unit:'1g'},{label:'10 grams',unit:'10g'},{label:'100 grams',unit:'100g'}];
  return <section className="surface p-6"><span className="eyebrow">RECENT HISTORY</span><h2 className="text-xl mt-2 mb-5">The last 10 reported days</h2>{!data.data.length?<p className="notice">Historical prices are currently unavailable.</p>:<div className="overflow-x-auto"><table className="stock-table"><thead><tr><th>Date</th>{columns.map(c=><th key={c.label}>{c.label}</th>)}</tr></thead><tbody>{data.data.map(day=><tr key={day.date}><td>{new Date(day.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kolkata'})}</td>{columns.map(c=><td key={c.label}>{formatPrice(normalizedPrice(day.prices,c.unit,c.purity))}</td>)}</tr>)}</tbody></table></div>}</section>;
}
