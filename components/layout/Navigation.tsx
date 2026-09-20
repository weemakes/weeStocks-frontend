'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';

const MARKET_TICKER = [
  { name: 'NIFTY 50', value: '24,980.40', change: '+0.35%', up: true },
  { name: 'SENSEX', value: '81,720.10', change: '+0.28%', up: true },
  { name: 'NIFTY SHARIAH 25', value: '4,850.15', change: '+0.42%', up: true },
  { name: 'GOLD 24K (10g)', value: '₹75,420', change: '+0.38%', up: true },
  { name: 'SILVER (1kg)', value: '₹88,400', change: '-0.12%', up: false },
  { name: 'ACTIVE IPOS', value: '8 Open', change: '+38% GMP', up: true },
  { name: 'TCS', value: '₹4,124.50', change: '+1.18%', up: true },
  { name: 'INFY', value: '₹1,892.40', change: '+1.22%', up: true },
  { name: 'USD/INR', value: '₹83.92', change: '-0.04%', up: false },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* 1. Real-Time Streaming Market Ticker Tape */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/70 dark:border-slate-800/70 text-[11px] py-1 px-4 overflow-hidden select-none">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-slate-200 dark:border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Market Pulse
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 ml-3 relative">
            <div className="flex items-center gap-6 animate-ticker">
              {MARKET_TICKER.concat(MARKET_TICKER).map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="inline-flex items-center gap-1.5 shrink-0">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100 tabular-nums">{item.value}</span>
                  <span
                    className={`inline-flex items-center text-[10px] font-bold tabular-nums ${
                      item.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar - De-congested Institutional Header */}
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-700 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-sm group-hover:shadow-sky-500/25 transition-all">
              W
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  WeeStox
                </span>
                <span className="px-1.5 py-0.2 bg-sky-500/10 dark:bg-sky-400/10 text-sky-600 dark:text-sky-400 text-[9px] font-bold rounded uppercase tracking-wider border border-sky-500/20">
                  Terminal
                </span>
              </div>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 -mt-0.5 tracking-tight hidden xl:inline">
                Halal &amp; Ethical Financial Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium">
            <Link
              href="/"
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/') && pathname === '/'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              Home
            </Link>

            {/* Stocks Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('stocks')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/stocks"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive('/stocks')
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>Stocks</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Live Screener" />
                <ChevronDown className="w-3 h-3 opacity-60" />
              </Link>

              {activeDropdown === 'stocks' && (
                <div className="absolute top-full left-0 pt-1 z-30">
                  <div className="w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 text-xs divide-y divide-slate-100 dark:divide-slate-800/60 animate-fade-in">
                    <div className="pb-1.5 space-y-0.5">
                      <Link
                        href="/stocks"
                        className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                      >
                        <div className="font-semibold">Halal Stock Screener</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">AAOIFI 21 Shariah audit</div>
                      </Link>
                      <Link
                        href="/stocks?preset=zero_debt"
                        className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                      >
                        <div className="font-semibold">Zero-Debt Giants</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Net-cash balance sheets</div>
                      </Link>
                    </div>
                    <div className="pt-1.5 space-y-0.5">
                      <Link
                        href="/stocks?preset=high_dividend"
                        className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                      >
                        <div className="font-semibold">High Dividend Halal</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Purification &lt; 1%</div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metals Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('metals')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive('/gold') || isActive('/silver') || isActive('/platinum')
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>Metals</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeDropdown === 'metals' && (
                <div className="absolute top-full left-0 pt-1 z-30">
                  <div className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 text-xs space-y-0.5 animate-fade-in">
                    <Link
                      href="/gold"
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 transition-colors"
                    >
                      <span className="font-semibold">Gold 24K / 22K</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Live</span>
                    </Link>
                    <Link
                      href="/silver"
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                      <span className="font-semibold">Silver Rates</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">1kg</span>
                    </Link>
                    <Link
                      href="/platinum"
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    >
                      <span className="font-semibold">Platinum Rates</span>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">950</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* IPOs */}
            <Link
              href="/ipo"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/ipo')
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <span>IPOs</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" title="Live GMP" />
            </Link>

            {/* Zakat */}
            <Link
              href="/zakat"
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/zakat')
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              Zakat
            </Link>

            {/* About */}
            <Link
              href="/about"
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive('/about')
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Controls: De-congested & Balanced */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Compact Search Trigger */}
            <Link
              href="/stocks"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
              title="Search stocks (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.2 text-[9px] font-bold text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                ⌘K
              </kbd>
            </Link>

            {/* Single Animated Hacker Theme Toggle */}
            <ThemeToggle />

            {/* Launch Screener CTA */}
            <Link
              href="/stocks"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs shadow-sm shadow-sky-600/25 transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Launch Screener</span>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              className="lg:hidden p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 dark:border-slate-800 animate-fade-in space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium"
            >
              Home
            </Link>
            <Link
              href="/stocks"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium"
            >
              <span>Halal Stocks Screener</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                AAOIFI
              </span>
            </Link>
            <Link
              href="/ipo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium"
            >
              <span>IPO Grey Market Premium</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold px-1.5 py-0.5 rounded">
                Live GMP
              </span>
            </Link>
            <Link
              href="/gold"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Gold Rates (24K / 22K)
            </Link>
            <Link
              href="/silver"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Silver Rates (1kg)
            </Link>
            <Link
              href="/zakat"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Zakat Calculator &amp; Nisab
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              About &amp; Methodology
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
