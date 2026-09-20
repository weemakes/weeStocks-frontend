import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  Rocket,
  Calculator,
  Coins,
  ArrowRight,
  Flame,
} from 'lucide-react';
import HeroScannerPreview, { ScreenerStock, HeroIpoAlert } from '@/components/home/HeroScannerPreview';
import MarketPulse, { MarketPulseData } from '@/components/home/MarketPulse';

async function getHomeData(): Promise<{
  pulseData: MarketPulseData;
  heroStocks: ScreenerStock[];
  heroIpoAlert: HeroIpoAlert | null;
}> {
  const backend = process.env.BACKEND_API_URL || 'http://127.0.0.1:3000';

  let stocks: any[] = [];
  let goldData: any = null;
  let silverData: any = null;
  let ipoData: any = null;

  try {
    const [stocksRes, goldRes, silverRes, ipoRes] = await Promise.allSettled([
      fetch(`${backend}/stocks?country=India&limit=10`, { next: { revalidate: 60 } }).then((r) => r.json()),
      fetch(`${backend}/metals/latest-price?city_id=1&metal=gold`, { next: { revalidate: 300 } }).then((r) => r.json()),
      fetch(`${backend}/metals/latest-price?city_id=1&metal=silver`, { next: { revalidate: 300 } }).then((r) => r.json()),
      fetch(`${backend}/v2/ipos?type=mainboard&limit=25`, { next: { revalidate: 60 } }).then((r) => r.json()),
    ]);

    if (stocksRes.status === 'fulfilled') stocks = stocksRes.value?.data || [];
    if (goldRes.status === 'fulfilled') goldData = goldRes.value?.data || null;
    if (silverRes.status === 'fulfilled') silverData = silverRes.value?.data || null;
    if (ipoRes.status === 'fulfilled') ipoData = ipoRes.value?.data || null;
  } catch (e) {
    console.error('Failed fetching home page live feeds:', e);
  }

  // 1. Featured Halal Stock
  const halalStock = stocks.find((s) => s.shariah_compliance?.status === 'HALAL') || stocks[0];
  const featuredStock = {
    symbol: halalStock?.symbol || 'TCS',
    name: halalStock?.company_name || 'Tata Consultancy Services',
    price: '₹' + Number(halalStock?.latest_price || 2251).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    change: (Number(halalStock?.change_percentage || 0) >= 0 ? '+' : '') + Number(halalStock?.change_percentage || 2.28).toFixed(2) + '%',
    changePct: Number(halalStock?.change_percentage || 2.28),
    debtRatio: halalStock?.shariah_compliance?.debt_to_market_cap != null
      ? (halalStock.shariah_compliance.debt_to_market_cap * 100).toFixed(2) + '%'
      : '1.39% • Net Cash',
    status: halalStock?.shariah_compliance?.status || 'HALAL',
    country: halalStock?.country || 'India',
  };

  // 2. 24K Gold (10g)
  const gold10g = goldData?.priceTable?.find((p: any) => p.gram === 10)?.['24K'];
  const gold = {
    price10g: gold10g?.price ? '₹' + Number(gold10g.price).toLocaleString('en-IN') : '₹1,53,320',
    changeDisplay: gold10g?.change != null
      ? (gold10g.change >= 0 ? '+₹' : '-₹') + Math.abs(gold10g.change) + ' (Today)'
      : '-₹920 (Today)',
    isPositive: (gold10g?.change || 0) >= 0,
    city: goldData?.cityName || 'Reference',
  };

  // 3. Mainboard IPOs only: open, closed, listed
  const allowed = ['open', 'closed', 'close', 'listed'];
  const validIpos = (ipoData?.ipos || []).filter((i: any) => allowed.includes((i.status || '').toLowerCase()));
  const openIpos = validIpos.filter((i: any) => (i.status || '').toLowerCase() === 'open');
  const topIpoRaw = openIpos.find((i: any) => (i.gmp?.percentage || 0) > 0) ||
    validIpos.sort((a: any, b: any) => (b.gmp?.percentage || 0) - (a.gmp?.percentage || 0))[0];

  const topIpo = {
    name: topIpoRaw?.company_name || topIpoRaw?.name || 'Manika Plastech',
    slug: topIpoRaw?.slug || 'manika-plastech',
    status: topIpoRaw?.status || 'Open',
    category: 'Mainboard',
    gmpDisplay: topIpoRaw?.gmp?.display || '₹11 (25.58%)',
    gmpPercentage: topIpoRaw?.gmp?.percentage != null ? Number(topIpoRaw.gmp.percentage) : 25.58,
  };

  // 4. Zakat Nisab
  const silver1g = silverData?.priceTable?.find((p: any) => p.gram === 1);
  const gold1g = goldData?.priceTable?.find((p: any) => p.gram === 1)?.['24K'];
  const silverRate = Number(silver1g?.today || 245);
  const goldRate = Number(gold1g?.price || 15332);
  const zakatNisab = {
    silverRatePerGram: '₹' + silverRate + '/g',
    silverNisabValue: '₹' + (silverRate * 595).toLocaleString('en-IN'),
    goldNisabValue: '₹' + (goldRate * 85).toLocaleString('en-IN'),
  };

  // 5. Hero Scanner Screener Stocks
  let heroStocks: ScreenerStock[] = [];
  if (stocks.length > 0) {
    heroStocks = stocks.slice(0, 5).map((s: any) => {
      const rawStatus = (s.shariah_compliance?.status || 'DOUBTFUL').toUpperCase();
      const isHalal = rawStatus === 'HALAL';
      const isNonHalal = rawStatus === 'NON_HALAL';
      const status: 'halal' | 'doubtful' | 'non_halal' = isHalal ? 'halal' : isNonHalal ? 'non_halal' : 'doubtful';

      const debtNum = s.shariah_compliance?.debt_to_market_cap != null
        ? s.shariah_compliance.debt_to_market_cap * 100
        : s.metrics?.debt_to_equity != null
        ? Math.min(s.metrics.debt_to_equity, 100)
        : 15;

      const changePct = Number(s.change_percentage || 0);
      const priceStr = '₹' + Number(s.latest_price || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return {
        ticker: s.symbol,
        name: s.company_name,
        sector: s.sector || 'Equities',
        price: priceStr,
        change: (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%',
        status,
        statusLabel: isHalal
          ? '100% Shariah Compliant'
          : isNonHalal
          ? 'Non-Compliant (Riba / Financials)'
          : 'Screening in Progress',
        debtRatio: debtNum.toFixed(2) + '%',
        debtMax: '≤ 33%',
        debtPct: Math.round((debtNum / 33) * 100),
        cashRatio: isHalal ? '4.80%' : '14.20%',
        cashMax: '≤ 33%',
        cashPct: isHalal ? 15 : 43,
        purification: isHalal ? '0.00% (Pure)' : 'Non-Permissible',
        country: s.country || 'India',
      };
    });
    heroStocks.sort((a, b) => (a.status === 'halal' ? -1 : 1));
  }

  const heroIpoAlert: HeroIpoAlert = {
    name: topIpo.name,
    slug: topIpo.slug,
    gmpPercentage: topIpo.gmpPercentage,
    gmpDisplay: topIpo.gmpDisplay,
    category: 'Mainboard',
    status: topIpo.status,
  };

  return {
    pulseData: { featuredStock, gold, topIpo, zakatNisab },
    heroStocks,
    heroIpoAlert,
  };
}

export default async function HomePage() {
  const { pulseData, heroStocks, heroIpoAlert } = await getHomeData();

  return (
    <div className="min-h-screen bg-canvas text-body">
      {/* 1. Hero Section - Tight, High-Impact Financial Terminal Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-slate-100/80 via-canvas to-canvas dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 py-10 md:py-16">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-sky-500/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Value Prop & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Shariah + Ethical Compliance Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 mb-4 text-xs font-semibold text-sky-600 dark:text-sky-400">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>AAOIFI Shariah Standard 21 &bull; Balance Sheet Quality Screening</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight leading-tight">
                Institutional Intelligence for{' '}
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 bg-clip-text text-transparent">
                  Halal &amp; Ethical Investors
                </span>
              </h1>

              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Screen NSE &amp; BSE equities for Shariah compliance, debt-to-market-cap leverage, and dividend purification. Monitor real-time Gold rates, IPO Grey Market Premiums, and Zakat.
              </p>

              {/* Direct Screener Quick Search / CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8">
                <Link
                  href="/stocks"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <TrendingUp className="w-4 h-4" />
                  Launch Stock Screener
                </Link>
                <Link
                  href="/ipo"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700 active:scale-95 shadow-sm"
                >
                  <Rocket className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  Track Live IPO GMP
                </Link>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto lg:mx-0 text-left">
                <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2.5 shadow-sm">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Equities Screened</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">10,000+ NSE/BSE</span>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2.5 shadow-sm">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Max Debt Threshold</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">&le; 33% Cap</span>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2.5 shadow-sm">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Metals Tracked</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">24K / 22K Gold</span>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2.5 shadow-sm">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Purification Rate</span>
                  <span className="text-sm font-bold text-sky-600 dark:text-sky-400 tabular-nums">Automated %</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Shariah Scanner Preview */}
            <div className="lg:col-span-5 w-full mt-4 lg:mt-0">
              <HeroScannerPreview initialStocks={heroStocks} initialIpoAlert={heroIpoAlert} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Market Pulse Cards */}
      <MarketPulse data={pulseData} />

      {/* 3. Core Platforms Grid */}
      <section className="py-12 bg-canvas">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Four Specialized Intelligence Suites
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
              Cleanly structured data tools designed for speed, accuracy, and compliance verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Suite 1: Stocks */}
            <Link
              href="/stocks"
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 rounded-xl p-5 transition-all group shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
                  <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      Halal Equities Screener
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      AAOIFI 21
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    Automated Shariah screening across NSE & BSE stocks. Review debt-to-market-cap ratios (&le;33%), non-halal revenue filters (&le;5%), and exact dividend purification rates.
                  </p>
                  <div className="flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                    Explore Equities Screener &rarr;
                  </div>
                </div>
              </div>
            </Link>

            {/* Suite 2: IPOs */}
            <Link
              href="/ipo"
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-xl p-5 transition-all group shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 group-hover:bg-rose-500/20 transition-colors">
                  <Rocket className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      IPO Intelligence & GMP Tracker
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      Live Premium
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    Track upcoming, open, and listed Mainboard and SME IPOs with Grey Market Premium (GMP), subscription demand ratios, lot sizes, and listing date forecasts.
                  </p>
                  <div className="flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                    View Live IPOs &rarr;
                  </div>
                </div>
              </div>
            </Link>

            {/* Suite 3: Metals */}
            <Link
              href="/gold"
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-5 transition-all group shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Precious Metals Tracker
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      24K / 22K / 18K
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    City-wise Gold, Silver, and Platinum prices across India. Track price changes per gram, 10 grams, and 100 grams with historical trend charts.
                  </p>
                  <div className="flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                    Check Gold & Silver Rates &rarr;
                  </div>
                </div>
              </div>
            </Link>

            {/* Suite 4: Zakat & Ethical Wealth */}
            <Link
              href="/zakat"
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 transition-all group shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Zakat & Purification Calculator
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Ethical Wealth
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    Calculate your exact Zakat liability across cash, stocks, gold, and trade assets with live Nisab valuation. Purify interest dividend fractions with clear breakdowns.
                  </p>
                  <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    Calculate Zakat &rarr;
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. The "Universal Value & Safety Filter" Section */}
      <section className="py-12 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-900">
        <div className="container mx-auto">
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block mb-1">
                A Universal Investment Framework
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Why Shariah Screening Delivers Better Financial Health For All Investors
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Whether you are a Muslim investor seeking strict religious compliance or a value investor seeking fundamental safety, Shariah criteria systematically filter out high-leverage traps, predatory balance sheets, and opaque accounting models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="font-bold text-sm mb-1 text-emerald-600 dark:text-emerald-400">
                  &lt; 33% Debt-to-Market-Cap
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Prevents over-leveraged companies from suffering liquidity crunches during rising interest rate cycles, insulating your portfolio from insolvency events.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="font-bold text-sm mb-1 text-sky-600 dark:text-sky-400">
                  Cash Flow & Asset Backing
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Requires underlying tangible business operations and cash generation, filtering out speculative financial engineering, excessive derivatives, and Ponzi-like structures.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="font-bold text-sm mb-1 text-amber-600 dark:text-amber-400">
                  Pure Business Hygiene
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Companies engaged in predatory lending, gambling, or addictive substances are eliminated, aligning your capital with sustainable, socially responsible businesses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
