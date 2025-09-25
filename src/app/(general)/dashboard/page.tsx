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
    return <div className='p-10'><BasicAlert variant='destructive' title='Not authenticated' description='Please sign in to view your dashboard.' /></div>
  }

  const [errAll, results] = await safeAwait(
    Promise.all([
      getProjectCountForUser(userId),
      getRunningAuditCountForUser(userId),
      getCompletedAuditCountForUser(userId)
    ])
  )

  if (errAll || !results) {
    return (<div className='p-10'>
        <BasicAlert
          variant="destructive"
          title="Error loading dashboard"
          description="There was a problem fetching your data. Please try again."
        />
      </div>
    )
  }

  const [resP, resR, resC] = results
  if (!resP.success || !resR.success || !resC.success) {
    return (
      <div className='p-10'>
        <BasicAlert
          variant="destructive"
          title="Error loading dashboard"
          description="There was a problem fetching your data. Please try again."
          />
      </div>
    )
  }

  return (
    <>
      <DashboardContainer
        projectCount={resP.data}
        runningCount={resR.data}
        completedCount={resC.data}
      />
    </>
  )
}
