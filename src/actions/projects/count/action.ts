'use server'

import { authActionClient } from '@/lib/action'
import { getProjectCountForUser } from './logic'

export const projectCountAction = authActionClient
  .metadata({ actionName: 'projectCount' })
  .action(async ({ ctx }) => {
    const userId = ctx.session.user.id

    try {
      const result = await getProjectCountForUser(userId)
      if (result.success) return result.data
      throw new Error(result.error, { cause: { internal: true } })
    } catch (err) {
      const error = err as Error
      const cause = (error.cause ?? {}) as { internal?: boolean }
      if (cause?.internal) {
        throw new Error(error.message, { cause: error })
      }
      console.error('Project count action error:', error, { userId })
      throw new Error('Something went wrong')
    }
  })
