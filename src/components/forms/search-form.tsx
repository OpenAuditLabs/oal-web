"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";

interface SearchFormProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchForm({
  onSearch,
  placeholder = "Search...",
}: SearchFormProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // console.log("User has searched:", query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-2xl mx-auto   items-center gap-2 p-4 "
    >
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" variant="default">
        Search
      </Button>
    </form>
  );
}
