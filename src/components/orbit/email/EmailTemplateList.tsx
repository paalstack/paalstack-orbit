'use client';
import { LuPencil, LuTrash2, LuMail } from '@paalstack/react-icons/lu';
import {
  Box,
  HStack,
  VStack,
  Badge,
  Button,
  TypographyMuted,
  TypographyP,
} from '@paalstack/react-ui';
import { useRouter } from 'next/navigation';

import {
  useEmailTemplates,
  useDeleteEmailTemplate,
} from '@/features/orbit/email/hooks/useEmailTemplates';

import type { EmailTemplate } from '@/types/orbit';

const TemplateRow = ({ template }: { template: EmailTemplate }) => {
  const router = useRouter();
  const { mutate: deleteTemplate, isPending } = useDeleteEmailTemplate();

  return (
    <HStack className="border-border bg-card hover:bg-muted items-center justify-between rounded-lg border p-4 transition-colors">
      <HStack className="gap-3">
        <Box className="bg-muted flex size-9 items-center justify-center rounded-md">
          <LuMail className="text-primary size-4" />
        </Box>
        <VStack className="gap-0.5">
          <TypographyP className="text-foreground text-sm font-medium">{template.name}</TypographyP>
          <TypographyMuted className="text-xs">{template.subject}</TypographyMuted>
        </VStack>
      </HStack>
      <HStack className="gap-2">
        <Badge variant="outline" className="text-xs">
          {new Date(template.created_at).toLocaleDateString()}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/email-templates/${template.id}`)}
          className="size-8 p-0"
        >
          <LuPencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteTemplate(template.id)}
          isLoading={isPending}
          className="text-destructive hover:text-destructive/80 size-8 p-0"
        >
          <LuTrash2 className="size-3.5" />
        </Button>
      </HStack>
    </HStack>
  );
};

export const EmailTemplateList = () => {
  const { data, isLoading, error } = useEmailTemplates();

  if (isLoading) {
    return (
      <VStack className="gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Box key={i} className="bg-muted h-16 animate-pulse rounded-lg" />
        ))}
      </VStack>
    );
  }

  if (error || data?.error) {
    return (
      <Box className="border-destructive/50 bg-destructive/10 rounded-lg border p-4">
        <TypographyMuted className="text-destructive">
          {data?.error ?? 'Failed to load templates'}
        </TypographyMuted>
      </Box>
    );
  }

  const templates = data?.data ?? [];

  if (templates.length === 0) {
    return (
      <Box className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <LuMail className="text-muted-foreground mb-3 size-8" />
        <TypographyP className="text-foreground text-sm font-medium">No templates yet</TypographyP>
        <TypographyMuted className="mt-1 text-xs">
          Create your first email template to get started
        </TypographyMuted>
      </Box>
    );
  }

  return (
    <VStack className="gap-2">
      {templates.map((template) => (
        <TemplateRow key={template.id} template={template} />
      ))}
    </VStack>
  );
};
