import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/libs/env', () => ({
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://api.example.com',
    NEXT_PUBLIC_APP_NAME: 'PaalStack',
    NEXT_PUBLIC_DEBUG_MODE: false,
  },
}));

import { apiClient } from './client';

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('apiClient', () => {
  describe('configuration', () => {
    it('is an axios instance', () => {
      expect(axios.isAxiosError).toBeDefined();
      expect(typeof apiClient.get).toBe('function');
      expect(typeof apiClient.post).toBe('function');
      expect(typeof apiClient.put).toBe('function');
      expect(typeof apiClient.delete).toBe('function');
    });

    it('has the correct base URL', () => {
      expect(apiClient.defaults.baseURL).toBe('https://api.example.com');
    });

    it('sets Content-Type to application/json', () => {
      const headers = apiClient.defaults.headers as Record<string, Record<string, string>>;
      expect(headers['Content-Type'] ?? headers.common?.['Content-Type']).toBe('application/json');
    });

    it('sets Accept to application/json', () => {
      const headers = apiClient.defaults.headers as Record<string, Record<string, string>>;
      expect(headers['Accept'] ?? headers.common?.['Accept']).toBe('application/json');
    });

    it('has a timeout of 30 000 ms', () => {
      expect(apiClient.defaults.timeout).toBe(30_000);
    });
  });

  describe('interceptors', () => {
    it('has at least one request interceptor registered', () => {
      const handlers = (apiClient.interceptors.request as unknown as { handlers: unknown[] })
        .handlers;
      expect(handlers.length).toBeGreaterThanOrEqual(1);
    });

    it('has at least one response interceptor registered', () => {
      const handlers = (apiClient.interceptors.response as unknown as { handlers: unknown[] })
        .handlers;
      expect(handlers.length).toBeGreaterThanOrEqual(1);
    });
  });
});

// ─── Types for accessing interceptor internals ───────────────────────────────

type RawInterceptorHandler = {
  fulfilled: (value: unknown) => unknown;
  rejected: (error: unknown) => Promise<never>;
};

type InterceptorManagerInternal = {
  handlers: RawInterceptorHandler[];
};

const getRequestHandler = (): RawInterceptorHandler => {
  const mgr = apiClient.interceptors.request as unknown as InterceptorManagerInternal;
  const handler = mgr.handlers[0];
  if (!handler) throw new Error('No request interceptor handler registered');
  return handler;
};

const getResponseHandler = (): RawInterceptorHandler => {
  const mgr = apiClient.interceptors.response as unknown as InterceptorManagerInternal;
  const handler = mgr.handlers[0];
  if (!handler) throw new Error('No response interceptor handler registered');
  return handler;
};

// ─── Request interceptor ─────────────────────────────────────────────────────

describe('apiClient – request interceptor (direct)', () => {
  it('success handler returns the config unchanged', () => {
    const handler = getRequestHandler();
    const mockConfig = { headers: {}, url: '/test', method: 'get' };
    const result = handler.fulfilled(mockConfig);
    expect(result).toBe(mockConfig);
  });

  it('error handler rejects with the original error', async () => {
    const handler = getRequestHandler();
    const error = new Error('network failure');
    await expect(handler.rejected(error)).rejects.toThrow('network failure');
  });
});

// ─── Response interceptor ────────────────────────────────────────────────────

describe('apiClient – response interceptor (direct)', () => {
  it('success handler passes the response through', () => {
    const handler = getResponseHandler();
    const mockResponse = { data: { ok: true }, status: 200 };
    const result = handler.fulfilled(mockResponse);
    expect(result).toBe(mockResponse);
  });

  it('error handler rejects with the error for generic errors', async () => {
    const handler = getResponseHandler();
    const error = { response: { status: 404 }, message: 'Not Found' };
    await expect(handler.rejected(error)).rejects.toEqual(error);
  });

  it('error handler still rejects on 401 (after auth hook placeholder)', async () => {
    const handler = getResponseHandler();
    const error = { response: { status: 401 }, message: 'Unauthorized' };
    await expect(handler.rejected(error)).rejects.toEqual(error);
  });

  it('error handler still rejects on 403 (after forbidden hook placeholder)', async () => {
    const handler = getResponseHandler();
    const error = { response: { status: 403 }, message: 'Forbidden' };
    await expect(handler.rejected(error)).rejects.toEqual(error);
  });

  it('error handler handles errors without a response object', async () => {
    const handler = getResponseHandler();
    const error = { message: 'Network Error' };
    await expect(handler.rejected(error)).rejects.toEqual(error);
  });
});
