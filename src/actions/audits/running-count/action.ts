'use server'

import { authActionClient } from '@/lib/action'
import { getRunningAuditCountForUser } from './logic'

export const runningAuditCountAction = authActionClient
  .metadata({ actionName: 'runningAuditCount' })
  .action(async ({ ctx }) => {
    const userId = ctx.session.user.id

    try {
      const result = await getRunningAuditCountForUser(userId)
      if (result.success) return result.data
      throw new Error(result.error, { cause: { internal: true } })
    } catch (err) {
      const error = err as Error
      const cause = (error.cause ?? {}) as { internal?: boolean }
      if (cause?.internal) {
        throw new Error(error.message, { cause: error })
      }
      console.error('Running audit count action error:', error, { userId })
      throw new Error('Something went wrong')
    }
  })
