'use client';

import React, { useState, createContext, useContext } from 'react';
import { CheckCircle, CircleX } from 'lucide-react';
import SearchAndFilter from '@/components/ui/SearchAndFilter';
import AuditTable from './pastAuditsTable';

// Create a context for search and filter state
export const SearchFilterContext = createContext<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
  toggleFilter: (value: string) => void;
}>({
  searchTerm: '',
  setSearchTerm: () => {},
  selectedFilters: [],
  setSelectedFilters: () => {},
  toggleFilter: () => {}
});

// Search and filter provider component
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (value: string) => {
    setSelectedFilters(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <SearchFilterContext.Provider value={{ 
      searchTerm, 
      setSearchTerm, 
      selectedFilters, 
      setSelectedFilters,
      toggleFilter
    }}>
      {children}
    </SearchFilterContext.Provider>
  );
}

// Search and filter input component (for header)
export function SearchInput() {
  const { setSearchTerm, selectedFilters, setSelectedFilters } = useContext(SearchFilterContext);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (values: string[]) => {
    setSelectedFilters(values);
  };

  const filterOptions = [
    { 
      value: 'completed', 
      label: '',
      icon: <CheckCircle className="w-4 h-4 text-primary" />
    },
    { 
      value: 'failed', 
      label: '',
      icon: <CircleX className="w-4 h-4 text-destructive" />
    }
  ];

  return (
    <SearchAndFilter
      searchPlaceholder="Search audits..."
      onSearch={handleSearch}
      filterOptions={filterOptions}
      selectedFilters={selectedFilters}
      onFilterChange={handleFilterChange}
    />
  );
}

// Searchable audit table component
export function SearchableAuditTable() {
  const { searchTerm, selectedFilters } = useContext(SearchFilterContext);

  return <AuditTable searchQuery={searchTerm} statusFilter={selectedFilters} />;
}
