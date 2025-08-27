"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, CheckCircle, CircleX } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedValues: string[];
  onFilterChange: (values: string[]) => void;
  placeholder?: string;
}

export default function FilterDropdown({
  options,
  selectedValues,
  onFilterChange,
  placeholder = "Filter"
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    onFilterChange(newValues);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center gap-2 p-2 border border-border rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="w-4 h-4 text-muted-foreground" />
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-17 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="py-1">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-secondary cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleOptionToggle(option.value)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="text-foreground text-xs">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
