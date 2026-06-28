import { describe, expect, it } from 'vitest';

import { createTestQueryClient, queryClient } from './lib';

describe('queryClient', () => {
  it('is a QueryClient instance with a getQueryCache method', () => {
    expect(queryClient).toBeDefined();
    expect(typeof queryClient.getQueryCache).toBe('function');
  });

  it('has retry disabled by default', () => {
    const options = queryClient.getDefaultOptions();
    expect(options.queries?.retry).toBe(false);
  });

  it('retryDelay follows exponential back-off capped at 30 s', () => {
    const options = queryClient.getDefaultOptions();
    const retryDelay = options.queries?.retryDelay;

    if (typeof retryDelay !== 'function') {
      throw new Error('retryDelay should be a function');
    }

    const error = new Error('test');
    expect(retryDelay(0, error)).toBe(1000); // 1000 * 2^0 = 1 000 ms
    expect(retryDelay(1, error)).toBe(2000); // 1000 * 2^1 = 2 000 ms
    expect(retryDelay(4, error)).toBe(16000); // 1000 * 2^4 = 16 000 ms
    expect(retryDelay(10, error)).toBe(30000); // capped at 30 000 ms
  });

  it('has mutations retry set to 0', () => {
    const options = queryClient.getDefaultOptions();
    expect(options.mutations?.retry).toBe(0);
  });
});

describe('createTestQueryClient', () => {
  it('returns a new QueryClient instance each call', () => {
    const client1 = createTestQueryClient();
    const client2 = createTestQueryClient();
    expect(client1).not.toBe(client2);
  });

  it('has retry disabled', () => {
    const client = createTestQueryClient();
    expect(client.getDefaultOptions().queries?.retry).toBe(false);
  });

  it('has gcTime set to Infinity to avoid cache eviction during tests', () => {
    const client = createTestQueryClient();
    expect(client.getDefaultOptions().queries?.gcTime).toBe(Infinity);
  });
});
