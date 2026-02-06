import axios from 'axios';
import type { AxiosError } from 'axios';
import https from 'https';
import type { ApiResponse } from '@/types/api';
import {
  responseEnvelopeInterceptor,
  errorResponseInterceptor,
  loggingRequestInterceptor,
  loggingResponseInterceptor,
} from './interceptors';

/**
 * Server-side Axios instance for use in Server Components and Server Actions.
 *
 * - Uses API_BASE_URL (server-only env var) with NEXT_PUBLIC fallback
 * - No auth interceptor (token passed explicitly per-request)
 * - Response envelope checked
 * - 30s timeout
 */
const serverApiClient = axios.create({
  baseURL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  ...(process.env.API_ALLOW_SELF_SIGNED === 'true' && {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  }),
});

// Request interceptors
serverApiClient.interceptors.request.use(loggingRequestInterceptor);

// Response interceptors
serverApiClient.interceptors.response.use(loggingResponseInterceptor);
serverApiClient.interceptors.response.use(
  responseEnvelopeInterceptor,
  errorResponseInterceptor as (error: AxiosError) => never,
);

/**
 * Make a server-side POST request with explicit auth token.
 *
 * Reads cookies from `next/headers` to forward the auth token.
 *
 * @param endpoint - API path (e.g., '/login', '/balances')
 * @param body - Request payload
 * @param token - JWT token (optional, read from cookies if not provided)
 * @returns The `payload` field from the API response envelope
 */
export async function serverApiPost<T>(
  endpoint: string,
  body: object = {},
  token?: string,
): Promise<T> {
  let authToken = token;

  if (!authToken) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    authToken = cookieStore.get('auth-token')?.value;
  }

  const headers: Record<string, string> = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await serverApiClient.post<ApiResponse<T>>(endpoint, body, { headers });
  return response.data.payload as T;
}

export { serverApiClient };
