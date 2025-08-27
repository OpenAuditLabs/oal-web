"use client";

import { Filter } from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";

interface SearchAndFilterProps {
  showSearch?: boolean;
  showFilter?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
}

export default function SearchAndFilter({
  showSearch = true,
  showFilter = true,
  searchPlaceholder = "Search",
  onSearch,
  onFilter
}: SearchAndFilterProps) {
  if (!showSearch && !showFilter) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {showSearch && (
        <SearchInput
          placeholder={searchPlaceholder}
          onSearch={onSearch}
        />
      )}
      
      {showFilter && (
        <button 
          className="p-2 border border-border rounded-lg hover:bg-secondary"
          onClick={onFilter}
        >
          <Filter className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
