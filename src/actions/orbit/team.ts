'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { requireAuth } from '@/libs/supabase/auth';

import type { TeamMemberWithProfile, TeamMember } from '@/types/orbit';

export const getTeamMembers = async () => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized', data: null };

  const resp = await supabase
    .from('team_members')
    .select('*, profile:profiles!team_members_user_id_fkey(id,full_name,email,avatar_url)');

  if (resp.error) return { error: resp.error.message, data: null };
  return { data: resp.data as TeamMemberWithProfile[], error: null };
};

export const inviteTeamMember = async (data: unknown) => {
  const { supabase, user, error } = await requireAuth();
  if (error || !user) return { error: 'Unauthorized' };

  const schema = z.object({
    user_id: z.string().uuid(),
    role: z.enum(['admin', 'sales', 'manager']),
  });
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const resp = await supabase
    .from('team_members')
    .insert(parsed.data)
    .select('*, profile:profiles!team_members_user_id_fkey(id,full_name,email)')
    .single();

  if (resp.error) return { error: resp.error.message };
  revalidatePath('/team');
  return { data: resp.data as TeamMemberWithProfile };
};

export const updateTeamMemberRole = async (id: string, role: 'admin' | 'sales' | 'manager') => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized' };

  const resp = await supabase.from('team_members').update({ role }).eq('id', id).select().single();

  if (resp.error) return { error: resp.error.message };
  revalidatePath('/team');
  return { data: resp.data as TeamMember };
};

export const removeTeamMember = async (id: string) => {
  const { supabase, error } = await requireAuth();
  if (error) return { error: 'Unauthorized' };

  const resp = await supabase.from('team_members').delete().eq('id', id);
  if (resp.error) return { error: resp.error.message };

  revalidatePath('/team');
  return { data: true };
};
