import React, { useState, useEffect } from 'react'
import { StatsCard } from '@/components/common/StatsCard'
import { FolderKanban, Timer, CheckCircle2, ShieldAlert } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { getProjectCountAction } from '@/actions/projects/getCount/action'
import { getRunningAuditCountAction } from '@/actions/audits/getRunningCount/action'
import { getCompletedAuditCountAction } from '@/actions/audits/getCompletedCount/action'
import { getTotalFindingsAction } from '@/actions/audits/getTotalFindings/action'
import { Skeleton } from '@/components/ui/skeleton'

export interface DashboardStatsGridProps {
  timeframe: string
}

export const DashboardStatsGrid = React.memo(function DashboardStatsGrid({ timeframe }: DashboardStatsGridProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [projectCount, setProjectCount] = useState<number | null>(null)
  const [runningCount, setRunningCount] = useState<number | null>(null)
  const [completedCount, setCompletedCount] = useState<number | null>(null)
  const [totalFindings, setTotalFindings] = useState<number | null>(null)
  const [projectCountDelta, setProjectCountDelta] = useState<number | null>(null)
  const [runningCountDelta, setRunningCountDelta] = useState<number | null>(null)
  const [completedCountDelta, setCompletedCountDelta] = useState<number | null>(null)
  const [totalFindingsDelta, setTotalFindingsDelta] = useState<number | null>(null)
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
      setError(null)
      try {
        const [projectRes, runningRes, completedRes, totalFindingsRes] = await Promise.all([
          getProjectCountAction(userId, timeframe),
          getRunningAuditCountAction(userId, timeframe),
          getCompletedAuditCountAction(userId, timeframe),
          getTotalFindingsAction(userId, timeframe),
        ])

        if (!signal.aborted) {
          setProjectCount(projectRes.current)
          setRunningCount(runningRes.current)
          setCompletedCount(completedRes.current)
          setTotalFindings(totalFindingsRes.current)

          setProjectCountDelta(projectRes.current - projectRes.previous)
          setRunningCountDelta(runningRes.current - runningRes.previous)
          setCompletedCountDelta(completedRes.current - completedRes.previous)
          setTotalFindingsDelta(totalFindingsRes.current - totalFindingsRes.previous)
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

  const getTrend = (delta: number | null) => {
    if (delta === null) return 'neutral' // Or handle as loading state
    if (delta > 0) return 'up'
    if (delta < 0) return 'down'
    return 'neutral'
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {error && <div className="col-span-full text-destructive">{error}</div>}
      {loading ? (
        <>
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </>
      ) : (
        <>
          <StatsCard
            label="Projects"
            value={projectCount !== null ? projectCount : 0}
            icon={<FolderKanban className="size-6" />}
            trend={getTrend(projectCountDelta)}
            delta={projectCountDelta !== null ? projectCountDelta : 0}
          />
          <StatsCard
            label="Running Audits"
            value={runningCount !== null ? runningCount : 0}
            icon={<Timer className="size-6" />}
            trend={getTrend(runningCountDelta)}
            delta={runningCountDelta !== null ? runningCountDelta : 0}
          />
          <StatsCard
            label="Completed"
            value={completedCount !== null ? completedCount : 0}
            icon={<CheckCircle2 className="size-6" />}
            trend={getTrend(completedCountDelta)}
            delta={completedCountDelta !== null ? completedCountDelta : 0}
          />
          <StatsCard
            label="Total Findings"
            value={totalFindings !== null ? totalFindings : 0}
            icon={<ShieldAlert className="size-6" />}
            trend={getTrend(totalFindingsDelta)}
            delta={totalFindingsDelta !== null ? totalFindingsDelta : 0}
          />
        </>
      )}
    </div>
  )
})
