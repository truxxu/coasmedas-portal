import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError, API_ERROR_CODES, AuthError, parseApiError } from './errors';

/**
 * Inject Authorization header from a token getter function.
 * The getter is injected to decouple from the storage mechanism.
 */
export function createAuthRequestInterceptor(getToken: () => string | null) {
  return (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  };
}

/**
 * Response interceptor that checks the Coasmedas API response envelope.
 *
 * The backend always returns HTTP 200 with `{ statusCode, statusDesc, payload }`.
 * This interceptor checks `statusCode` and throws typed errors for non-zero codes.
 */
export function responseEnvelopeInterceptor(response: AxiosResponse): AxiosResponse {
  const data = response.data;

  // If the response doesn't follow the envelope pattern, pass through
  if (!data || typeof data.statusCode === 'undefined') {
    return response;
  }

  if (data.statusCode === API_ERROR_CODES.UNAUTHORIZED) {
    throw new AuthError(data.statusDesc);
  }

  if (data.statusCode !== API_ERROR_CODES.SUCCESS) {
    const payload = data.payload as Record<string, unknown> | undefined;
    const upstreamError = payload?.error as Record<string, unknown> | undefined;

    const statusDesc =
      (upstreamError?.stateDescriptionCustomer as string) ||
      data.statusDesc ||
      'Error desconocido';

    throw new ApiError(data.statusCode, statusDesc, response.status);
  }

  return response;
}

/**
 * Error response interceptor that transforms Axios errors into typed ApiErrors.
 */
export function errorResponseInterceptor(error: AxiosError<{ statusCode?: number; statusDesc?: string; payload?: Record<string, unknown> }>): never {
  throw parseApiError(error);
}

/**
 * Development-only logging interceptor for requests.
 */
export function loggingRequestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Request] POST ${config.url}`, config.data);
  }
  return config;
}

/**
 * Development-only logging interceptor for responses.
 */
export function loggingResponseInterceptor(response: AxiosResponse): AxiosResponse {
  if (process.env.NODE_ENV === 'development') {
    const { statusCode, statusDesc } = response.data || {};
    console.log(`[API Response] ${response.config.url} → statusCode: ${statusCode}, statusDesc: ${statusDesc}`);
  }
  return response;
}
