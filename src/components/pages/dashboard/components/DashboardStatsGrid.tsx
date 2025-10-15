import React from 'react'
import { StatsCard } from '@/components/common/StatsCard'
import { FolderKanban, Timer, CheckCircle2, ShieldAlert } from 'lucide-react'

export interface DashboardStatsGridProps {
  projectCount: number 
  runningCount: number
  completedCount: number
  totalFindings?: number
}

export const DashboardStatsGrid = React.memo(function DashboardStatsGrid({ projectCount, runningCount, completedCount, totalFindings = 0 }: DashboardStatsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard label="Projects" value={projectCount} icon={<FolderKanban className="size-6" />} />
      <StatsCard label="Running Audits" value={runningCount} icon={<Timer className="size-6" />} />
      <StatsCard label="Completed" value={completedCount} icon={<CheckCircle2 className="size-6" />} />
      <StatsCard label="Total Findings" value={totalFindings} icon={<ShieldAlert className="size-6" />} />
    </div>
  )
})
