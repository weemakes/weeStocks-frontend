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
