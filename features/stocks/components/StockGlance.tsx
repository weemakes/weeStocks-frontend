'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { getStockChart } from '../api';
import type { StockItem } from '../types';
import { formatMarketCap, formatSafePrice, formatSafeVolume } from '../utils/mappers';
import CompanyLogo from './CompanyLogo';
import styles from './StocksBrowser.module.css';

export type ChartPeriod = 'session' | 'five';
type Trend = { values: number[]; label: string };
const cache = new Map<string, { expires: number; promise: Promise<Trend> }>();
const queue: Array<() => void> = [];
let active = 0;
function schedule<T>(job: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const run = () => {
      active++;
      job().then(resolve, reject).finally(() => { active--; queue.shift()?.(); });
    };
    if (active < 4) run(); else queue.push(run);
  });
}
function trendFor(stock: StockItem, period: ChartPeriod): Promise<Trend> {
  const key = `${stock.country}:${stock.symbol}:${period}`;
  const existing = cache.get(key);
  if (existing && existing.expires > Date.now()) return existing.promise;
  const promise = schedule(async () => {
    let data = await getStockChart(stock.symbol, period === 'session' ? '1D' : '1W', period === 'session' ? '5m' : '1d', stock.country);
    let label = period === 'session' ? 'Latest session' : '5 sessions';
    if (period === 'session' && (data?.candles?.length ?? 0) < 2) {
      data = await getStockChart(stock.symbol, '1W', '1d', stock.country);
      label = 'Recent sessions';
    }
    let values = (data?.candles ?? []).map(c => Number(c.close)).filter(v => Number.isFinite(v) && v > 0);
    if (label !== 'Latest session') values = values.slice(-5);
    return { values, label };
  });
  if (cache.size >= 300) cache.delete(cache.keys().next().value!);
  cache.set(key, { promise, expires: Date.now() + 180_000 });
  return promise;
}

function MiniTrend({ stock, period }: { stock: StockItem; period: ChartPeriod }) {
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId().replace(/:/g, '');
  const [trend, setTrend] = useState<Trend | null>(null);
  useEffect(() => {
    let cancelled = false;
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      observer.disconnect();
      setTrend(null);
      void trendFor(stock, period).then(result => { if (!cancelled) setTrend(result); });
    }, { root: element.closest('[data-stock-scroll]'), rootMargin: '100px' });
    observer.observe(element);
    return () => { cancelled = true; observer.disconnect(); };
  }, [stock.symbol, stock.country, period, stock]);
  const values = trend?.values ?? [];
  const min = Math.min(...values), max = Math.max(...values);
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${3 + i * 94 / Math.max(1, values.length - 1)} ${max === min ? 17 : 4 + (max - v) / (max - min) * 25}`).join(' ');
  const positive = values.length > 1 ? values[values.length - 1] >= values[0] : stock.changePercent >= 0;
  return <span ref={ref} className={`${styles.trend} ${positive ? styles.positive : styles.negative}`}>
    {values.length > 1 ? <svg viewBox="0 0 100 34" role="img" aria-label={`${stock.symbol} ${trend?.label} closing price trend`}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="currentColor" stopOpacity=".25" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
      <path d={`${line} L97 34 L3 34 Z`} fill={`url(#${id})`} /><path d={line} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg> : <span className={styles.noTrend}>{trend ? 'No trend data' : 'Loading trend…'}</span>}
    <small>{trend?.label ?? (period === 'session' ? 'Latest session' : '5 sessions')}</small>
  </span>;
}

export default function StockGlance({ stock, period }: { stock: StockItem; period: ChartPeriod }) {
  const href = `/stocks/${encodeURIComponent(stock.symbol)}?country=${encodeURIComponent(stock.country || 'India')}`;
  const low = stock.fundamentals.week52Low, high = stock.fundamentals.week52High;
  const validRange = Number.isFinite(low) && Number.isFinite(high) && low > 0 && high > low && stock.price > 0;
  const position = validRange ? Math.max(0, Math.min(100, (stock.price - low) / (high - low) * 100)) : 0;
  const status = stock.complianceStatus === 'compliant' ? 'AAOIFI Pass' : stock.complianceStatus === 'non_compliant' ? 'Non-compliant' : 'Review';
  return <article className={styles.stock}>
    <Link href={href} className={styles.company}><CompanyLogo src={stock.logo_url} symbol={stock.symbol} name={stock.name} size="sm" /><span><strong>{stock.name}</strong><small>{stock.symbol} · {stock.exchange}</small></span></Link>
    <Link href={href} className={styles.glance}><span><b>{formatSafePrice(stock.price, stock.currencySymbol, 2)}</b><small className={stock.changePercent >= 0 ? styles.positive : styles.negative}>{stock.changePercent >= 0 ? '↗ +' : '↘ '}{stock.changePercent.toFixed(2)}%</small></span><MiniTrend stock={stock} period={period} /></Link>
    <div className={styles.range}><div><span>52-week range</span><span>{validRange ? `${Math.round(position)}%` : 'Unavailable'}</span></div>{validRange ? <><div className={styles.track} role="img" aria-label={`${Math.round(position)}% between the 52-week low and high`}><span style={{ width: `${position}%` }} /><i style={{ left: `${position}%` }} /></div><div><span>{formatSafePrice(low, stock.currencySymbol, 0)}</span><span>{formatSafePrice(high, stock.currencySymbol, 0)}</span></div></> : <div className={styles.emptyTrack} />}</div>
    <div className={styles.metrics}><span>Mkt cap <b>{formatMarketCap(stock.rawMarketCap, stock.country)}</b></span><span>P/E <b>{stock.fundamentals.peRatio ? stock.fundamentals.peRatio.toFixed(1) : '—'}</b></span><span>Volume <b>{formatSafeVolume(stock.volume)}</b></span></div>
    <div className={styles.screening}><span className={stock.complianceStatus === 'compliant' ? styles.pass : stock.complianceStatus === 'non_compliant' ? styles.fail : styles.review}>{stock.complianceStatus === 'compliant' ? '✓ ' : stock.complianceStatus === 'non_compliant' ? '× ' : ''}{status}</span><Link href={href}>Research →</Link></div>
  </article>;
}
