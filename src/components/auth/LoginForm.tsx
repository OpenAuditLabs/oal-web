"use client";
import React, { useState, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import { validateLogin } from '@/lib/validation';
import Link from 'next/link';

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [form, setForm] = useState<LoginFormState>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors(fe => {
      if (!fe[e.target.name]) return fe; // nothing to clear
      const rest = { ...fe };
      delete rest[e.target.name];
      return rest;
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validation = validateLogin(form);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      // Placeholder: implement real auth in next PR.
      await new Promise(res => setTimeout(res, 600));
      // For now just log.
      console.log('Login attempt', validation.data.email);
      // TODO: redirect after successful auth
  } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <h1 className="text-xl font-semibold mb-1 text-foreground">Welcome back</h1>
      <p className="text-sm text-muted-foreground mb-6">Sign in to continue to your dashboard.</p>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
          {fieldErrors.email && <p id="email-error" className="text-xs text-red-500">{fieldErrors.email}</p>}
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
            {fieldErrors.password && <p id="password-error" className="text-xs text-red-500">{fieldErrors.password}</p>}
        </div>
        {error && <div className="text-xs text-red-500">{error}</div>}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={loading}
          className="w-full justify-center"
        >
          {loading ? 'Signing in…' : 'Sign In'}
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
