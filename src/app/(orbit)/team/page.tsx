import { Box, HStack, TypographyH1, TypographyMuted } from '@paalstack/react-ui';

import { TeamMemberList } from '@/components/orbit/team/TeamMemberList';

export const metadata = {
  title: 'Team — Orbit',
};

const TeamPage = () => {
  return (
    <Box>
      <HStack className="mb-6 items-start justify-between">
        <Box>
          <TypographyH1 className="text-foreground">Team</TypographyH1>
          <TypographyMuted className="text-muted-foreground mt-1">
            Manage your sales team and their roles
          </TypographyMuted>
        </Box>
      </HStack>
      <TeamMemberList />
    </Box>
  );
};

export default TeamPage;
