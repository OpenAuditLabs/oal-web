import { z } from 'zod'

export const signinSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export type SigninInput = z.infer<typeof signinSchema>
