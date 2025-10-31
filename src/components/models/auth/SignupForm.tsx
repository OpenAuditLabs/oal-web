'use client';

import { signupAction } from '@/actions/auth/signup/action';
import { signupSchema } from '@/actions/auth/signup/schema';
import { FormCheckbox } from '@/components/common/Form/FormCheckbox';
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
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const PasswordToggleButton = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className="px-3 py-2 hover:bg-transparent"
    onClick={onToggle}
  >
    {show ? <EyeOffIcon className="h-4 w-4" aria-hidden="true"/> : <EyeIcon className="h-4 w-4" aria-hidden="true"/>}
    <span className="sr-only">{show ? 'Hide password' : 'Show password'}</span>
  </Button>
);

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      termsAndConditions: false
    }
  });

  const { execute, isExecuting } = useAction(signupAction, {
    onSuccess: () => {
      toast.success('Signup successful');
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

  const password = form.watch('password') || '';
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/(?=.*[a-z])/)) strength++;
    if (password.match(/(?=.*[A-Z])/)) strength++;
    if (password.match(/(?=.*\d)/)) strength++;
    if (password.match(/(?=.*[@$!%*?&])/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>Create your account</CardTitle>
          <CardDescription className='text-center'>
            Signup to OpenAuditLabs and start Auditing
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(execute)}>
            <CardContent className='space-y-2'>
              <FormInput control={form.control} name='name' label='Name' placeholder='John Doe' required id='name' autoFocus />
              <FormInput
                control={form.control}
                name='email'
                type='email'
                label='Email'
                placeholder='john@example.com'
                required
                id='email'
              />

              <FormInput
                control={form.control}
                name='password'
                type={showPassword ? 'text' : 'password'}
                label='Password'
                helperText='Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.'
                required
                id='password'
                endComponent={<PasswordToggleButton show={showPassword} onToggle={() => setShowPassword(p => !p)} />}
              />
              {password && (
                <div className='mt-2'>
                  <div className='h-2 w-full rounded-full bg-gray-200'>
                    <div
                      className={`h-full rounded-full ${
                        passwordStrength === 0
                          ? 'bg-transparent'
                          : passwordStrength === 1
                          ? 'bg-red-500'
                          : passwordStrength === 2
                          ? 'bg-orange-500'
                          : passwordStrength === 3
                          ? 'bg-yellow-500'
                          : passwordStrength === 4
                          ? 'bg-lime-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      passwordStrength === 0
                        ? 'text-gray-500'
                        : passwordStrength === 1
                        ? 'text-red-500'
                        : passwordStrength === 2
                        ? 'text-orange-500'
                        : passwordStrength === 3
                        ? 'text-yellow-500'
                        : passwordStrength === 4
                        ? 'text-lime-500'
                        : 'text-green-500'
                    }`}
                  >
                    {passwordStrength === 0
                      ? 'No password'
                      : passwordStrength === 1
                      ? 'Very Weak'
                      : passwordStrength === 2
                      ? 'Weak'
                      : passwordStrength === 3
                      ? 'Fair'
                      : passwordStrength === 4
                      ? 'Good'
                      : 'Strong'}
                  </p>
                </div>
              )}
              <FormInput
                control={form.control}
                name='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                label='Confirm Password'
                helperText='Passwords must match.'
                required
                id='confirmPassword'
                endComponent={<PasswordToggleButton show={showConfirmPassword} onToggle={() => setShowConfirmPassword(p => !p)} />}
              />

              <FormCheckbox
                control={form.control}
                name='termsAndConditions'
                label={
                  <span>
                    I agree to the{' '}
                    <Link href='/terms' className='text-primary'>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href='/privacy' className='text-primary'>
                      Privacy Policy
                    </Link>
                  </span>
                }
                required
              />
            </CardContent>

            <CardFooter className='flex flex-col space-y-4'>
              <Button
                className='mt-4 text-secondary'
                disabled={isExecuting || !form.formState.isValid || !form.formState.isDirty}
                type='submit'
              >
                {isExecuting ? 'Signing up...' : 'Sign Up'}
              </Button>
              <p className='text-center text-sm text-gray-600'>
                Already have an account?{' '}
                <Link href='/signin' className='text-primary'>
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}