import { DashboardStatsGrid } from '@/components/pages/dashboard/DashboardStatsGrid'

export default async function DashboardPage() {
  return (
    <div className="p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Monitor real-time security analysis and threat detection</p>
      </div>
      <DashboardStatsGrid />
    </div>
  )
}
