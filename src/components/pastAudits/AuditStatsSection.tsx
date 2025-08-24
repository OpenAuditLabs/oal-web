'use client';

import KPIGrid from '@/components/common/KPIGrid';
import { useAuditStats } from '@/hooks/useAuditStats';

export default function AuditStatsSection() {
  const { kpiData, loading, error } = useAuditStats();

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

  return <KPIGrid kpiData={kpiData} />;
}
