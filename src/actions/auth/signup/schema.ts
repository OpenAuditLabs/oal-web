import { z } from 'zod'

export const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: z.email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type SignupInput = z.infer<typeof signupSchema>
