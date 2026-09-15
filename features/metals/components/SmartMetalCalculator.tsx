'use client';
import { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metal } from '../types';
import { purchaseEstimate, nonNegative } from '@/lib/calculations';
const currency=(value:number)=>value.toLocaleString('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2});
export function SmartMetalCalculator({metal,cityName,prices}:{metal:Metal;cityName:string;prices:{'24K'?:number;'22K'?:number;'18K'?:number;perGram?:number}}) {
  const [purity,setPurity]=useState<'24K'|'22K'|'18K'>('22K');
  const [weight,setWeight]=useState(metal==='silver'?'100':'10');
  const [making,setMaking]=useState(0);
  const [tax,setTax]=useState(true);
  const rate=nonNegative(metal==='gold'?prices[purity]:prices.perGram);
  const result=purchaseEstimate(rate,nonNegative(weight),making,tax?3:0);
  return <section className="surface p-6"><div className="flex items-center gap-3 mb-5"><span className="tool-icon"><Calculator size={21}/></span><div><span className="eyebrow">PLAN YOUR PURCHASE</span><h2 className="text-lg mt-1">{cityName} {metal} calculator</h2></div></div>
    <div className="grid md:grid-cols-2 gap-6"><div className="space-y-5">{metal==='gold'&&<div><span className="form-label">Gold purity</span><div className="range-tabs">{(['24K','22K','18K'] as const).map(p=><button key={p} aria-pressed={purity===p} onClick={()=>setPurity(p)}>{p}</button>)}</div></div>}
      <div><label className="form-label" htmlFor="metal-weight">Weight in grams</label><input id="metal-weight" className="form-input" type="number" min="0.01" max="1000000000000" step="any" value={weight} onChange={e=>setWeight(e.target.value)} aria-invalid={weight!==''&&(!nonNegative(weight)||nonNegative(weight)===null)}/><div className="flex flex-wrap gap-2 mt-2">{[1,8,10,100,1000].map(w=><button className="weight-chip" key={w} onClick={()=>setWeight(String(w))} aria-pressed={Number(weight)===w}>{w===1000?'1 kg':w+' g'}</button>)}</div></div>
      <div><label className="form-label" htmlFor="making-charge">Making charges <span className="text-accent">{making}%</span></label><input id="making-charge" type="range" min="0" max="30" step="0.5" value={making} onChange={e=>setMaking(Number(e.target.value))} className="w-full accent-blue-600"/><p className="text-xs text-muted mt-1">Set the charge quoted by your seller.</p></div>
      <label className="flex items-center gap-2 text-xs text-body"><input type="checkbox" checked={tax} onChange={e=>setTax(e.target.checked)} className="accent-blue-600"/>Include 3% GST on metal + making charges</label>
    </div><div className="calculation-result"><span className="eyebrow">ESTIMATED PURCHASE COST</span><strong className="calculation-total">{result?currency(result.total):'—'}</strong><p className="text-xs text-muted">{rate?currency(rate)+' per gram · source rate':'A source rate is unavailable for this purity.'}</p>
      {result?<dl className="calculation-lines"><div><dt>Metal value</dt><dd>{currency(result.base)}</dd></div><div><dt>Making charges ({making}%)</dt><dd>{currency(result.making)}</dd></div><div><dt>{tax?'GST (3%)':'Tax excluded'}</dt><dd>{currency(result.tax)}</dd></div></dl>:<p className="notice mt-5">{rate?'Enter a valid weight greater than zero to calculate.':'Choose an available purity or check again later.'}</p>}
      <p className="text-[11px] text-muted leading-relaxed mt-5">Estimate only. Other seller charges are excluded. Unchecking GST excludes tax from this estimate; it does not imply an exemption. <a href="https://cbic-gst.gov.in/sectoral-faq.html" target="_blank" rel="noopener noreferrer" className="text-accent underline">GST reference</a>.</p>
    </div></div><Link href="/zakat" className="inline-flex items-center gap-2 text-xs text-accent mt-5">Calculate Zakat across your assets<ArrowRight size={14}/></Link>
  </section>;
}
