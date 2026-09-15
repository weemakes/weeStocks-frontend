import fs from 'node:fs';
const write = (path, content) => fs.writeFileSync(path, content.trimStart());
write('components/layout/Navigation.tsx', `
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, ChartNoAxesCombined, Menu, Search, X } from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';
const links = [
  { href: '/stocks', label: 'Stocks' }, { href: '/ipo', label: 'IPOs' },
  { href: '/gold', label: 'Gold' }, { href: '/silver', label: 'Silver' },
  { href: '/platinum', label: 'Platinum' }, { href: '/zakat', label: 'Zakat calculator' },
];
export default function Navigation() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  return <header className="site-header">
    <div className="container header-inner">
      <Link href="/" className="brand" aria-label="WeeStox home"><span className="brand-mark"><ChartNoAxesCombined size={22} /></span>Wee<span>Stox</span><span className="brand-dot" /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? 'page' : undefined}>{link.label}</Link>)}</nav>
      <div className="header-actions"><Link href="/stocks" className="icon-button header-search" aria-label="Search stocks"><Search size={18} /></Link><ThemeToggle />
        <button className="icon-button mobile-menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setMenuPath(open ? null : pathname)}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-nav container" aria-label="Mobile navigation">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuPath(null)} aria-current={pathname.startsWith(link.href) ? 'page' : undefined}>{link.label}<ArrowUpRight size={16} /></Link>)}</nav>}
  </header>;
}
`);
write('components/layout/Footer.tsx', `
import Link from 'next/link';
import { ChartNoAxesCombined, ArrowUpRight } from 'lucide-react';
export default function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-grid"><div><Link href="/" className="brand"><span className="brand-mark"><ChartNoAxesCombined size={21} /></span>Wee<span>Stox</span></Link><p className="mt-4 max-w-xs text-sm text-muted leading-relaxed">A clearer view of your investments.<br />Research stocks, explore metals, and build financial understanding.</p></div>
      <div><h3>Explore markets</h3><Link href="/stocks">Stock screener</Link><Link href="/ipo">IPO insights</Link><Link href="/gold">Precious metals</Link></div>
      <div><h3>Your toolkit</h3><Link href="/zakat">Zakat calculator</Link><Link href="/about">Screening methodology</Link><a href="mailto:care@weestox.com">Get in touch <ArrowUpRight size={13} /></a></div>
      <div className="footer-note"><span className="eyebrow">RESEARCH WITH CONTEXT</span><p>Screening is a starting point. Review the source data, reporting date, and methodology before making a decision.</p></div>
    </div><div className="footer-bottom"><span>© {new Date().getFullYear()} WeeStox. All rights reserved.</span><span>For education and research. Not investment advice.</span></div>
  </div></footer>;
}
`);
// Migrate existing utilities to shared semantic colors, including opacity and state variants.
const replacements = {
  'bg-slate-950':'bg-canvas','bg-gray-950':'bg-canvas','bg-gray-900':'bg-panel','bg-slate-900':'bg-panel',
  'bg-slate-800':'bg-well','bg-gray-800':'bg-well','bg-slate-700':'bg-elevated','bg-gray-700':'bg-elevated',
  'border-slate-800':'border-line','border-gray-800':'border-line','border-slate-700':'border-line-strong','border-gray-700':'border-line-strong',
  'text-slate-100':'text-ink','text-gray-100':'text-ink','text-white':'text-ink','text-slate-200':'text-ink','text-gray-200':'text-ink',
  'text-slate-300':'text-body','text-gray-300':'text-body','text-slate-400':'text-muted','text-gray-400':'text-muted',
  'text-slate-500':'text-quiet','text-gray-500':'text-quiet',
  'text-sky-400':'text-accent','text-sky-300':'text-accent','text-blue-400':'text-accent','text-blue-300':'text-accent',
  'text-emerald-400':'text-positive','text-green-400':'text-positive','text-emerald-300':'text-positive','text-green-500':'text-positive',
  'text-rose-400':'text-negative','text-rose-300':'text-negative','text-red-400':'text-negative',
  'text-amber-400':'text-warning','text-amber-300':'text-warning','text-yellow-400':'text-warning',
  'placeholder-slate-500':'placeholder-quiet','placeholder-gray-500':'placeholder-quiet',
};
function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]); }
for (const file of ['app','features','components'].flatMap(walk).filter(f=>f.endsWith('.tsx'))) {
  let content=fs.readFileSync(file,'utf8');
  for(const [from,to] of Object.entries(replacements)) content=content.replaceAll(from,to);
  write(file,content);
}
