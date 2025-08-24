'use client';

import React from 'react';
import Header from '@/components/common/Header';
import { AuditStatsSection, AuditTable } from '@/components/pastAudits';

export default function PastAuditsPage() {
  return (
    <div className="flex-1 p-8 space-y-8">
      <Header title="Past Audits" subtitle="Review and manage completed audit history" />
      
      <AuditStatsSection />
      
      <AuditTable />
    </div>
  );
}
