/**
 * Base Axios HTTP Client
 *
 * Provides a pre-configured axios instance with:
 * - Base URL from environment variables
 * - JSON content-type headers
 * - Request/response interceptors for auth and error handling
 *
 * Usage:
 *   import { apiClient } from '@/libs/axios';
 *   const data = await apiClient.get('/users');
 */

import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import { env } from '@/libs/env';

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30_000,
});

// ─── Request interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // CUSTOMIZE: Attach auth token from storage / state here
    // const token = getAuthToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response interceptor ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // CUSTOMIZE: Handle unauthenticated — redirect to login, clear session, etc.
    }
    if (error.response?.status === 403) {
      // CUSTOMIZE: Handle forbidden access
    }
    return Promise.reject(error);
  }
);
