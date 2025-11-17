import { safeAwait } from '@/lib/async'
import { BasicAlert } from '@/components/common/BasicAlert'
import { getAuditsForUser } from '@/actions/audits/getAuditList/logic'
import { AuditsContainer } from '@/components/pages/audits/AuditsPageContainer'

interface AuditsDataLoaderProps {
  userId: string;
}

export default async function AuditsDataLoader({ userId }: AuditsDataLoaderProps) {
  const [err, res] = await safeAwait(getAuditsForUser(userId))

  if (err || !res?.success) {
    return (
      <div className='p-10'>
        <BasicAlert
          variant="error"
          title="Error loading audits"
          description="There was a problem fetching your audits. Please try again."
        />
      </div>
    )
  }

  const audits = res.data.audits

  return <AuditsContainer audits={audits} isLoading={false} />
}
