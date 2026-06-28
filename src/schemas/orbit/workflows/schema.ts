import { z } from 'zod';

export const workflowConditionSchema = z.object({
  field: z.enum(['status', 'owner_id', 'assigned_to']),
  operator: z.enum(['eq', 'neq', 'in', 'not_in']),
  value: z.union([z.string(), z.array(z.string())]),
});

export const createWorkflowRuleSchema = z.object({
  name: z.string().min(1, 'Name required'),
  trigger_event: z.enum(['lead_status_changed']),
  condition: workflowConditionSchema,
  action: z.enum(['create_task', 'send_email']),
  action_payload: z.object({
    template_id: z.string().uuid().optional(),
    task_note: z.string().optional(),
  }),
  active: z.boolean().default(true),
});

export type CreateWorkflowRuleInput = z.infer<typeof createWorkflowRuleSchema>;
