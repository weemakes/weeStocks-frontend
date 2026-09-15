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
