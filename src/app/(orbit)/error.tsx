'use client';

import { Box, Button, TypographyH2, TypographyMuted, TypographyP } from '@paalstack/react-ui';
import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const OrbitError = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-12">
      <Box className="flex flex-col items-center gap-2 text-center">
        <TypographyH2 className="text-foreground text-2xl font-bold">
          Something went wrong
        </TypographyH2>
        <TypographyP className="text-muted-foreground max-w-md text-sm">
          {error.message}
        </TypographyP>
        {error.digest && (
          <TypographyMuted className="font-mono text-xs">Error ID: {error.digest}</TypographyMuted>
        )}
      </Box>
      <Button onClick={reset} className="bg-primary text-primary-foreground hover:bg-primary/90">
        Try again
      </Button>
    </Box>
  );
};

export default OrbitError;
