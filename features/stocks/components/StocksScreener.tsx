'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Activity, Filter, LayoutGrid, List, Loader2, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { getAvailableCountries, getFiltersConfig, getMarketMovers, getStocksList, type StockListParams } from '../api';
import type { MarketMoverItem, StockCountry, StockFiltersConfig, StockItem, StockListResponse } from '../types';
import { formatSafePct, formatSafeVolume, mapBackendStockToStockItem } from '../utils/mappers';
import StockGlance, { type ChartPeriod } from './StockGlance';
import Select from '@/components/ui/Select';
import styles from './StocksBrowser.module.css';

type MoverType = 'gainers' | 'losers' | 'active';
const groups = [{ type: 'gainers' as const, label: 'Top gainers', icon: TrendingUp }, { type: 'losers' as const, label: 'Top losers', icon: TrendingDown }, { type: 'active' as const, label: 'Most active', icon: Activity }];
function Movers({ country, onSelect }: { country: string; onSelect: (preset: string) => void }) {
  const [data, setData] = useState<Partial<Record<MoverType, MarketMoverItem[]>>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<MoverType>('gainers');
  useEffect(() => {
    let current = true;
    void Promise.all(groups.map(async group => [group.type, await getMarketMovers(country, group.type, 5)] as const)).then(results => {
      if (current) { setData(Object.fromEntries(results)); setLoading(false); }
    });
    return () => { current = false; };
  }, [country]);
  return <section className={styles.movers} aria-label={`${country} market movers`}>
    <div className={styles.sectionHeading}><h2>Market movers</h2><span>Latest available market data</span></div>
    <div className={styles.moverTabs}>{groups.map(group => <button key={group.type} aria-pressed={tab === group.type} onClick={() => setTab(group.type)}>{group.label}</button>)}</div>
    <div className={styles.moverGrid}>{groups.map(group => <article key={group.type} className={`${styles.mover} ${tab === group.type ? styles.activeMover : ''}`}>
      <h3><group.icon size={14} />{group.label}</h3>
      {loading ? <p className={styles.muted}>Loading…</p> : data[group.type]?.length ? <ol>{data[group.type]!.map(stock => <li key={stock.id}><Link href={`/stocks/${encodeURIComponent(stock.symbol)}?country=${encodeURIComponent(country)}`}><span>{stock.symbol}</span><b className={group.type === 'active' ? '' : Number(stock.change_percentage) >= 0 ? styles.positive : styles.negative}>{group.type === 'active' ? formatSafeVolume(stock.volume) : formatSafePct(stock.change_percentage)}</b></Link></li>)}</ol> : <p className={styles.muted}>No market data available.</p>}
      <button className={styles.viewAll} onClick={() => onSelect(group.type === 'active' ? 'most_active' : group.type)}>View all →</button>
    </article>)}</div>
  </section>;
}

function Browser({ initialData, initialCountry }: { initialData: StockListResponse; initialCountry: string }) {
  const searchParams = useSearchParams();
  const [country, setCountry] = useState(initialCountry);
  const [countries, setCountries] = useState<StockCountry[]>([]);
  const [config, setConfig] = useState<StockFiltersConfig | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sector, setSector] = useState('All');
  const [status, setStatus] = useState<StockListParams['halal_status']>('ALL');
  const [preset, setPreset] = useState(searchParams.get('filter') === 'zero_debt' ? 'zero_debt' : 'all');
  const [pe, setPe] = useState('all');
  const [cap, setCap] = useState('all');
  const [sort, setSort] = useState('market_cap:DESC');
  const [view, setView] = useState<'rows' | 'cards'>('cards');
  const [period, setPeriod] = useState<ChartPeriod>('session');
  const [showFilters, setShowFilters] = useState(false);
  const [stocks, setStocks] = useState<StockItem[]>(() => initialData.data.map(s => mapBackendStockToStockItem(s, initialCountry)));
  const [total, setTotal] = useState(initialData.meta.total);
  const [pages, setPages] = useState(initialData.meta.totalPages);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moreError, setMoreError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<HTMLElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const generation = useRef(0);
  const busy = useRef(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const siteHeader = document.querySelector<HTMLElement>('[data-site-header]');
    if (!siteHeader) return;
    const alignHeader = () => browserRef.current?.style.setProperty('--dock-top', `${siteHeader.getBoundingClientRect().height}px`);
    alignHeader();
    const observer = new ResizeObserver(alignHeader);
    observer.observe(siteHeader);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { let alive = true; void getAvailableCountries().then(items => { if (alive) setCountries(items); }); return () => { alive = false; }; }, []);
  useEffect(() => { let alive = true; void getFiltersConfig(country).then(value => { if (alive) setConfig(value); }); return () => { alive = false; }; }, [country]);
  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(search), 300); return () => clearTimeout(timer); }, [search]);
  const params = useMemo<StockListParams>(() => {
    const [sort_by, sort_order] = sort.split(':');
    return { country, search: debouncedSearch, sector: sector === 'All' ? undefined : sector, halal_status: status, preset: preset === 'all' ? undefined : preset,
      sort_by, sort_order: sort_order as 'ASC' | 'DESC', limit: 20, pe_max: pe === 'all' ? undefined : Number(pe),
      market_cap_min: cap === 'large' ? 200_000_000_000 : cap === 'mid' ? 50_000_000_000 : undefined,
      market_cap_max: cap === 'small' ? 49_999_999_999 : cap === 'mid' ? 199_999_999_999 : undefined };
  }, [country, debouncedSearch, sector, status, preset, sort, pe, cap]);
  useEffect(() => {
    const version = ++generation.current;
    const controller = new AbortController();
    busy.current = true;
    const timer = setTimeout(() => {
      setLoading(true); setLoadingMore(false); setError(null); setMoreError(false);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      void getStocksList({ ...params, page: 1 }, controller.signal).then(result => {
        if (generation.current !== version) return;
        if (!Array.isArray(result.data)) throw new Error('Invalid stock response');
        setStocks(result.data.map(stock => mapBackendStockToStockItem(stock, country)));
        setTotal(result.meta.total); setPages(result.meta.totalPages); setPage(1);
      }).catch(() => { if (!controller.signal.aborted && generation.current === version) setError('Stock data could not be loaded. Please retry.'); })
        .finally(() => { if (generation.current === version) { busy.current = false; setLoading(false); } });
    }, 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [params, country, retry]);
  const loadMore = useCallback(async (isRetry = false) => {
    if (busy.current || loading || page >= pages || (error && !isRetry)) return;
    busy.current = true;
    const version = generation.current;
    setLoadingMore(true); setError(null); setMoreError(false);
    try {
      const result = await getStocksList({ ...params, page: page + 1 });
      if (generation.current !== version) return;
      if (!Array.isArray(result.data)) throw new Error('Invalid stock response');
      const incoming = result.data.map(s => mapBackendStockToStockItem(s, country));
      setStocks(previous => { const ids = new Set(previous.map(s => s.id)); return [...previous, ...incoming.filter(s => !ids.has(s.id))]; });
      setPage(page + 1); setTotal(result.meta.total); setPages(result.meta.totalPages);
    } catch { if (generation.current === version) { setError('More stocks could not be loaded. Retry to continue.'); setMoreError(true); } }
    finally { if (generation.current === version) { busy.current = false; setLoadingMore(false); } }
  }, [params, country, loading, page, pages, error]);
  useEffect(() => {
    const target = sentinel.current;
    if (!target || loading || loadingMore || error || page >= pages) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) void loadMore(); }, { root: scrollRef.current, rootMargin: '180px', threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore, loading, loadingMore, error, page, pages, stocks.length]);
  function reset() { setSearch(''); setSector('All'); setStatus('ALL'); setPreset('all'); setPe('all'); setCap('all'); setSort('market_cap:DESC'); }
  function selectPreset(value: string) {
    setPreset(value); setStatus('ALL');
    setSort(value === 'gainers' ? 'change_pct:DESC' : value === 'losers' ? 'change_pct:ASC' : value === 'most_active' ? 'volume:DESC' : 'market_cap:DESC');
  }
  const choices = config?.sort_options?.length ? config.sort_options : [{ id: 'market_cap', label: 'Market capitalisation' }, { id: 'pe_ratio', label: 'P/E ratio' }, { id: 'volume', label: 'Volume' }];
  return <section ref={browserRef} className={styles.browser} aria-label="Stock screener">
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Stocks</span></nav>
    <div className={styles.dock}>
      <div className={styles.title}><h1>{country} Stock Screener</h1><span>{total.toLocaleString()} companies</span><Select className={styles.marketSelect} label="Select market" value={country} onChange={value => { setCountry(value); reset(); }} options={countries.length ? countries.map(item => ({ value: item.country, label: item.country, description: `${item.total_companies.toLocaleString()} stocks` })) : [{ value: country, label: country }]} /></div>
      <div className={styles.toolbar}><label className={styles.search}><Search size={17} /><input aria-label="Search companies" placeholder="Search company or symbol…" value={search} onChange={e => setSearch(e.target.value)} /></label>
        <Select className={styles.sortSelect} label="Sort stocks" value={sort} onChange={setSort} options={choices.flatMap(option => ['DESC', 'ASC'].map(order => ({ value: `${option.id}:${order}`, label: `${option.label} · ${order === 'DESC' ? 'High to low' : 'Low to high'}` })))} />
        <button className={styles.filterButton} aria-expanded={showFilters} onClick={() => setShowFilters(v => !v)}><Filter size={14} />Filters</button>
        <div className={styles.segment} aria-label="Chart period"><button aria-pressed={period === 'five'} onClick={() => setPeriod('five')}>5 sessions</button><button aria-pressed={period === 'session'} onClick={() => setPeriod('session')}>Latest session</button></div>
        <div className={styles.segment} aria-label="Stock display"><button aria-pressed={view === 'rows'} onClick={() => setView('rows')}><List size={14} />Rows</button><button aria-pressed={view === 'cards'} onClick={() => setView('cards')}><LayoutGrid size={14} />Cards</button></div>
      </div>
      <div className={styles.presets}>{[['all', 'All stocks'], ['halal_only', '✓ Shariah compliant'], ['gainers', 'Gainers'], ['losers', 'Losers'], ['most_active', 'Most active']].map(([id, label]) => <button key={id} aria-pressed={preset === id} onClick={() => selectPreset(id)}>{label}</button>)}</div>
    </div>
    <div className={styles.workspace}>
      <aside className={`${styles.sidebar} ${showFilters ? styles.filtersOpen : ''}`} aria-label="Stock filters"><h2>Refine your search</h2>
        <div className={styles.filterField}><span>Sector</span><Select label="Sector" value={sector} onChange={setSector} options={[{ value: 'All', label: 'All sectors' }, ...(config?.sectors ?? []).map(value => ({ value, label: value }))]} /></div>
        <div className={styles.filterField}><span>P/E ratio</span><Select label="P/E ratio" value={pe} onChange={setPe} options={[{ value: 'all', label: 'Any P/E' }, ...[5, 10, 20, 30, 50].map(value => ({ value: String(value), label: `Up to ${value}` }))]} /></div>
        <div className={styles.filterField}><span>Market capitalisation</span><Select label="Market capitalisation" value={cap} onChange={setCap} options={[{ value: 'all', label: 'All companies' }, { value: 'large', label: 'Large cap' }, { value: 'mid', label: 'Mid cap' }, { value: 'small', label: 'Small cap' }]} /></div>
        <div className={styles.filterField}><span>Shariah screening</span><Select label="Shariah screening" value={status || 'ALL'} onChange={value => { setStatus(value as StockListParams['halal_status']); setPreset('all'); }} options={[{ value: 'ALL', label: 'All statuses' }, { value: 'HALAL', label: 'Compliant' }, { value: 'NON_HALAL', label: 'Non-compliant' }, { value: 'DOUBTFUL', label: 'Review' }]} /></div>
        <button className={styles.reset} onClick={reset}>Reset filters</button><p>AAOIFI Standard No. 21<br />Screening and price performance are shown separately.</p>
      </aside>
      <div ref={scrollRef} className={styles.scroll} data-stock-scroll role="region" aria-label="Market movers and stock results" tabIndex={0}>
        <Movers key={country} country={country} onSelect={selectPreset} />
        <div className={styles.sectionHeading}><h2>All stocks</h2><span aria-live="polite">{loading ? 'Updating…' : `${stocks.length} of ${total.toLocaleString()} shown`}</span></div>
        {error && <div role="status" className={styles.error}>{error}<button onClick={() => moreError ? void loadMore(true) : setRetry(value => value + 1)}>Retry</button></div>}
        {loading ? <div className={styles.loading}><Loader2 size={20} className={styles.spinner} />Loading stocks…</div> : error && !moreError ? null : stocks.length ? <div className={view === 'cards' ? styles.cards : styles.rows}>{stocks.map(stock => <StockGlance key={`${country}:${stock.id}`} stock={stock} period={period} />)}</div> : <p className={styles.empty}>No companies match these filters. Try broadening your search.</p>}
        <div ref={sentinel} className={styles.loadMore} aria-live="polite">{loadingMore ? <><Loader2 size={15} className={styles.spinner} />Loading more stocks…</> : !loading && page < pages && !error ? <button onClick={() => void loadMore()}>Load more stocks ↓</button> : !loading && !error ? <span>All matching companies loaded.</span> : null}</div>
      </div>
    </div>
  </section>;
}

export default function StocksScreener(props: { initialData: StockListResponse; initialCountry: string }) {
  return <Suspense fallback={<p>Loading stock screener…</p>}><Browser {...props} /></Suspense>;
}
