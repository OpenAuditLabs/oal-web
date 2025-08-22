'use server'

import { createAuditRerun } from '@/actions/audits'
import { revalidatePath } from 'next/cache'

export async function rerunAuditAction(formData: FormData) {
  if (!formData.has('auditId')) {
    throw new Error('Missing auditId in form data')
  }
  
  const auditId = formData.get('auditId') as string
  
  if (!auditId || auditId.trim() === '') {
    throw new Error('auditId cannot be empty')
  }
  
  const trimmedAuditId = auditId.trim()
  
  try {
    await createAuditRerun(trimmedAuditId)
    revalidatePath('/')
  } catch (error) {
    console.error('Error re-running audit:', error)
    throw error
  }
}
