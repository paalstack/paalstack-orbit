'use client';
import { toast } from '@paalstack/react-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getLeads, getLead, createLead, updateLead, deleteLead } from '@/actions/orbit/leads';

export const LEADS_KEY = ['orbit', 'leads'] as const;
export const LEAD_KEY = (id: string) => ['orbit', 'lead', id] as const;

const toErrMsg = (err: unknown) => (typeof err === 'string' ? err : 'An error occurred');

export const useLeads = (filters?: { status?: string; sort?: 'created_at' | 'value' }) =>
  useQuery({
    queryKey: [...LEADS_KEY, filters],
    queryFn: () => getLeads(filters),
  });

export const useLead = (id: string) =>
  useQuery({
    queryKey: LEAD_KEY(id),
    queryFn: () => getLead(id),
    enabled: !!id,
  });

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLead,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(toErrMsg(result.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: LEADS_KEY });
      toast.success('Lead created');
    },
    onError: () => toast.error('Failed to create lead'),
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateLead,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(toErrMsg(result.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: LEADS_KEY });
      toast.success('Lead updated');
    },
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: LEADS_KEY });
      toast.success('Lead deleted');
    },
  });
};
