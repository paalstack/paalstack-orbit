'use client';
import { toast } from '@paalstack/react-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getTeamMembers,
  inviteTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
} from '@/actions/orbit/team';

import type { TeamRole } from '@/types/orbit';

export const TEAM_KEY = ['orbit', 'team'] as const;

const toErrMsg = (err: unknown) => (typeof err === 'string' ? err : 'An error occurred');

export const useTeamMembers = () =>
  useQuery({
    queryKey: TEAM_KEY,
    queryFn: getTeamMembers,
  });

export const useInviteTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: inviteTeamMember,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(toErrMsg(result.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: TEAM_KEY });
      toast.success('Team member added');
    },
  });
};

export const useUpdateTeamMemberRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: TeamRole }) => updateTeamMemberRole(id, role),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(toErrMsg(result.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: TEAM_KEY });
      toast.success('Role updated');
    },
  });
};

export const useRemoveTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeTeamMember(id),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(toErrMsg(result.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: TEAM_KEY });
      toast.success('Member removed');
    },
  });
};
