'use client';

import { type ReactNode } from 'react';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
};
