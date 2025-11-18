import type { AuditWithProject } from '@/actions/audits/getAuditList/logic'
import { useState } from 'react'
import type { AuditWithProject } from '@/actions/audits/getAuditList/logic'
import { FileText, Clock, Timer as TimerIcon, Copy } from 'lucide-react'
import { formatShortDate } from '@/lib/utils'
import { ActiveScanBadge } from './ActiveScanBadge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'

export interface AuditDetailCardProps {
  audit: AuditWithProject
}

export function AuditDetailCard({ audit }: AuditDetailCardProps) {
  const [isCopying, setIsCopying] = useState(false)
  const isRunning = audit.status === 'RUNNING'
  const progress = Math.max(0, Math.min(100, Number(audit.progress ?? 0)))

  const progressTrack = 'bg-accent'
  const progressBar = isRunning ? 'bg-primary' : ''
  const noteBg = isRunning ? 'bg-accent/20 border-primary border' : 'bg-queue/20 border border-queue'
  const noteText = isRunning ? 'Analyzing security vulnerabilities and threat patterns...' : 'Queued for analysis...'

  const displayTitle = audit.project?.name
  const displaySubtitle = (isRunning ? 'scanning files…' : 'in queue')

  const durationText = isRunning
    ? 'calculating...' // Duration calculation will be handled elsewhere or simplified
    : 'n/a'

  const handleCopy = async () => {
    setIsCopying(true)
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(audit.id)
        toast.success('Audit ID copied!', {
          description: 'The audit ID has been copied to your clipboard.',
        })
      } else {
        throw new Error('Clipboard API not supported')
      }
    } catch (error) {
      console.error('Failed to copy audit ID:', error)
      toast.error('Failed to copy Audit ID', {
        description: 'Please try again or copy manually.',
      })
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold leading-tight">{displayTitle}</h3>
              {isRunning && <ActiveScanBadge count={1} />} {/* Render badge for running audits */}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{displaySubtitle}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-muted-foreground">Audit ID: {audit.id}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      aria-label="Copy Audit ID"
                      onClick={handleCopy}
                      disabled={isCopying}
                    >
                      <Copy className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy Audit ID</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => console.log('View Audit', audit.id)}>View</Button>
            <Button variant="outline" size="sm" onClick={() => console.log('Rerun Audit', audit.id)}>Rerun</Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="size-4" /> <span>Size: {'n/a'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" /> <span>Started: {formatShortDate(audit.createdAt)}</span>
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
