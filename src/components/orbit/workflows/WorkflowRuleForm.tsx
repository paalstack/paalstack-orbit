'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  VStack,
  HStack,
  Button,
  FormRoot,
  FormFieldItem,
  TypographyH2,
  TypographyMuted,
} from '@paalstack/react-ui';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { useEmailTemplates } from '@/features/orbit/email/hooks/useEmailTemplates';
import { useCreateWorkflowRule } from '@/features/orbit/workflows/hooks/useWorkflowRules';

import type React from 'react';

const formSchema = z.object({
  name: z.string().min(1, 'Name required'),
  trigger_event: z.enum(['lead_status_changed']),
  condition: z.object({
    field: z.enum(['status', 'owner_id', 'assigned_to']),
    operator: z.enum(['eq', 'neq', 'in', 'not_in']),
    value: z.string().min(1, 'Value required'),
  }),
  action: z.enum(['create_task', 'send_email']),
  action_payload: z.object({
    task_note: z.string().optional(),
    template_id: z.string().optional(),
  }),
  active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export const WorkflowRuleForm = () => {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateWorkflowRule();
  const { data: templatesResult } = useEmailTemplates();
  const templates = templatesResult?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      trigger_event: 'lead_status_changed',
      condition: { field: 'status', operator: 'eq', value: '' },
      action: 'create_task',
      action_payload: { task_note: '', template_id: '' },
      active: true,
    },
  });

  const selectedAction = useWatch({ control: form.control, name: 'action' });
  const selectedOperator = useWatch({ control: form.control, name: 'condition.operator' });

  const handleSubmit = (values: FormValues) => {
    const conditionValue =
      values.condition.operator === 'in' || values.condition.operator === 'not_in'
        ? values.condition.value
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : values.condition.value;

    const payload = {
      name: values.name,
      trigger_event: values.trigger_event,
      condition: { ...values.condition, value: conditionValue },
      action: values.action,
      action_payload:
        values.action === 'send_email'
          ? { template_id: values.action_payload.template_id ?? undefined }
          : { task_note: values.action_payload.task_note ?? undefined },
      active: values.active,
    };

    create(payload, {
      onSuccess: (result) => {
        if (!result.error) router.push('/workflows');
      },
    });
  };

  const templateOptions = templates.map((t) => ({ label: t.name, value: t.id }));

  return (
    <VStack className="gap-6">
      <Box>
        <TypographyH2 className="text-foreground">New Workflow Rule</TypographyH2>
        <TypographyMuted>Automate actions when lead conditions are met</TypographyMuted>
      </Box>

      <FormRoot {...form}>
        <Box
          as="form"
          onSubmit={(e: React.FormEvent) => {
            void form.handleSubmit(handleSubmit)(e);
          }}
          className="space-y-4"
        >
          <FormFieldItem
            control={form.control}
            field={{ type: 'input', name: 'name', label: 'Rule Name', required: true }}
          />

          <FormFieldItem
            control={form.control}
            field={{
              type: 'select',
              name: 'trigger_event',
              label: 'Trigger Event',
              options: [{ label: 'Lead Status Changed', value: 'lead_status_changed' }],
              required: true,
            }}
          />

          <Box className="border-border bg-card rounded-lg border p-4">
            <TypographyMuted className="mb-3 text-xs tracking-wider uppercase">
              Condition
            </TypographyMuted>
            <Box className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <FormFieldItem
                control={form.control}
                field={{
                  type: 'select',
                  name: 'condition.field',
                  label: 'Field',
                  options: [
                    { label: 'Status', value: 'status' },
                    { label: 'Owner ID', value: 'owner_id' },
                    { label: 'Assigned To', value: 'assigned_to' },
                  ],
                  required: true,
                }}
              />
              <FormFieldItem
                control={form.control}
                field={{
                  type: 'select',
                  name: 'condition.operator',
                  label: 'Operator',
                  options: [
                    { label: 'Equals', value: 'eq' },
                    { label: 'Not Equals', value: 'neq' },
                    { label: 'In', value: 'in' },
                    { label: 'Not In', value: 'not_in' },
                  ],
                  required: true,
                }}
              />
              <FormFieldItem
                control={form.control}
                field={{
                  type: 'input',
                  name: 'condition.value',
                  label:
                    selectedOperator === 'in' || selectedOperator === 'not_in'
                      ? 'Value (comma-separated)'
                      : 'Value',
                  required: true,
                }}
              />
            </Box>
          </Box>

          <FormFieldItem
            control={form.control}
            field={{
              type: 'select',
              name: 'action',
              label: 'Action',
              options: [
                { label: 'Create Task', value: 'create_task' },
                { label: 'Send Email', value: 'send_email' },
              ],
              required: true,
            }}
          />

          {selectedAction === 'create_task' && (
            <FormFieldItem
              control={form.control}
              field={{
                type: 'textarea',
                name: 'action_payload.task_note',
                label: 'Task Note',
              }}
            />
          )}

          {selectedAction === 'send_email' && (
            <FormFieldItem
              control={form.control}
              field={{
                type: 'select',
                name: 'action_payload.template_id',
                label: 'Email Template',
                options:
                  templateOptions.length > 0
                    ? templateOptions
                    : [{ label: 'No templates available', value: '' }],
                required: true,
              }}
            />
          )}

          <FormFieldItem
            control={form.control}
            field={{ type: 'checkbox', name: 'active', label: 'Active' }}
          />

          <HStack className="justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.push('/workflows')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              Create Rule
            </Button>
          </HStack>
        </Box>
      </FormRoot>
    </VStack>
  );
};
