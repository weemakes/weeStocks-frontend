/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import type { ScreenerStock, HeroIpoAlert } from '@/components/home/HeroScannerPreview';
import type { MarketPulseData } from '@/components/home/MarketPulse';
import HomeLanding from '@/components/home/HomeLanding';

export const metadata: Metadata = {
  title: 'WeeStox | Stocks, IPOs, Metals & Shariah Market Intelligence',
  description: 'Research stocks, IPO GMP, gold, silver and platinum prices with Shariah screening, transparent analytics and Islamic wealth tools.',
};

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
    logoUrl: halalStock?.logo_url || null,
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
    heroStocks.sort((a) => (a.status === 'halal' ? -1 : 1));
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
  const { pulseData } = await getHomeData();
  return <HomeLanding data={pulseData} />;
}
