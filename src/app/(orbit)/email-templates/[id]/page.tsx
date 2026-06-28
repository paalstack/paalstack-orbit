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
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';

import { getEmailTemplate } from '@/actions/orbit/email';
import { EmailTemplateForm } from '@/components/orbit/email/EmailTemplateForm';
import { useUpdateEmailTemplate } from '@/features/orbit/email/hooks/useEmailTemplates';

import type { UpdateEmailTemplateInput } from '@/schemas/orbit/email/schema';

type PageProps = {
  params: Promise<{ id: string }>;
};

const EditEmailTemplatePage = ({ params }: PageProps) => {
  const { id } = use(params);
  const router = useRouter();
  const { mutate, isPending } = useUpdateEmailTemplate();

  const { data, isLoading } = useQuery({
    queryKey: ['orbit', 'email-templates', id],
    queryFn: () => getEmailTemplate(id),
  });

  const template = data?.data;

  const handleSubmit = (formData: Omit<UpdateEmailTemplateInput, 'id'>) => {
    mutate(
      { ...formData, id },
      {
        onSuccess: (result) => {
          if (!result.error) {
            router.push('/email-templates');
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box className="bg-background min-h-screen p-6">
        <VStack className="mx-auto max-w-2xl gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} className="bg-muted h-10 animate-pulse rounded-md" />
          ))}
        </VStack>
      </Box>
    );
  }

  if (!template) {
    return (
      <Box className="bg-background min-h-screen p-6">
        <VStack className="mx-auto max-w-2xl items-center gap-4 py-20">
          <TypographyMuted>Template not found.</TypographyMuted>
          <Button asChild variant="outline">
            <Link href="/email-templates">Back to templates</Link>
          </Button>
        </VStack>
      </Box>
    );
  }

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
              Edit Template
            </TypographyH1>
            <TypographyMuted className="text-sm">{template.name}</TypographyMuted>
          </VStack>
        </HStack>
        <Card contentClassName="p-6" className="border-border bg-card">
          <EmailTemplateForm
            onSubmit={handleSubmit}
            defaultValues={{
              name: template.name,
              subject: template.subject,
              body: template.body,
            }}
            isSubmitting={isPending}
          />
        </Card>
      </VStack>
    </Box>
  );
};

export default EditEmailTemplatePage;
