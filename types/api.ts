/**
 * Standardized API Response Contract
 * Synchronized with the backend envelope:
 * Success: { status: 1, statusCode, message, data, meta? }
 * Error:   { status: 0, statusCode, message, error?, timestamp, path }
 */

export interface PaginationMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  status: 1 | 0;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  error?: string | any;
  timestamp?: string;
  path?: string;
}

export interface ApiSuccessResponse<T = any> extends ApiResponse<T> {
  status: 1;
}

export interface ApiErrorResponse extends ApiResponse<never> {
  status: 0;
}
