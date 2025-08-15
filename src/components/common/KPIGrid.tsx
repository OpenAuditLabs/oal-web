import { BarChart3, Hourglass, CheckCircle, ShieldAlert ,CircleX} from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";

interface KPIData {
  icon: string;
  label: string;
  value: string;
  iconColor: string;
}

interface KPIGridProps {
  kpiData: KPIData[];
}

export default function KPIGrid({ kpiData }: KPIGridProps) {
  const iconMap = {
    BarChart3,
    Hourglass,
    CheckCircle,
    ShieldAlert,
    CircleX
  };

  const stats = kpiData.map(item => ({
    ...item,
    icon: iconMap[item.icon as keyof typeof iconMap]
  }));

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
