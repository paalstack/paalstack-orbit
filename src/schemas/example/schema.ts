/**
 * Example Zod validation schemas.
 *
 * Demonstrates the schema pattern used throughout this starter.
 * Schemas are used with react-hook-form via @hookform/resolvers/zod.
 *
 * Usage:
 *   import { createExampleSchema, type CreateExampleFormValues } from '@/schemas/example';
 *   const form = useForm<CreateExampleFormValues>({ resolver: zodResolver(createExampleSchema) });
 */

import { z } from 'zod';

export const createExampleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
});

export type CreateExampleFormValues = z.infer<typeof createExampleSchema>;
