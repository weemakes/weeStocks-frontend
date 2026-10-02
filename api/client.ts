import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/api';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '';
  }
  return process.env.BACKEND_API_URL || 'http://localhost:3000';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Response Interceptor: Extracts data and handles status: 0 uniformly
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // If backend returned HTTP 200 but status: 0 (business logic failure)
    if (response.data && response.data.status === 0) {
      const errorMessage = response.data.message || 'Operation failed';
      return Promise.reject(new Error(errorMessage));
    }
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // Standardized HTTP errors (400, 404, 500, etc.)
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
