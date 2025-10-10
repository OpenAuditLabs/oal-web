import type { AuditWithProject } from '@/actions/audits/getAuditList/logic'
import { AuditDetailCard } from './AuditDetailCard'
import { ActiveScanBadge } from './ActiveScanBadge'

export interface AuditsListProps {
  audits: AuditWithProject[]
}

export function AuditsList({ audits }: AuditsListProps) {
  const activeCount = audits.filter(a => a.status === 'RUNNING').length
  return (
    <div className="p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Audits</h1>
        <p className="text-sm text-muted-foreground">Monitor real-time security analysis and threat detection</p>
        <ActiveScanBadge count={activeCount} />
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
                .map(a => (
                  // Using audit.id as key to prevent React list-key bugs, as it's a stable unique identifier.
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
                  // Using audit.id as key to prevent React list-key bugs, as it's a stable unique identifier.
                  <AuditDetailCard key={a.id} audit={a} />
                ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
