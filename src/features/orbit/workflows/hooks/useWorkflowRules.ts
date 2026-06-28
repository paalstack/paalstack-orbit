'use client';
import { toast } from '@paalstack/react-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getWorkflowRules,
  createWorkflowRule,
  toggleWorkflowRule,
  deleteWorkflowRule,
} from '@/actions/orbit/workflows';

export const WORKFLOW_RULES_KEY = ['orbit', 'workflow-rules'] as const;

const toErrMsg = (err: unknown) => (typeof err === 'string' ? err : 'An error occurred');

export const useWorkflowRules = () =>
  useQuery({
    queryKey: WORKFLOW_RULES_KEY,
    queryFn: getWorkflowRules,
  });

export const useCreateWorkflowRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createWorkflowRule,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(toErrMsg(result.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: WORKFLOW_RULES_KEY });
      toast.success('Workflow rule created');
    },
    onError: () => toast.error('Failed to create workflow rule'),
  });
};

export const useToggleWorkflowRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => toggleWorkflowRule(id, active),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(toErrMsg(result.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: WORKFLOW_RULES_KEY });
    },
    onError: () => toast.error('Failed to update rule'),
  });
};

export const useDeleteWorkflowRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkflowRule,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: WORKFLOW_RULES_KEY });
      toast.success('Workflow rule deleted');
    },
    onError: () => toast.error('Failed to delete rule'),
  });
};
