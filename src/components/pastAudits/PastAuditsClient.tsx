'use client';

import React, { useState, createContext, useContext } from 'react';
import SearchAndFilter from '@/components/ui/SearchAndFilter';
import AuditTable from './pastAuditsTable';

// Create a context for search term
const SearchContext = createContext<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}>({
  searchTerm: '',
  setSearchTerm: () => {}
});

// Search provider component
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
}

// Search input component (for header)
export function SearchInput() {
  const { setSearchTerm } = useContext(SearchContext);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <SearchAndFilter
      searchPlaceholder="Search audits..."
      onSearch={handleSearch}
    />
  );
}

// Searchable audit table component
export function SearchableAuditTable() {
  const { searchTerm } = useContext(SearchContext);

  return <AuditTable searchQuery={searchTerm} />;
}
