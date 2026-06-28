'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Form, toast } from '@paalstack/react-ui';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createBrowserSupabaseClient } from '@/libs/supabase';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const router = useRouter();
  const [done, setDone] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirm_password: '' },
  });

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });
    if (error) { toast.error(error.message); return; }
    setDone(true);
    setTimeout(() => router.push('/auth/login'), 2000);
  };

  if (done) {
    return (
      <Card
        header={{
          title: 'Password updated',
          description: 'Your password has been changed. Redirecting you to sign in…',
        }}
        headerClassName="text-center"
        titleProps={{ className: 'text-2xl font-bold' }}
      >
        {null}
      </Card>
    );
  }

  return (
    <Card
      header={{
        title: 'Set a new password',
        description: 'Choose a strong password for your account.',
      }}
      headerClassName="text-center"
      titleProps={{ className: 'text-2xl font-bold' }}
    >
      <Form
        form={form}
        onSubmit={handleSubmit}
        fields={[
          {
            type: 'input',
            name: 'password',
            label: 'New password',
            inputType: 'password',
            placeholder: 'At least 8 characters',
            required: true,
          },
          {
            type: 'input',
            name: 'confirm_password',
            label: 'Confirm new password',
            inputType: 'password',
            placeholder: '••••••••',
            required: true,
          },
        ]}
        hideResetButton
        SubmitButton={({ isSubmitting, onFormSubmit }) => (
          <Button
            type="submit"
            onClick={onFormSubmit}
            isLoading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Updating…' : 'Update password'}
          </Button>
        )}
      />
    </Card>
  );
};
