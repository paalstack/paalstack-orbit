import { Box, TypographyMuted } from '@paalstack/react-ui';

const Loading = () => {
  return (
    <Box className="container flex min-h-[60vh] items-center justify-center py-12">
      <Box className="flex flex-col items-center gap-4">
        <Box className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
        <TypographyMuted className="text-sm">Loading...</TypographyMuted>
      </Box>
    </Box>
  );
};

export default Loading;
