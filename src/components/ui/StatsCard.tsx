import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  link?: string;
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
  link
}: StatsCardProps) {
  const cardContent = (
    <div className="bg-card p-6 rounded-lg shadow-sm transition-transform duration-150 hover:scale-105 hover:shadow-md cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg">
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
  return link ? (
    <a href={link} className="block" tabIndex={0} aria-label={label}>
      {cardContent}
    </a>
  ) : cardContent;
}
