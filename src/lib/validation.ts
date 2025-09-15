import { z } from 'zod';

// Shared auth-related schemas
export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
});

export type LoginSchema = z.infer<typeof loginSchema>;

export function validateLogin(data: unknown) {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.length ? issue.path.join('.') : 'form';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false as const, errors: fieldErrors };
  }
  return { success: true as const, data: parsed.data };
}
export const registrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password too long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one digit" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});

export function validateRegistration(data: unknown) {
  const parsed = registrationSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.length ? issue.path.join('.') : 'form';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false as const, errors: fieldErrors };
  }
  return { success: true as const, data: parsed.data };
}
