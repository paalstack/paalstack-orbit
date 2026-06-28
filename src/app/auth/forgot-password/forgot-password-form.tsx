'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Form, Separator, Text, toast } from '@paalstack/react-ui';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createBrowserSupabaseClient } from '@/libs/supabase';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas/auth';

export const ForgotPasswordForm = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setSubmittedEmail(values.email);
  };

  if (submittedEmail) {
    return (
      <Card
        header={{
          title: 'Check your email',
          description: (
            <>
              We sent a password reset link to{' '}
              <Text as="span" className="font-medium">
                {submittedEmail}
              </Text>
              . It expires in 1 hour.
            </>
          ),
        }}
        headerClassName="text-center"
        titleProps={{ className: 'text-2xl font-bold' }}
        footer={
          <Button variant="outline" asChild>
            <Link href="/auth/login">Back to sign in</Link>
          </Button>
        }
        footerClassName="justify-center"
      >
        {null}
      </Card>
    );
  }

  return (
    <Card
      header={{
        title: 'Forgot your password?',
        description: "Enter your email and we'll send you a link to reset your password.",
      }}
      headerClassName="text-center"
      titleProps={{ className: 'text-2xl font-bold' }}
      footer={
        <>
          <Separator />
          <Text className="text-muted-foreground text-center text-sm">
            Remembered your password?{' '}
            <Button variant="link" size="sm" className="h-auto p-0" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </Text>
        </>
      }
      footerClassName="flex-col gap-3"
    >
      <Form
        form={form}
        onSubmit={handleSubmit}
        fields={[
          {
            type: 'input',
            name: 'email',
            label: 'Email',
            inputType: 'email',
            placeholder: 'you@example.com',
            required: true,
          },
        ]}
        hideResetButton
        submitText="Send reset link"
      />
    </Card>
  );
};
