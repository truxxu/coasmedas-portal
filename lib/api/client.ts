import axios from 'axios';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import {
  createAuthRequestInterceptor,
  responseEnvelopeInterceptor,
  errorResponseInterceptor,
  loggingRequestInterceptor,
  loggingResponseInterceptor,
} from './interceptors';

let tokenGetter: () => string | null = () => null;

/**
 * Set the function used to retrieve the auth token for client-side requests.
 * Call this from the AuthProvider/UserContext when the token changes.
 */
export function setTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
}

/**
 * Client-side Axios instance for the Coasmedas API.
 *
 * - Base URL from NEXT_PUBLIC_API_BASE_URL
 * - All requests use POST (backend convention)
 * - Auth token injected via request interceptor
 * - Response envelope checked (non-zero statusCode throws)
 * - 30s timeout
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

// Request interceptors
apiClient.interceptors.request.use(loggingRequestInterceptor);
apiClient.interceptors.request.use(createAuthRequestInterceptor(() => tokenGetter()));

// Response interceptors
apiClient.interceptors.response.use(loggingResponseInterceptor);
apiClient.interceptors.response.use(
  responseEnvelopeInterceptor,
  errorResponseInterceptor as (error: AxiosError) => never,
);

/**
 * Make a POST request to the Coasmedas API and return the unwrapped payload.
 *
 * All backend endpoints use POST, so this is the primary API call method.
 *
 * @param endpoint - API path (e.g., '/login', '/balances')
 * @param body - Request payload
 * @returns The `payload` field from the API response envelope
 */
export async function apiPost<T>(endpoint: string, body: object = {}): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(endpoint, body);
  return response.data.payload as T;
}

export { apiClient };
