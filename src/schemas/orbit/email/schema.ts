import { z } from 'zod';

export const createEmailTemplateSchema = z.object({
  name: z.string().min(1, 'Name required'),
  subject: z.string().min(1, 'Subject required'),
  body: z.string().min(1, 'Body required'),
});

export const updateEmailTemplateSchema = createEmailTemplateSchema.partial().extend({
  id: z.string().uuid(),
});

export const sendTemplatedEmailSchema = z.object({
  lead_id: z.string().uuid(),
  template_id: z.string().uuid(),
  recipient: z.string().email(),
  variables: z.record(z.string(), z.string()).default({}),
});

export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateSchema>;
export type SendTemplatedEmailInput = z.infer<typeof sendTemplatedEmailSchema>;
