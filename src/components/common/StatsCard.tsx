import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import * as React from 'react'

export interface StatsCardProps {
  label: string
  value: number | string
  icon?: React.ReactNode
  className?: string
}

export function StatsCard({ label, value, icon, className }: StatsCardProps) {
  return (
    <Card className={cn('border border-border bg-card/80 backdrop-blur-sm', className)}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-sm font-medium">
          {icon}
          <span>{label}</span>
        </div>
        <div className="text-3xl font-semibold tabular-nums">
          {value}
        </div>
      </CardContent>
    </Card>
  )
}
