/**
 * Example API types.
 * Replace with your actual API data shapes.
 */

export type ExampleItem = {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

export type GetExampleItemsResponse = {
  items: ExampleItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateExampleItemRequest = {
  title: string;
  description: string;
};

export type CreateExampleItemResponse = ExampleItem;
