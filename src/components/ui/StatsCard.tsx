import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  link?: string;
  containerClassName?: string; // override base styling if needed
  active?: boolean; // optional active state
  activeClassName?: string; // override active styling
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
  link,
  containerClassName = "bg-card",
  active = false,
  activeClassName = "bg-primary/10 border border-primary/30"
}: StatsCardProps) {
  const combinedClass = `${containerClassName} ${active ? activeClassName : ''}`.trim();
  const cardContent = (
    <div className={`${combinedClass} p-6 rounded-lg shadow-sm transition-transform duration-150 hover:scale-105 hover:shadow-md cursor-pointer`}>        
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
