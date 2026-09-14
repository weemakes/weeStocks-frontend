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
  Sparkles,
  Flame,
  Shield,
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const MARKET_TICKER = [
  { name: 'NIFTY 50', value: '24,980.40', change: '+0.35%', up: true },
  { name: 'SENSEX', value: '81,720.10', change: '+0.28%', up: true },
  { name: 'NIFTY SHARIAH 25', value: '4,850.15', change: '+0.42%', up: true },
  { name: 'GOLD 24K (10g)', value: '₹75,420', change: '+0.38%', up: true },
  { name: 'SILVER (1kg)', value: '₹88,400', change: '-0.12%', up: false },
  { name: 'ACTIVE IPOS', value: '4 Open', change: 'Live GMP', up: true },
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      {/* 1. Real-Time Market Ticker Tape (StockeZee standard) */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 text-[11px] py-1 px-3 overflow-hidden select-none">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Market Pulse
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 ml-3 relative">
            <div className="flex items-center gap-6 animate-ticker">
              {MARKET_TICKER.concat(MARKET_TICKER).map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="inline-flex items-center gap-1.5 shrink-0">
                  <span className="font-semibold text-slate-300">{item.name}</span>
                  <span className="font-medium text-slate-100 tabular-nums">{item.value}</span>
                  <span
                    className={`inline-flex items-center text-[10px] font-bold tabular-nums ${
                      item.up ? 'text-emerald-400' : 'text-rose-400'
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

      {/* 2. Main Navigation Bar */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-700 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-sm group-hover:shadow-sky-500/25 transition-all">
              W
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-slate-100 tracking-tight">WeeStox</span>
                <span className="px-1 py-0.2 bg-sky-500/15 text-sky-400 text-[9px] font-bold rounded uppercase">
                  Terminal
                </span>
              </div>
              <span className="text-[9px] text-slate-400 -mt-0.5 tracking-tight hidden sm:inline">
                Halal & Ethical Financial Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/') && pathname === '/'
                  ? 'text-sky-400 bg-slate-900 font-semibold'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60'
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
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/stocks')
                    ? 'text-sky-400 bg-slate-900 font-semibold'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <span>Stocks</span>
                <span className="px-1 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-400 font-bold rounded">
                  Screener
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </Link>

              {activeDropdown === 'stocks' && (
                <div className="absolute top-full left-0 pt-1 z-30">
                  <div className="w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 text-xs divide-y divide-slate-800/60 animate-fade-in">
                    <div className="pb-1.5 space-y-0.5">
                      <Link
                        href="/stocks"
                        className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-sky-400 transition-colors"
                      >
                        <div className="font-semibold">Halal Stock Screener</div>
                        <div className="text-[10px] text-slate-400">100% Shariah compliant equities</div>
                      </Link>
                      <Link
                        href="/stocks?filter=zero_debt"
                        className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-sky-400 transition-colors"
                      >
                        <div className="font-semibold">Zero-Debt Giants</div>
                        <div className="text-[10px] text-slate-400">Net-cash pristine balance sheets</div>
                      </Link>
                    </div>
                    <div className="pt-1.5 space-y-0.5">
                      <Link
                        href="/stocks?filter=nifty50"
                        className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-sky-400 transition-colors"
                      >
                        <div className="font-semibold">Nifty 50 Shariah</div>
                        <div className="text-[10px] text-slate-400">Bluechip halal performers</div>
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
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/gold') || isActive('/silver') || isActive('/platinum')
                    ? 'text-sky-400 bg-slate-900 font-semibold'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <span>Metals</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'metals' && (
                <div className="absolute top-full left-0 pt-1 z-30">
                  <div className="w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 text-xs space-y-0.5 animate-fade-in">
                    <Link
                      href="/gold/agra"
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-colors"
                    >
                      <span className="font-semibold">Gold 24K & 22K</span>
                      <span className="text-[10px] text-amber-400 font-bold">Live</span>
                    </Link>
                    <Link
                      href="/silver/agra"
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                    >
                      <span className="font-semibold">Silver Rates</span>
                      <span className="text-[10px] text-slate-400 font-bold">1kg</span>
                    </Link>
                    <Link
                      href="/platinum/agra"
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-sky-400 transition-colors"
                    >
                      <span className="font-semibold">Platinum Rates</span>
                      <span className="text-[10px] text-sky-400 font-bold">950</span>
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
                  ? 'text-sky-400 bg-slate-900 font-semibold'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <span>IPOs</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-rose-500/20 text-rose-400 font-bold rounded">
                GMP Live
              </span>
            </Link>

            {/* Zakat */}
            <Link
              href="/zakat"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/zakat')
                  ? 'text-sky-400 bg-slate-900 font-semibold'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              Zakat Calculator
            </Link>

            {/* About */}
            <Link
              href="/about"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/about')
                  ? 'text-sky-400 bg-slate-900 font-semibold'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              About
            </Link>
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/stocks"
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search stocks...</span>
              <kbd className="px-1.5 py-0.5 text-[9px] font-bold text-slate-500 bg-slate-950 border border-slate-800 rounded">
                ⌘K
              </kbd>
            </Link>

            <Link
              href="/stocks"
              className="btn btn-primary text-xs py-1.5 px-3.5 shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Launch Screener
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 animate-fade-in space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900"
            >
              Home
            </Link>
            <Link
              href="/stocks"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900"
            >
              <span>Halal Stocks Screener</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                Popular
              </span>
            </Link>
            <Link
              href="/ipo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900"
            >
              <span>IPO Grey Market Premium (GMP)</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-1.5 py-0.5 rounded">
                Live
              </span>
            </Link>
            <Link
              href="/gold/agra"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900"
            >
              Gold Rates Today (24K/22K)
            </Link>
            <Link
              href="/silver/agra"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900"
            >
              Silver Rates Today
            </Link>
            <Link
              href="/zakat"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900"
            >
              Zakat Calculator
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900"
            >
              Methodology & About
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
