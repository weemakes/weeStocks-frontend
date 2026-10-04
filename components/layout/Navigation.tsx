'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Coins,
  Gem,
  Layers,
  Flame,
  Calculator,
  BookOpen,
  Home,
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
      {/* 1. Real-Time Streaming Market Ticker Tape Carousel */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/70 dark:border-slate-800/70 text-[11px] py-1 overflow-hidden select-none">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1.5 shrink-0 pr-2.5 sm:pr-3 border-r border-slate-200 dark:border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="hidden sm:inline">Market </span>Pulse
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 ml-2.5 sm:ml-3 relative">
            <div className="flex items-center gap-6 animate-ticker">
              {MARKET_TICKER.concat(MARKET_TICKER).map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="inline-flex items-center gap-1.5 shrink-0">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100 tabular-nums">{item.value}</span>
                  <span
                    className={`inline-flex items-center text-[10px] font-bold tabular-nums ${item.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
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

      {/* 2. Main Navigation Bar - Unified Institutional Header */}
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-3">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 group py-1"
            aria-label="WeeStox - Halal & Ethical Financial Intelligence"
          >
            <div className="relative h-12 sm:h-14 w-auto aspect-[490/193]">
              <Image
                src="/logo_light.png"
                alt="WeeStox"
                width={490}
                height={193}
                className="h-full w-auto object-contain dark:hidden group-hover:scale-[1.02] transition-transform"
                priority
              />
              <Image
                src="/logo_dark.png"
                alt="WeeStox"
                width={490}
                height={193}
                className="h-full w-auto object-contain hidden dark:block group-hover:scale-[1.02] transition-transform"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/') && pathname === '/'
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <span>Home</span>
            </Link>

            <Link
              href="/stocks"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/stocks')
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <span>Stocks</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Live Screener" />
            </Link>

            {/* Metals Dropdown (StockeZee Institutional Style) */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('metals')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'metals' ? null : 'metals')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer outline-none focus:outline-none focus-visible:outline-none ${
                  activeDropdown === 'metals' || isActive('/gold') || isActive('/silver') || isActive('/platinum')
                    ? 'text-amber-700 dark:text-amber-400 font-semibold bg-amber-500/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <span>Metals</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'metals' ? 'rotate-180 text-amber-600 dark:text-amber-400' : 'opacity-60'
                  }`}
                />
              </button>

              {activeDropdown === 'metals' && (
                <div className="absolute top-full left-0 pt-2 z-40">
                  <div className="w-68 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-2xl p-2.5 space-y-1 animate-fade-in">
                    {/* Header with vertical amber bar (StockeZee reference) */}
                    <div className="flex items-center gap-2 px-3 pt-1 pb-1.5 mb-0.5">
                      <span className="w-1 h-3.5 bg-amber-600 rounded-full inline-block" />
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                        Precious Metals
                      </span>
                    </div>

                    {/* Gold Price Today */}
                    <Link
                      href="/gold"
                      onClick={() => setActiveDropdown(null)}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 dark:hover:bg-amber-500/15 transition-all cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        Gold Price Today
                      </span>
                    </Link>

                    {/* Silver Price Today */}
                    <Link
                      href="/silver"
                      onClick={() => setActiveDropdown(null)}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Layers className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </div>
                      <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        Silver Price Today
                      </span>
                    </Link>

                    {/* Platinum Price Today */}
                    <Link
                      href="/platinum"
                      onClick={() => setActiveDropdown(null)}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 transition-all cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Gem className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        Platinum Price Today
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* IPOs */}
            <Link
              href="/ipo"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/ipo')
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <span>IPOs</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                GMP
              </span>
            </Link>

            {/* Zakat */}
            <Link
              href="/zakat"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/zakat')
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <span>Zakat</span>
            </Link>

            {/* About */}
            <Link
              href="/about"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/about')
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <span>About</span>
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
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
              className="lg:hidden p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer outline-none focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer (StockeZee Institutional Style with Colored Indicators) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 dark:border-slate-800 animate-fade-in space-y-3">
            {/* Section 1: Capital Markets */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-1">
                <span className="w-1 h-3.5 bg-sky-500 rounded-full inline-block" />
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  Capital Markets
                </span>
              </div>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive('/') && pathname === '/'
                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                </div>
                <span>Home Dashboard</span>
              </Link>
              <Link
                href="/stocks"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive('/stocks')
                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span>Halal Stocks Screener</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  AAOIFI 21
                </span>
              </Link>
              <Link
                href="/ipo"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive('/ipo')
                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span>IPO Grey Market Premium</span>
                </div>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                  Live GMP
                </span>
              </Link>
            </div>

            {/* Section 2: Precious Metals (Exact StockeZee Style) */}
            <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2 px-3 py-1">
                <span className="w-1 h-3.5 bg-amber-600 rounded-full inline-block" />
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Precious Metals
                </span>
              </div>
              <Link
                href="/gold"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive('/gold')
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span>Gold Price Today</span>
              </Link>
              <Link
                href="/silver"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive('/silver')
                    ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
                <span>Silver Price Today</span>
              </Link>
              <Link
                href="/platinum"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive('/platinum')
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Gem className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span>Platinum Price Today</span>
              </Link>
            </div>

            {/* Section 3: Tools & Information */}
            <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2 px-3 py-1">
                <span className="w-1 h-3.5 bg-purple-500 rounded-full inline-block" />
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  Analysis &amp; Tools
                </span>
              </div>
              <Link
                href="/zakat"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive('/zakat')
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4 text-purple-500" />
                </div>
                <span>Zakat Calculator</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive('/about')
                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
                <span>About &amp; AAOIFI Methodology</span>
              </Link>
            </div>

            {/* Mobile Screener CTA */}
            <div className="pt-2">
              <Link
                href="/stocks"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-98 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Launch Shariah Screener</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
