import { Suspense } from 'react'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import AuditsDataLoader from '@/components/pages/audits/AuditsDataLoader'
import { AuditsListSkeleton } from '@/components/pages/audits/AuditsListSkeleton'

export default async function AuditsPage() {
  const session = await getSession()
  const userId = session.user?.id

  if (!userId) {
    redirect('/signin')
  }

  return (
    <Suspense fallback={<AuditsListSkeleton />}>
      <AuditsDataLoader userId={userId} />
    </Suspense>
  )
}
