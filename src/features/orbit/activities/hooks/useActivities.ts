'use client';
import { toast } from '@paalstack/react-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createActivity, getActivitiesByLead } from '@/actions/orbit/activities';

export const ACTIVITIES_KEY = (leadId: string) => ['orbit', 'activities', leadId] as const;

const toErrMsg = (err: unknown) => (typeof err === 'string' ? err : 'An error occurred');

export const useActivities = (leadId: string) =>
  useQuery({
    queryKey: ACTIVITIES_KEY(leadId),
    queryFn: () => getActivitiesByLead(leadId),
    enabled: !!leadId,
  });

export const useCreateActivity = (leadId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createActivity,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(toErrMsg(result.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: ACTIVITIES_KEY(leadId) });
      toast.success('Activity logged');
    },
    onError: () => toast.error('Failed to log activity'),
  });
};
