"use client";
import React, { useState, useActionState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { validateLogin } from '@/lib/validation';
import Link from 'next/link';
import { loginUserAction, type LoginResult } from '@/actions/auth';
import { toast } from 'sonner';

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [form, setForm] = useState<LoginFormState>({ email: '', password: '' });
  const [serverState, formAction, isPending] = useActionState<LoginResult, FormData>(loginUserAction, {});
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  // Toast notifications for server action results
  useEffect(() => {
    if (!serverState) return;
    if (serverState.success) {
      toast.success(serverState.success);
    }
    if (serverState.errors?.form) {
      toast.error(serverState.errors.form);
    }
    if (serverState.errors?.email || serverState.errors?.password) {
      toast.error('Please fix the highlighted fields');
    }
  }, [serverState]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors(fe => {
      if (!fe[e.target.name]) return fe; // nothing to clear
      const rest = { ...fe };
      delete rest[e.target.name];
      return rest;
    });
  };

  // Optional: live client-side feedback via onChange; rely on server action for final validation

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <h1 className="text-xl font-semibold mb-1 text-foreground">Welcome back</h1>
      <p className="text-sm text-muted-foreground mb-6">Sign in to continue to your dashboard.</p>
  <form action={formAction} className="space-y-4" noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`w-full rounded-md border ${fieldErrors.email ? 'border-red-500 focus:ring-red-400' : 'border-border focus:ring-primary/40'} bg-background px-3 py-2 text-sm outline-none focus:ring-2`}
            value={form.email}
            onChange={onChange}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
          {(fieldErrors.email || serverState?.errors?.email) && (
            <p id="email-error" className="text-xs text-red-500">{fieldErrors.email || serverState?.errors?.email}</p>
          )}
        </div>
        <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`w-full rounded-md border ${fieldErrors.password ? 'border-red-500 focus:ring-red-400' : 'border-border focus:ring-primary/40'} bg-background px-3 py-2 text-sm outline-none focus:ring-2`}
              value={form.password}
              onChange={onChange}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {(fieldErrors.password || serverState?.errors?.password) && (
              <p id="password-error" className="text-xs text-red-500">{fieldErrors.password || serverState?.errors?.password}</p>
            )}
        </div>
        {serverState?.errors?.form && <div className="text-xs text-red-500">{serverState.errors.form}</div>}
        {serverState?.success && <div className="text-xs text-green-600">{serverState.success}</div>}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending}
          className="w-full justify-center"
        >
          {isPending ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
      <div className="mt-6 pt-4 border-t border-border text-center">
        <Link
          href="/register"
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Not yet a member?
        </Link>
      </div>
    </div>
  );
}
