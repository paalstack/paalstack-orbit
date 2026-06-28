'use client';

import {
  Card,
  VStack,
  HStack,
  Box,
  TypographyH2,
  TypographyMuted,
  TypographyP,
} from '@paalstack/react-ui';

type ConversionRateCardProps = {
  conversionRate: number;
  totalLeads: number;
  wonLeads: number;
};

export const ConversionRateCard = ({
  conversionRate,
  totalLeads,
  wonLeads,
}: ConversionRateCardProps) => {
  return (
    <Card header={{ title: 'Conversion Rate' }} className="h-full">
      <VStack className="gap-4">
        <Box className="flex items-end gap-2">
          <TypographyH2 className="text-primary text-5xl font-bold">{conversionRate}%</TypographyH2>
          <TypographyMuted className="mb-1 text-sm">conversion</TypographyMuted>
        </Box>
        <HStack className="gap-6">
          <VStack className="gap-0.5">
            <TypographyP className="text-foreground text-2xl font-semibold">
              {totalLeads}
            </TypographyP>
            <TypographyMuted className="text-xs">Total Leads</TypographyMuted>
          </VStack>
          <VStack className="gap-0.5">
            <TypographyP className="text-primary text-2xl font-semibold">{wonLeads}</TypographyP>
            <TypographyMuted className="text-xs">Won</TypographyMuted>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );
};
