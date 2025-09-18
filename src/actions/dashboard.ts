'use server'

import { prisma } from '@/lib/prisma'
import { AuditStatus } from '@prisma/client'
import { requireAuthUser } from '@/lib/auth-user'

export interface DashboardKPI {
  icon: string
  label: string
  value: string
  iconColor: string
  link?: string
}

export async function getDashboardKPIs(): Promise<DashboardKPI[]> {
  try {
  const user = await requireAuthUser();
  // Get total project count (owned by user)
  const projectCount = await prisma.project.count({ where: { ownerId: user.id } })

    // Get running audits (audits with IN_PROGRESS status)
    const runningAudits = await prisma.audit.count({ where: { status: AuditStatus.IN_PROGRESS, project: { ownerId: user.id } } })

    // Get completed audits
    const completedAudits = await prisma.audit.count({ where: { status: AuditStatus.COMPLETED, project: { ownerId: user.id } } })

    // Get total findings from all completed audits
    const totalFindings = await prisma.audit.aggregate({
      _sum: { findingsCount: true },
      where: { status: AuditStatus.COMPLETED, project: { ownerId: user.id } }
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
