/**
 * useExampleQuery — TanStack Query hook for fetching example items.
 *
 * Pattern used across this starter:
 * - hook.ts  → the hook implementation
 * - index.ts → barrel export
 *
 * Replace with your actual query hooks.
 */

import { useQuery } from '@tanstack/react-query';

import { getExampleItems } from '@/apis/example';

export const EXAMPLE_QUERY_KEY = ['example', 'items'] as const;

export const useExampleQuery = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: [...EXAMPLE_QUERY_KEY, { page, pageSize }],
    queryFn: () => getExampleItems(page, pageSize),
  });
};
