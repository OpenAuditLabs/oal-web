import { DashboardStatsGrid } from './components/DashboardStatsGrid'
import { Skeleton } from '@/components/ui/skeleton'

export interface DashboardContainerProps {
  projectCount: number
  runningCount: number
  completedCount: number
  loading: boolean
}

export function DashboardContainer({ projectCount, runningCount, completedCount, loading }: DashboardContainerProps) {
  return (
    <div className="p-10 space-y-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Monitor real-time security analysis and threat detection</p>
          </div>
        <div className="space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
            </div>
          ) : (
            <DashboardStatsGrid projectCount={projectCount} runningCount={runningCount} completedCount={completedCount} totalFindings={0} />
          )}
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Skeleton className="col-span-4 h-[350px]" />
              <Skeleton className="col-span-3 h-[350px]" />
            </div>
          ) : (
            <>
              {/* Main cards content will go here */}
            </>
          )}
        </div>
    </div>
  )
}
