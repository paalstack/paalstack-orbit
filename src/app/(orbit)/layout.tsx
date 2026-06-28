import { Box, Flex } from '@paalstack/react-ui';
import React from 'react';

import { OrbitSidebar } from '@/components/orbit/OrbitSidebar';
import { OrbitTopBar } from '@/components/orbit/OrbitTopBar';
import { requireAuth } from '@/libs/supabase/auth';

const OrbitLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await requireAuth();

  return (
    <Flex className="bg-background min-h-screen">
      <OrbitSidebar />
      <Box className="flex flex-1 flex-col">
        <OrbitTopBar user={user} />
        <Box as="main" className="flex-1 p-6">
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default OrbitLayout;
