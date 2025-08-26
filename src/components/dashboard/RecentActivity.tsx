'use client'

import { useEffect, useState } from 'react'
import type { ActivityData } from '@/actions/activities'
import { getRecentActivities } from '@/actions/activities'
import { formatActivityStatus, formatFileInfo } from '@/lib/activity-utils'

// Helper function to get progress bar color based on status
const getProgressBarColor = (status: ActivityData['status']): string => {
  switch (status) {
    case 'FAILED':
      return 'bg-red-500'
    case 'IN_PROGRESS':
    case 'COMPLETED':
    case 'QUEUED':
    default:
      return 'bg-primary'
  }
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivities(5)
        setActivities(data)
      } catch (error) {
        console.error('Error fetching activities:', error)
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return (
      <div className="bg-secondary rounded-xl p-8">
        <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading activities...</p>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="bg-secondary rounded-xl p-8">
        <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recent activities found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-secondary rounded-xl p-8">
      <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-card p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{activity.title}</h4>
              <span className="text-sm text-muted-foreground">
                {formatActivityStatus(activity.status)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {formatFileInfo(activity.fileCount, activity.fileSize)}
              </span>
              {activity.progress !== null && (
                <span className="text-sm text-muted-foreground">{activity.progress}%</span>
              )}
            </div>
            {activity.progress !== null && (
              <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                <div 
                  className={`${getProgressBarColor(activity.status)} h-1.5 rounded-full`}
                  style={{ width: `${activity.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
