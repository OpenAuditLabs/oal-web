import type { AuditWithProject } from '@/actions/audits/getAuditList/logic'
import { FileText, Clock, Timer as TimerIcon } from 'lucide-react'
import { DateTime } from 'luxon'

export interface AuditDetailCardProps {
  audit: AuditWithProject
}

export function AuditDetailCard({ audit }: AuditDetailCardProps) {
  const isRunning = audit.status === 'RUNNING'
  const progress = Math.max(0, Math.min(100, Number(audit.progress ?? 0)))

  const progressTrack = 'bg-accent'
  const progressBar = isRunning ? 'bg-primary' : ''
  const noteBg = isRunning ? 'bg-accent/20 border-primary border' : 'bg-queue/20 border border-queue'
  const noteText = isRunning ? 'Analyzing security vulnerabilities and threat patterns...' : 'Queued for analysis...'

  const displayTitle = audit.project?.name
  const displaySubtitle = (isRunning ? 'scanning files…' : 'in queue')
  // Parse dates from database (ISO strings or JS Date)
  const started = typeof audit.createdAt === 'string'
    ? DateTime.fromISO(audit.createdAt, { zone: 'utc' })
    : DateTime.fromJSDate(audit.createdAt, { zone: 'utc' })
  const now = DateTime.now().setZone('utc')

  // Calculate duration using Luxon Duration
  const rawDuration = now.diff(started, ['hours', 'minutes'])
  // Round up minutes to nearest integer
  const hours = Math.floor(rawDuration.as('hours'))
  const minutes = Math.ceil(rawDuration.minutes)
  const durationText = isRunning
    ? `${hours > 0 ? hours + 'h ' : ''}${minutes}m`
    : 'n/a'

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{displayTitle}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{displaySubtitle}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="size-4" /> <span>Size: {'n/a'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" /> <span>Started: {started.isValid ? started.toLocaleString(DateTime.DATETIME_MED) : 'n/a'}</span>
          </div>
          <div className="flex items-center gap-2">
            <TimerIcon className="size-4" /> <span>Duration: {durationText}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Analysis Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <div className={`h-2 w-full rounded-full ${progressTrack}`}>
            <div
              className={`h-2 rounded-full ${progressBar}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={`mt-4 rounded-md ${noteBg} text-sm px-4 py-3`}>{noteText}</div>
        </div>
      </div>
    </div>
  )
}
