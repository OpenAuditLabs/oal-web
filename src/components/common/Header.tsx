"use client";

import { Search, Filter } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  showSearch?: boolean;
  showFilter?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
}

export default function Header({
  title,
  subtitle,
  showSearch = true,
  showFilter = true,
  searchPlaceholder = "Search",
  onSearch,
  onFilter
}: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        
        {(showSearch || showFilter) && (
          <div className="flex items-center gap-3">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onChange={(e) => onSearch?.(e.target.value)}
                />
              </div>
            )}
            
            {showFilter && (
              <button 
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={onFilter}
              >
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
