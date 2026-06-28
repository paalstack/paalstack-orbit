import { cn } from '@paalstack/react-ui/lib';
import { type Metadata, type Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { type ReactNode } from 'react';

import { Providers } from '@/providers';

import '@/styles/globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | PaalStack Orbit',
    default: 'PaalStack Orbit',
  },
  description:
    'PaalStack Orbit — intelligent outreach and lead management platform for modern sales teams.',
  keywords: ['PaalStack', 'Orbit', 'CRM', 'Lead Management', 'Outreach', 'Sales'],
  authors: [{ name: 'Paalamugan' }],
  creator: 'PaalStack',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'PaalStack Orbit',
    description: 'Intelligent outreach and lead management for modern sales teams.',
    siteName: 'PaalStack Orbit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PaalStack Orbit',
    description: 'Intelligent outreach and lead management for modern sales teams.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, plusJakartaSans.variable, 'antialiased')}>
        <NextTopLoader showSpinner={false} height={5} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
