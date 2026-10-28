import type {
  IPOV2ListResponse,
  IPODetailV2Response,
  IPOGmpHistoryResponse,
  IPOQueryParams,
  IPOV2Summary,
  IPOFilterCountsMatrix,
  IPOStatusCounts,
} from '../types';

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

/**
 * Trigger immediate sync of all live subscriptions
 * POST /v2/ipos/sync-live-subscriptions
 */
export async function syncLiveSubscriptions(): Promise<{ status: number; message: string; count?: number }> {
  const url = `${API_BASE_URL}/v2/ipos/sync-live-subscriptions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'WeeStox/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to sync live subscriptions: ${response.status}`);
  }
  return response.json();
}

/**
 * Deep enrich a single IPO (subscription tables, day-wise, applications, funding cost)
 * POST /v2/ipos/:id/enrich-premium
 */
export async function enrichIPODetail(idOrSlug: string | number): Promise<{ status: number; message: string; count?: number }> {
  const url = `${API_BASE_URL}/v2/ipos/${encodeURIComponent(idOrSlug)}/enrich-premium`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'WeeStox/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to deep enrich IPO ${idOrSlug}: ${response.status}`);
  }
  return response.json();
}

/**
 * In-memory short-term cache for IPO filter counts matrix to prevent redundant backend calls
 */
const countsMatrixCache = new Map<string, { matrix: IPOFilterCountsMatrix; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000;

/**
 * Fetch and construct the cross-filter counts matrix.
 * Allows status tabs (All, Open, Upcoming, Closed, Listed) to update dynamically when Mainboard/SME is selected,
 * and allows category tabs (All, Mainboard, SME) to reflect current status or feature selections.
 */
export async function getIPOCountsMatrix(
  baseSummary?: IPOV2Summary,
  options: { halal?: string } = {}
): Promise<IPOFilterCountsMatrix> {
  const isHalal = options.halal === 'true';
  const cacheKey = isHalal ? 'halal' : 'all';
  const cached = countsMatrixCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.matrix;
  }

  try {
    if (isHalal) {
      // Query totals for halal universe concurrently
      const [
        allTotalRes,
        allOpenRes,
        allUpcomingRes,
        allClosedRes,
        allListedRes,
        mbTotalRes,
        mbOpenRes,
        mbUpcomingRes,
        mbClosedRes,
        mbListedRes,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/v2/ipos?halal=true&limit=1`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/v2/ipos?halal=true&status=open&limit=1`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/v2/ipos?halal=true&status=upcoming&limit=1`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/v2/ipos?halal=true&status=closed&limit=1`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/v2/ipos?halal=true&status=listed&limit=1`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/v2/ipos?halal=true&category=mainboard&limit=1`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/v2/ipos?halal=true&category=mainboard&status=open&limit=1`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/v2/ipos?halal=true&category=mainboard&status=upcoming&limit=1`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/v2/ipos?halal=true&category=mainboard&status=closed&limit=1`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/v2/ipos?halal=true&category=mainboard&status=listed&limit=1`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => null),
      ]);

      const allTotal = allTotalRes?.data?.total ?? 0;
      const allOpen = allOpenRes?.data?.total ?? 0;
      const allUpcoming = allUpcomingRes?.data?.total ?? 0;
      const allClosed = allClosedRes?.data?.total ?? 0;
      const allListed = allListedRes?.data?.total ?? 0;

      const mbTotal = mbTotalRes?.data?.total ?? 0;
      const mbOpen = mbOpenRes?.data?.total ?? 0;
      const mbUpcoming = mbUpcomingRes?.data?.total ?? 0;
      const mbClosed = mbClosedRes?.data?.total ?? 0;
      const mbListed = mbListedRes?.data?.total ?? 0;

      const matrix: IPOFilterCountsMatrix = {
        all: {
          total: allTotal,
          open: allOpen,
          upcoming: allUpcoming,
          closed: allClosed,
          listed: allListed,
        },
        mainboard: {
          total: mbTotal,
          open: mbOpen,
          upcoming: mbUpcoming,
          closed: mbClosed,
          listed: mbListed,
        },
        sme: {
          total: Math.max(0, allTotal - mbTotal),
          open: Math.max(0, allOpen - mbOpen),
          upcoming: Math.max(0, allUpcoming - mbUpcoming),
          closed: Math.max(0, allClosed - mbClosed),
          listed: Math.max(0, allListed - mbListed),
        },
      };

      countsMatrixCache.set(cacheKey, { matrix, timestamp: Date.now() });
      return matrix;
    }

    // Default (non-halal):
    let sum = baseSummary;
    if (!sum) {
      const summaryRes = await fetch(`${API_BASE_URL}/v2/ipos?limit=1`, { next: { revalidate: 60 } })
        .then((r) => r.json())
        .catch(() => null);
      sum = summaryRes?.data?.summary;
    }

    const total = sum?.total ?? 164;
    const open = sum?.open ?? 6;
    const upcoming = sum?.upcoming ?? 8;
    const closed = sum?.closed ?? 2;
    const listed = sum?.listed ?? 148;
    const mbTotal = sum?.mainboard ?? 72;
    const smeTotal = sum?.sme ?? 92;

    // Concurrently fetch the 4 Mainboard status counts
    const [mbOpenRes, mbUpcomingRes, mbClosedRes, mbListedRes] = await Promise.all([
      fetch(`${API_BASE_URL}/v2/ipos?category=mainboard&status=open&limit=1`, { next: { revalidate: 60 } })
        .then((r) => r.json())
        .catch(() => null),
      fetch(`${API_BASE_URL}/v2/ipos?category=mainboard&status=upcoming&limit=1`, { next: { revalidate: 60 } })
        .then((r) => r.json())
        .catch(() => null),
      fetch(`${API_BASE_URL}/v2/ipos?category=mainboard&status=closed&limit=1`, { next: { revalidate: 60 } })
        .then((r) => r.json())
        .catch(() => null),
      fetch(`${API_BASE_URL}/v2/ipos?category=mainboard&status=listed&limit=1`, { next: { revalidate: 60 } })
        .then((r) => r.json())
        .catch(() => null),
    ]);

    const mbOpen = mbOpenRes?.data?.total ?? 3;
    const mbUpcoming = mbUpcomingRes?.data?.total ?? 2;
    const mbClosed = mbClosedRes?.data?.total ?? 1;
    const mbListed = mbListedRes?.data?.total ?? 66;

    const matrix: IPOFilterCountsMatrix = {
      all: {
        total,
        open,
        upcoming,
        closed,
        listed,
      },
      mainboard: {
        total: mbTotal,
        open: mbOpen,
        upcoming: mbUpcoming,
        closed: mbClosed,
        listed: mbListed,
      },
      sme: {
        total: smeTotal,
        open: Math.max(0, open - mbOpen),
        upcoming: Math.max(0, upcoming - mbUpcoming),
        closed: Math.max(0, closed - mbClosed),
        listed: Math.max(0, listed - mbListed),
      },
    };

    countsMatrixCache.set(cacheKey, { matrix, timestamp: Date.now() });
    return matrix;
  } catch (err) {
    console.error('Failed to generate IPO filter counts matrix:', err);
    return {
      all: {
        total: baseSummary?.total ?? 164,
        open: baseSummary?.open ?? 6,
        upcoming: baseSummary?.upcoming ?? 8,
        closed: baseSummary?.closed ?? 2,
        listed: baseSummary?.listed ?? 148,
      },
      mainboard: {
        total: baseSummary?.mainboard ?? 72,
        open: 3,
        upcoming: 2,
        closed: 1,
        listed: 66,
      },
      sme: {
        total: baseSummary?.sme ?? 92,
        open: 3,
        upcoming: 6,
        closed: 1,
        listed: 82,
      },
    };
  }
}
