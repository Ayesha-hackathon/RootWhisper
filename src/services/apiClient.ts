/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HTTP API Client for Google Antigravity Backend
 * ----------------------------------------------------------------------------
 * Lightweight, dependency-free wrapper around the native browser fetch API.
 * Handles base URL resolution, JSON parsing, timeout aborts, and normalized error responses.
 */

import { APP_CONFIG } from '../config/appConfig';

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean>;
}

export class ApiError extends Error {
  public status: number;
  public data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 12000, params, headers, ...customConfig } = options;

  // Build full URL
  let fullUrl = endpoint.startsWith('http')
    ? endpoint
    : `${APP_CONFIG.apiUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  // Setup abort controller for timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Application': 'RootWhisper-Frontend',
    'X-Client-Version': '2.4.1',
  };

  try {
    const response = await fetch(fullUrl, {
      ...customConfig,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw new ApiError(
        errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Parse JSON
    return (await response.json()) as T;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new ApiError(`Request timeout after ${timeoutMs}ms: ${endpoint}`, 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network request failed', 0, error);
  }
}

export const http = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
