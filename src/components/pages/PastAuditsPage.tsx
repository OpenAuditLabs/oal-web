import React from 'react';
import Header from '@/components/common/Header';
import { AuditStatsSection } from '@/components/pastAudits';
import { SearchProvider, SearchInput, SearchableAuditTable } from '@/components/pastAudits/PastAuditsClient';

export default async function PastAuditsPage() {
  return (
    <SearchProvider>
      <div className="flex-1 p-8 space-y-8">
        <Header
          title="Past Audits"
          subtitle="Review previously completed security audits and their findings"
        >
          <SearchInput />
        </Header>
        
        <AuditStatsSection />
        
        <SearchableAuditTable />
      </div>
    </SearchProvider>
  );
}
