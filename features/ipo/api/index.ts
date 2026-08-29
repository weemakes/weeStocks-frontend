import type { IPOListResponse, IPODetailResponse, IPOSummaryResponse, IPOQueryParams } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function getIPOList(params: IPOQueryParams = {}): Promise<IPOListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  if (params.type && params.type !== 'all') queryParams.append('type', params.type);
  if (params.category && params.category !== 'all') queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.snapshot_date) queryParams.append('snapshot_date', params.snapshot_date);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const url = `${API_BASE_URL}/ipos/gmp/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'User-Agent': 'WeeStox/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch IPO list: ${response.statusText}`);
  }

  return response.json();
}

export async function getIPODetail(companyName: string): Promise<IPODetailResponse> {
  const url = `${API_BASE_URL}/ipos/ipo-detail?company_name=${encodeURIComponent(companyName)}`;
  
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'User-Agent': 'WeeStox/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch IPO detail: ${response.statusText}`);
  }

  return response.json();
}

export async function getIPOSummary(snapshot_date?: string): Promise<IPOSummaryResponse> {
  const queryParams = new URLSearchParams();
  if (snapshot_date) queryParams.append('snapshot_date', snapshot_date);

  const url = `${API_BASE_URL}/ipos/gmp/summary${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'User-Agent': 'WeeStox/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch IPO summary: ${response.statusText}`);
  }

  return response.json();
}
