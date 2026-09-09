import Link from 'next/link';
import { Mail, Shield, ExternalLink, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 mt-16 text-xs text-slate-400">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Col (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-sky-500 to-sky-700 rounded-lg flex items-center justify-center font-bold text-xs text-white">
                W
              </div>
              <span className="text-base font-bold text-slate-100 tracking-tight">WeeStox</span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              WeeStox is an institutional-grade financial intelligence platform screening Indian and global capital markets for Shariah compliance, low balance-sheet leverage, and fundamental quality.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Screening Standard: AAOIFI Shariah Standard No. 21</span>
            </div>
          </div>

          {/* Equities & Screeners */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Equities & Screeners
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/stocks" className="hover:text-sky-400 transition-colors">
                  Halal Stock Screener
                </Link>
              </li>
              <li>
                <Link href="/stocks?filter=zero_debt" className="hover:text-sky-400 transition-colors">
                  Zero-Debt Giants
                </Link>
              </li>
              <li>
                <Link href="/stocks?filter=nifty50" className="hover:text-sky-400 transition-colors">
                  NIFTY 50 Shariah Stocks
                </Link>
              </li>
              <li>
                <Link href="/stocks" className="hover:text-sky-400 transition-colors">
                  Dividend Purification Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Metals & IPOs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Commodities & IPOs
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/gold/agra" className="hover:text-amber-400 transition-colors">
                  Gold Rates Today (24K/22K)
                </Link>
              </li>
              <li>
                <Link href="/silver/agra" className="hover:text-slate-200 transition-colors">
                  Silver Prices (1kg / 10g)
                </Link>
              </li>
              <li>
                <Link href="/platinum/agra" className="hover:text-sky-400 transition-colors">
                  Platinum Market Rates
                </Link>
              </li>
              <li>
                <Link href="/ipo" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  Live IPO GMP & Status
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Ethical Wealth & Guides */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Ethical Wealth & Tools
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/zakat" className="hover:text-emerald-400 transition-colors">
                  Zakat Calculator
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  Compliance Methodology
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  About WeeStox
                </Link>
              </li>
              <li>
                <a href="mailto:care@weestox.com" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  Support & Contact
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers & Legal */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            &copy; {currentYear} WeeStox Intelligence. All rights reserved. Data updated in real-time.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Methodology Disclaimer
            </Link>
          </div>
        </div>

        <p className="text-[10px] text-slate-600 mt-4 leading-relaxed text-center md:text-left">
          Regulatory Disclaimer: WeeStox provides automated financial and Shariah screening based on publicly available audited filings and standard AAOIFI guidelines for informational purposes. WeeStox is not a SEBI registered investment advisor. Nothing on this website constitutes personal financial advice. Investors must conduct independent due diligence.
        </p>
      </div>
    </footer>
  );
}
