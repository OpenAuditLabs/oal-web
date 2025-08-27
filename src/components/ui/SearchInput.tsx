"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export default function SearchInput({
  placeholder = "Search",
  onSearch,
  className = ""
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background w-full"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  );
}
