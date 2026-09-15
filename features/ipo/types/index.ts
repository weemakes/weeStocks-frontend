// V2 IPO API Types

export interface IPOV2Gmp {
  value: number;
  percentage: number | null;
  display: string;
  sub_display?: string;
  rating: number;
}

export interface IPOV2ListItem {
  id: number;
  slug: string;
  company_name: string;
  status: 'Upcoming' | 'Open' | 'Closed' | 'Listed' | string;
  updated_on: string;
  type: string; // e.g. "BSE SME", "IPO", "NSE SME"
  open_close: string; // e.g. "10 Sep → 15 Sep"
  open_date: string;
  close_date: string;
  ipo_size_cr: number | null;
  ipo_size_display: string | null;
  issue_price: number | null;
  issue_price_display: string | null;
  min_investment: number | null;
  min_investment_display: string | null;
  gmp: IPOV2Gmp;
  est_profit: number | null;
  est_profit_display: string | null;
  est_listing: number | null;
  est_listing_display: string | null;
  subscription_times: number | null;
  subscription_display: string;
  lot_size: number | null;
  lot_size_display: string | null;
  listing_date: string | null;
  listing_date_display: string | null;
  has_anchor: boolean;
  halal_status: 'halal' | 'not_halal' | 'doubtful' | string | null;
  halal_score: number | null;
}

export interface IPOV2Summary {
  total: number;
  open: number;
  upcoming: number;
  closed: number;
  listed: number;
  mainboard: number;
  sme: number;
}

export interface IPOV2ListResponse {
  status: number;
  message: string;
  data: {
    snapshot_date: string;
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    summary: IPOV2Summary;
    ipos: IPOV2ListItem[];
  };
}

// V2 IPO Detail Types

export interface IPOProfile {
  id: number;
  slug: string;
  company_name: string;
  logo_url: string | null;
  type: string;
  status: string;
  isin: string | null;
  sector: string | null;
  industry: string | null;
  listing_at: string | null;
  symbol_nse: string | null;
  symbol_bse: string | null;
  website: string | null;
  company_website: string | null;
  registered_address: string | null;
  ipo_summary: string | null;
  business_description: string | null;
}

export interface IPOIssueDetails {
  open_date: string | null;
  close_date: string | null;
  allotment_date: string | null;
  refund_date: string | null;
  credit_date: string | null;
  listing_date: string | null;
  face_value: number | null;
  price_band_lower: number | null;
  price_band_upper: number | null;
  price_band_display: string | null;
  lot_size: number | null;
  min_investment: number | null;
  min_investment_display: string | null;
  total_issue_amount_cr: number | null;
  fresh_issue_amount_cr: number | null;
  ofs_amount_cr: number | null;
  fresh_issue_shares: number | null;
  ofs_shares: number | null;
}

export interface IPODocuments {
  rhp_url: string | null;
  drhp_url: string | null;
  anchor_pdf_url: string | null;
}

export interface IPORegistrar {
  name: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
}

export interface IPODetailGmp {
  value: number;
  percentage: number | null;
  previous: number | null;
  high: number | null;
  trend: 'up' | 'down' | 'flat' | string | null;
  display: string;
  rating: number;
  subscription_times: number | null;
  subscription_display: string;
  anchor_investor: string | null;
  snapshot_date: string | null;
  updated_on: string | null;
}

export interface IPOEstimates {
  est_listing: number | null;
  est_listing_display: string | null;
  est_profit_per_lot: number | null;
  est_profit_display: string | null;
}

export interface IPOKpi {
  roe: number | null;
  roce: number | null;
  ronw: number | null;
  debt_equity_ratio: number | null;
  eps_basic: number | null;
  eps_diluted: number | null;
  pe_pre_ipo: number | null;
  pe_post_ipo: number | null;
  market_cap_pre_ipo_cr: number | null;
  market_cap_post_ipo_cr: number | null;
  price_to_book: number | null;
  ebitda_margin: number | null;
  pat_margin: number | null;
  as_of_date: string | null;
}

export interface IPOFinancialYear {
  period_ended: string;
  assets_cr: number | null;
  total_income_cr: number | null;
  profit_after_tax_cr: number | null;
  ebitda_cr: number | null;
  net_worth_cr: number | null;
  reserves_surplus_cr: number | null;
  total_borrowing_cr: number | null;
  cash_and_bank_balance_cr: number | null;
  trade_receivables_cr: number | null;
  interest_income_cr: number | null;
}

export interface IPOSubscriptionCategory {
  category: string;
  day_number?: number | null;
  shares_offered?: number | null;
  shares_applied?: number | null;
  subscription_times?: number | null;
  amount_applied_cr?: number | null;
  applications_reserved?: number | null;
  applications_applied?: number | null;
  applications_times?: number | null;
  demand_offered_cr?: number | null;
  demand_applied_cr?: number | null;
  demand_times?: number | null;
  sub_type?: string | null;
}

export interface IPOHalalScreening {
  status: 'halal' | 'not_halal' | 'doubtful' | string;
  score: number | null;
  business_activity: string | null;
  notes: string | null;
  debt_to_assets_pct: number | null;
  non_compliant_income_pct: number | null;
  purification_pct: number | null;
  cash_to_assets_pct: number | null;
  receivables_to_assets_pct: number | null;
  methodology: string | null;
  screening_method: string | null;
  last_reviewed_at: string | null;
}

export interface IPOAnchorInvestor {
  bid_date: string | null;
  shares_offered: number | null;
  amount_cr: number | null;
  lock_in_50pct_date: string | null;
  lock_in_remaining_date: string | null;
  investor_breakdown?: Array<{
    investor_name: string;
    shares_allocated?: number;
    amount_cr?: number;
    percentage?: number;
  }>;
}

export interface IPOReservationItem {
  category: string;
  shares: number | null;
  percentage: number | null;
}

export interface IPOLotDistributionItem {
  category: string;
  lots: number;
  qty: number;
  amount: number;
  reserved: number | null;
}

export interface IPOBrokerReview {
  reviewer: string;
  recommendation: 'Apply' | 'Neutral' | 'Avoid' | 'Not Rated' | string;
  file_url: string | null;
}

export interface IPOSubscriptionSummary {
  by_shares?: Array<{
    category: string;
    offered: number | null;
    applied: number | null;
    times: number | null;
  }>;
  by_applications?: Array<{
    category: string;
    reserved: number | null;
    applied: number | null;
    times: number | null;
  }>;
  by_demand_cr?: Array<{
    category: string;
    offered_cr: number | null;
    applied_cr: number | null;
    times: number | null;
  }>;
  day_wise?: Array<{category?: string; day_1?: number | string | null; day_2?: number | string | null; day_3?: number | string | null}>;
  funding_interest_cost?: Record<string, number>;
  last_updated_at?: string | null;
}

export interface IPODetailData {
  profile: IPOProfile;
  issue_details: IPOIssueDetails;
  documents: IPODocuments;
  registrar: IPORegistrar;
  lead_managers: string[];
  promoters: string[];
  gmp: IPODetailGmp;
  estimates: IPOEstimates;
  kpi: IPOKpi | null;
  financials: IPOFinancialYear[];
  subscriptions: IPOSubscriptionCategory[];
  subscription_summary?: IPOSubscriptionSummary | null;
  reservation?: IPOReservationItem[];
  lot_distribution?: IPOLotDistributionItem[];
  funding_interest_cost?: Record<string, number> | null;
  strengths?: string[];
  risks?: string[];
  broker_reviews?: IPOBrokerReview[];
  peer_comparison?: unknown[];
  anchor_investor: IPOAnchorInvestor | null;
  halal_screening: IPOHalalScreening | null;
  created_at: string;
  updated_at: string;
}

export interface IPODetailV2Response {
  status: number;
  message: string;
  data: IPODetailData;
}

export interface IPOQueryParams {
  status?: string;
  type?: string;
  category?: string;
  search?: string;
  snapshot_date?: string;
  sort?: string;
  halal?: string;
  page?: number | string;
  limit?: number | string;
}
