import { BarChart3, Hourglass, CheckCircle, Shield } from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";

export default function KPIGrid() {
  const stats = [
    {
      icon: BarChart3,
      label: "Projects",
      value: "4",
      iconColor: "text-black-600"
    },
    {
      icon: Hourglass,
      label: "Running Audits",
      value: "1",
      iconColor: "text-black-600"
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: "2",
      iconColor: "text-black-600"
    },
    {
      icon: Shield,
      label: "Total Findings",
      value: "8",
      iconColor: "text-black-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}
