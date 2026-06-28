import { LuPlus } from '@paalstack/react-icons/lu';
import { Box, HStack, VStack, Button, TypographyH1, TypographyMuted } from '@paalstack/react-ui';
import Link from 'next/link';

import { WorkflowRuleList } from '@/components/orbit/workflows/WorkflowRuleList';

export const metadata = {
  title: 'Workflows — Orbit',
};

const WorkflowsPage = () => {
  return (
    <VStack className="gap-6">
      <HStack className="items-center justify-between">
        <Box>
          <TypographyH1 className="text-foreground">Workflows</TypographyH1>
          <TypographyMuted>Automate actions based on lead events</TypographyMuted>
        </Box>
        <Button asChild>
          <Link href="/workflows/new">
            <LuPlus className="mr-2 size-4" />
            New Rule
          </Link>
        </Button>
      </HStack>
      <WorkflowRuleList />
    </VStack>
  );
};

export default WorkflowsPage;
