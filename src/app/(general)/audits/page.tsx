import { safeAwait } from '@/lib/async'
import { BasicAlert } from '@/components/common/BasicAlert'
import { getSession } from '@/lib/session'
import { getAuditsForUser } from '@/actions/audits/getAuditList/logic'
import { AuditsContainer } from '@/components/pages/audits/AuditsPageContainer'
import { redirect } from 'next/navigation'

export default async function AuditsPage() {
  const session = await getSession()
  const userId = session.user?.id

  if (!userId) {
    redirect('/signin')
  }

  const [err, res] = await safeAwait(getAuditsForUser(userId))
  if (err || !res?.success) {
    return (
      <div className='p-10'> 
          <BasicAlert
            variant="destructive"
            title="Error loading audits"
            description="There was a problem fetching your audits. Please try again."
          />
      </div>
    )
  }

  const audits = res.data

  return (
    
  <AuditsContainer audits={audits} />
  )
}
