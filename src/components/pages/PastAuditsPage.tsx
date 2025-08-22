'use client';

import React from 'react';
import Header from '@/components/common/Header';
import KPIGrid from '@/components/common/KPIGrid';
import { AuditTable } from '@/components/pastAudits';
import pastAuditKPI from '@/data/pastAuditKPI.json';

export default function PastAuditsPage() {
  return (
    <div className="flex-1 p-8 space-y-8">
      <Header title="Past Audits" subtitle="Review and manage completed audit history" />
      
      <KPIGrid kpiData={pastAuditKPI} />
      
      <AuditTable />
    </div>
  );
}
