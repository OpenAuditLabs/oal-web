import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import * as React from 'react'

export interface StatsCardProps {
  /** The label for the stat card. */
  label: string
  /** The value to display in the stat card. */
  value: number | string
  /** Optional: An icon to display on the left side of the label. */
  icon?: React.ReactNode
  /** Optional: Reduces padding and typography for a more compact display. */
  compact?: boolean
  className?: string
}

export function StatsCard({ label, value, icon, compact, className }: StatsCardProps) {
  return (
    <Card className={cn('border border-border bg-card/80 backdrop-blur-sm', className)}>
      <CardContent className={cn(
        'flex flex-col gap-4',
        compact && 'gap-2 p-4' // Reduced padding and gap for compact variant
      )}>
        <div className={cn(
          'flex items-center gap-3 text-sm font-medium',
          compact && 'text-xs' // Smaller typography for compact variant
        )}>
          {icon}
          <span>{label}</span>
        </div>
        <div className={cn(
          'text-3xl font-semibold tabular-nums',
          compact && 'text-xl' // Smaller typography for compact variant
        )}>
          {value}
        </div>
      </CardContent>
    </Card>
  )
}
