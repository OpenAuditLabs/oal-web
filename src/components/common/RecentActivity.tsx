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
    <div className="bg-gray-50 rounded-xl p-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">{activity.title}</h4>
              <span className="text-sm text-gray-600">{activity.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{activity.details}</span>
              {activity.progress && (
                <span className="text-sm text-gray-600">{activity.progress}</span>
              )}
            </div>
            {activity.progress && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-gray-600 h-1.5 rounded-full" 
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
