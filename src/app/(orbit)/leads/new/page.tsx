import { Box, TypographyH1 } from '@paalstack/react-ui';

import { LeadForm } from '@/components/orbit/leads/LeadForm';

export const metadata = {
  title: 'New Lead — Orbit',
};

const NewLeadPage = () => {
  return (
    <Box className="mx-auto max-w-2xl">
      <TypographyH1 className="text-foreground mb-6">New Lead</TypographyH1>
      <LeadForm />
    </Box>
  );
};

export default NewLeadPage;
