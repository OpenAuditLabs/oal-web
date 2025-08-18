export default function RecentActivity() {
  const activities = [
    {
      title: "E-Commerce App",
      details: "42 files - 2.6MB",
      status: "In Progress",
      progress: "69%"
    },
    {
      title: "Transport API",
      details: "42 files - 2.6MB",
      status: "Queued"
    },
    {
      title: "E-Commerce App",
      details: "42 files - 2.6MB",
      status: "In Progress",
      progress: "9%"
    },
    {
      title: "E-Commerce App",
      details: "42 files - 2.6MB",
      status: "In Progress",
      progress: "99%"
    }
  ];

  return (
    <div className="bg-secondary rounded-xl p-8">
      <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="bg-card p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{activity.title}</h4>
              <span className="text-sm text-muted-foreground">{activity.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{activity.details}</span>
              {activity.progress && (
                <span className="text-sm text-muted-foreground">{activity.progress}</span>
              )}
            </div>
            {activity.progress && (
              <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                <div 
                  className="bg-primary h-1.5 rounded-full" 
                  style={{ width: activity.progress }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
