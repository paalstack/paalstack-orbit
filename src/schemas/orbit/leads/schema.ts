import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name required'),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const),
  assigned_to: z.string().uuid().optional().nullable(),
  value: z.number().min(0).optional().nullable(),
});

export const updateLeadSchema = createLeadSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
