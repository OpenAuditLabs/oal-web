"use client";
import React, { useState, useActionState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";
import { forgotPasswordCheckAction, type ForgotPasswordCheckResult } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [formState, formAction, isPending] = useActionState(forgotPasswordCheckAction, {} as ForgotPasswordCheckResult);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!formState) return;
    if (formState.success) {
      setSuccess(formState.success);
      setError("");
      toast.success(formState.success);
    }
    if (formState.errors?.email) {
      setError(formState.errors.email);
      setSuccess("");
      toast.error(formState.errors.email);
    } else if (formState.errors?.form) {
      setError(formState.errors.form);
      setSuccess("");
      toast.error(formState.errors.form);
    }
  }, [formState]);

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-sm max-w-md mx-auto mt-16">
      <h1 className="text-xl font-semibold mb-1 text-foreground">Forgot Password?</h1>
      <p className="text-sm text-muted-foreground mb-6">Enter your email to receive a password reset link.</p>
      <form action={formAction} className="space-y-4" noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? "email-error" : undefined}
          />
          {error && (
            <p id="email-error" className="text-xs text-red-500">{error}</p>
          )}
        </div>
        {success && <div className="text-xs text-green-600">{success}</div>}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending}
          className="w-full justify-center"
        >
          {isPending ? "Sending…" : "Send Reset Link"}
        </Button>
      </form>
      <div className="mt-6 pt-4 border-t border-border text-center">
        <Link
          href="/login"
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
