'use server'

import { actionClient } from '@/lib/action'
import { signup } from './logic'
import { signupSchema } from './schema'

export const signupAction = actionClient
  .schema(signupSchema)
  .metadata({ actionName: 'signup' })
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput

    try {
      const result = await signup(parsedInput)

      if (result.success) {
        return result.data
      }

      throw new Error(result.error, { cause: { internal: true } })
    } catch (err) {
      const error = err as Error
      const cause = (error.cause ?? {}) as { internal?: boolean }

      if (cause?.internal) {
        throw new Error(error.message, { cause: error })
      }

      console.error('Sign up error:', error)
      throw new Error('Something went wrong')
    }
  })
