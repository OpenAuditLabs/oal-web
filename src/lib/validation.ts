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
      if (issue.path.length > 0) {
        const key = issue.path.join('.') || 'form';
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
    }
    return { success: false as const, errors: fieldErrors };
  }
  return { success: true as const, data: parsed.data };
}
