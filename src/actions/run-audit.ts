'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createAuditForProject(projectId: string) {
  if (!projectId) throw new Error('projectId is required')
  // Create a new queued audit for project
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) throw new Error('Project not found')

  const audit = await prisma.audit.create({
    data: {
      projectId: project.id,
      projectName: project.name,
      size: '0 bytes',
      status: 'QUEUED',
      fileCount: project.fileCount,
      findingsCount: 0,
    }
  })

  // Revalidate relevant paths
  try {
    revalidatePath('/');
    revalidatePath('/audits');
  } catch (e) {
    // best-effort
    console.warn('Revalidation failed', e)
  }

  return audit
}

export async function runAuditAction(formData: FormData) {
  if (!formData.has('projectId')) throw new Error('Missing projectId')
  const projectId = (formData.get('projectId') as string).trim()
  return createAuditForProject(projectId)
}
