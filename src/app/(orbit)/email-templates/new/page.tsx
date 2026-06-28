'use client';
import { LuArrowLeft } from '@paalstack/react-icons/lu';
import {
  Box,
  HStack,
  VStack,
  Button,
  Card,
  TypographyH1,
  TypographyMuted,
} from '@paalstack/react-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { EmailTemplateForm } from '@/components/orbit/email/EmailTemplateForm';
import { useCreateEmailTemplate } from '@/features/orbit/email/hooks/useEmailTemplates';

import type { CreateEmailTemplateInput } from '@/schemas/orbit/email/schema';

const NewEmailTemplatePage = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateEmailTemplate();

  const handleSubmit = (data: CreateEmailTemplateInput) => {
    mutate(data, {
      onSuccess: (result) => {
        if (!result.error) {
          router.push('/email-templates');
        }
      },
    });
  };

  return (
    <Box className="bg-background min-h-screen p-6">
      <VStack className="mx-auto max-w-2xl gap-6">
        <HStack className="items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="p-0">
            <Link href="/email-templates">
              <LuArrowLeft className="size-4" />
            </Link>
          </Button>
          <VStack className="gap-0.5">
            <TypographyH1 className="text-foreground text-2xl font-semibold">
              New Email Template
            </TypographyH1>
            <TypographyMuted className="text-sm">
              Create a reusable template with variable interpolation
            </TypographyMuted>
          </VStack>
        </HStack>
        <Card contentClassName="p-6" className="border-border bg-card">
          <EmailTemplateForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </Card>
      </VStack>
    </Box>
  );
};

export default NewEmailTemplatePage;
