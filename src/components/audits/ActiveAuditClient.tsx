"use client";

import React, { useState, createContext, useContext } from "react";
import SearchAndFilter from "@/components/ui/SearchAndFilter";
import  AuditsClient from "@/components/audits/AuditsClient";
import { type AuditCard } from "@/actions/activities";

// Context for search state
const SearchContext = createContext<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
} | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
}

export function SearchInput() {
  const ctx = useContext(SearchContext);
  if (!ctx) return null;
  return (
    <SearchAndFilter
      searchPlaceholder="Search audits..."
      onSearch={ctx.setSearchTerm}
      showFilter={true}
      filterOptions={[]}
    />
  );
}

export function SearchableActiveAuditList({ initialAudits }: { initialAudits: AuditCard[] }) {
  const ctx = useContext(SearchContext);
  const searchTerm = ctx?.searchTerm || "";
  return <AuditsClient initialAudits={initialAudits} searchQuery={searchTerm} />;
}
