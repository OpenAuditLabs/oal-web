import { DashboardContainer } from '@/components/pages/dashboard/DashboardPageContainer'
import { safeAwait } from '@/lib/async'
import { getProjectCountForUser } from '@/actions/projects/getCount/logic'
import { getRunningAuditCountForUser } from '@/actions/audits/getRunningCount/logic'
import { getCompletedAuditCountForUser } from '@/actions/audits/getCompletedCount/logic'
import { BasicAlert } from '@/components/common/BasicAlert'
import { getSession } from '@/lib/session'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your project and audit statistics on the OpenAuditLabs dashboard.',
}



export default async function DashboardPage() {
  const session = await getSession()
  const userId = session.user?.id

  if (!userId) {
    redirect('/signin')
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
          variant="error"
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
          variant="error"
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
