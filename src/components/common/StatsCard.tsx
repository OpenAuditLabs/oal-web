import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
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
  /** Optional: Indicates the trend of the metric ('up', 'down', 'neutral'). */
  trend?: 'up' | 'down' | 'neutral'
  /** Optional: The numerical delta to display in the tooltip. */
  delta?: number
  className?: string
}

export function StatsCard({ label, value, icon, compact, trend, delta, className }: StatsCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'

  return (
    <Card className={cn('border border-border bg-card/80 backdrop-blur-sm', className)}>
      <CardContent className={cn(
        'flex flex-col gap-4 p-6',
        compact && 'gap-2 p-4' // Reduced vertical and horizontal padding and gap for compact variant
      )}>
        <div className={cn(
          'flex items-center gap-3 text-sm font-medium',
          compact && 'text-xs' // Smaller typography for compact variant
        )}>
          {icon}
          <span>{label}</span>
        </div>
        <div className={cn(
          'flex items-center gap-2 text-3xl font-semibold tabular-nums',
          compact && 'text-xl' // Smaller typography for compact variant
        )}>
          {value}
          {trend && delta !== undefined && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TrendIcon className={cn('size-5', trendColor, compact && 'size-4')} />
                </TooltipTrigger>
                <TooltipContent>
                  {delta > 0 ? `+${delta}` : delta}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
