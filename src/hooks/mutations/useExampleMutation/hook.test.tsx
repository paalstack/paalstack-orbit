import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type * as TanStackQuery from '@tanstack/react-query';

// Mock API and query key before importing the hook
const mockCreateExampleItem = vi.hoisted(() => vi.fn());
vi.mock('@/apis/example', () => ({
  createExampleItem: mockCreateExampleItem,
}));

const mockInvalidateQueries = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof TanStackQuery>();
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: mockInvalidateQueries,
    }),
  };
});

import { useCreateExampleMutation } from './hook';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

// ─── Fixtures ────────────────────────────────────────────────────────────────

const newItem = { title: 'New Item', description: 'New description' };
const createdItem = {
  id: 3,
  title: 'New Item',
  description: 'New description',
  status: 'active' as const,
  createdAt: '2024-01-03',
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useCreateExampleMutation', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useCreateExampleMutation(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('calls createExampleItem with the provided payload', async () => {
    mockCreateExampleItem.mockResolvedValue(createdItem);

    const { result } = renderHook(() => useCreateExampleMutation(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate(newItem);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockCreateExampleItem).toHaveBeenCalledWith(newItem, expect.anything());
  });

  it('exposes the created item as data on success', async () => {
    mockCreateExampleItem.mockResolvedValue(createdItem);

    const { result } = renderHook(() => useCreateExampleMutation(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate(newItem);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(createdItem);
  });

  it('invalidates the example query on success', async () => {
    mockCreateExampleItem.mockResolvedValue(createdItem);

    const { result } = renderHook(() => useCreateExampleMutation(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate(newItem);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockInvalidateQueries).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['example', 'items'] })
    );
  });

  it('sets isError=true when the mutation fails', async () => {
    mockCreateExampleItem.mockRejectedValue(new Error('Create failed'));

    const { result } = renderHook(() => useCreateExampleMutation(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate(newItem);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
