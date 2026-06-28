'use server';
import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/libs/supabase/auth';
import { createWorkflowRuleSchema } from '@/schemas/orbit/workflows/schema';

import type { WorkflowRule } from '@/types/orbit';

export const getWorkflowRules = async () => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized', data: null };

  const resp = await supabase
    .from('workflow_rules')
    .select('*')
    .order('created_at', { ascending: false });

  if (resp.error) return { error: resp.error.message, data: null };
  return { data: resp.data as WorkflowRule[], error: null };
};

export const createWorkflowRule = async (input: unknown) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized' };

  const parsed = createWorkflowRuleSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const resp = await supabase.from('workflow_rules').insert(parsed.data).select().single();

  if (resp.error) return { error: resp.error.message };
  revalidatePath('/workflows');
  return { data: resp.data as WorkflowRule };
};

export const toggleWorkflowRule = async (id: string, active: boolean) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized' };

  const resp = await supabase
    .from('workflow_rules')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (resp.error) return { error: resp.error.message };
  revalidatePath('/workflows');
  return { data: resp.data as WorkflowRule };
};

export const deleteWorkflowRule = async (id: string) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized' };

  const resp = await supabase.from('workflow_rules').delete().eq('id', id);
  if (resp.error) return { error: resp.error.message };

  revalidatePath('/workflows');
  return { data: true };
};
