import { DashboardContainer } from '@/components/pages/dashboard/DashboardContainer'
import { safeAwait } from '@/lib/async'
import { getProjectCountForUser } from '@/actions/projects/getCount/logic'
import { getRunningAuditCountForUser } from '@/actions/audits/getRunningCount/logic'
import { getCompletedAuditCountForUser } from '@/actions/audits/getCompletedCount/logic'
import { BasicAlert } from '@/components/common/BasicAlert'
import { getSession } from '@/lib/session'

export default async function DashboardPage() {
  const session = await getSession()
  const userId = session.user?.id

  if (!userId) {
    return <BasicAlert variant='destructive' title='Not authenticated' description='Please sign in to view your dashboard.' />
  }

  const [errP, resP] = await safeAwait(getProjectCountForUser(userId))
  if (errP) return <BasicAlert variant='destructive' title='Error loading projects' description={errP.message} />
  if (!resP.success) return <BasicAlert variant='destructive' title='Error loading projects' description={resP.error} />

  const [errR, resR] = await safeAwait(getRunningAuditCountForUser(userId))
  if (errR) return <BasicAlert variant='destructive' title='Error loading running audits' description={errR.message} />
  if (!resR.success) return <BasicAlert variant='destructive' title='Error loading running audits' description={resR.error} />

  const [errC, resC] = await safeAwait(getCompletedAuditCountForUser(userId))
  if (errC) return <BasicAlert variant='destructive' title='Error loading completed audits' description={errC.message} />
  if (!resC.success) return <BasicAlert variant='destructive' title='Error loading completed audits' description={resC.error} />

  return (
    <div className="p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Monitor real-time security analysis and threat detection</p>
      </div>
      <DashboardContainer
        projectCount={resP.data}
        runningCount={resR.data}
        completedCount={resC.data}
      />
    </div>
  )
}
