import 'server-only';
import type { IPOV2ListResponse, IPODetailV2Response, IPOQueryParams } from '../types';

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
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
    headers: {
      'User-Agent': 'WeeStox/1.0',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('IPO listings are temporarily unavailable');
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
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
    headers: {
      'User-Agent': 'WeeStox/1.0',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch IPO detail for ${slug}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
