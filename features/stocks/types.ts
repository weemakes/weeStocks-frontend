export type ComplianceStatus = 'compliant' | 'non_compliant' | 'doubtful';

export interface ShariahCriteria {
  // Business activity screening (impermissible revenue <= 5%)
  businessActivityStatus: 'pass' | 'fail';
  nonHalalRevenuePercent: number; // e.g. 0%, 2.1%
  nonHalalRevenueSource?: string;

  // Debt screening (interest-bearing debt / 36-month avg market cap <= 33%)
  debtRatioPercent: number; // e.g. 14.5%
  debtRatioStatus: 'pass' | 'fail';

  // Liquidity screening (interest-bearing securities + cash / market cap <= 33%)
  cashAndSecuritiesRatioPercent: number; // e.g. 18.2%
  cashRatioStatus: 'pass' | 'fail';

  // Receivables screening (accounts receivable / market cap <= 50% or total assets)
  receivablesRatioPercent?: number;

  // Dividend purification ratio (% of dividend that must be purified)
  purificationPercent: number; // e.g. 0.35%
}

export interface FundamentalMetrics {
  peRatio: number;
  pbRatio: number;
  roePercent: number;
  rocePercent: number;
  debtToEquity: number;
  freeCashFlowCr: number; // in Crores
  dividendYield: number; // in %
  week52High: number;
  week52Low: number;
}

export interface StockItem {
  id: string;
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'NSE & BSE';
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  marketCapCr: number; // Market Cap in INR Crores
  marketCapCategory: 'Large Cap' | 'Mid Cap' | 'Small Cap';
  halalScore: number; // 0 to 100
  complianceStatus: ComplianceStatus;
  statusReason: string;
  shariah: ShariahCriteria;
  fundamentals: FundamentalMetrics;
  lastUpdated: string;
  isNifty50?: boolean;
}

export type StockSortField = 
  | 'symbol' 
  | 'price' 
  | 'changePercent' 
  | 'marketCapCr' 
  | 'halalScore' 
  | 'debtRatio' 
  | 'purification';

export type SortDirection = 'asc' | 'desc';
