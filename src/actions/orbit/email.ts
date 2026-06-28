'use server';
import { revalidatePath } from 'next/cache';

import { getEmailProvider, renderTemplate } from '@/features/orbit/email';
import { requireAuth } from '@/libs/supabase/auth';
import {
  createEmailTemplateSchema,
  updateEmailTemplateSchema,
  sendTemplatedEmailSchema,
} from '@/schemas/orbit/email/schema';

import type { EmailTemplate } from '@/types/orbit';

export const getEmailTemplates = async () => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized', data: null };

  const resp = await supabase
    .from('email_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (resp.error) return { error: resp.error.message, data: null };
  return { data: resp.data as EmailTemplate[], error: null };
};

export const getEmailTemplate = async (id: string) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized', data: null };

  const resp = await supabase.from('email_templates').select('*').eq('id', id).single();

  if (resp.error) return { error: resp.error.message, data: null };
  return { data: resp.data as EmailTemplate, error: null };
};

export const createEmailTemplate = async (input: unknown) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized' };

  const parsed = createEmailTemplateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const resp = await supabase.from('email_templates').insert(parsed.data).select().single();

  if (resp.error) return { error: resp.error.message };
  revalidatePath('/email-templates');
  return { data: resp.data as EmailTemplate };
};

export const updateEmailTemplate = async (input: unknown) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized' };

  const parsed = updateEmailTemplateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { id, ...updates } = parsed.data;

  const resp = await supabase
    .from('email_templates')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (resp.error) return { error: resp.error.message };
  revalidatePath('/email-templates');
  revalidatePath(`/email-templates/${id}`);
  return { data: resp.data as EmailTemplate };
};

export const deleteEmailTemplate = async (id: string) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized' };

  const resp = await supabase.from('email_templates').delete().eq('id', id);
  if (resp.error) return { error: resp.error.message };

  revalidatePath('/email-templates');
  return { data: true };
};

export const sendTemplatedEmail = async (input: unknown) => {
  const { supabase, user, error } = await requireAuth();
  if (error || !user) return { error: 'Unauthorized' };

  const parsed = sendTemplatedEmailSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { lead_id, template_id, recipient, variables } = parsed.data;

  const tplResp = await supabase.from('email_templates').select('*').eq('id', template_id).single();

  if (tplResp.error || !tplResp.data) return { error: 'Template not found' };

  const template = tplResp.data as EmailTemplate;
  const subject = renderTemplate(template.subject, variables);
  const html = renderTemplate(template.body, variables);

  const logResp = await supabase
    .from('email_log')
    .insert({ lead_id, template_id, recipient, status: 'queued', provider: 'resend' })
    .select()
    .single();

  if (logResp.error || !logResp.data) return { error: 'Failed to create email log' };

  const logEntry = logResp.data as { id: string };
  const provider = getEmailProvider();
  const result = await provider.send({ to: recipient, subject, html });

  await supabase
    .from('email_log')
    .update({
      status: result.success ? 'sent' : 'failed',
      sent_at: result.success ? new Date().toISOString() : null,
    })
    .eq('id', logEntry.id);

  if (!result.success) return { error: result.error ?? 'Send failed' };
  return { data: { messageId: result.messageId } };
};
