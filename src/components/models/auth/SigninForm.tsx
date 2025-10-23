'use client';

import { signinAction } from '@/actions/auth/signin/action';
import { signinSchema } from '@/actions/auth/signin/schema';
import { FormInput } from '@/components/common/Form/FormInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import React from 'react';

export function SigninForm() {
  const router = useRouter();
  const emailInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    emailInputRef.current?.focus();
  }, []);
  const form = useForm({
    resolver: zodResolver(signinSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { execute, isExecuting } = useAction(signinAction, {
    onSuccess: () => {
      toast.success('Signin successful');
      form.reset();
      router.push('/dashboard');
    },
    onError: (error) => {
      const { serverError, validationErrors } = error.error;
      const fieldErrors = validationErrors?.fieldErrors;
      const formErrors = validationErrors?.formErrors?.join(', ');
      const fieldErrorMessage = fieldErrors
        ? Object.entries(fieldErrors)
            .map(([key, value]) => `${key}: ${value?.join(', ')}`)
            .join(', ')
        : undefined;

      const errorMessage = serverError ?? formErrors ?? fieldErrorMessage ?? 'An unknown error occurred';
      toast.error(errorMessage);
    }
  });

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>Welcome back</CardTitle>
          <CardDescription className='text-center'>Sign in to access your OpenAuditLabs account</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(execute)}>
            <CardContent className='space-y-4'>
              <FormInput
                control={form.control}
                name='email'
                type='email'
                label='Email'
                placeholder='john@example.com'
                required
                id='email'
              />

              <FormInput control={form.control} name='password' type='password' label='Password' required id='password' />
            </CardContent>

            <CardFooter className='flex flex-col space-y-4'>
              <Button
                className='mt-4 text-secondary'
                disabled={isExecuting || !form.formState.isValid || !form.formState.isDirty}
                type='submit'
              >
                {isExecuting ? 'Signing in...' : 'Sign In'}
              </Button>
              <p className='text-center text-sm text-gray-600'>
                Don&apos;t have an account?{' '}
                <Link href='/signup' className='text-primary'>
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
