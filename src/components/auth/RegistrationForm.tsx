'use client'
import { useState, ChangeEvent, FormEvent } from "react";
import { validateRegistration } from "@/lib/validation";
import Button from "@/components/ui/Button";
import Link from "next/link";

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
  const [errors, setErrors] = useState<ErrorState>({});
  const [success, setSuccess] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess("");
    setErrors({});
    const result = validateRegistration(form);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    // TODO: Wire up backend registration
    setSuccess("Registration successful! (Backend not yet wired)");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
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
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
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
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
      </div>
      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full justify-center"
      >
        Register
      </Button>
      {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
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
