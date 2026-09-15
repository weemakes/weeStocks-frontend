import 'server-only';
/**
 * API Client
 * Server-side HTTP client for backend API communication
 * This should ONLY be used in Server Components or Server Actions
 */

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  revalidate?: number;
}

/**
 * Make a request to the backend API
 * Server-side only - do not use in Client Components
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${BACKEND_API_URL}${endpoint}`;

  console.log(`[API Request] ${options.method || "GET"} ${url}`);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    signal: AbortSignal.timeout(12000),
    headers,
    cache: options.cache,
    next: options.revalidate !== undefined ? { revalidate: options.revalidate } : undefined,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);

    console.log(`[API Response] ${url} - Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Error] ${url} - ${response.status}: ${errorText}`);
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status,
        errorText
      );
    }

    const data = await response.json();
    console.log(`[API Success] ${url} - Data received`);
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[API Network Error] ${url} - ${errorMessage}`);
    throw new ApiError(`Network error: ${errorMessage}`);
  }
}

/**
 * Build query string from parameters
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== undefined
  );

  if (filtered.length === 0) return "";

  const query = new URLSearchParams(
    filtered.map(([key, value]) => [key, String(value)])
  );

  return `?${query.toString()}`;
}
