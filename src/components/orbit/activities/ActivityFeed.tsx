'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  LuFileText,
  LuPhone,
  LuCalendar,
  LuArrowRight,
  LuMail,
  LuSquareCheck,
  LuPlus,
} from '@paalstack/react-icons/lu';
import {
  Box,
  VStack,
  HStack,
  Card,
  Button,
  Select,
  toast,
  TypographyH3,
  TypographyMuted,
  TypographySmall,
  TypographyP,
} from '@paalstack/react-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createActivity, getActivitiesByLead } from '@/actions/orbit/activities';

import type { ActivityType } from '@/types/orbit';
import type React from 'react';
import type { ComponentType } from 'react';

const ACTIVITY_ICONS: Record<ActivityType, ComponentType<{ className?: string }>> = {
  note: LuFileText,
  call: LuPhone,
  meeting: LuCalendar,
  status_change: LuArrowRight,
  email_sent: LuMail,
  task: LuSquareCheck,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  note: 'text-blue-400',
  call: 'text-green-400',
  meeting: 'text-purple-400',
  status_change: 'text-amber-400',
  email_sent: 'text-cyan-400',
  task: 'text-emerald-400',
};

const addActivitySchema = z.object({
  type: z.enum(['note', 'call', 'meeting', 'task']),
  note: z.string().min(1, 'Note is required'),
});

type AddActivityInput = z.infer<typeof addActivitySchema>;

const TYPE_OPTIONS = [
  { label: 'Note', value: 'note' },
  { label: 'Call', value: 'call' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'Task', value: 'task' },
];

type ActivityFeedProps = {
  leadId: string;
};

export const ActivityFeed = ({ leadId }: ActivityFeedProps) => {
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: result, isLoading } = useQuery({
    queryKey: ['orbit', 'activities', leadId],
    queryFn: () => getActivitiesByLead(leadId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createActivity,
    onSuccess: (res) => {
      if (res.error) {
        toast.error(typeof res.error === 'string' ? res.error : 'An error occurred');
        return;
      }
      void qc.invalidateQueries({ queryKey: ['orbit', 'activities', leadId] });
      toast.success('Activity logged');
      setShowForm(false);
      form.reset({ type: 'note', note: '' });
    },
    onError: () => toast.error('Failed to log activity'),
  });

  const form = useForm<AddActivityInput>({
    resolver: zodResolver(addActivitySchema),
    defaultValues: { type: 'note', note: '' },
  });

  const handleSubmit = (data: AddActivityInput) => {
    mutate({ ...data, lead_id: leadId });
  };

  const activities = result?.data ?? [];

  return (
    <VStack className="gap-4">
      <HStack className="items-center justify-between">
        <TypographyH3 className="text-foreground">Activity</TypographyH3>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => setShowForm((v) => !v)}
        >
          <LuPlus className="mr-1 size-3" />
          Log Activity
        </Button>
      </HStack>

      {showForm && (
        <Card className="border-border bg-card" contentClassName="p-4">
          <Box
            as="form"
            onSubmit={(e: React.FormEvent) => {
              void form.handleSubmit(handleSubmit)(e);
            }}
          >
            <VStack className="gap-3">
              <Select
                options={TYPE_OPTIONS}
                value={form.watch('type')}
                onValueChange={(v) =>
                  form.setValue('type', v as 'note' | 'call' | 'meeting' | 'task')
                }
              />
              <Box
                as="textarea"
                {...form.register('note')}
                rows={3}
                placeholder="Add a note..."
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
              {form.formState.errors.note && (
                <TypographySmall className="text-destructive">
                  {form.formState.errors.note.message}
                </TypographySmall>
              )}
              <HStack className="justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPending ? 'Saving...' : 'Save'}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Card>
      )}

      {isLoading && (
        <TypographyMuted>Loading activities...</TypographyMuted>
      )}
      {!isLoading && activities.length === 0 && (
        <TypographyMuted>No activities yet.</TypographyMuted>
      )}
      {!isLoading && activities.length > 0 && (
        <VStack className="gap-0">
          {activities.map((activity, idx) => {
            const type = activity.type;
            const Icon = ACTIVITY_ICONS[type] ?? LuFileText;
            const colorClass = ACTIVITY_COLORS[type] ?? 'text-muted-foreground';
            const isLast = idx === activities.length - 1;

            const activityWithCreator = activity as {
              creator?: { full_name?: string | null; email?: string | null };
            };
            return (
              <HStack key={activity.id} className="items-start gap-3">
                <VStack className="items-center gap-0">
                  <Box
                    className={`mt-0.5 rounded-full border border-border bg-card p-1.5 ${colorClass}`}
                  >
                    <Icon className="size-3.5" />
                  </Box>
                  {!isLast && (
                    <Box className="w-px flex-1 bg-border" style={{ minHeight: '1.5rem' }} />
                  )}
                </VStack>
                <Box className="pb-4">
                  <TypographyP className="text-sm text-foreground">{activity.note}</TypographyP>
                  <TypographyMuted className="mt-0.5 text-xs">
                    {activityWithCreator.creator?.full_name ??
                      activityWithCreator.creator?.email ??
                      'Unknown'}
                    {' · '}
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </TypographyMuted>
                </Box>
              </HStack>
            );
          })}
        </VStack>
      )}
    </VStack>
  );
};
