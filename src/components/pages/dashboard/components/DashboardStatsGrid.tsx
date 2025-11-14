import React, { useState, useEffect } from 'react'
import { StatsCard } from '@/components/common/StatsCard'
import { FolderKanban, Timer, CheckCircle2, ShieldAlert } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { getProjectCountAction } from '@/actions/projects/getCount/action'
import { getRunningAuditCountAction } from '@/actions/audits/getRunningCount/action'
import { getCompletedAuditCountAction } from '@/actions/audits/getCompletedCount/action'
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
  const [totalFindings, setTotalFindings] = useState(0) // New state for Total Findings
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    async function fetchData() {
      if (!userId) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null) // Clear any previous errors
      try {
        const [projectRes, runningRes, completedRes] = await Promise.all([
          getProjectCountAction(userId, timeframe),
          getRunningAuditCountAction(userId, timeframe),
          getCompletedAuditCountAction(userId, timeframe),
        ])

        if (!signal.aborted) {
          setProjectCount(projectRes)
          setRunningCount(runningRes)
          setCompletedCount(completedRes)
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // console.log('Fetch aborted:', error.message)
        } else {
          console.error('Failed to fetch dashboard stats:', error)
          if (!signal.aborted) {
            setError('Failed to load dashboard statistics.')
          }
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      abortController.abort()
    }
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
      {error && <div className="col-span-full text-destructive">{error}</div>}
      <StatsCard label="Projects" value={projectCount} icon={<FolderKanban className="size-6" />} />
      <StatsCard label="Running Audits" value={runningCount} icon={<Timer className="size-6" />} />
      <StatsCard label="Completed" value={completedCount} icon={<CheckCircle2 className="size-6" />} />
      <StatsCard label="Total Findings" value={totalFindings} icon={<ShieldAlert className="size-6" />} />
    </div>
  )
})
