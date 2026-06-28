'use client';
import { toast } from '@paalstack/react-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
} from '@/actions/orbit/email';

export const EMAIL_TEMPLATES_KEY = ['orbit', 'email-templates'] as const;

const toErrMsg = (err: unknown) => (typeof err === 'string' ? err : 'An error occurred');

export const useEmailTemplates = () =>
  useQuery({
    queryKey: EMAIL_TEMPLATES_KEY,
    queryFn: getEmailTemplates,
  });

export const useCreateEmailTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createEmailTemplate,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(toErrMsg(result.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: EMAIL_TEMPLATES_KEY });
      toast.success('Template created');
    },
  });
};

export const useUpdateEmailTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateEmailTemplate,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(toErrMsg(result.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: EMAIL_TEMPLATES_KEY });
      toast.success('Template updated');
    },
  });
};

export const useDeleteEmailTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteEmailTemplate,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: EMAIL_TEMPLATES_KEY });
      toast.success('Template deleted');
    },
  });
};
