import type { IPOV2ListResponse, IPODetailV2Response, IPOGmpHistoryResponse, IPOQueryParams } from '../types';

export class IPOApiError extends Error {
  constructor(message: string, public status: number) { super(message); this.name = 'IPOApiError'; }
}

const API_BASE_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Fetch IPO list using V2 API
 * GET /v2/ipos
 */
export async function getIPOList(params: IPOQueryParams = {}): Promise<IPOV2ListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  if (params.type && params.type !== 'all') queryParams.append('type', params.type);
  if (params.category && params.category !== 'all') queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.snapshot_date) queryParams.append('snapshot_date', params.snapshot_date);
  if (params.halal) queryParams.append('halal', params.halal);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/v2/ipos${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    next: { revalidate: 15 },
    headers: {
      'User-Agent': 'WeeStox/1.0',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch IPO list from ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch IPO detailed profile and analysis using V2 API
 * GET /v2/ipos/:slug
 */
export async function getIPODetail(slug: string): Promise<IPODetailV2Response> {
  const encodedSlug = encodeURIComponent(slug.trim());
  const url = `${API_BASE_URL}/v2/ipos/${encodedSlug}`;
  
  const response = await fetch(url, {
    next: { revalidate: 15 },
    headers: {
      'User-Agent': 'WeeStox/1.0',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new IPOApiError(`Failed to fetch IPO detail for ${slug}: ${response.status} ${response.statusText}`, response.status);
  }

  const payload = (await response.json()) as IPODetailV2Response;

  // The detail endpoint currently exposes allotment fields inside `profile`,
  // while list rows expose them at the item root. Normalize both supported
  // response shapes so detail consumers always read one consistent contract.
  if (payload.data?.profile) {
    payload.data.is_allotment_out =
      payload.data.is_allotment_out ?? payload.data.profile.is_allotment_out ?? false;
    payload.data.allotment_declared_at =
      payload.data.allotment_declared_at ?? payload.data.profile.allotment_declared_at ?? null;
  }

  return payload;
}

/**
 * Fetch genuine daily GMP snapshots retained by the backend.
 * GET /v2/ipos/:slug/gmp-history
 */
export async function getIPOGmpHistory(slug: string): Promise<IPOGmpHistoryResponse> {
  const encodedSlug = encodeURIComponent(slug.trim());
  const url = `${API_BASE_URL}/v2/ipos/${encodedSlug}/gmp-history`;
  const response = await fetch(url, {
    next: { revalidate: 900 },
    headers: {
      'User-Agent': 'WeeStox/1.0',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GMP history for ${slug}: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as IPOGmpHistoryResponse;
  if (payload.status === 0 || !Array.isArray(payload.data?.history)) {
    throw new Error(payload.message || 'GMP history is unavailable');
  }
  return payload;
}
