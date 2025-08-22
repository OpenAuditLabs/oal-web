'use server'

import { createAuditRerun } from '@/actions/audits'
import { revalidatePath } from 'next/cache'

export async function rerunAuditAction(formData: FormData) {
  const auditId = formData.get('auditId') as string
  
  try {
    await createAuditRerun(auditId)
    // Revalidate the current page to refresh the data
    revalidatePath('/')
  } catch (error) {
    console.error('Error re-running audit:', error)
    throw error
  }
}
