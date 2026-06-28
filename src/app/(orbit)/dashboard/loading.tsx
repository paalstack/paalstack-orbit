import { Box, Grid, GridItem, Skeleton, VStack } from '@paalstack/react-ui';

const DashboardLoading = () => {
  return (
    <VStack className="gap-6">
      <Box>
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </Box>
      <Grid className="grid-cols-1 gap-6 md:grid-cols-3">
        <GridItem className="md:col-span-1">
          <Skeleton className="h-48 w-full rounded-lg" />
        </GridItem>
        <GridItem className="md:col-span-2">
          <Skeleton className="h-48 w-full rounded-lg" />
        </GridItem>
      </Grid>
      <Skeleton className="h-64 w-full rounded-lg" />
    </VStack>
  );
};

export default DashboardLoading;
