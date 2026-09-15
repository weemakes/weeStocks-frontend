import { StockItem, StockListItem, ComplianceStatus } from '../types';

export function getCurrencySymbol(countryOrCurrency?: string): string {
  if (!countryOrCurrency) return '₹';
  const val = countryOrCurrency.toLowerCase();
  if (val.includes('saudi') || val === 'sar') return '﷼';
  if (val.includes('emirates') || val.includes('uae') || val === 'aed') return 'د.إ';
  if (val.includes('japan') || val === 'jpy') return '¥';
  return '₹';
}

export function formatCurrencyAmount(amount: number | undefined | null, currencySymbol: string = '₹'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '–';
  return `${currencySymbol}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function formatMarketCap(mcap: number | string | undefined | null, country?: string): string {
  if (mcap === undefined || mcap === null || mcap === '') return '–';
  const num = typeof mcap === 'number' ? mcap : parseFloat(String(mcap));
  if (isNaN(num) || num === 0) return '–';
  const sym = getCurrencySymbol(country);

  // For Indian markets, use Crores (1 Cr = 10,000,000)
  if (!country || country.toLowerCase() === 'india') {
    if (num >= 10000000) {
      const cr = num / 10000000;
      return `${sym}${cr >= 1000 ? (cr / 1000).toFixed(2) + 'k Cr' : cr.toFixed(1) + ' Cr'}`;
    }
    return `${sym}${(num / 100000).toFixed(1)} Lakh`;
  }

  // For International markets (Saudi, UAE, Japan), use Millions / Billions / Trillions
  if (num >= 1000000000000) {
    return `${sym}${(num / 1000000000000).toFixed(2)}T`;
  }
  if (num >= 1000000000) {
    return `${sym}${(num / 1000000000).toFixed(2)}B`;
  }
  if (num >= 1000000) {
    return `${sym}${(num / 1000000).toFixed(1)}M`;
  }
  return `${sym}${num.toLocaleString('en-US')}`;
}


export function numeric(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value); return Number.isFinite(n) ? n : null;
}
export function mapBackendStockToStockItem(item: Partial<StockListItem>, country?: string): StockItem {
  const raw = item.shariah_compliance?.status?.toUpperCase();
  const complianceStatus: ComplianceStatus = raw === 'HALAL' ? 'compliant' : raw === 'NON_HALAL' ? 'non_compliant' : raw === 'DOUBTFUL' ? 'doubtful' : 'unknown';
  const debt = numeric(item.shariah_compliance?.debt_to_market_cap);
  const mcap = numeric(item.metrics?.market_cap);
  const actualCountry = item.country || country;
  const percent = (value: unknown) => { const n = numeric(value); return n === null ? null : n * 100; };
  const check = (value?: boolean) => value === true ? 'pass' as const : value === false ? 'fail' as const : 'unknown' as const;
  return {
    id: item.id || item.symbol || "", symbol: item.symbol || "", name: item.company_name || item.symbol || "", logo_url: item.logo_url,
    exchange: item.exchange || "", country: actualCountry, currency: item.currency,
    currencySymbol: getCurrencySymbol(item.currency || actualCountry), sector: item.sector || 'Unclassified', industry: item.industry || 'Unclassified',
    price: numeric(item.latest_price), change: numeric(item.change), changePercent: numeric(item.change_percentage), volume: item.volume,
    marketCapCr: mcap === null ? null : mcap / 10000000,
    marketCapCategory: mcap === null || actualCountry !== 'India' ? 'Unknown' : mcap >= 200000000000 ? 'Large Cap' : mcap >= 50000000000 ? 'Mid Cap' : 'Small Cap',
    halalScore: null, complianceStatus, statusReason: item.shariah_compliance?.notes?.join(' ') || 'Review the reported screening details and methodology.',
    shariah: { businessActivityStatus: check(item.shariah_compliance?.is_sector_compliant), nonHalalRevenuePercent: null, debtRatioPercent: debt === null ? null : debt * 100,
      debtRatioStatus: check(item.shariah_compliance?.is_debt_compliant), cashAndSecuritiesRatioPercent: null, cashRatioStatus: 'unknown', purificationPercent: null },
    fundamentals: { peRatio: numeric(item.metrics?.pe_ratio), pbRatio: numeric(item.metrics?.price_to_book), roePercent: percent(item.metrics?.roe), rocePercent: null,
      debtToEquity: null, freeCashFlowCr: null, dividendYield: percent(item.metrics?.dividend_yield), week52High: numeric(item.metrics?.fifty_two_week_high), week52Low: numeric(item.metrics?.fifty_two_week_low) },
    lastUpdated: item.market_date || 'Date unavailable',
  };
}
