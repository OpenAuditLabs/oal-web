'use client';

import { useEffect, useState } from 'react';
import { getAuditStatistics } from '@/actions/audits';

interface KPIData {
  icon: string;
  label: string;
  value: string;
  iconColor: string;
}

export function useAuditStats() {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const stats = await getAuditStatistics();
        
        if (isMounted) {
          const dynamicKpiData: KPIData[] = [
            {
              icon: "BarChart3",
              label: "Total Audits",
              value: stats.total.toString(),
              iconColor: "text-black-600"
            },
            {
              icon: "CheckCircle",
              label: "Completed",
              value: stats.completed.toString(),
              iconColor: "text-black-600"
            },
            {
              icon: "CircleX",
              label: "Failed",
              value: stats.failed.toString(),
              iconColor: "text-black-600"
            },
            {
              icon: "ShieldAlert",
              label: "Total Findings",
              value: stats.totalFindings.toString(),
              iconColor: "text-black-600"
            }
          ];
          
          setKpiData(dynamicKpiData);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching audit statistics:', err);
        if (isMounted) {
          setError('Failed to load statistics');
          setKpiData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return { kpiData, loading, error };
}
