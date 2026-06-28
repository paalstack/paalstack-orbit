import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock the API module before importing the hook
const mockGetExampleItems = vi.hoisted(() => vi.fn());
vi.mock('@/apis/example', () => ({
  getExampleItems: mockGetExampleItems,
}));

import { EXAMPLE_QUERY_KEY, useExampleQuery } from './hook';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockResponse = {
  items: [
    {
      id: 1,
      title: 'Item 1',
      description: 'Desc 1',
      status: 'active' as const,
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      title: 'Item 2',
      description: 'Desc 2',
      status: 'inactive' as const,
      createdAt: '2024-01-02',
    },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useExampleQuery', () => {
  it('has the correct static query key', () => {
    expect(EXAMPLE_QUERY_KEY).toEqual(['example', 'items']);
  });

  it('returns data on a successful fetch', async () => {
    mockGetExampleItems.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useExampleQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });

  it('calls getExampleItems with default page=1 and pageSize=10', async () => {
    mockGetExampleItems.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useExampleQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetExampleItems).toHaveBeenCalledWith(1, 10);
  });

  it('calls getExampleItems with custom page and pageSize', async () => {
    mockGetExampleItems.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useExampleQuery(2, 5), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetExampleItems).toHaveBeenCalledWith(2, 5);
  });

  it('exposes isLoading=true before the response arrives', () => {
    mockGetExampleItems.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useExampleQuery(), { wrapper: createWrapper() });

    expect(result.current.isPending).toBe(true);
  });

  it('exposes isError=true when the fetch fails', async () => {
    mockGetExampleItems.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useExampleQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
