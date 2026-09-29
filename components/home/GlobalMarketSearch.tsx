'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Building2, Gem, LoaderCircle, Rocket, Search } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'stock' | 'ipo' | 'metal';
  title: string;
  subtitle: string;
  href: string;
  logoUrl?: string | null;
}

const popular = [
  { label: 'RELIANCE', href: '/stocks/RELIANCE?country=India' },
  { label: 'TCS', href: '/stocks/TCS?country=India' },
  { label: 'Gold 24K', href: '/gold' },
  { label: 'Live IPO GMP', href: '/ipo' },
];

function ResultIcon({ result }: { result: SearchResult }) {
  if (result.logoUrl) return <Image src={result.logoUrl} alt="" width={32} height={32} className="h-8 w-8 rounded-lg border border-slate-200 object-contain dark:border-slate-700" unoptimized />;
  const Icon = result.type === 'stock' ? Building2 : result.type === 'ipo' ? Rocket : Gem;
  const tone = result.type === 'stock' ? 'bg-sky-100 text-sky-600' : result.type === 'ipo' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600';
  return <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></span>;
}

export default function GlobalMarketSearch() {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    const value = query.trim();
    if (!value) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`, { signal: controller.signal });
        const payload = await response.json() as { data?: SearchResult[] };
        setResults(Array.isArray(payload.data) ? payload.data : []);
        setOpen(true);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (results[0]) router.push(results[0].href);
    else if (query.trim()) router.push(`/stocks?search=${encodeURIComponent(query.trim())}`);
  };

  return <div ref={wrapperRef} className="relative mt-5 max-w-xl">
    <form onSubmit={submit} className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-sky-900/5 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:ring-sky-950">
      <Search className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
      <input value={query} onChange={(event) => { const value = event.target.value; setQuery(value); if (!value.trim()) { setResults([]); setOpen(false); setLoading(false); } }} onFocus={() => query.trim() && setOpen(true)} aria-label="Search markets" placeholder="Search stocks, IPOs or metals…" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400" />
      {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-sky-500" />}
      <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-700">Search</button>
    </form>
    {open && query.trim() && <div role="listbox" className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
      {results.map((result) => <Link key={result.id} href={result.href} role="option" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-sky-50 dark:hover:bg-sky-950/30"><ResultIcon result={result} /><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-slate-900 dark:text-white">{result.title}</strong><span className="block truncate text-[10px] text-slate-500">{result.subtitle}</span></span><span className="rounded bg-slate-100 px-2 py-1 text-[8px] font-bold uppercase text-slate-500 dark:bg-slate-800">{result.type}</span></Link>)}
      {!loading && results.length === 0 && <p className="px-4 py-5 text-center text-xs text-slate-500">No matching stocks, IPOs or metals found.</p>}
    </div>}
    <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-slate-500"><span>Popular:</span>{popular.map((item) => <Link key={item.label} href={item.href} className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-sky-950">{item.label}</Link>)}</div>
  </div>;
}
