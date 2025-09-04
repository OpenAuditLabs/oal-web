'use client';

import React, { useState, createContext, useContext } from 'react';
import { CheckCircle, CircleX, Flame, AlertTriangle, ShieldHalf, Info } from 'lucide-react';
import SearchAndFilter from '@/components/ui/SearchAndFilter';
import AuditTable from './pastAuditsTable';

// Create a context for search and filter state
export const SearchFilterContext = createContext<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
  toggleFilter: (value: string) => void;
  severityFilters: string[];
  setSeverityFilters: (filters: string[]) => void;
  toggleSeverity: (value: string) => void;
}>({
  searchTerm: '',
  setSearchTerm: () => {},
  selectedFilters: [],
  setSelectedFilters: () => {},
  toggleFilter: () => {},
  severityFilters: [],
  setSeverityFilters: () => {},
  toggleSeverity: () => {}
});

// Search and filter provider component
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [severityFilters, setSeverityFilters] = useState<string[]>([]);

  const toggleFilter = (value: string) => {
    setSelectedFilters(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleSeverity = (value: string) => {
    setSeverityFilters(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <SearchFilterContext.Provider value={{ 
      searchTerm, 
      setSearchTerm, 
      selectedFilters, 
      setSelectedFilters,
      toggleFilter,
      severityFilters,
      setSeverityFilters,
      toggleSeverity
    }}>
      {children}
    </SearchFilterContext.Provider>
  );
}

// Search and filter input component (for header)
export function SearchInput() {
  const { setSearchTerm, selectedFilters, setSelectedFilters, severityFilters, setSeverityFilters } = useContext(SearchFilterContext);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (values: string[]) => {
    setSelectedFilters(values.filter(v => v === 'COMPLETED' || v === 'FAILED' || v === 'completed' || v === 'failed'));
    // Extract severity tags (prefixed with sev:)
    const sev = values.filter(v => v.startsWith('sev:')).map(v => v.replace('sev:', '').toUpperCase());
    setSeverityFilters(sev);
  };

  const filterOptions = [
    // Status filters
    { value: 'completed', label: 'Completed', icon: <CheckCircle className="w-4 h-4 text-primary" /> },
    { value: 'failed', label: 'Failed', icon: <CircleX className="w-4 h-4 text-destructive" /> },
    // Severity filters (prefixed to distinguish)
    { value: 'sev:CRITICAL', label: 'Critical', icon: <Flame className="w-4 h-4 text-red-600" /> },
    { value: 'sev:HIGH', label: 'High', icon: <AlertTriangle className="w-4 h-4 text-orange-500" /> },
    { value: 'sev:MEDIUM', label: 'Medium', icon: <ShieldHalf className="w-4 h-4 text-yellow-500" /> },
    { value: 'sev:LOW', label: 'Low', icon: <Info className="w-4 h-4 text-blue-500" /> }
  ];

  return (
    <SearchAndFilter
      searchPlaceholder="Search audits..."
      onSearch={handleSearch}
      filterOptions={filterOptions}
  selectedFilters={[...selectedFilters, ...severityFilters.map(s => `sev:${s}`)]}
      onFilterChange={handleFilterChange}
    />
  );
}

// Searchable audit table component
export function SearchableAuditTable() {
  const { searchTerm, selectedFilters, severityFilters } = useContext(SearchFilterContext);
  return <AuditTable searchQuery={searchTerm} statusFilter={selectedFilters} severityFilter={severityFilters} />;
}
