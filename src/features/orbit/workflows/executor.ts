'use server';
import { type createClient as createServerSupabaseClient } from '@/libs/supabase/server';

import { evaluateCondition } from './engine';

import type { WorkflowRule, Lead } from '@/types/orbit';

type SupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

export const executeWorkflowRules = async (
  rules: WorkflowRule[],
  lead: Lead,
  context: { supabase: SupabaseClient; userId: string }
): Promise<void> => {
  const evalContext: Record<string, string> = {
    status: lead.status,
    owner_id: lead.owner_id,
    assigned_to: lead.assigned_to ?? '',
  };

  for (const rule of rules) {
    if (!rule.active) continue;
    if (!evaluateCondition(rule.condition, evalContext)) continue;

    if (rule.action === 'create_task') {
      await context.supabase.from('activities').insert({
        lead_id: lead.id,
        type: 'task',
        note: rule.action_payload.task_note ?? `Automated task from rule: ${rule.name}`,
        created_by: context.userId,
      });
    }

    if (rule.action === 'send_email') {
      const { sendTemplatedEmail } = await import('@/actions/orbit/email');
      if (lead.email && rule.action_payload.template_id) {
        await sendTemplatedEmail({
          lead_id: lead.id,
          template_id: rule.action_payload.template_id,
          recipient: lead.email,
          variables: {
            lead_name: lead.name,
            company: lead.company ?? '',
            status: lead.status,
          },
        });
      }
    }
  }
};
