import type { AuditWithProject } from '@/actions/audits/getAuditList/logic'
import { AuditDetailCard } from './components/AuditDetailCard'
import Image from 'next/image'

export interface AuditsContainerProps {
  audits: AuditWithProject[]
}

export function AuditsContainer({ audits }: AuditsContainerProps) {
  const activeCount = audits.filter(a => a.status === 'RUNNING').length
  return (
    <div className="p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Audits</h1>
        <p className="text-sm text-muted-foreground">Monitor real-time security analysis and threat detection</p>
        {activeCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent text-green-900 border border-primary text-base font-medium mt-4">
            <span>{activeCount} Active Scan</span>
            <Image
              src="/icons/scan-alt.svg"
              alt="Queued scans"
              width={20}
              height={20}
              className="rotate-90 text-current"
            />
          </div>
        )}
      </div>
    {audits.length === 0 ? (
      <div className="rounded-md border p-4">
        <p className="text-sm text-muted-foreground">Get started by creating a new audit.</p>
      </div>
    ) : (
      <div className="space-y-8">
        {/* Active Audits */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Audits</h2>
          </div>
          <div className="grid gap-6">
            {audits
              .filter(a => a.status === 'RUNNING')
              .map(a => (
                <AuditDetailCard key={a.id} audit={a} />
              ))}
          </div>
        </section>

        {/* Queued Audits */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Queued Audits</h2>
          </div>
          <div className="grid gap-6">
            {audits
              .filter(a => a.status === 'QUEUED')
              .map(a => (
                <AuditDetailCard key={a.id} audit={a} />
              ))}
          </div>
        </section>
      </div>
    )}
    </div>
  )
}
