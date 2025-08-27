'use server'

import { prisma } from '@/lib/prisma'
import { AuditStatus, SeverityLevel } from '@prisma/client'

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
}

// Get paginated audit history (Past Audits page)
export async function getAuditHistory({ 
  page = 1, 
  limit = 20,
  search = ''
}: PaginationParams = {}) {
  try {
    const skip = (page - 1) * limit

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

    // Combine filters
    const whereClause = {
      status: {
        in: [AuditStatus.COMPLETED, AuditStatus.FAILED]
      },
      ...searchFilter
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
        take: limit,
      }),
      prisma.audit.count({
        where: whereClause
      })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
      audits: audits as AuditHistoryItem[],
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
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

    // Create a new activity for the re-run
    const activity = await prisma.activity.create({
      data: {
        title: originalAudit.projectName,
        fileCount: originalAudit.project.fileCount,
        fileSize: originalAudit.size,
        status: 'QUEUED',
        progress: null,
      }
    })

    return {
      activityId: activity.id,
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
