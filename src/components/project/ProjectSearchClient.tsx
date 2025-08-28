"use client";

import React, { useState, createContext, useContext } from "react";
import SearchAndFilter from "@/components/ui/SearchAndFilter";
import ProjectsClient from "@/components/project/ProjectsClient";

interface Project {
  id: string;
  name: string;
  description: string | null;
  fileCount: number;
  createdAt: string | Date;
  auditCount: number;
  _count: { audits: number };
}

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
      searchPlaceholder="Search projects..."
      onSearch={ctx.setSearchTerm}
      showFilter={true}
      filterOptions={[]}
    />
  );
}

export function SearchableProjectsList({ projects }: { projects: Project[] }) {
  const ctx = useContext(SearchContext);
  const searchTerm = ctx?.searchTerm?.toLowerCase() || "";
  const filtered = searchTerm
    ? projects.filter(project => project.name.toLowerCase().includes(searchTerm))
    : projects;
  return <ProjectsClient projects={filtered} />;
}
