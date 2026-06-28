'use client';

import {
  LuLayoutDashboard,
  LuUsers,
  LuWorkflow,
  LuMail,
  LuUserCog,
} from '@paalstack/react-icons/lu';
import { Box, VStack, Tooltip, TypographySmall } from '@paalstack/react-ui';
import { cn } from '@paalstack/react-ui/lib';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import type { ComponentType } from 'react';

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LuLayoutDashboard },
  { label: 'Leads', href: '/leads', icon: LuUsers },
  { label: 'Workflows', href: '/workflows', icon: LuWorkflow },
  { label: 'Email Templates', href: '/email-templates', icon: LuMail },
  { label: 'Team', href: '/team', icon: LuUserCog },
];

export const OrbitSidebar = () => {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      as="aside"
      className={cn(
        'border-border bg-card relative flex flex-col border-r transition-all duration-200',
        expanded ? 'w-60' : 'w-16'
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <Box className="border-border flex h-16 items-center justify-center border-b px-4">
        {expanded ? (
          <TypographySmall className="text-primary font-semibold tracking-widest">
            ORBIT
          </TypographySmall>
        ) : (
          <Box className="bg-primary size-6 rounded" />
        )}
      </Box>

      <VStack className="flex-1 gap-1 p-2">
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Tooltip key={href} content={!expanded ? label : undefined} side="right">
              <Link
                href={href}
                prefetch={false}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="size-5 shrink-0" />
                {expanded && (
                  <TypographySmall
                    className={cn('font-medium', isActive ? 'text-primary' : 'text-inherit')}
                  >
                    {label}
                  </TypographySmall>
                )}
              </Link>
            </Tooltip>
          );
        })}
      </VStack>
    </Box>
  );
};
