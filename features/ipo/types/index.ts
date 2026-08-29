export interface IPOParsed {
  gmp_value: number;
  gmp_percentage: number;
  gmp_previous: number | null;
  gmp_high: number | null;
  gmp_trend: 'up' | 'down' | 'flat' | null;
  subscription_times: number | null;
  rating_stars: number;
  is_sme: boolean;
  price_num: number;
  lot_size: number;
  min_investment: number;
  est_listing: number | null;
  est_profit_per_lot: number | null;
}

export interface IPOGmpHistoryItem {
  id: number;
  company_name: string;
  type: string;
  status: string;
  gmp: string;
  rating: string;
  sub: string;
  price: string;
  ipo_size: string;
  lot: string;
  open_date: string;
  close_date: string;
  boa_dt: string;
  listing_date: string;
  updated_on: string;
  anchor: string;
  snapshot_date: string;
  gmp_value: number | null;
  gmp_percentage: number | null;
  gmp_previous: number | null;
  gmp_high: number | null;
  gmp_trend: 'up' | 'down' | 'flat' | null;
  parsed: IPOParsed;
}

export interface IPO {
  id: number;
  company_name: string;
  type: string;
  status: string;
  gmp: string;
  rating: string;
  sub: string;
  price: string;
  ipo_size: string;
  lot: string;
  open_date: string;
  close_date: string;
  boa_dt: string;
  listing_date: string;
  updated_on: string;
  anchor: string;
  snapshot_date: string;
  gmp_value: number | null;
  gmp_percentage: number | null;
  gmp_previous: number | null;
  gmp_high: number | null;
  gmp_trend: 'up' | 'down' | 'flat' | null;
  parsed: IPOParsed;
}

export interface IPOSummary {
  total: number;
  open: number;
  upcoming: number;
  closed: number;
  listed: number;
  mainboard: number;
  sme: number;
}

export interface IPOListResponse {
  status: number;
  message: string;
  data: {
    snapshot_date: string;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    summary: IPOSummary;
    ipos: IPO[];
  };
}

export interface IPODetailSummary {
  current_gmp: number;
  gmp_percentage: number;
  est_listing: number;
  est_profit_per_lot: number;
  price_band: string;
  subscription: string;
  issue_size: string;
  trend_text: string;
  subject_to_sauda_retail: string | null;
  subject_to_sauda_hni: string | null;
}

export interface IPODetailResponse {
  status: number;
  message: string;
  data: {
    company: IPO;
    history: IPOGmpHistoryItem[];
    summary: IPODetailSummary;
  };
}

export interface IPOSummaryResponse {
  status: number;
  message: string;
  data: {
    snapshot_date: string;
    counts: IPOSummary;
    top_gainers: IPO[];
    most_subscribed: IPO[];
    open_ipos: IPO[];
    upcoming_ipos: IPO[];
    available_snapshot_dates: string[];
  };
}

export type IPOStatus = 'all' | 'open' | 'upcoming' | 'closed' | 'closed_today' | 'listed';
export type IPOType = 'all' | 'ipo' | 'mainboard' | 'sme' | 'bse_sme' | 'nse_sme';
export type IPOCategory = 'all' | 'mainboard' | 'sme';
export type IPOSort = 'gmp_desc' | 'gmp_asc' | 'sub_desc' | 'rating_desc' | 'open_date_desc' | 'open_date_asc' | 'close_date_asc' | 'name_asc' | 'name_desc' | 'newest';

export interface IPOQueryParams {
  status?: IPOStatus;
  type?: IPOType;
  category?: IPOCategory;
  search?: string;
  sort?: IPOSort;
  snapshot_date?: string;
  page?: number;
  limit?: number;
}
