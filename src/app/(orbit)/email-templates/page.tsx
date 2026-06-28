import { LuPlus } from '@paalstack/react-icons/lu';
import { Box, HStack, VStack, Button, TypographyH1, TypographyMuted } from '@paalstack/react-ui';
import Link from 'next/link';

import { EmailTemplateList } from '@/components/orbit/email/EmailTemplateList';

export const metadata = {
  title: 'Email Templates — Orbit',
};

const EmailTemplatesPage = () => {
  return (
    <Box className="min-h-screen bg-background p-6">
      <VStack className="mx-auto max-w-4xl gap-6">
        <HStack className="items-center justify-between">
          <VStack className="gap-1">
            <TypographyH1 className="text-2xl font-semibold text-foreground">
              Email Templates
            </TypographyH1>
            <TypographyMuted className="text-sm">
              Manage reusable email templates with dynamic variables
            </TypographyMuted>
          </VStack>
          <Button asChild className="bg-primary text-primary-foreground hover:opacity-90">
            <Link href="/email-templates/new">
              <LuPlus className="mr-2 size-4" />
              New Template
            </Link>
          </Button>
        </HStack>
        <EmailTemplateList />
      </VStack>
    </Box>
  );
};

export default EmailTemplatesPage;
