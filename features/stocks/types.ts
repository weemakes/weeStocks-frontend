export type ComplianceStatus = 'compliant' | 'non_compliant' | 'doubtful';

export interface ShariahCriteria {
  businessActivityStatus: 'pass' | 'fail';
  nonHalalRevenuePercent: number;
  nonHalalRevenueSource?: string;
  debtRatioPercent: number;
  debtRatioStatus: 'pass' | 'fail';
  cashAndSecuritiesRatioPercent: number;
  cashRatioStatus: 'pass' | 'fail';
  receivablesRatioPercent?: number;
  purificationPercent: number;
}

export interface FundamentalMetrics {
  peRatio: number;
  pbRatio: number;
  roePercent: number;
  rocePercent: number;
  debtToEquity: number;
  freeCashFlowCr: number;
  dividendYield: number;
  week52High: number;
  week52Low: number;
}

export interface StockItem {
  id: string;
  symbol: string;
  name: string;
  logo_url?: string | null;
  exchange: string;
  country?: string;
  currency?: string;
  currencySymbol?: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCapCr: number;
  marketCapCategory: 'Large Cap' | 'Mid Cap' | 'Small Cap';
  halalScore: number;
  complianceStatus: ComplianceStatus;
  statusReason: string;
  shariah: ShariahCriteria;
  fundamentals: FundamentalMetrics;
  lastUpdated: string;
  isNifty50?: boolean;
  rawMarketCap?: number;
  trader_indicators?: {
    market_tier?: string;
    rank_in_country?: number;
    is_top_ten?: boolean;
    range_52w_position?: number | null;
    distance_52w_high_pct?: number | null;
    distance_52w_low_pct?: number | null;
    delivery_pct?: number | null;
    momentum_status?: string;
    cpr_nature?: string | null;
  };
}

export type StockSortField = 
  | 'symbol' 
  | 'price' 
  | 'changePercent' 
  | 'marketCapCr' 
  | 'halalScore' 
  | 'debtRatio' 
  | 'purification' 
  | 'pe_ratio'
  | 'volume';

export type SortDirection = 'asc' | 'desc';

// ==========================================
// Multi-Market Live Backend API Models
// ==========================================

export interface StockCountry {
  country: string;
  code: string;
  flag: string;
  exchange: string;
  currency: string;
  currency_symbol: string;
  total_companies: number;
  is_active: boolean;
}

export interface StockListItem {
  id: string;
  symbol: string;
  isin?: string | null;
  company_name: string;
  logo_url?: string | null;
  exchange: string;
  country: string;
  currency: string;
  sector?: string | null;
  industry?: string | null;
  latest_price: number;
  change: number;
  change_percentage: number;
  volume: number;
  market_date?: string;
  trader_indicators?: {
    market_tier?: string;
    rank_in_country?: number;
    is_top_ten?: boolean;
    range_52w_position?: number | null;
    distance_52w_high_pct?: number | null;
    distance_52w_low_pct?: number | null;
    delivery_pct?: number | null;
    momentum_status?: string;
    cpr_nature?: string | null;
  };
  metrics?: {
    market_cap?: number;
    pe_ratio?: number;
    price_to_book?: number;
    dividend_yield?: number;
    roe?: number;
    fifty_two_week_high?: number;
    fifty_two_week_low?: number;
  };
  shariah_compliance?: {
    status: 'HALAL' | 'NON_HALAL' | 'DOUBTFUL' | 'PASS' | 'FAIL';
    score?: number;
    is_sector_compliant?: boolean;
    is_debt_compliant?: boolean;
    debt_to_market_cap?: number;
    methodology?: string;
    notes?: string[] | string;
  };
}

export interface StockFilterPreset {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: string;
}

export interface StockSortOption {
  id: string;
  label: string;
  default_order?: 'ASC' | 'DESC';
}

export interface StockMarketTier {
  id: string;
  label: string;
}

export interface StockFiltersConfig {
  country: string;
  presets: StockFilterPreset[];
  sort_options: StockSortOption[];
  market_tiers: StockMarketTier[];
  sectors: string[];
}

export interface StockMasterDetail {
  trader_insights: {
    market_tier: string;
    rank_in_country: number;
    is_top_ten: boolean;
    momentum_status: string;
    range_52w_position: number;
    distance_52w_high_pct: number;
    distance_52w_low_pct: number;
    cpr_nature?: string | null;
  };
  company: {
    id: string;
    symbol: string;
    name: string;
    country: string;
    exchange: string;
    currency: string;
    sector: string;
    industry: string;
    sub_industry?: string;
    website?: string;
    logo_url?: string;
    description?: string;
  };
  quote: {
    price: number;
    previous_close: number;
    change: number;
    change_percentage: number;
    day_high: number;
    day_low: number;
    volume: number;
    date?: string;
  };
  metrics: {
    market_cap: number;
    enterprise_value?: number;
    pe_ratio?: number;
    forward_pe?: number;
    price_to_book?: number;
    peg_ratio?: number;
    eps?: number;
    forward_eps?: number;
    roe?: number;
    roa?: number;
    roce?: number;
    debt_to_equity?: number;
    dividend_yield?: number;
    face_value?: number;
    fifty_two_week_high?: number;
    fifty_two_week_low?: number;
  };
  scores: {
    overall: number;
    valuation: number;
    profitability: number;
    financial_health: number;
  };
  flags: {
    green_flags: string[];
    red_flags: string[];
  };
  thesis: {
    bull_case: string[];
    bear_case: string[];
    flip_conditions: string[];
  };
  technicals: {
    reference_date?: string;
    current_price?: number;
    classical_pivots?: {
      pivot: number;
      r1: number;
      r2: number;
      r3: number;
      s1: number;
      s2: number;
      s3: number;
    };
    cpr?: {
      tc: number;
      pivot: number;
      bc: number;
      nature?: string;
    };
    moving_averages?: Record<string, number>;
  };
  delivery_conviction?: Array<{
    date: string;
    delivery_percentage: number;
    traded_quantity: number;
    delivery_quantity: number;
  }>;
  quarterly_financials?: Array<{
    fiscal_year: number;
    fiscal_quarter: number;
    revenue: number;
    operating_income?: number;
    ebitda?: number;
    net_income: number;
    diluted_eps?: number;
  }>;
  annual_financials?: Array<{
    fiscal_year: number;
    revenue: number;
    operating_income?: number;
    ebitda?: number;
    net_income: number;
    diluted_eps?: number;
    total_assets?: number;
    total_debt?: number;
    free_cash_flow?: number;
  }>;
  shareholding_pattern?: Array<{
    quarter: string;
    promoter: number;
    fii: number;
    dii: number;
    public: number;
    pledged?: number;
  }>;
  peers?: Array<{
    symbol: string;
    company_name: string;
    market_cap: number;
    pe_ratio?: number;
    price_to_book?: number;
    roe?: number;
    roce?: number;
  }>;
  shariah_compliance: {
    status: string;
    score?: number;
    is_sector_compliant?: boolean;
    is_debt_compliant?: boolean;
    is_cash_compliant?: boolean;
    debt_to_market_cap?: number;
    cash_to_market_cap?: number;
    methodology?: string;
    notes?: string | string[];
  };
  chart: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export interface StockListResponse {
  status: number;
  message: string;
  data: StockListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StockDetailData {
  profile: {
    id: string;
    symbol: string;
    isin?: string | null;
    company_name: string;
    logo_url?: string | null;
    exchange: string;
    country: string;
    currency: string;
    sector?: string | null;
    industry?: string | null;
    website?: string | null;
    description?: string | null;
    quote_type?: string;
    status?: string;
  };
  quote: {
    price: number | string;
    previous_close?: number | string;
    change: number | string;
    change_percentage: number | string;
    open?: number | string;
    day_high?: number | string;
    day_low?: number | string;
    volume?: number | string;
    date?: string;
  };
  metrics?: {
    market_cap?: number | string;
    enterprise_value?: number | string;
    pe_ratio?: number | string;
    forward_pe?: number | string;
    price_to_book?: number | string;
    peg_ratio?: number | string;
    eps?: number | string;
    forward_eps?: number | string;
    roe?: number | string;
    roa?: number | string;
    dividend_yield?: number | string;
    fifty_two_week_high?: number | string;
    fifty_two_week_low?: number | string;
  };
  financial_summary?: {
    fiscal_year?: number;
    period_type?: string;
    revenue?: number | string;
    net_income?: number | string;
    total_assets?: number | string;
    total_debt?: number | string;
    cash_and_equivalents?: number | string;
  };
  shariah_compliance?: {
    status: 'HALAL' | 'NON_HALAL' | 'DOUBTFUL';
    debt_to_market_cap?: number | string;
    cash_to_market_cap?: number | string;
    notes?: string[];
  };
}

export interface StockCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockChartData {
  symbol: string;
  company_name: string;
  currency: string;
  range: string;
  total_candles: number;
  candles: StockCandle[];
}

export interface FinancialSnapshot {
  id: string;
  fiscal_year: number;
  period_type: 'ANNUAL' | 'QUARTERLY';
  income_statement?: {
    revenue?: number | string;
    gross_profit?: number | string;
    operating_income?: number | string;
    net_income?: number | string;
    interest_income?: number | string;
    interest_expense?: number | string;
  };
  balance_sheet?: {
    total_assets?: number | string;
    total_liabilities?: number | string;
    total_debt?: number | string;
    cash_and_equivalents?: number | string;
  };
  cash_flow?: {
    operating_cash_flow?: number | string;
    free_cash_flow?: number | string;
  };
}

export interface StockFinancialsData {
  symbol: string;
  company_name: string;
  currency: string;
  snapshots: FinancialSnapshot[];
}

export interface StockHalalAuditData {
  company: {
    id: string;
    symbol: string;
    company_name: string;
    logo_url?: string | null;
    sector?: string;
    industry?: string;
    exchange: string;
    country: string;
  };
  audit: {
    status: 'HALAL' | 'NON_HALAL' | 'DOUBTFUL';
    is_sector_compliant: boolean;
    is_debt_compliant: boolean;
    is_cash_compliant: boolean;
    debt_to_market_cap: number | string;
    cash_to_market_cap: number | string;
    methodology: string;
    notes: string[];
  };
}

export interface MarketMoverItem {
  id: string;
  symbol: string;
  company_name: string;
  logo_url?: string | null;
  country: string;
  exchange: string;
  currency: string;
  sector?: string;
  price: number | string;
  previous_close?: number | string;
  change: number | string;
  change_percentage: number | string;
  volume: number | string;
  date?: string;
}

export interface MarketSectorOverview {
  sector: string;
  count: number | string;
  percentage?: number | string;
}

export interface MarketOverviewData {
  country: string;
  total_stocks?: number | string;
  summary?: Array<{
    country: string;
    total_companies: number | string;
    companies_with_isin?: number | string;
    companies_with_sector?: number | string;
  }>;
  top_sectors: MarketSectorOverview[];
}
