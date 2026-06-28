/**
 * useExampleMutation — TanStack Query mutation hook for creating an example item.
 *
 * Pattern used across this starter:
 * - hook.ts  → the mutation implementation
 * - index.ts → barrel export
 *
 * Replace with your actual mutation hooks.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createExampleItem } from '@/apis/example';
import { EXAMPLE_QUERY_KEY } from '@/hooks/queries/useExampleQuery';

export const useCreateExampleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExampleItem,
    onSuccess: async () => {
      // Invalidate the example list so it re-fetches after creation
      await queryClient.invalidateQueries({ queryKey: EXAMPLE_QUERY_KEY });
    },
  });
};
