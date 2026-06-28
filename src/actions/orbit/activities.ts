'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { requireAuth } from '@/libs/supabase/auth';

import type { Activity } from '@/types/orbit';

const createActivitySchema = z.object({
  lead_id: z.string().uuid(),
  type: z.enum(['note', 'call', 'meeting', 'task']),
  note: z.string().min(1),
});

export const createActivity = async (data: unknown) => {
  const { supabase, user, error } = await requireAuth();
  if (error || !user) return { error: 'Unauthorized' };

  const parsed = createActivitySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const resp = await supabase
    .from('activities')
    .insert({ ...parsed.data, created_by: user.id })
    .select('*, creator:profiles!activities_created_by_fkey(id,full_name,email)')
    .single();

  if (resp.error) return { error: resp.error.message };
  const activity = resp.data as Activity;
  revalidatePath(`/orbit/leads/${parsed.data.lead_id}`);
  return { data: activity };
};

export const getActivitiesByLead = async (leadId: string) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized', data: null };

  const resp = await supabase
    .from('activities')
    .select('*, creator:profiles!activities_created_by_fkey(id,full_name,email)')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (resp.error) return { error: resp.error.message, data: null };
  return { data: resp.data as Activity[], error: null };
};
