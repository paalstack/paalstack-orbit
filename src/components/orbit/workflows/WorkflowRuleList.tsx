'use client';
import { LuTrash2, LuWorkflow } from '@paalstack/react-icons/lu';
import {
  Box,
  HStack,
  VStack,
  Badge,
  Button,
  Switch,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from '@paalstack/react-ui';

import {
  useWorkflowRules,
  useToggleWorkflowRule,
  useDeleteWorkflowRule,
} from '@/features/orbit/workflows/hooks/useWorkflowRules';

import type { WorkflowRule } from '@/types/orbit';

const conditionSummary = (rule: WorkflowRule): string => {
  const { field, operator, value } = rule.condition;
  const v = Array.isArray(value) ? value.join(', ') : value;
  return `${field} ${operator} ${v}`;
};

const RuleRow = ({ rule }: { rule: WorkflowRule }) => {
  const { mutate: toggle, isPending: toggling } = useToggleWorkflowRule();
  const { mutate: del, isPending: deleting } = useDeleteWorkflowRule();

  return (
    <HStack className="items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted">
      <HStack className="gap-3">
        <Box className="flex size-9 items-center justify-center rounded-md bg-muted">
          <LuWorkflow className="size-4 text-primary" />
        </Box>
        <VStack className="gap-0.5">
          <TypographyP className="text-sm font-medium text-foreground">{rule.name}</TypographyP>
          <HStack className="gap-2">
            <Badge variant="outline" className="text-xs">
              {rule.trigger_event}
            </Badge>
            <TypographySmall className="text-muted-foreground">{conditionSummary(rule)}</TypographySmall>
            <Badge
              variant="outline"
              className={
                rule.action === 'send_email'
                  ? 'border-blue-700 text-xs text-blue-400'
                  : 'border-yellow-700 text-xs text-yellow-400'
              }
            >
              {rule.action}
            </Badge>
          </HStack>
        </VStack>
      </HStack>
      <HStack className="gap-3">
        <Switch
          checked={rule.active}
          onCheckedChange={(checked) => toggle({ id: rule.id, active: checked })}
          disabled={toggling}
          aria-label={rule.active ? 'Disable rule' : 'Enable rule'}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            del(rule.id);
          }}
          isLoading={deleting}
          className="size-8 p-0 text-destructive hover:text-destructive/80"
        >
          <LuTrash2 className="size-3.5" />
        </Button>
      </HStack>
    </HStack>
  );
};

export const WorkflowRuleList = () => {
  const { data, isLoading, error } = useWorkflowRules();

  if (isLoading) {
    return (
      <VStack className="gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Box key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </VStack>
    );
  }

  if (error || data?.error) {
    return (
      <Box className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <TypographyMuted className="text-destructive">
          {data?.error ?? 'Failed to load workflow rules'}
        </TypographyMuted>
      </Box>
    );
  }

  const rules = data?.data ?? [];

  if (rules.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
        <LuWorkflow className="mb-3 size-8 text-muted-foreground" />
        <TypographyP className="text-sm font-medium text-foreground">
          No workflow rules yet
        </TypographyP>
        <TypographyMuted className="mt-1 text-xs">
          Create your first rule to automate lead workflows
        </TypographyMuted>
      </Box>
    );
  }

  return (
    <VStack className="gap-2">
      {rules.map((rule) => (
        <RuleRow key={rule.id} rule={rule} />
      ))}
    </VStack>
  );
};
