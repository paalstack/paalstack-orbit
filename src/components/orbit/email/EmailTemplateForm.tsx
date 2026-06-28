'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, VStack, Box, TypographyMuted } from '@paalstack/react-ui';
import { useForm } from 'react-hook-form';

import {
  createEmailTemplateSchema,
  type CreateEmailTemplateInput,
} from '@/schemas/orbit/email/schema';

type EmailTemplateFormProps = {
  onSubmit: (data: CreateEmailTemplateInput) => void;
  defaultValues?: Partial<CreateEmailTemplateInput>;
  isSubmitting?: boolean;
};

export const EmailTemplateForm = ({
  onSubmit,
  defaultValues,
  isSubmitting,
}: EmailTemplateFormProps) => {
  const form = useForm<CreateEmailTemplateInput>({
    resolver: zodResolver(createEmailTemplateSchema),
    defaultValues,
  });

  return (
    <VStack className="gap-4">
      <Box className="rounded-md bg-muted p-3">
        <TypographyMuted className="text-xs">
          Available variables: {'{{lead_name}}'}, {'{{company}}'}, {'{{status}}'}
        </TypographyMuted>
      </Box>
      <Form
        form={form}
        onSubmit={onSubmit}
        fields={[
          { type: 'input', name: 'name', label: 'Template Name', required: true },
          { type: 'input', name: 'subject', label: 'Subject', required: true },
          { type: 'textarea', name: 'body', label: 'Body (HTML)', required: true },
        ]}
        hideResetButton
        SubmitButton={({ onFormSubmit }) => (
          <Box className="flex justify-end">
            <button
              type="submit"
              onClick={onFormSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Save Template'}
            </button>
          </Box>
        )}
      />
    </VStack>
  );
};
