import { Box, Button, TypographyH1, TypographyH2, TypographyP } from '@paalstack/react-ui';
import Link from 'next/link';

const NotFound = () => {
  return (
    <Box className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-12">
      <Box className="flex flex-col items-center gap-2 text-center">
        <TypographyH1 className="text-foreground text-8xl font-bold">404</TypographyH1>
        <TypographyH2 className="text-foreground text-2xl font-semibold">
          Page not found
        </TypographyH2>
        <TypographyP className="text-muted-foreground max-w-md text-sm">
          The page you are looking for doesn&apos;t exist or has been moved.
        </TypographyP>
      </Box>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </Box>
  );
};

export default NotFound;
