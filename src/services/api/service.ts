/**
 * Generic API service — demonstrates the service pattern for business logic
 * that sits above the raw API layer (src/apis/).
 *
 * Services orchestrate one or more API calls, apply transformations, and
 * handle domain-specific error handling before returning data to hooks/components.
 *
 * Usage:
 *   import { exampleService } from '@/services/api';
 *   const items = await exampleService.fetchItems();
 */

import { logger } from '@paalstack/react-ui/lib';

import { getExampleItems } from '@/apis/example';
import { type ExampleItem } from '@/apis/example/type';

type FetchItemsOptions = {
  page?: number;
  pageSize?: number;
  /** Filter to only active items */
  onlyActive?: boolean;
};

const fetchItems = async ({
  page = 1,
  pageSize = 10,
  onlyActive = false,
}: FetchItemsOptions = {}): Promise<ExampleItem[]> => {
  try {
    const response = await getExampleItems(page, pageSize);
    const items = response.items;
    return onlyActive ? items.filter((item) => item.status === 'active') : items;
  } catch (error) {
    logger.error('Failed to fetch example items', { error });
    throw error;
  }
};

export const exampleService = { fetchItems };
