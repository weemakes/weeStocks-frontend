import type {
  StockCountry,
  StockListResponse,
  StockMasterDetail,
  StockChartData,
  StockFinancialsData,
  StockHalalAuditData,
  MarketMoverItem,
  MarketOverviewData,
  StockFiltersConfig,
  StockCorporateAction,
} from '../types';

// In browser / client environment, use relative URL to route proxy.
// In SSR / server environment, use absolute URL to route proxy or backend.
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '/api/stocks';
  }
  const backend = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://webapi.weestox.com';
  return `${backend}/stocks`;
};

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

export function normalizeStockDetail(raw: unknown): StockMasterDetail | null {
  const source = asRecord(raw);
  if (!source.company || !source.quote) return null;

  const metrics = asRecord(source.metrics);
  const rawDebtToEquity = toNumber(metrics.debt_to_equity);
  // Some market feeds expose D/E as a percentage (36.65 means 0.3665x).
  const debtToEquity = rawDebtToEquity !== null && Math.abs(rawDebtToEquity) > 10
    ? rawDebtToEquity / 100
    : rawDebtToEquity;

  const technicals = asRecord(source.technicals);
  const pivotRows = Array.isArray(technicals.classical_pivots)
    ? technicals.classical_pivots.map(asRecord)
    : [];
  const pivotValue = (level: string) =>
    toNumber(pivotRows.find((row) => String(row.level || '').toUpperCase() === level)?.price) ?? 0;
  const pivot = pivotRows.find((row) => String(row.level || '').toLowerCase().includes('pivot'));
  const cpr = asRecord(technicals.cpr);

  const deliverySource = Array.isArray(source.delivery_conviction)
    ? source.delivery_conviction
    : Array.isArray(source.delivery_report) ? source.delivery_report : [];
  const delivery = deliverySource.map((item) => {
        const row = asRecord(item);
        return {
          date: String(row.date || ''),
          traded_quantity: toNumber(row.traded_quantity) ?? 0,
          delivery_quantity: toNumber(row.delivery_quantity ?? row.deliverable_quantity) ?? 0,
          delivery_percentage: toNumber(row.delivery_percentage ?? row.delivery_pct) ?? 0,
          conviction: row.conviction ? String(row.conviction) : undefined,
          delivery_ratio: toNumber(row.delivery_ratio),
          relative_strength: row.relative_strength ? String(row.relative_strength) : undefined,
        };
      });

  const financialStatements = asRecord(source.financial_statements);
  const quarterlySource = Array.isArray(source.quarterly_financials)
    ? source.quarterly_financials
    : Array.isArray(financialStatements.quarterly) ? financialStatements.quarterly : [];

  const quarterly = quarterlySource.map((item) => {
        const row = asRecord(item);
        return {
          fiscal_year: toNumber(row.fiscal_year) ?? 0,
          fiscal_quarter: toNumber(row.fiscal_quarter) ?? 0,
          revenue: toNumber(row.revenue) ?? 0,
          gross_profit: toNumber(row.gross_profit) ?? undefined,
          operating_income: toNumber(row.operating_income) ?? undefined,
          ebitda: toNumber(row.ebitda) ?? undefined,
          net_income: toNumber(row.net_income) ?? 0,
          diluted_eps: toNumber(row.diluted_eps) ?? undefined,
          pbt: toNumber(row.pbt) ?? undefined,
          tax_expense: toNumber(row.tax_expense) ?? undefined,
          interest_expense: toNumber(row.interest_expense) ?? undefined,
          revenue_yoy_pct: toNumber(row.revenue_yoy_pct) ?? undefined,
          pat_yoy_pct: toNumber(row.pat_yoy_pct) ?? undefined,
          ebitda_yoy_pct: toNumber(row.ebitda_yoy_pct) ?? undefined,
          ebitda_margin_pct: toNumber(row.ebitda_margin_pct) ?? undefined,
          pat_margin_pct: toNumber(row.pat_margin_pct) ?? undefined,
        };
      });

  const annualSource = Array.isArray(source.annual_financials)
    ? source.annual_financials
    : Array.isArray(financialStatements.annual) ? financialStatements.annual : [];

  const annualRows = annualSource.map((item) => {
        const row = asRecord(item);
        return {
          fiscal_year: toNumber(row.fiscal_year) ?? 0,
          revenue: toNumber(row.revenue) ?? 0,
          gross_profit: toNumber(row.gross_profit) ?? undefined,
          operating_income: toNumber(row.operating_income) ?? undefined,
          ebitda: toNumber(row.ebitda) ?? undefined,
          net_income: toNumber(row.net_income) ?? 0,
          diluted_eps: toNumber(row.diluted_eps) ?? undefined,
          total_assets: toNumber(row.total_assets) ?? undefined,
          total_liabilities: toNumber(row.total_liabilities) ?? undefined,
          total_debt: toNumber(row.total_debt) ?? undefined,
          cash_and_equivalents: toNumber(row.cash_and_equivalents) ?? undefined,
          operating_cash_flow: toNumber(row.operating_cash_flow) ?? undefined,
          capex: toNumber(row.capex) ?? undefined,
          free_cash_flow: toNumber(row.free_cash_flow) ?? undefined,
          equity_share_capital: toNumber(row.equity_share_capital) ?? undefined,
          reserves_surplus: toNumber(row.reserves_surplus) ?? undefined,
          interest_income: toNumber(row.interest_income) ?? undefined,
          interest_expense: toNumber(row.interest_expense) ?? undefined,
          pbt: toNumber(row.pbt) ?? undefined,
          tax_expense: toNumber(row.tax_expense) ?? undefined,
          revenue_yoy_pct: toNumber(row.revenue_yoy_pct) ?? undefined,
          pat_yoy_pct: toNumber(row.pat_yoy_pct) ?? undefined,
          ebitda_yoy_pct: toNumber(row.ebitda_yoy_pct) ?? undefined,
          ebitda_margin_pct: toNumber(row.ebitda_margin_pct) ?? undefined,
          pat_margin_pct: toNumber(row.pat_margin_pct) ?? undefined,
        };
      });
  const annualByYear = new Map<number, (typeof annualRows)[number]>();
  for (const row of annualRows) {
    const current = annualByYear.get(row.fiscal_year);
    const completeness = Object.values(row).filter((value) => value !== undefined && value !== null).length;
    const currentCompleteness = current
      ? Object.values(current).filter((value) => value !== undefined && value !== null).length
      : -1;
    if (!current) {
      annualByYear.set(row.fiscal_year, row);
      continue;
    }
    const primary = completeness > currentCompleteness ? row : current;
    const secondary = primary === row ? current : row;
    annualByYear.set(row.fiscal_year, mergeDefined(secondary, primary));
  }

  const shareholdingSource = Array.isArray(source.shareholding_pattern)
    ? source.shareholding_pattern
    : Array.isArray(source.shareholding) ? source.shareholding : [];
  const shareholding = shareholdingSource.map((item) => {
        const row = asRecord(item);
        const institutions = Array.isArray(row.top_institutions) ? row.top_institutions.map((institution) => {
          const holder = asRecord(institution);
          return {
            name: String(holder.name || ''),
            category: String(holder.category || ''),
            holding_pct: toNumber(holder.holding_pct) ?? 0,
          };
        }).filter((holder) => holder.name) : [];
        return {
          quarter: String(row.quarter ?? row.quarter_ending ?? ''),
          promoter: toNumber(row.promoter ?? row.promoter_pct),
          fii: toNumber(row.fii ?? row.fii_pct),
          dii: toNumber(row.dii ?? row.dii_pct),
          public: toNumber(row.public ?? row.public_pct),
          pledged: toNumber(row.pledged ?? row.promoter_pledged_pct),
          num_shareholders: toNumber(row.num_shareholders),
          top_institutions: institutions,
        };
      });

  const corporateActions = Array.isArray(source.corporate_actions)
    ? source.corporate_actions.map(normalizeCorporateAction)
    : [];

  const thesisSection = asRecord(source.strengths_risks_thesis);
  const legacyFlags = asRecord(source.flags);
  const legacyThesis = asRecord(source.thesis);

  const peers = Array.isArray(source.peers)
    ? source.peers.map((item) => {
        const row = asRecord(item);
        return {
          id: row.id ? String(row.id) : undefined,
          symbol: String(row.symbol || ''),
          company_name: String(row.company_name || ''),
          logo_url: typeof row.logo_url === 'string' ? row.logo_url : null,
          currency: row.currency ? String(row.currency) : undefined,
          exchange: row.exchange ? String(row.exchange) : undefined,
          is_current: Boolean(row.is_current),
          market_cap: toNumber(row.market_cap) ?? 0,
          market_cap_cr: toNumber(row.market_cap_cr),
          pe_ratio: toNumber(row.pe_ratio),
          dividend_yield: toNumber(row.dividend_yield),
          quarterly_sales: toNumber(row.quarterly_sales),
          quarterly_sales_cr: toNumber(row.quarterly_sales_cr),
          profit_after_tax: toNumber(row.profit_after_tax),
          profit_after_tax_cr: toNumber(row.profit_after_tax_cr),
          sales_growth_pct: toNumber(row.sales_growth_pct),
          profit_growth_pct: toNumber(row.profit_growth_pct),
          price_to_book: toNumber(row.price_to_book),
          roe: toNumber(row.roe),
          roce: toNumber(row.roce),
          operating_margin: toNumber(row.operating_margin),
        };
      })
    : [];

  return {
    ...(source as unknown as StockMasterDetail),
    metrics: {
      ...(metrics as StockMasterDetail['metrics']),
      debt_to_equity: debtToEquity ?? undefined,
    },
    technicals: {
      ...(technicals as StockMasterDetail['technicals']),
      classical_pivots: pivotRows.length ? {
        pivot: toNumber(pivot?.price) ?? 0,
        r1: pivotValue('R1'), r2: pivotValue('R2'), r3: pivotValue('R3'),
        s1: pivotValue('S1'), s2: pivotValue('S2'), s3: pivotValue('S3'),
      } : undefined,
      cpr: Object.keys(cpr).length ? {
        tc: toNumber(cpr.tc ?? cpr.top_central) ?? 0,
        pivot: toNumber(cpr.pivot) ?? 0,
        bc: toNumber(cpr.bc ?? cpr.bottom_central) ?? 0,
        nature: String(cpr.nature ?? cpr.sentiment ?? ''),
      } : undefined,
    },
    delivery_conviction: delivery,
    quarterly_financials: quarterly,
    annual_financials: Array.from(annualByYear.values()).sort((a, b) => b.fiscal_year - a.fiscal_year),
    shareholding_pattern: shareholding,
    corporate_actions: corporateActions,
    flags: {
      green_flags: stringArray(legacyFlags.green_flags ?? thesisSection.strengths ?? thesisSection.green_flags),
      red_flags: stringArray(legacyFlags.red_flags ?? thesisSection.risks ?? thesisSection.red_flags),
    },
    thesis: {
      bull_case: stringArray(legacyThesis.bull_case ?? thesisSection.bull_case),
      bear_case: stringArray(legacyThesis.bear_case ?? thesisSection.bear_case),
      flip_conditions: stringArray(legacyThesis.flip_conditions ?? thesisSection.flip_conditions),
    },
    peers,
  };
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function mergeDefined<T extends Record<string, unknown>>(fallback: T, preferred: T): T {
  const merged = { ...fallback } as Record<string, unknown>;
  for (const [key, value] of Object.entries(preferred)) {
    if (value !== undefined && value !== null) merged[key] = value;
  }
  return merged as T;
}

function normalizeCorporateAction(value: unknown): StockCorporateAction {
  const row = asRecord(value);
  const type = String(row.action_type ?? row.type ?? 'OTHER').toUpperCase();
  return {
    id: row.id ? String(row.id) : undefined,
    type,
    action_type: type,
    announcement_date: row.announcement_date ? String(row.announcement_date) : null,
    ex_date: row.ex_date ? String(row.ex_date) : row.date ? String(row.date) : null,
    record_date: row.record_date ? String(row.record_date) : null,
    dividend_amount: toNumber(row.dividend_amount),
    split_ratio: row.split_ratio ? String(row.split_ratio) : null,
    bonus_ratio: row.bonus_ratio ? String(row.bonus_ratio) : null,
    notes: row.notes ? String(row.notes) : null,
    details: row.details ? String(row.details) : row.notes ? String(row.notes) : null,
    company_id: row.company_id ? String(row.company_id) : undefined,
    symbol: row.symbol ? String(row.symbol) : undefined,
    company_name: row.company_name ? String(row.company_name) : undefined,
    country: row.country ? String(row.country) : undefined,
    exchange: row.exchange ? String(row.exchange) : undefined,
    logo_url: row.logo_url ? String(row.logo_url) : null,
  };
}

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
    return [
      {
        country: 'India',
        code: 'IN',
        flag: '🇮🇳',
        exchange: 'NSE',
        currency: 'INR',
        currency_symbol: '₹',
        total_companies: 2414,
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
  q?: string;
  preset?: string;
  halal_status?: 'ALL' | 'HALAL' | 'NON_HALAL' | 'DOUBTFUL';
  sort_by?: string;
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
  if (params.preset && params.preset !== 'all') p.set('preset', params.preset);
  if (params.search && params.search.trim()) p.set('search', params.search.trim());
  if (params.q && params.q.trim()) p.set('q', params.q.trim());
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
 * 3. Fetch Single Stock Details & Profile (Master 14 Institutional Sections)
 * GET /stocks/:identifier
 */
export async function getStockDetail(identifier: string, country?: string): Promise<StockMasterDetail | null> {
  try {
    const p = new URLSearchParams();
    if (country) p.set('country', country);
    const qs = p.toString();
    const url = `${getBaseUrl()}/${encodeURIComponent(identifier)}${qs ? `?${qs}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const detail = normalizeStockDetail(json.data);
    if (!detail) return null;

    // Older master-report deployments may omit these newer sections. Fetch only
    // the missing datasets so a complete master response still costs one request.
    const [shareholding, corporateActions] = await Promise.all([
      detail.shareholding_pattern?.length ? Promise.resolve(null) : getStockShareholding(identifier, country),
      detail.corporate_actions?.length ? Promise.resolve(null) : getStockCorporateActions(identifier, 20),
    ]);
    if (shareholding?.length) detail.shareholding_pattern = shareholding;
    if (corporateActions?.length) detail.corporate_actions = corporateActions;
    return detail;
  } catch (error) {
    console.error(`Failed to fetch stock detail for ${identifier}:`, error);
    return null;
  }
}

/** GET /stocks/:identifier/corporate-actions */
export async function getStockCorporateActions(identifier: string, limit: number = 20): Promise<StockCorporateAction[]> {
  try {
    const p = new URLSearchParams({ limit: String(limit) });
    const res = await fetch(`${getBaseUrl()}/${encodeURIComponent(identifier)}/corporate-actions?${p}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return Array.isArray(json.data) ? json.data.map(normalizeCorporateAction) : [];
  } catch (error) {
    console.error(`Failed to fetch corporate actions for ${identifier}:`, error);
    return [];
  }
}

/** GET /stocks/corporate-actions/upcoming */
export async function getUpcomingCorporateActions(country: string = 'all', limit: number = 50): Promise<StockCorporateAction[]> {
  try {
    const p = new URLSearchParams({ country, limit: String(limit) });
    const res = await fetch(`${getBaseUrl()}/corporate-actions/upcoming?${p}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return Array.isArray(json.data) ? json.data.map(normalizeCorporateAction) : [];
  } catch (error) {
    console.error('Failed to fetch upcoming corporate actions:', error);
    return [];
  }
}

/** GET /stocks/:identifier/shareholding */
export async function getStockShareholding(identifier: string, country?: string): Promise<NonNullable<StockMasterDetail['shareholding_pattern']>> {
  try {
    const p = new URLSearchParams();
    if (country) p.set('country', country);
    const qs = p.toString();
    const res = await fetch(`${getBaseUrl()}/${encodeURIComponent(identifier)}/shareholding${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data = Array.isArray(json.data) ? json.data : Array.isArray(json.data?.shareholding) ? json.data.shareholding : [];
    return data.map((item: unknown) => {
      const row = asRecord(item);
      const topInstitutions = Array.isArray(row.top_institutions) ? row.top_institutions.map((item) => {
        const holder = asRecord(item);
        return { name: String(holder.name || ''), category: String(holder.category || ''), holding_pct: toNumber(holder.holding_pct) ?? 0 };
      }).filter((holder) => holder.name) : [];
      return {
        quarter: String(row.quarter ?? row.quarter_ending ?? ''),
        promoter: toNumber(row.promoter ?? row.promoter_pct),
        fii: toNumber(row.fii ?? row.fii_pct),
        dii: toNumber(row.dii ?? row.dii_pct),
        public: toNumber(row.public ?? row.public_pct),
        pledged: toNumber(row.pledged ?? row.promoter_pledged_pct),
        num_shareholders: toNumber(row.num_shareholders),
        top_institutions: topInstitutions,
      };
    });
  } catch (error) {
    console.error(`Failed to fetch shareholding for ${identifier}:`, error);
    return [];
  }
}

/**
 * 4. Fetch Dynamic Filter Presets & Dropdown Configurations
 * GET /stocks/filters/config
 */
export async function getFiltersConfig(country: string = 'India'): Promise<StockFiltersConfig | null> {
  try {
    const url = `${getBaseUrl()}/filters/config?country=${encodeURIComponent(country)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Failed to fetch filter config for ${country}:`, error);
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
