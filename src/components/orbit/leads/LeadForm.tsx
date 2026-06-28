'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, VStack, Card, TypographyH2 } from '@paalstack/react-ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { getTeamMembers } from '@/actions/orbit/team';
import { useCreateLead, useUpdateLead } from '@/features/orbit/leads/hooks/useLeads';
import { createLeadSchema } from '@/schemas/orbit/leads/schema';

import type { CreateLeadInput } from '@/schemas/orbit/leads/schema';
import type { Lead } from '@/types/orbit';

type LeadFormProps = {
  lead?: Lead;
};

const STATUS_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Proposal', value: 'proposal' },
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' },
];

export const LeadForm = ({ lead }: LeadFormProps) => {
  const router = useRouter();
  const [teamOptions, setTeamOptions] = useState<{ label: string; value: string }[]>([]);
  const { mutate: createLead, isPending: isCreating } = useCreateLead();
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();
  const isEditing = !!lead;

  const form = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: lead?.name ?? '',
      company: lead?.company ?? '',
      email: lead?.email ?? '',
      phone: lead?.phone ?? '',
      source: lead?.source ?? '',
      status: lead?.status ?? 'new',
      assigned_to: lead?.assigned_to ?? null,
      value: lead?.value ?? undefined,
    },
  });

  useEffect(() => {
    void getTeamMembers().then((res) => {
      if (res.data) {
        const members = res.data;
        setTeamOptions([
          { label: 'Unassigned', value: '' },
          ...members.map((m) => ({
            label: m.profile?.full_name ?? m.profile?.email ?? m.user_id,
            value: m.user_id,
          })),
        ]);
      }
    });
  }, []);

  const handleSubmit = (data: CreateLeadInput) => {
    const payload = {
      ...data,
      assigned_to: data.assigned_to ?? null,
      email: data.email ?? undefined,
    };

    if (isEditing) {
      updateLead(
        { ...payload, id: lead.id },
        {
          onSuccess: (result) => {
            if (!result.error) router.push(`/leads/${lead.id}`);
          },
        }
      );
    } else {
      createLead(payload, {
        onSuccess: (result) => {
          if (!result.error) router.push('/leads');
        },
      });
    }
  };

  return (
    <Card contentClassName="p-6">
      <VStack className="gap-6">
        <TypographyH2 className="text-lg font-semibold text-foreground">
          {isEditing ? 'Edit Lead' : 'New Lead'}
        </TypographyH2>

        <Form
          form={form}
          onSubmit={handleSubmit}
          fields={[
            {
              type: 'input',
              name: 'name',
              label: 'Name',
              required: true,
            },
            {
              type: 'input',
              name: 'company',
              label: 'Company',
            },
            {
              type: 'input',
              name: 'email',
              label: 'Email',
              inputType: 'email',
            },
            {
              type: 'input',
              name: 'phone',
              label: 'Phone',
              inputType: 'tel',
            },
            {
              type: 'input',
              name: 'source',
              label: 'Source',
            },
            {
              type: 'select',
              name: 'status',
              label: 'Status',
              required: true,
              options: STATUS_OPTIONS,
            },
            ...(teamOptions.length > 1
              ? [
                  {
                    type: 'select' as const,
                    name: 'assigned_to' as const,
                    label: 'Assigned To',
                    options: teamOptions,
                  },
                ]
              : []),
            {
              type: 'number',
              name: 'value',
              label: 'Value ($)',
            },
          ]}
          hideResetButton
          SubmitButton={({ isSubmitting, onFormSubmit }) => {
            const isBusy = isSubmitting || isCreating || isUpdating;
            const editLabel = isEditing ? 'Update Lead' : 'Create Lead';
            const label = isBusy ? 'Saving...' : editLabel;
            return (
              <button
                type="submit"
                onClick={onFormSubmit}
                disabled={isBusy}
                className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {label}
              </button>
            );
          }}
        />
      </VStack>
    </Card>
  );
};
