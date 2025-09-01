'use client';

import { useAuditStats } from '@/hooks/useAuditStats';
import { useContext } from 'react';
import { SearchFilterContext } from './PastAuditsClient';
import StatsCard from '@/components/ui/StatsCard';
import { BarChart3, Hourglass, CheckCircle, ShieldAlert, CircleX } from 'lucide-react';

export default function AuditStatsSection() {
  const { kpiData, loading, error } = useAuditStats();
  const ctx = useContext(SearchFilterContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  const handleCardClick = (label: string) => {
    if (!ctx) return;
    if (label === 'Completed') ctx.toggleFilter('completed');
    if (label === 'Failed') ctx.toggleFilter('failed');
  };

  // Local render to keep KPIGrid unchanged globally while enabling per-card click here
  const iconMap: Record<string, any> = {
    BarChart3,
    Hourglass,
    CheckCircle,
    ShieldAlert,
    CircleX
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((k, i) => {
        const Icon = iconMap[k.icon] || BarChart3;
        const isToggle = k.label === 'Completed' || k.label === 'Failed';
        const filterValue = k.label === 'Completed' ? 'completed' : k.label === 'Failed' ? 'failed' : null;
        const isActive = filterValue ? ctx?.selectedFilters.includes(filterValue) : false;
        return (
          <div
            key={i}
            onClick={isToggle ? () => handleCardClick(k.label) : undefined}
            className={(isToggle ? 'cursor-pointer ' : '') + ' rounded-lg'}
          >
            <StatsCard
              icon={Icon}
              label={k.label}
              value={k.value}
              iconColor={k.iconColor}
              active={isActive}
              activeClassName={k.label === 'Failed' ? 'bg-destructive/10 border border-destructive/30' : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
