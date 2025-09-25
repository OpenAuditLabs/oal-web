import { DashboardStatsGrid } from './components/DashboardStatsGrid'

export interface DashboardContainerProps {
  projectCount: number | null
  runningCount: number | null
  completedCount: number | null
}

export function DashboardContainer({ projectCount, runningCount, completedCount }: DashboardContainerProps) {
  return (
    <div className="p-10 space-y-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Monitor real-time security analysis and threat detection</p>
          </div>
        <div className="space-y-8">
        <DashboardStatsGrid projectCount={projectCount} runningCount={runningCount} completedCount={completedCount} totalFindings={0} />
        </div>
    </div>
  )
}
