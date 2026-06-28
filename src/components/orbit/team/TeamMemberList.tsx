'use client';

import { LuTrash2 } from '@paalstack/react-icons/lu';
import {
  Box,
  VStack,
  HStack,
  Card,
  Button,
  Select,
  toast,
  TypographyMuted,
  TypographySmall,
  TypographyP,
} from '@paalstack/react-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getTeamMembers, updateTeamMemberRole, removeTeamMember } from '@/actions/orbit/team';

import { RoleBadge } from './RoleBadge';

import type { TeamRole, TeamMemberWithProfile } from '@/types/orbit';

const ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Sales', value: 'sales' },
];

const TEAM_KEY = ['orbit', 'team'] as const;

const toErrMsg = (err: unknown) => (typeof err === 'string' ? err : 'An error occurred');

export const TeamMemberList = () => {
  const qc = useQueryClient();

  const { data: result, isLoading } = useQuery({
    queryKey: TEAM_KEY,
    queryFn: getTeamMembers,
  });

  const { mutate: updateRole } = useMutation({
    mutationFn: ({ id, role }: { id: string; role: TeamRole }) => updateTeamMemberRole(id, role),
    onSuccess: (res) => {
      if (res.error) {
        toast.error(toErrMsg(res.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: TEAM_KEY });
      toast.success('Role updated');
    },
  });

  const { mutate: removeMember, isPending: isRemoving } = useMutation({
    mutationFn: (id: string) => removeTeamMember(id),
    onSuccess: (res) => {
      if (res.error) {
        toast.error(toErrMsg(res.error));
        return;
      }
      void qc.invalidateQueries({ queryKey: TEAM_KEY });
      toast.success('Member removed');
    },
  });

  if (isLoading) {
    return <TypographyMuted>Loading team...</TypographyMuted>;
  }

  const members = (result?.data ?? []) as TeamMemberWithProfile[];

  if (members.length === 0) {
    return (
      <TypographyMuted className="py-8 text-center">
        No team members yet.
      </TypographyMuted>
    );
  }

  return (
    <Card contentClassName="p-0" className="overflow-hidden">
      <Box as="table" className="w-full text-sm">
        <Box as="thead" className="border-b border-border">
          <Box as="tr">
            <Box as="th" className="px-4 py-3 text-left font-medium text-muted-foreground">
              Member
            </Box>
            <Box as="th" className="px-4 py-3 text-left font-medium text-muted-foreground">
              Email
            </Box>
            <Box as="th" className="px-4 py-3 text-left font-medium text-muted-foreground">
              Role
            </Box>
            <Box as="th" className="px-4 py-3 text-left font-medium text-muted-foreground">
              Actions
            </Box>
          </Box>
        </Box>
        <Box as="tbody">
          {members.map((member) => (
            <Box
              as="tr"
              key={member.id}
              className="border-b border-border last:border-0 hover:bg-muted/40"
            >
              <Box as="td" className="px-4 py-3">
                <HStack className="items-center gap-3">
                  <Box className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {(member.profile?.full_name ?? member.profile?.email ?? '?')[0]?.toUpperCase()}
                  </Box>
                  <TypographyP className="font-medium text-foreground">
                    {member.profile?.full_name ?? 'Unknown'}
                  </TypographyP>
                </HStack>
              </Box>
              <Box as="td" className="px-4 py-3">
                <TypographySmall className="text-muted-foreground">
                  {member.profile?.email ?? '—'}
                </TypographySmall>
              </Box>
              <Box as="td" className="px-4 py-3">
                <VStack className="gap-2">
                  <RoleBadge role={member.role} />
                  <Select
                    options={ROLE_OPTIONS}
                    value={member.role}
                    onValueChange={(v) => updateRole({ id: member.id, role: v as TeamRole })}
                    placeholder="Change role"
                    className="h-7 w-32 text-xs"
                  />
                </VStack>
              </Box>
              <Box as="td" className="px-4 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isRemoving}
                  className="cursor-pointer text-destructive hover:text-destructive/80"
                  onClick={() => removeMember(member.id)}
                >
                  <LuTrash2 className="size-4" />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
};
