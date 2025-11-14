"use client"

import { useState } from 'react'
import { DashboardStatsGrid } from './components/DashboardStatsGrid'
import { Skeleton } from '@/components/ui/skeleton'
import { BasicSelect } from '@/components/common/BasicSelect'

export interface DashboardContainerProps {
}

export function DashboardContainer({}: DashboardContainerProps) {
  const [timeframe, setTimeframe] = useState('all')

  const timeframeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '24h', label: 'Last 24 Hours' },
  ]

  return (
    <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Monitor real-time security analysis and threat detection</p>
            </div>
            <BasicSelect
              items={timeframeOptions}
              value={timeframe}
              onChange={setTimeframe}
              placeholder="Select timeframe"
              className="w-[180px]"
            />
          </div>
        <div className="space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
            </div>
          ) : (
            <DashboardStatsGrid timeframe={timeframe} />
          )}
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Skeleton className="col-span-4 h-[350px]" />
              <Skeleton className="col-span-3 h-[350px]" />
            </div>
          ) : (
            <>
              {/* Main cards content will go here */}
            </>
          )}
        </div>
    </div>
  )
}
