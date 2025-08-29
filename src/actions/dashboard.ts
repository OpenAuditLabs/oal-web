'use server'

import { prisma } from '@/lib/prisma'
import { AuditStatus, ActivityStatus } from '@prisma/client'

export interface DashboardKPI {
  icon: string
  label: string
  value: string
  iconColor: string
  link?: string
}

export async function getDashboardKPIs(): Promise<DashboardKPI[]> {
  try {
    // Get total project count
    const projectCount = await prisma.project.count()

    // Get running audits (activities with IN_PROGRESS status)
    const runningAudits = await prisma.activity.count({
      where: {
        status: ActivityStatus.IN_PROGRESS
      }
    })

    // Get completed audits
    const completedAudits = await prisma.audit.count({
      where: {
        status: AuditStatus.COMPLETED
      }
    })

    // Get total findings from all completed audits
    const totalFindings = await prisma.audit.aggregate({
      _sum: {
        findingsCount: true
      },
      where: {
        status: AuditStatus.COMPLETED
      }
    })

    const kpiData: DashboardKPI[] = [
      {
        icon: "BarChart3",
        label: "Projects",
        value: projectCount.toString(),
        iconColor: "text-black-600",
        link: "?tab=projects"
      },
      {
        icon: "Hourglass",
        label: "Running Audits",
        value: runningAudits.toString(),
        iconColor: "text-black-600",
        link: "/?tab=audits"
      },
      {
        icon: "CheckCircle",
        label: "Completed",
        value: completedAudits.toString(),
        iconColor: "text-black-600",
        link: "?tab=past-audits"
      },
      {
        icon: "ShieldAlert",
        label: "Total Findings",
        value: (totalFindings._sum.findingsCount || 0).toString(),
        iconColor: "text-black-600",
        link: "?tab=past-audits"
      }
    ]

    return kpiData
  } catch (error) {
    console.error('Error fetching dashboard KPIs:', error)
    // Return fallback data in case of error
    return [
      {
        icon: "BarChart3",
        label: "Projects",
        value: "0",
        iconColor: "text-black-600",
        link: "?tab=projects"
      },
      {
        icon: "Hourglass",
        label: "Running Audits",
        value: "0",
        iconColor: "text-black-600",
        link: "?tab=audits"
      },
      {
        icon: "CheckCircle",
        label: "Completed",
        value: "0",
        iconColor: "text-black-600",
        link: "?tab=past-audits"
      },
      {
        icon: "ShieldAlert",
        label: "Total Findings",
        value: "0",
        iconColor: "text-black-600",
        link: "?tab=past-audits"
      }
    ]
  }
}
