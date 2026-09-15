import type {
  StockCountry,
  StockListItem,
  StockListResponse,
  StockDetailData,
  StockChartData,
  StockFinancialsData,
  StockHalalAuditData,
  MarketMoverItem,
  MarketOverviewData,
} from '../types';

// In browser / client environment, use relative URL to route proxy.
// In SSR / server environment, use absolute URL to route proxy or backend.
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '/api/stocks';
  }
  const backend = process.env.BACKEND_API_URL || 'http://localhost:3000';
  return `${backend}/stocks`;
};

/**
 * 1. Fetch Available Countries List
 * GET /stocks/countries
 */
export async function getAvailableCountries(): Promise<StockCountry[]> {
  try {
    const url = `${getBaseUrl()}/countries`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch stock countries:', error);
    // Fallback list if backend is momentarily unreachable
    return [
      {
        country: 'India',
        code: 'IN',
        flag: '🇮🇳',
        exchange: 'NSE',
        currency: 'INR',
        currency_symbol: '₹',
        total_companies: 2169,
        is_active: true,
      },
      {
        country: 'Saudi Arabia',
        code: 'SA',
        flag: '🇸🇦',
        exchange: 'Tadawul',
        currency: 'SAR',
        currency_symbol: '﷼',
        total_companies: 1877,
        is_active: true,
      },
      {
        country: 'United Arab Emirates',
        code: 'AE',
        flag: '🇦🇪',
        exchange: 'ADX/DFM',
        currency: 'AED',
        currency_symbol: 'د.إ',
        total_companies: 91,
        is_active: true,
      },
      {
        country: 'Japan',
        code: 'JP',
        flag: '🇯🇵',
        exchange: 'TSE',
        currency: 'JPY',
        currency_symbol: '¥',
        total_companies: 3775,
        is_active: true,
      },
    ];
  }
}

export interface StockListParams {
  country?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  search?: string;
  halal_status?: 'ALL' | 'HALAL' | 'NON_HALAL' | 'DOUBTFUL';
  sort_by?: 'market_cap' | 'pe_ratio' | 'price' | 'volume' | 'symbol' | 'company_name';
  sort_order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

/**
 * 2. Fetch Multi-Market Paginated Stock List
 * GET /stocks?...
 */
export async function getStocksList(params: StockListParams = {}): Promise<StockListResponse> {
  const p = new URLSearchParams();
  if (params.country && params.country !== 'All') p.set('country', params.country);
  if (params.exchange && params.exchange !== 'All') p.set('exchange', params.exchange);
  if (params.sector && params.sector !== 'All') p.set('sector', params.sector);
  if (params.industry && params.industry !== 'All') p.set('industry', params.industry);
  if (params.search && params.search.trim()) p.set('search', params.search.trim());
  if (params.halal_status && params.halal_status !== 'ALL') p.set('halal_status', params.halal_status);
  if (params.sort_by) p.set('sort_by', params.sort_by);
  if (params.sort_order) p.set('sort_order', params.sort_order);
  p.set('page', String(params.page || 1));
  p.set('limit', String(params.limit || 20));

  const url = `${getBaseUrl()}?${p.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * 3. Fetch Single Stock Details & Profile
 * GET /stocks/:identifier
 */
export async function getStockDetail(identifier: string, country?: string): Promise<StockDetailData | null> {
  try {
    const p = new URLSearchParams();
    if (country) p.set('country', country);
    const qs = p.toString();
    const url = `${getBaseUrl()}/${encodeURIComponent(identifier)}${qs ? `?${qs}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Failed to fetch stock detail for ${identifier}:`, error);
    return null;
  }
}

/**
 * 4. Fetch Stock Interactive Chart (Candlestick / OHLCV)
 * GET /stocks/:identifier/chart
 */
export async function getStockChart(
  identifier: string,
  range: string = '1M',
  interval: string = '1d',
  country?: string
): Promise<StockChartData | null> {
  try {
    const p = new URLSearchParams({ range, interval });
    if (country) p.set('country', country);
    const url = `${getBaseUrl()}/${encodeURIComponent(identifier)}/chart?${p.toString()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Failed to fetch chart for ${identifier}:`, error);
    return null;
  }
}

/**
 * 5. Fetch Stock Financial Statements (Annual / Quarterly)
 * GET /stocks/:identifier/financials
 */
export async function getStockFinancials(
  identifier: string,
  periodType: 'ANNUAL' | 'QUARTERLY' = 'ANNUAL',
  limit: number = 5,
  country?: string
): Promise<StockFinancialsData | null> {
  try {
    const p = new URLSearchParams({ period_type: periodType, limit: String(limit) });
    if (country) p.set('country', country);
    const url = `${getBaseUrl()}/${encodeURIComponent(identifier)}/financials?${p.toString()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Failed to fetch financials for ${identifier}:`, error);
    return null;
  }
}

/**
 * 6. Fetch AAOIFI Shariah Compliance Deep Audit
 * GET /stocks/:identifier/halal-screening
 */
export async function getStockHalalAudit(identifier: string): Promise<StockHalalAuditData | null> {
  try {
    const url = `${getBaseUrl()}/${encodeURIComponent(identifier)}/halal-screening`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Failed to fetch Shariah audit for ${identifier}:`, error);
    return null;
  }
}

/**
 * 7. Fetch Market Movers (Top Gainers, Losers, Active)
 * GET /stocks/market-movers
 */
export async function getMarketMovers(
  country: string = 'India',
  type: 'gainers' | 'losers' | 'active' = 'gainers',
  limit: number = 5
): Promise<MarketMoverItem[]> {
  try {
    const p = new URLSearchParams({ country, type, limit: String(limit) });
    const url = `${getBaseUrl()}/market-movers?${p.toString()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(`Failed to fetch market movers for ${country}:`, error);
    return [];
  }
}

/**
 * 8. Fetch Market Overview & Statistics
 * GET /stocks/overview
 */
export async function getMarketOverview(country?: string): Promise<MarketOverviewData | null> {
  try {
    const p = new URLSearchParams();
    if (country && country !== 'All') p.set('country', country);
    const qs = p.toString();
    const url = `${getBaseUrl()}/overview${qs ? `?${qs}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Failed to fetch market overview:`, error);
    return null;
  }
}
