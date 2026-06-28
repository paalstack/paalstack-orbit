import { Box, Grid, GridItem, TypographyH1, TypographyMuted, VStack } from '@paalstack/react-ui';

import { getDashboardStats } from '@/actions/orbit/dashboard';
import { ActivityVolumeChart } from '@/components/orbit/dashboard/ActivityVolumeChart';
import { ConversionRateCard } from '@/components/orbit/dashboard/ConversionRateCard';
import { LeadsByStatusChart } from '@/components/orbit/dashboard/LeadsByStatusChart';

export const metadata = {
  title: 'Dashboard — Orbit',
};

const DashboardPage = async () => {
  const stats = await getDashboardStats();

  return (
    <VStack className="gap-6">
      <Box>
        <TypographyH1>Dashboard</TypographyH1>
        <TypographyMuted>CRM performance overview</TypographyMuted>
      </Box>
      <Grid className="grid-cols-1 gap-6 md:grid-cols-3">
        <GridItem className="md:col-span-1">
          <ConversionRateCard
            conversionRate={stats.conversionRate}
            totalLeads={stats.totalLeads}
            wonLeads={stats.wonLeads}
          />
        </GridItem>
        <GridItem className="md:col-span-2">
          <LeadsByStatusChart data={stats.leadsByStatus} />
        </GridItem>
      </Grid>
      <ActivityVolumeChart data={stats.activityVolume} />
    </VStack>
  );
};

export default DashboardPage;
