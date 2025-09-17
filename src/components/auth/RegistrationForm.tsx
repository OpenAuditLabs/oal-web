'use client'
import { useState, ChangeEvent, useActionState } from "react";
import { validateRegistration } from "@/lib/validation";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { registerUserAction, type RegisterResult } from "@/actions/auth";

type FormState = {
  name: string;
  email: string;
  password: string;
};

type ErrorState = {
  name?: string;
  email?: string;
  password?: string;
  form?: string;
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });
  const [clientErrors, setClientErrors] = useState<ErrorState>({});
  const [serverState, formAction, isPending] = useActionState<RegisterResult, FormData>(registerUserAction, {});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function preValidateAndSubmit(formData: FormData) {
    // Client-side validation for instant field errors before server call
    const result = validateRegistration(form);
    if (!result.success) {
      setClientErrors(result.errors);
      return;
    }
    setClientErrors({});
    formAction(formData);
  }

  return (
    <form className="space-y-4" action={preValidateAndSubmit}>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {(clientErrors.name || serverState?.errors?.name) && (
          <p className="text-red-500 text-xs">{clientErrors.name || serverState?.errors?.name}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {(clientErrors.email || serverState?.errors?.email) && (
          <p className="text-red-500 text-xs">{clientErrors.email || serverState?.errors?.email}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {(clientErrors.password || serverState?.errors?.password) && (
          <p className="text-red-500 text-xs">{clientErrors.password || serverState?.errors?.password}</p>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full justify-center"
        disabled={isPending}
      >
        {isPending ? 'Registering…' : 'Register'}
      </Button>
      {serverState?.errors?.form && (
        <p className="text-red-500 text-sm mt-2">{serverState.errors.form}</p>
      )}
      {serverState?.success && (
        <p className="text-green-600 text-sm mt-2">{serverState.success}</p>
      )}
      <div className="mt-6 pt-4 border-t border-border text-center">
        <Link
          href="/login"
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Already a member?
        </Link>
      </div>
    </form>
  );
}
