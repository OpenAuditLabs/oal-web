import { projectCountAction } from '@/actions/projects/count/action'
import { runningAuditCountAction } from '@/actions/audits/running-count/action'
import { completedAuditCountAction } from '@/actions/audits/completed-count/action'
import { StatsCard } from '@/components/common/StatsCard'
import { FolderKanban, Timer, CheckCircle2, ShieldAlert } from 'lucide-react'
import { extractNumber } from '@/lib/action-unwrap'

export async function DashboardStatsGrid() {
  // Invoke server actions (they encapsulate auth + validation). Each returns a SafeActionResult shape.
  const [projectsRes, runningRes, completedRes] = await Promise.all([
    projectCountAction(),
    runningAuditCountAction(),
    completedAuditCountAction(),
  ])

  const projectCount = extractNumber(projectsRes)
  const runningCount = extractNumber(runningRes)
  const completedCount = extractNumber(completedRes)

  const totalFindings = 0

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard label="Projects" value={projectCount ?? '—'} icon={<FolderKanban className="size-6" />} />
      <StatsCard label="Running Audits" value={runningCount ?? '—'} icon={<Timer className="size-6" />} />
      <StatsCard label="Completed" value={completedCount ?? '—'} icon={<CheckCircle2 className="size-6" />} />
      <StatsCard label="Total Findings" value={totalFindings} icon={<ShieldAlert className="size-6" />} />
    </div>
  )
}
