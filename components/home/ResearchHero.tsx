'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Calculator, Coins, Rocket, ShieldCheck, TrendingUp } from 'lucide-react';
import type { MarketPulseData } from './MarketPulse';
import { getStockChart } from '@/features/stocks/api';
import CompanyLogo from '@/features/stocks/components/CompanyLogo';
import GlobalMarketSearch from './GlobalMarketSearch';
import styles from './ResearchHero.module.css';

type PricePoint = { date: string; price: number };
function MetalSparkline({ href, positive }: { href: string; positive: boolean }) {
  const [values, setValues] = useState<number[]>([]);
  useEffect(() => {
    let active = true;
    const metal = href.replace('/', '');
    const query = new URLSearchParams({ metal, citySlug: 'mumbai', unit: '1g', duration: '1m', ...(metal === 'gold' ? { purity: '24K' } : {}) });
    void fetch('/api/metals/history?' + query).then(response => {
      if (!response.ok) throw new Error('Metal history unavailable');
      return response.json();
    }).then(result => {
      if (active) setValues((result.data ?? []).map((point: { value: number }) => Number(point.value)).filter((value: number) => Number.isFinite(value) && value > 0));
    }).catch(() => {});
    return () => { active = false; };
  }, [href]);
  if (values.length < 2) return <span className={styles.metalChartEmpty}>History unavailable</span>;
  // A glance chart uses a handful of actual observations rather than every daily wiggle.
  const sampleCount = Math.min(6, values.length);
  const samples = Array.from({ length: sampleCount }, (_, index) => values[Math.round(index / (sampleCount - 1) * (values.length - 1))]);
  const low = Math.min(...samples), range = Math.max(...samples) - low || 1;
  const points = samples.map((value, index) => ({ x: 3 + index / (samples.length - 1) * 114, y: 34 - (value - low) / range * 24 }));
  // Horizontal handles keep each curve within its actual neighbouring price values.
  const line = points.reduce((path, point, index) => {
    if (!index) return `M${point.x} ${point.y}`;
    const previous = points[index - 1];
    const midpoint = (previous.x + point.x) / 2;
    return `${path} C${midpoint} ${previous.y} ${midpoint} ${point.y} ${point.x} ${point.y}`;
  }, '');
  return <svg className={styles.metalChart} viewBox="0 0 120 44" role="img" aria-label="Recent metal price trend" style={{ color: positive ? 'var(--success-green)' : 'var(--danger-red)' }}><path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function useEntrance(key: string, enabled: boolean) {
  const [frame, setFrame] = useState({ key: '', value: 0 });
  useEffect(() => {
    if (!enabled) return;
    let request = 0;
    let start: number | null = null;
    const tick = (time: number) => {
      start ??= time;
      const fraction = Math.min(1, Math.max(0, time - start - 180) / 1400);
      setFrame({ key, value: 1 - Math.pow(1 - fraction, 3) });
      if (fraction < 1) request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [key, enabled]);
  return frame.key === key ? frame.value : 0;
}
function useRotation(length: number, delay: number, paused: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (length < 2 || paused) return;
    const timer = setInterval(() => { if (!document.hidden) setIndex(value => (value + 1) % length); }, delay);
    return () => clearInterval(timer);
  }, [length, delay, paused]);
  return [index % Math.max(1, length), setIndex] as const;
}
function Dots({ length, index, select, label }: { length: number; index: number; select: (index: number) => void; label: string }) {
  return <div className={styles.dots}>{Array.from({ length }, (_, i) => <button key={i} type="button" aria-label={`${label} ${i + 1}`} aria-pressed={i === index} onClick={() => select(i)} />)}</div>;
}

export default function ResearchHero({ data }: { data: MarketPulseData }) {
  const [points, setPoints] = useState<PricePoint[]>([]);
  const hero = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(98);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-site-header]');
    if (!header) return;
    const measure = () => setHeaderHeight(header.getBoundingClientRect().height);
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    measure();
    return () => observer.disconnect();
  }, []);
  const [visible, setVisible] = useState(false);
  const stocks = data.stocksList?.length ? data.stocksList : [data.featuredStock];
  const metals = data.metalsList?.length ? data.metalsList : [{ name: 'Gold 24K', rateDisplay: data.gold.price10g, changeDisplay: data.gold.changeDisplay, isPositive: data.gold.isPositive, unit: 'per 10g', href: '/gold' }];
  const ipos = data.iposList?.length ? data.iposList : [data.topIpo];
  const [stockIndex, setStockIndex] = useRotation(stocks.length, 5000, !visible);
  const [metalIndex, setMetalIndex] = useRotation(metals.length, 2500, !visible);
  const [ipoIndex, setIpoIndex] = useRotation(ipos.length, 2500, !visible);
  const stock = stocks[stockIndex], metal = metals[metalIndex], ipo = ipos[ipoIndex];
  useEffect(() => {
    if (!hero.current) return;
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)), { threshold: 0.15 });
    observer.observe(hero.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let alive = true;
    const timer = setTimeout(() => {
      setPoints([]);
      void getStockChart(stock.symbol, '1M', '1d', stock.country).then(result => {
        if (alive) setPoints((result?.candles ?? []).map(candle => ({ date: candle.date, price: Number(candle.close) })).filter(point => Number.isFinite(point.price) && point.price > 0));
      });
    }, 0);
    return () => { alive = false; clearTimeout(timer); };
  }, [stock.symbol, stock.country]);
  const pass = ['HALAL', 'PASS', 'COMPLIANT'].includes(stock.status.toUpperCase()) || /standard 21 pass/i.test(stock.status);
  const score = stock.aaoifiScore != null && Number.isFinite(stock.aaoifiScore) ? Math.max(0, Math.min(100, stock.aaoifiScore)) : null;
  const meter = score ?? (pass ? 100 : 0);
  const subscription = ipo.subscriptionTimes;
  const gmp = ipo.gmpPercentage;
  const progress = subscription != null ? Math.min(100, Math.max(0, subscription / 50 * 100)) : gmp != null ? Math.min(100, Math.max(0, gmp)) : null;
  const entrance = useEntrance(stock.symbol, visible);
  const ipoEntrance = useEntrance(ipo.slug, visible);
  const chartEntrance = useEntrance(`${stock.symbol}:${points.length}`, visible && points.length > 1);
  const href = `/stocks/${encodeURIComponent(stock.symbol)}?country=${encodeURIComponent(stock.country || 'India')}`;
  return <section ref={hero} style={{ minHeight: `calc(100svh - ${headerHeight}px)` }} className={styles.hero} aria-label="Market research introduction">
    <div className={styles.bgGraphic} aria-hidden="true">
      <Image
        src="/hero-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={80}
        className={styles.bgImage}
      />
      <div className={styles.bgOverlay} />
    </div>
    <div className={styles.main}>
      <div className={styles.copy}><h1>Research markets<br />with clarity. <span>Invest<br className={styles.desktopBreak} /> with confidence.</span></h1><p>Discover Halal and ethical investment opportunities with clear Shariah screening, market research and current financial data.</p><GlobalMarketSearch /><div className={styles.actions}><Link href="/stocks" className={styles.primary}>Explore Screener →</Link><Link href="/about">Our methodology <ShieldCheck size={13} /></Link></div></div>
      <div className={styles.dashboard}>
        <div className={styles.top}>
          <article className={styles.stock}><header><h2>Stock audit</h2><Dots length={stocks.length} index={stockIndex} select={setStockIndex} label="Featured stock" /></header><Link className={styles.identity} href={href}><CompanyLogo src={stock.logoUrl} symbol={stock.symbol} name={stock.name} size="sm" /><span><strong>{stock.name}</strong><small>{stock.symbol} · {stock.country || 'India'}</small></span></Link><div className={styles.mobileCompliance}>{score != null ? `✓ AAOIFI Shariah Pass (${Math.round(score)}%)` : pass ? '✓ AAOIFI Shariah Pass' : 'Shariah screening · Review'}</div><div className={styles.quote}><b>{stock.price}</b><span className={stock.changePct >= 0 ? styles.positive : styles.negative}>{stock.change}</span></div>
            <div className={styles.chart} key={stock.symbol}>{points.length > 1 ? <div style={{ height: '100%', clipPath: `inset(0 ${(1 - chartEntrance) * 100}% 0 0)` }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={points} margin={{ top: 7, right: 5, bottom: 0, left: 0 }}><defs><linearGradient id="hero-stock-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--primary-accent)" stopOpacity={0.28} /><stop offset="1" stopColor="var(--primary-accent)" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--border-subtle)" strokeDasharray="3 4" /><XAxis dataKey="date" axisLine={false} tickLine={false} minTickGap={25} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={date => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} /><YAxis hide domain={['auto', 'auto']} /><Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-active)', borderRadius: 8, fontSize: 12 }} itemStyle={{ color: 'var(--text-primary)' }} labelStyle={{ color: 'var(--text-secondary)' }} formatter={value => [`₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 'Price']} labelFormatter={date => new Date(String(date)).toLocaleDateString('en-IN')} /><Area type="monotone" dataKey="price" stroke="var(--primary-accent)" fill="url(#hero-stock-fill)" strokeWidth={2.3} isAnimationActive={false} animationDuration={1100} /></AreaChart></ResponsiveContainer></div> : <span className={styles.chartEmpty}>{points.length ? 'Chart unavailable' : 'Loading price history…'}</span>}</div>
          </article>
          <div className={styles.auditColumn}><article className={styles.audit}><h2>Compliance audit</h2><div className={styles.gauge} key={`${stock.symbol}:${visible}`}><svg viewBox="0 0 120 110" role="img" aria-label={score != null ? `AAOIFI score ${score}%` : pass ? 'AAOIFI screening passed' : 'AAOIFI screening under review'}><path className={styles.gaugeTrack} d="M22 90 A49 49 0 1 1 98 90" pathLength="100" /><path className={styles.gaugeValue} d="M22 90 A49 49 0 1 1 98 90" pathLength="100" strokeDasharray={`${meter * entrance} 100`} /></svg><div><strong>{score != null ? `${Math.round(score * entrance)}%` : pass ? 'Pass' : 'Review'}</strong><span>AAOIFI<br />Shariah screening</span></div></div><Link href={href}>View full audit ↗</Link></article><div className={styles.debt}>Debt / market cap <b>{stock.debtRatio}</b></div></div>
        </div>
        <div className={styles.widgets}><article className={styles.widget}><header><h2><Coins size={13} />Bullion spot desk</h2><Dots length={metals.length} index={metalIndex} select={setMetalIndex} label="Metal" /></header><Link key={metal.name} href={metal.href} className={styles.widgetBody}><span>{metal.name}<small>{metal.unit}</small></span><div className={styles.metalQuote}><strong>{metal.rateDisplay}</strong><MetalSparkline key={metal.href} href={metal.href} positive={metal.isPositive} /></div><small className={metal.isPositive ? styles.positive : styles.negative}>{metal.changeDisplay}</small></Link></article>
          <article className={`${styles.widget} ${gmp != null && gmp < 0 ? styles.ipoDown : styles.ipoUp}`}><header><h2><Rocket size={13} />IPO GMP</h2><Dots length={ipos.length} index={ipoIndex} select={setIpoIndex} label="IPO" /></header><Link key={ipo.slug} href={`/ipo/${encodeURIComponent(ipo.slug)}`} className={styles.widgetBody}><span className={styles.ipoName}>{ipo.name}</span><strong className={gmp != null && gmp < 0 ? styles.negative : styles.positive}>{ipo.gmpDisplay}</strong><small>{subscription != null ? `Subscription · ${subscription}×` : 'Grey-market premium'}</small><div className={styles.progress}>{progress != null ? <span style={{ width: `${progress * ipoEntrance}%`, background: gmp != null && gmp < 0 ? 'var(--danger-red)' : 'var(--success-green)' }} /> : null}</div><div className={styles.progressLabels}><span>{subscription != null ? '0×' : '0%'}</span><span>{subscription != null ? '50×+' : '100%+'}</span></div></Link></article></div>
        <Link className={styles.nisab} href="/zakat"><Calculator size={13} /><span>Silver Nisab <b>{data.zakatNisab.silverNisabValue}</b></span><span>Calculate →</span></Link>
      </div>
    </div>
    <div className={styles.features}>{[{ title: 'Stock Intelligence', copy: 'Fundamentals, charts and Shariah screening.', href: '/stocks', icon: TrendingUp }, { title: 'IPO Tracker', copy: 'GMP, subscription and key dates.', href: '/ipo', icon: Rocket }, { title: 'Precious Metals', copy: 'Gold, silver and platinum rates.', href: '/gold', icon: Coins }, { title: 'Zakat Calculator', copy: 'Current Nisab and clear calculations.', href: '/zakat', icon: Calculator }].map(item => <Link href={item.href} key={item.href}><item.icon size={19} /><strong>{item.title}</strong><p>{item.copy}</p></Link>)}</div>
  </section>;
}

