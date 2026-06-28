import { LuPlus } from '@paalstack/react-icons/lu';
import { Button, HStack, Box, TypographyH1 } from '@paalstack/react-ui';
import Link from 'next/link';

import { getLeads } from '@/actions/orbit/leads';
import { LeadTableClient } from '@/components/orbit/leads/LeadTable';

export const metadata = {
  title: 'Leads — Orbit',
};

const LeadsPage = async () => {
  const { data: leads } = await getLeads();

  return (
    <Box>
      <HStack className="mb-6 justify-between">
        <TypographyH1 className="text-foreground">Leads</TypographyH1>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          <Link href="/leads/new">
            <LuPlus className="mr-2 size-4" />
            New Lead
          </Link>
        </Button>
      </HStack>
      <LeadTableClient initialData={leads ?? []} />
    </Box>
  );
};

export default LeadsPage;
