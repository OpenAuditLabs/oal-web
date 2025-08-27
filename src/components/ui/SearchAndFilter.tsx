"use client";

import SearchInput from "@/components/ui/SearchInput";
import FilterDropdown from "@/components/ui/FilterDropdown";

interface FilterOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface SearchAndFilterProps {
  showSearch?: boolean;
  showFilter?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filterOptions?: FilterOption[];
  selectedFilters?: string[];
  onFilterChange?: (values: string[]) => void;
  filterPlaceholder?: string;
}

export default function SearchAndFilter({
  showSearch = true,
  showFilter = true,
  searchPlaceholder = "Search",
  onSearch,
  filterOptions = [],
  selectedFilters = [],
  onFilterChange,
  filterPlaceholder = "Filter"
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
      
      {showFilter && filterOptions.length > 0 && (
        <FilterDropdown
          options={filterOptions}
          selectedValues={selectedFilters}
          onFilterChange={onFilterChange || (() => {})}
          placeholder={filterPlaceholder}
        />
      )}
    </div>
  );
}
