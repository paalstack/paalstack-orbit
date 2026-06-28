'use server';
import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/libs/supabase/auth';
import { createLeadSchema, updateLeadSchema } from '@/schemas/orbit/leads/schema';

import type { Lead, WorkflowRule, LeadWithAssignee } from '@/types/orbit';

export const createLead = async (data: unknown) => {
  const { supabase, user, error } = await requireAuth();
  if (error || !user) return { error: 'Unauthorized' };

  const parsed = createLeadSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const resp = await supabase
    .from('leads')
    .insert({ ...parsed.data, owner_id: user.id })
    .select()
    .single();

  if (resp.error) return { error: resp.error.message };
  revalidatePath('/leads');
  return { data: resp.data as Lead };
};

export const updateLead = async (data: unknown) => {
  const { supabase, user, error } = await requireAuth();
  if (error || !user) return { error: 'Unauthorized' };

  const parsed = updateLeadSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { id, ...updates } = parsed.data;

  const currentResp = await supabase.from('leads').select('status').eq('id', id).single();
  const currentLead = currentResp.data;

  const resp = await supabase
    .from('leads')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (resp.error) return { error: resp.error.message };
  const lead = resp.data as Lead;

  if (currentLead && updates.status && currentLead.status !== updates.status) {
    await supabase.from('activities').insert({
      lead_id: id,
      type: 'status_change',
      note: `Status changed from ${currentLead.status} to ${updates.status}`,
      created_by: user.id,
    });

    // Evaluate and execute workflow rules
    const rulesResp = await supabase
      .from('workflow_rules')
      .select('*')
      .eq('trigger_event', 'lead_status_changed')
      .eq('active', true);

    const rules = rulesResp.data as WorkflowRule[] | null;
    if (rules && rules.length > 0) {
      const { executeWorkflowRules } = await import('@/features/orbit/workflows/executor');
      await executeWorkflowRules(rules, lead, { supabase, userId: user.id });
    }
  }

  revalidatePath(`/leads/${id}`);
  revalidatePath('/leads');
  return { data: lead };
};

export const deleteLead = async (id: string) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized' };

  const resp = await supabase.from('leads').delete().eq('id', id);
  if (resp.error) return { error: resp.error.message };

  revalidatePath('/leads');
  return { data: true };
};

export const getLead = async (id: string) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized', data: null };

  const resp = await supabase
    .from('leads')
    .select(
      '*, owner:profiles!leads_owner_id_fkey(id,full_name,email), assignee:profiles!leads_assigned_to_fkey(id,full_name,email)'
    )
    .eq('id', id)
    .single();

  if (resp.error) return { error: resp.error.message, data: null };
  return { data: resp.data as LeadWithAssignee, error: null };
};

export const getLeads = async (filters?: { status?: string; sort?: 'created_at' | 'value' }) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized', data: null };

  let query = supabase
    .from('leads')
    .select('*, assignee:profiles!leads_assigned_to_fkey(id,full_name,email)');

  if (filters?.status) query = query.eq('status', filters.status);
  query = query.order(filters?.sort ?? 'created_at', { ascending: false });

  const resp = await query;
  if (resp.error) return { error: resp.error.message, data: null };
  return { data: resp.data as Lead[], error: null };
};
