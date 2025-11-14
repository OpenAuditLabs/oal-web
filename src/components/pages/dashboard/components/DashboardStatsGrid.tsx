import React, { useState, useEffect } from 'react'
import { StatsCard } from '@/components/common/StatsCard'
import { FolderKanban, Timer, CheckCircle2, ShieldAlert } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { getProjectCountForUser } from '@/actions/projects/getCount/logic'
import { getRunningAuditCountForUser } from '@/actions/audits/getRunningCount/logic'
import { getCompletedAuditCountForUser } from '@/actions/audits/getCompletedCount/logic'
import { Skeleton } from '@/components/ui/skeleton'

export interface DashboardStatsGridProps {
  timeframe: string
}

export const DashboardStatsGrid = React.memo(function DashboardStatsGrid({ timeframe }: DashboardStatsGridProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [projectCount, setProjectCount] = useState(0)
  const [runningCount, setRunningCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!userId) return

      setLoading(true)
      const [projectRes, runningRes, completedRes] = await Promise.all([
        getProjectCountForUser(userId, timeframe),
        getRunningAuditCountForUser(userId, timeframe),
        getCompletedAuditCountForUser(userId, timeframe),
      ])

      if (projectRes.success) {
        setProjectCount(projectRes.data)
      }
      if (runningRes.success) {
        setRunningCount(runningRes.data)
      }
      if (completedRes.success) {
        setCompletedCount(completedRes.data)
      }
      setLoading(false)
    }

    fetchData()
  }, [userId, timeframe])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
      <StatsCard label="Projects" value={projectCount} icon={<FolderKanban className="size-6" />} />
      <StatsCard label="Running Audits" value={runningCount} icon={<Timer className="size-6" />} />
      <StatsCard label="Completed" value={completedCount} icon={<CheckCircle2 className="size-6" />} />
      <StatsCard label="Total Findings" value={0} icon={<ShieldAlert className="size-6" />} />
    </div>
  )
})
