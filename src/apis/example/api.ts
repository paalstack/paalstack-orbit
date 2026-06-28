/**
 * Example API module.
 *
 * Demonstrates the API layer pattern used throughout this starter.
 * Replace with your actual endpoints and response types.
 *
 * Pattern:
 * - Each function maps to one HTTP endpoint
 * - Return the `.data` from the axios response to unwrap the payload
 * - Types live in ./type.ts
 */

import { apiClient } from '@/libs/axios';

import {
  type CreateExampleItemRequest,
  type CreateExampleItemResponse,
  type GetExampleItemsResponse,
} from './type';

export const getExampleItems = async (
  page = 1,
  pageSize = 10
): Promise<GetExampleItemsResponse> => {
  const response = await apiClient.get<GetExampleItemsResponse>('/example', {
    params: { page, pageSize },
  });
  return response.data;
};

export const createExampleItem = async (
  payload: CreateExampleItemRequest
): Promise<CreateExampleItemResponse> => {
  const response = await apiClient.post<CreateExampleItemResponse>('/example', payload);
  return response.data;
};

export const deleteExampleItem = async (id: number): Promise<void> => {
  await apiClient.delete(`/example/${id}`);
};
