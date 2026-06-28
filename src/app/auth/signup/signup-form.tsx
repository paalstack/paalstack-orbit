'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Form, Separator, Text, toast } from '@paalstack/react-ui';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createBrowserSupabaseClient } from '@/libs/supabase';
import { signupSchema, type SignupFormValues } from '@/schemas/auth';

export const SignupForm = () => {
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { full_name: '', email: '', password: '', confirm_password: '' },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setConfirmedEmail(values.email);
  };

  if (confirmedEmail) {
    return (
      <Card
        header={{
          title: 'Check your email',
          description: (
            <>
              We sent a confirmation link to{' '}
              <Text as="span" className="font-medium">
                {confirmedEmail}
              </Text>
              . Click it to activate your account.
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
        title: 'Create an account',
        description: 'Get started for free — no credit card required',
      }}
      headerClassName="text-center"
      titleProps={{ className: 'text-2xl font-bold' }}
      contentClassName="flex flex-col gap-4"
      footer={
        <>
          <Separator />
          <Text className="text-muted-foreground text-center text-sm">
            Already have an account?{' '}
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
            name: 'full_name',
            label: 'Full name',
            placeholder: 'Jane Smith',
            required: true,
          },
          {
            type: 'input',
            name: 'email',
            label: 'Email',
            inputType: 'email',
            placeholder: 'you@example.com',
            required: true,
          },
          {
            type: 'input',
            name: 'password',
            label: 'Password',
            inputType: 'password',
            placeholder: 'At least 8 characters',
            required: true,
          },
          {
            type: 'input',
            name: 'confirm_password',
            label: 'Confirm password',
            inputType: 'password',
            placeholder: '••••••••',
            required: true,
          },
        ]}
        hideResetButton
        submitText="Create account"
      />
    </Card>
  );
};
