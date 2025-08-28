"use client";

import React, { useState, createContext, useContext } from "react";
import SearchAndFilter from "@/components/ui/SearchAndFilter";
import { AuditsClient } from "@/components/audits/AuditsClient";
import { type AuditCard } from "@/actions/activities";
import { CirclePauseIcon , CirclePlayIcon } from "lucide-react";

// Context for search state
const SearchContext = createContext<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
} | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["active", "queued"]);
  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, selectedFilters, setSelectedFilters }}>
      {children}
    </SearchContext.Provider>
  );
}

export function SearchInput() {
  const ctx = useContext(SearchContext);
  if (!ctx) return null;
  const filterOptions = [
    {
      value: "active",
      label: "",
      icon: <CirclePlayIcon className="w-4 h-4 text-primary" />
    },
    {
      value: "queued",
      label: "",
      icon: <CirclePauseIcon className="w-4 h-4 text-destructive" />
    }
  ];
  return (
    <SearchAndFilter
      searchPlaceholder="Search audits..."
      onSearch={ctx.setSearchTerm}
      showFilter={true}
      filterOptions={filterOptions}
      selectedFilters={ctx.selectedFilters}
      onFilterChange={ctx.setSelectedFilters}
    />
  );
}

export function SearchableActiveAuditList({ initialAudits }: { initialAudits: AuditCard[] }) {
  const ctx = useContext(SearchContext);
  const searchTerm = ctx?.searchTerm || "";
  const selectedFilters = ctx?.selectedFilters || ["active", "queued"];
  return <AuditsClient initialAudits={initialAudits} searchQuery={searchTerm} statusFilter={selectedFilters} />;
}
