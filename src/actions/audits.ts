'use server'

import { prisma } from '@/lib/prisma'
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
export async function getAuditHistory({ 
  page = 1, 
  limit = 20,
  search = '',
  status = [],
  severity = []
}: PaginationParams = {}) {
  try {
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
        where: whereClause,
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
        where: whereClause
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
  } catch (error) {
    console.error('Error fetching audit history:', error)
    throw new Error('Failed to fetch audit history')
  }
}

// Get detailed audit report with findings
export async function getAuditReport(auditId: string) {
  try {
    const audit = await prisma.audit.findUnique({
      where: {
        id: auditId
      },
      include: {
        project: true,
        findings: {
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
  } catch (error) {
    console.error('Error fetching audit report:', error)
    throw new Error('Failed to fetch audit report')
  }
}

// Create a new audit (for re-run functionality)
export async function createAuditRerun(originalAuditId: string) {
  try {
    const originalAudit = await prisma.audit.findUnique({
      where: {
        id: originalAuditId
      },
      include: {
        project: true
      }
    })

    if (!originalAudit) {
      throw new Error('Original audit not found')
    }

    // Create a new queued audit (active audit)
    const newAudit = await prisma.audit.create({
      data: {
        projectId: originalAudit.projectId,
        projectName: originalAudit.projectName,
        size: originalAudit.size,
        status: 'QUEUED',
        progress: null,
        fileCount: originalAudit.project.fileCount,
      }
    })

    return {
      auditId: newAudit.id,
      message: 'Audit re-run has been queued successfully'
    }
  } catch (error) {
    console.error('Error creating audit re-run:', error)
    throw new Error('Failed to create audit re-run')
  }
}

// Get audit statistics for dashboard
export async function getAuditStatistics() {
  try {
    const [
      totalAudits,
      completedAudits,
      failedAudits,
      recentAudits,
      totalFindings,
      severityStats
    ] = await Promise.all([
      // Total audits
      prisma.audit.count(),
      
      // Completed audits
      prisma.audit.count({
        where: { status: 'COMPLETED' }
      }),
      
      // Failed audits  
      prisma.audit.count({
        where: { status: 'FAILED' }
      }),
      
      // Recent audits (last 30 days)
      prisma.audit.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Total findings across all audits
      prisma.audit.aggregate({
        _sum: {
          findingsCount: true
        }
      }),
      
      // Severity distribution
      prisma.audit.groupBy({
        by: ['overallSeverity'],
        _count: {
          overallSeverity: true
        },
        where: {
          status: 'COMPLETED',
          overallSeverity: {
            not: null
          }
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
  } catch (error) {
    console.error('Error fetching audit statistics:', error)
    throw new Error('Failed to fetch audit statistics')
  }
}

// Get recent audit activity for dashboard
export async function getRecentAuditActivity(limit = 5) {
  try {
    const recentAudits = await prisma.audit.findMany({
      where: {
        status: 'COMPLETED'
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
  } catch (error) {
    console.error('Error fetching recent audit activity:', error)
    throw new Error('Failed to fetch recent audit activity')
  }
}
