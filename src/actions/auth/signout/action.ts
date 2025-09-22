'use server'

import { authActionClient } from '@/lib/action'
import { signout } from './logic'

export const signoutAction = authActionClient
  .metadata({ actionName: 'signout' })
  .action(async () => {
    try {
      const result = await signout()

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

      console.error('Sign out error:', error)
      throw new Error('Something went wrong')
    }
  })
