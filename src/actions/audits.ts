'use server'

import { prisma } from '@/lib/prisma'
import { requireAuthUser } from '@/lib/auth-user'
import { AuditStatus, SeverityLevel, Prisma } from '@prisma/client'

// Types for the audit history
export interface AuditHistoryItem {
  id: string
  projectName: string
  size: string
  status: AuditStatus
  overallSeverity: SeverityLevel | null
  findingsCount: number
  duration: string | null
  completedAt: Date | null
  createdAt: Date
}

// Pagination and search parameters
interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  status?: string[] // Array of status values to filter by
  severity?: string[] // Array of severity levels to filter by
}

// Get paginated audit history (Past Audits page)
export interface AuditHistoryResult {
  audits: AuditHistoryItem[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export async function getAuditHistory({ 
  page = 1, 
  limit = 20,
  search = '',
  status = [],
  severity = []
}: PaginationParams = {}): Promise<AuditHistoryResult> {
  try {
    const user = await requireAuthUser();
    // Define maximum limit to prevent excessive queries
    const MAX_LIMIT = 100;
    
    // Validate and sanitize inputs
    const safePage = Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1);
    const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Number.isFinite(limit) ? Math.floor(limit) : 20));
    const skip = (safePage - 1) * safeLimit;

    // Build search filter
    const searchFilter = search.trim() ? {
      OR: [
        {
          projectName: {
            contains: search,
            mode: 'insensitive' as const
          }
        },
        {
          project: {
            name: {
              contains: search,
              mode: 'insensitive' as const
            }
          }
        }
      ]
    } : {}

    // Build status filter with proper validation
    // Default to showing both COMPLETED and FAILED audits
    let statusFilter: AuditStatus[] = [AuditStatus.COMPLETED, AuditStatus.FAILED];
    
    if (status.length > 0) {
      // Normalize and validate each status string against AuditStatus enum
      const validStatuses: AuditStatus[] = [];
      
      for (const statusStr of status) {
        // Normalize input: trim whitespace and convert to uppercase
        const normalizedStatus = statusStr.trim().toUpperCase();
        
        // Validate against AuditStatus enum values
        if (Object.values(AuditStatus).includes(normalizedStatus as AuditStatus)) {
          validStatuses.push(normalizedStatus as AuditStatus);
        } else {
          // Log warning for invalid status but continue processing other valid ones
          console.warn(`Invalid audit status ignored: "${statusStr}" (normalized: "${normalizedStatus}"). Valid options: ${Object.values(AuditStatus).join(', ')}`);
        }
      }
      
      // Use validated statuses if any are valid, otherwise keep default behavior
      if (validStatuses.length > 0) {
        statusFilter = validStatuses;
      }
      // If no valid statuses were found, statusFilter remains the default
    }

    // Build severity filter validation
    let severityFilter: SeverityLevel[] | undefined = undefined;
    if (severity.length > 0) {
      const validSeverities: SeverityLevel[] = [];
      for (const sev of severity) {
        const normalized = sev.trim().toUpperCase();
        if (Object.values(SeverityLevel).includes(normalized as SeverityLevel)) {
          validSeverities.push(normalized as SeverityLevel);
        } else {
          console.warn(`Invalid severity ignored: "${sev}" (normalized: "${normalized}")`);
        }
      }
      if (validSeverities.length > 0) {
        severityFilter = validSeverities;
      }
    }

    // Combine filters
    let whereClause: Prisma.AuditWhereInput = {
      status: { in: statusFilter },
      ...(searchFilter as Prisma.AuditWhereInput)
    }
    if (severityFilter) {
      whereClause = {
        ...whereClause,
        overallSeverity: { in: severityFilter }
      }
    }

    // Get audits with pagination and search
    const [audits, totalCount] = await Promise.all([
      prisma.audit.findMany({
        where: { ...whereClause, project: { ownerId: user.id } },
        select: {
          id: true,
          projectName: true,
          size: true,
          status: true,
          overallSeverity: true,
          findingsCount: true,
          duration: true,
          completedAt: true,
          createdAt: true,
        },
        orderBy: {
          completedAt: 'desc'
        },
        skip,
        take: safeLimit,
      }),
      prisma.audit.count({
        where: { ...whereClause, project: { ownerId: user.id } }
      })
    ])

    const totalPages = Math.ceil(totalCount / safeLimit)

    return {
      audits: audits as AuditHistoryItem[],
      pagination: {
        currentPage: safePage,
        totalPages,
        totalCount,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      }
    }
  } catch (error: unknown) {
    console.error('Error fetching audit history:', error)
    throw new Error('Failed to fetch audit history')
  }
}

// Get detailed audit report with findings (including file relation for path/name)
export type AuditReportWithRelations = Prisma.AuditGetPayload<{
  include: {
    project: true
    findings: {
      include: {
        file: { select: { name: true; path: true } }
      }
    }
  }
}>

export async function getAuditReport(auditId: string): Promise<AuditReportWithRelations> {
  try {
    const user = await requireAuthUser();
    const audit = await prisma.audit.findFirst({
      where: { id: auditId, project: { ownerId: user.id } },
      include: {
        project: true,
        findings: {
          include: {
            file: { select: { name: true, path: true } }
          },
          orderBy: [
            { severity: 'desc' }, // CRITICAL, HIGH, MEDIUM, LOW
            { createdAt: 'desc' }
          ]
        }
      }
    })

    if (!audit) {
      throw new Error('Audit not found')
    }

    return audit
  } catch (error: unknown) {
    console.error('Error fetching audit report:', error)
    throw new Error('Failed to fetch audit report')
  }
}

// Create a new audit (for re-run functionality)
export async function createAuditRerun(originalAuditId: string) {
  try {
    const user = await requireAuthUser();
    const result = await prisma.$transaction(async (tx) => {
      const originalAudit = await tx.audit.findUnique({
        where: { id: originalAuditId },
        include: { project: true }
      })

      if (!originalAudit) {
        throw new Error('Original audit not found')
      }

  if (originalAudit.project.ownerId !== user.id) throw new Error('Not authorized');
  // Remove existing findings for this audit to reset state
      await tx.finding.deleteMany({ where: { auditId: originalAuditId } })

      // Move the existing audit back to active by updating its status and clearing completion fields
      const updated = await tx.audit.update({
        where: { id: originalAuditId },
        data: {
          status: 'QUEUED',
          progress: null,
          findingsCount: 0,
          overallSeverity: null,
          duration: null,
          completedAt: null,
          createdAt: new Date(),
          fileCount: originalAudit.project.fileCount,
        }
      })

      return updated
    })

    return {
      auditId: result.id,
      message: 'Audit re-run has been queued successfully'
    }
  } catch (error: unknown) {
    console.error('Error creating audit re-run:', error)
    throw new Error('Failed to create audit re-run')
  }
}

// Get audit statistics for dashboard
export async function getAuditStatistics() {
  try {
    const user = await requireAuthUser();
    const [
      totalAudits,
      completedAudits,
      failedAudits,
      recentAudits,
      totalFindings,
      severityStats
    ] = await Promise.all([
      // Total audits
      prisma.audit.count({ where: { project: { ownerId: user.id } } }),
      
      // Completed audits
      prisma.audit.count({ where: { status: 'COMPLETED', project: { ownerId: user.id } } }),
      
      // Failed audits  
      prisma.audit.count({ where: { status: 'FAILED', project: { ownerId: user.id } } }),
      
      // Recent audits (last 30 days)
      prisma.audit.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, project: { ownerId: user.id } } }),
      
      // Total findings across all audits
      prisma.audit.aggregate({
        _sum: {
          findingsCount: true
        }
        , where: { project: { ownerId: user.id } }
      }),
      
      // Severity distribution
      prisma.audit.groupBy({
        by: ['overallSeverity'],
        _count: {
          overallSeverity: true
        },
        where: {
          status: 'COMPLETED',
          overallSeverity: { not: null },
          project: { ownerId: user.id }
        }
      })
    ])

    return {
      total: totalAudits,
      completed: completedAudits,
      failed: failedAudits,
      recent: recentAudits,
      totalFindings: totalFindings._sum.findingsCount || 0,
      severityDistribution: severityStats.reduce((acc, item) => {
        if (item.overallSeverity) {
          acc[item.overallSeverity] = item._count.overallSeverity
        }
        return acc
      }, {} as Record<SeverityLevel, number>)
    }
  } catch (error: unknown) {
    console.error('Error fetching audit statistics:', error)
    throw new Error('Failed to fetch audit statistics')
  }
}

// Get recent audit activity for dashboard
export async function getRecentAuditActivity(limit = 5) {
  try {
    const user = await requireAuthUser();
    const recentAudits = await prisma.audit.findMany({
      where: {
        status: 'COMPLETED',
        project: { ownerId: user.id }
      },
      select: {
        id: true,
        projectName: true,
        overallSeverity: true,
        findingsCount: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: limit,
    })

    return recentAudits
  } catch (error: unknown) {
    console.error('Error fetching recent audit activity:', error)
    throw new Error('Failed to fetch recent audit activity')
  }
}

// Form-action wrappers to enable calling from Client Components via <form action={...}>
export type AuditHistoryActionResult = AuditHistoryResult & { error?: string; requestId?: string }
export type AuditReportState = AuditReportWithRelations | { error: string } | null

export async function getAuditReportAction(formData: FormData): Promise<AuditReportState> {
  try {
    const auditId = (formData.get('auditId') as string | null)?.trim()
    if (!auditId) {
      return { error: 'Missing auditId' }
    }
    const report = await getAuditReport(auditId)
    return report
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch audit report'
    console.error('getAuditReportAction error:', err)
    return { error: message }
  }
}

export async function getAuditHistoryAction(formData: FormData): Promise<AuditHistoryActionResult> {
  try {
    // Basic params
    const pageRaw = formData.get('page') as string | null
    const limitRaw = formData.get('limit') as string | null
    const search = (formData.get('search') as string | null) ?? ''
    const requestId = (formData.get('requestId') as string | null) ?? undefined
    // Multi-value fields
    const status = formData.getAll('status').map(v => String(v))
    const severity = formData.getAll('severity').map(v => String(v))

    const page = pageRaw ? Number(pageRaw) : 1
    const limit = limitRaw ? Number(limitRaw) : 20

  console.debug('[getAuditHistoryAction:in]', { pageRaw, limitRaw, search, requestId, status, severity })
  const result = await getAuditHistory({ page, limit, search, status, severity })
  console.log('[getAuditHistoryAction]', { page, limit, search, status, severity, totalCount: result.pagination.totalCount })
  return { ...result, requestId }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch audit history'
    console.error('getAuditHistoryAction error:', err)
    return {
      audits: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error: message,
      requestId: (formData.get('requestId') as string | null) ?? undefined
    }
  }
}

// Adapters for useFormState (prevState, formData) -> nextState
export async function getAuditReportFormAction(_prevState: AuditReportState, formData: FormData): Promise<AuditReportState> {
  return getAuditReportAction(formData)
}

export async function getAuditHistoryFormAction(_prevState: AuditHistoryActionResult, formData: FormData): Promise<AuditHistoryActionResult> {
  return getAuditHistoryAction(formData)
}
