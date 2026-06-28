import { Box } from '@paalstack/react-ui';
import { type ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box className="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-12">
      <Box className="w-full max-w-md">{children}</Box>
    </Box>
  );
};

export default AuthLayout;
