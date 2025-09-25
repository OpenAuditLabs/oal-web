import { DashboardStatsGrid } from './components/DashboardStatsGrid'

export interface DashboardContainerProps {
  projectCount: number | null
  runningCount: number | null
  completedCount: number | null
}

export function DashboardContainer({ projectCount, runningCount, completedCount }: DashboardContainerProps) {
  return (
    <div className="space-y-8">
      <DashboardStatsGrid projectCount={projectCount} runningCount={runningCount} completedCount={completedCount} totalFindings={0} />
    </div>
  )
}
