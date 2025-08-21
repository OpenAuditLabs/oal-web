'use server'

import { prisma } from '@/lib/prisma'

// Get all projects
export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: {
            audits: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return projects.map(project => ({
      ...project,
      auditCount: project._count.audits
    }))
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw new Error('Failed to fetch projects')
  }
}

// Get project by ID with audit history
export async function getProjectWithAudits(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      include: {
        audits: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!project) {
      throw new Error('Project not found')
    }

    return project
  } catch (error) {
    console.error('Error fetching project with audits:', error)
    throw new Error('Failed to fetch project with audits')
  }
}

// Create a new project
export async function createProject(data: {
  name: string
  description?: string
  fileCount: number
}) {
  try {
    const project = await prisma.project.create({
      data
    })

    return project
  } catch (error) {
    console.error('Error creating project:', error)
    throw new Error('Failed to create project')
  }
}
