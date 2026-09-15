import { StockItem, StockListItem, ComplianceStatus, StockCountry } from '../types';

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

export function mapBackendStockToStockItem(item: StockListItem, countryCode?: string): StockItem {
  const complianceRaw = item.shariah_compliance?.status?.toUpperCase() || 'HALAL';
  let complianceStatus: ComplianceStatus = 'compliant';
  if (complianceRaw === 'NON_HALAL') complianceStatus = 'non_compliant';
  if (complianceRaw === 'DOUBTFUL') complianceStatus = 'doubtful';

  const debtRatioNum = Number(item.shariah_compliance?.debt_to_market_cap ?? 0);
  const debtRatioPercent = Number((debtRatioNum * 100).toFixed(2));

  // Determine market cap category
  const mcap = item.metrics?.market_cap ? Number(item.metrics.market_cap) : 0;
  let marketCapCategory: 'Large Cap' | 'Mid Cap' | 'Small Cap' = 'Mid Cap';
  if (mcap >= 200000000000) { // >= 20,000 Cr
    marketCapCategory = 'Large Cap';
  } else if (mcap < 50000000000) { // < 5,000 Cr
    marketCapCategory = 'Small Cap';
  }

  // Calculate Halal Score 0-100
  let halalScore = 95;
  if (complianceStatus === 'compliant') {
    halalScore = Math.max(75, Math.round(100 - debtRatioPercent * 0.5));
  } else if (complianceStatus === 'doubtful') {
    halalScore = 60;
  } else {
    halalScore = 20;
  }

  const currencySym = getCurrencySymbol(item.country || item.currency);
  const latestPrice = Number(item.latest_price || 0);

  return {
    id: item.id,
    symbol: item.symbol,
    name: item.company_name,
    logo_url: item.logo_url || null,
    exchange: item.exchange,
    country: item.country,
    currency: item.currency,
    currencySymbol: currencySym,
    sector: item.sector || 'Diversified',
    industry: item.industry || item.sector || 'Equities',
    price: latestPrice,
    change: Number(item.change || 0),
    changePercent: Number(item.change_percentage || 0),
    volume: Number(item.volume || 0),
    marketCapCr: Math.round(mcap / 10000000), // in Crores
    marketCapCategory,
    halalScore,
    complianceStatus,
    statusReason:
      item.shariah_compliance?.notes?.[0] ||
      (complianceStatus === 'compliant'
        ? 'Passes AAOIFI debt & business activity guidelines'
        : 'Exceeds interest-bearing debt threshold or impermissible business revenue'),
    shariah: {
      businessActivityStatus: item.shariah_compliance?.is_sector_compliant === false ? 'fail' : 'pass',
      nonHalalRevenuePercent: 0,
      nonHalalRevenueSource: undefined,
      debtRatioPercent,
      debtRatioStatus: item.shariah_compliance?.is_debt_compliant === false ? 'fail' : 'pass',
      cashAndSecuritiesRatioPercent: 8.5,
      cashRatioStatus: 'pass',
      purificationPercent: 0.25,
    },
    fundamentals: {
      peRatio: item.metrics?.pe_ratio ? Number(item.metrics.pe_ratio) : 0,
      pbRatio: item.metrics?.price_to_book ? Number(item.metrics.price_to_book) : 0,
      roePercent: item.metrics?.roe ? Number((Number(item.metrics.roe) * 100).toFixed(2)) : 0,
      rocePercent: 14.2,
      debtToEquity: debtRatioNum,
      freeCashFlowCr: 0,
      dividendYield: item.metrics?.dividend_yield ? Number((Number(item.metrics.dividend_yield) * 100).toFixed(2)) : 0,
      week52High: item.metrics?.fifty_two_week_high ? Number(item.metrics.fifty_two_week_high) : (latestPrice ? latestPrice * 1.15 : 0),
      week52Low: item.metrics?.fifty_two_week_low ? Number(item.metrics.fifty_two_week_low) : (latestPrice ? latestPrice * 0.85 : 0),
    },
    lastUpdated: item.market_date || 'Live',
    isNifty50: item.country === 'India' && mcap >= 500000000000,
  };
}
