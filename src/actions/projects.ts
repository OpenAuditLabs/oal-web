'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from "next/cache";

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
export async function createProject(formData: FormData) {
  try {
    const rawName = formData.get('name');
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (!name) {
      throw new Error('Project name is required');
    }
    const rawDescription = formData.get('description');
    const description =
      typeof rawDescription === 'string'
        ? (rawDescription.trim() || null)
        : null;
    const rawFileCount = formData.get('fileCount');
    const parsed = typeof rawFileCount === 'string' ? Number(rawFileCount) : 0;
    const fileCount = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    await prisma.project.create({
      data: {
        name,
        description,
        fileCount
      }
    });
    revalidatePath("/projects");
    return void 0;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}

// Update an existing project (name & description only for now)
export async function updateProject(formData: FormData) {
  try {
    const rawId = formData.get('id');
    const id = typeof rawId === 'string' ? rawId.trim() : '';
    if (!id) {
      throw new Error('Project id is required');
    }
    const rawName = formData.get('name');
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (!name) {
      throw new Error('Project name is required');
    }
    const rawDescription = formData.get('description');
    const description = typeof rawDescription === 'string' && rawDescription.trim().length > 0
      ? rawDescription.trim()
      : null;

    await prisma.project.update({
      where: { id },
      data: { name, description }
    });

    // Keep denormalized audit.projectName in sync so past audits reflect the new project name
    try {
      await prisma.audit.updateMany({
        where: { projectId: id },
        data: { projectName: name }
      });
    } catch (syncErr) {
      console.warn('Failed to sync audit.projectName values for project', id, syncErr);
    }

    // Revalidate relevant paths. Root layout to cascade, projects page specifically.
    const pathsToRevalidate = [
      '/',
      '/projects'
    ];
    pathsToRevalidate.forEach(p => {
      try { revalidatePath(p); } catch (e) { console.warn('Failed revalidate', p, e); }
    });
    return void 0;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}
