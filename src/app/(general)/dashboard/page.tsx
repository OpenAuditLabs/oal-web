import { DashboardContainer } from '@/components/pages/dashboard/DashboardContainer'
import { safeAwait } from '@/lib/async'
import { getProjectCountForUser } from '@/actions/projects/getCount/logic'
import { getRunningAuditCountForUser } from '@/actions/audits/getRunningCount/logic'
import { getCompletedAuditCountForUser } from '@/actions/audits/getCompletedCount/logic'
import { BasicAlert } from '@/components/common/BasicAlert'
import { DashboardErrorToast } from '@/components/pages/dashboard/DashboardErrorToast'
import { getSession } from '@/lib/session'

export default async function DashboardPage() {
  const session = await getSession()
  const userId = session.user?.id

  if (!userId) {
    return <div className='p-10'><BasicAlert variant='destructive' title='Not authenticated' description='Please sign in to view your dashboard.' /></div>
  }

  const [errP, resP] = await safeAwait(getProjectCountForUser(userId))
  const projectCount: number | null = resP?.success ? resP.data : null
  const hadErrP = Boolean(errP) || (resP ? !resP.success : false)

  const [errR, resR] = await safeAwait(getRunningAuditCountForUser(userId))
  const runningCount: number | null = resR?.success ? resR.data : null
  const hadErrR = Boolean(errR) || (resR ? !resR.success : false)

  const [errC, resC] = await safeAwait(getCompletedAuditCountForUser(userId))
  const completedCount: number | null = resC?.success ? resC.data : null
  const hadErrC = Boolean(errC) || (resC ? !resC.success : false)

  const showErrorToast = hadErrP || hadErrR || hadErrC

  return (
    <>
      {/* Trigger a one-time client toast if any fetch failed */}
      <DashboardErrorToast show={showErrorToast} />

      <DashboardContainer
        projectCount={projectCount}
        runningCount={runningCount}
        completedCount={completedCount}
      />
    </>
  )
}
