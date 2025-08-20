import { getRecentActivities, formatActivityStatus, formatFileInfo } from '@/actions/activities'

export default async function RecentActivity() {
  // Fetch activities from database
  const activities = await getRecentActivities(4)

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
                  className="bg-primary h-1.5 rounded-full"
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
