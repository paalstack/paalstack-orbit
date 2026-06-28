'use client';

import { LuTrash2 } from '@paalstack/react-icons/lu';
import {
  Box,
  Button,
  Card,
  HStack,
  Select,
  toast,
  TypographyMuted,
  TypographyP,
  TypographySmall,
  VStack,
} from '@paalstack/react-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getTeamMembers, removeTeamMember, updateTeamMemberRole } from '@/actions/orbit/team';

import { RoleBadge } from './RoleBadge';

import type { TeamRole } from '@/types/orbit';

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

  const members = result?.data ?? [];

  if (members.length === 0) {
    return <TypographyMuted className="py-8 text-center">No team members yet.</TypographyMuted>;
  }

  return (
    <Card contentClassName="p-0" className="overflow-hidden">
      <Box as="table" className="w-full text-sm">
        <Box as="thead" className="border-border border-b">
          <Box as="tr">
            <Box as="th" className="text-muted-foreground px-4 py-3 text-left font-medium">
              Member
            </Box>
            <Box as="th" className="text-muted-foreground px-4 py-3 text-left font-medium">
              Email
            </Box>
            <Box as="th" className="text-muted-foreground px-4 py-3 text-left font-medium">
              Role
            </Box>
            <Box as="th" className="text-muted-foreground px-4 py-3 text-left font-medium">
              Actions
            </Box>
          </Box>
        </Box>
        <Box as="tbody">
          {members.map((member) => (
            <Box
              as="tr"
              key={member.id}
              className="border-border hover:bg-muted/40 border-b last:border-0"
            >
              <Box as="td" className="px-4 py-3">
                <HStack className="items-center gap-3">
                  <Box className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full text-sm font-semibold">
                    {(member.profile?.full_name ?? member.profile?.email ?? '?')[0]?.toUpperCase()}
                  </Box>
                  <TypographyP className="text-foreground font-medium">
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
                  className="text-destructive hover:text-destructive/80 cursor-pointer"
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
