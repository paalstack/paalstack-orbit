'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, Form, HStack, Separator, Text, toast } from '@paalstack/react-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { createBrowserSupabaseClient } from '@/libs/supabase';
import { loginSchema, type LoginFormValues } from '@/schemas/auth';

export const LoginForm = () => {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <Card
      header={{ title: 'Welcome back', description: 'Sign in to your account to continue' }}
      headerClassName="text-center"
      titleProps={{ className: 'text-2xl font-bold' }}
      footer={
        <>
          <Separator />
          <Text className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{' '}
            <Button variant="link" size="sm" className="h-auto p-0" asChild>
              <Link href="/auth/signup">Sign up</Link>
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
          {
            type: 'input',
            name: 'password',
            label: 'Password',
            inputType: 'password',
            placeholder: '••••••••',
            required: true,
          },
        ]}
        hideResetButton
        SubmitButton={({ isSubmitting, onFormSubmit: onFormSubmit }) => (
          <Box className="flex w-full flex-col gap-3">
            <HStack className="justify-end">
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                <Link href="/auth/forgot-password">Forgot password?</Link>
              </Button>
            </HStack>
            <Button
              type="submit"
              onClick={onFormSubmit}
              isLoading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </Box>
        )}
      />
    </Card>
  );
};
