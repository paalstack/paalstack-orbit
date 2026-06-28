import { LuArrowLeft, LuPencil } from '@paalstack/react-icons/lu';
import {
  Box,
  VStack,
  HStack,
  Card,
  Grid,
  GridItem,
  Button,
  TypographyH1,
  TypographyMuted,
  TypographySmall,
} from '@paalstack/react-ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getLead } from '@/actions/orbit/leads';
import { ActivityFeed } from '@/components/orbit/activities/ActivityFeed';
import { LeadStatusBadge } from '@/components/orbit/leads/LeadStatusBadge';

import type { LeadWithAssignee } from '@/types/orbit';

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

const LeadDetailPage = async ({ params }: LeadDetailPageProps) => {
  const { id } = await params;
  const result = await getLead(id);

  if (result.error || !result.data) notFound();

  const lead = result.data as LeadWithAssignee;

  return (
    <Box>
      <HStack className="mb-6 items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <Link href="/leads">
            <LuArrowLeft className="mr-1 size-4" />
            Leads
          </Link>
        </Button>
      </HStack>

      <HStack className="mb-6 items-start justify-between">
        <VStack className="gap-1">
          <TypographyH1 className="text-foreground">{lead.name}</TypographyH1>
          {lead.company && (
            <TypographyMuted className="text-muted-foreground">{lead.company}</TypographyMuted>
          )}
        </VStack>
        <HStack className="items-center gap-3">
          <LeadStatusBadge status={lead.status} />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="cursor-pointer border-border text-muted-foreground hover:text-foreground"
          >
            <Link href={`/leads/${id}/edit`}>
              <LuPencil className="mr-1 size-3" />
              Edit
            </Link>
          </Button>
        </HStack>
      </HStack>

      <Grid className="grid-cols-1 gap-6 lg:grid-cols-3">
        <GridItem className="lg:col-span-2">
          <ActivityFeed leadId={id} />
        </GridItem>

        <GridItem>
          <Card
            className="border-border bg-card"
            contentClassName="p-4"
            header={{ title: 'Lead Details' }}
            titleProps={{ className: 'text-sm font-semibold text-foreground' }}
          >
            <VStack className="gap-3">
              {[
                { label: 'Email', value: lead.email },
                { label: 'Phone', value: lead.phone },
                { label: 'Source', value: lead.source },
                {
                  label: 'Value',
                  value: lead.value != null ? `$${lead.value.toLocaleString()}` : null,
                },
                {
                  label: 'Owner',
                  value: lead.owner?.full_name ?? lead.owner?.email ?? null,
                },
                {
                  label: 'Assigned To',
                  value: lead.assignee?.full_name ?? lead.assignee?.email ?? null,
                },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <TypographySmall className="font-medium text-muted-foreground">{label}</TypographySmall>
                  <TypographyMuted className="text-muted-foreground">{value ?? '—'}</TypographyMuted>
                </Box>
              ))}
            </VStack>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default LeadDetailPage;
