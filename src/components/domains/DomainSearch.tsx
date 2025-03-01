// src/components/domains/DomainSearch.tsx
"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DomainResult {
  name: string;
  available: boolean;
  price?: number;
}

interface DomainSearchProps {
  onDomainSelect?: (domain: DomainResult) => void;
}

export default function DomainSearch({ onDomainSelect }: DomainSearchProps) {
  const [searchDomain, setSearchDomain] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DomainResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock TLDs for domain suggestions
  const tlds = [".com", ".net", ".org", ".io"];

  const handleDomainSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDomain) return;

    setIsSearching(true);
    setShowResults(true);

    try {
      // Mock API call - replace with actual domain availability check
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock results
      const results: DomainResult[] = tlds.map(tld => ({
        name: searchDomain + tld,
        available: Math.random() > 0.5,
        price: Math.floor(Math.random() * 20) + 10,
      }));

      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-medium text-gray-900">Register New Domain</h2>
      <p className="mt-1 text-sm text-gray-500">
        Search for your perfect domain name and check its availability.
      </p>

      <form onSubmit={handleDomainSearch} className="mt-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Find your perfect domain name..."
              value={searchDomain}
              onChange={e => setSearchDomain(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" loading={isSearching}>
            <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>
      </form>

      {/* Search Results */}
      {showResults && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Search Results
          </h3>
          <div className="space-y-4">
            {searchResults.map(result => (
              <div
                key={result.name}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-3">
                  {result.available ? (
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XMarkIcon className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{result.name}</p>
                    {result.available ? (
                      <p className="text-sm text-green-600">Available</p>
                    ) : (
                      <p className="text-sm text-red-600">Taken</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {result.available && (
                    <>
                      <p className="text-lg font-medium text-gray-900">
                        ${result.price}/year
                      </p>
                      <Button
                        size="sm"
                        onClick={() => onDomainSelect?.(result)}
                      >
                        Register
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Domain Suggestions */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Try these alternatives
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {tlds.map(tld => (
                <button
                  key={tld}
                  onClick={() => setSearchDomain(searchDomain + tld)}
                  className="rounded-lg border border-gray-200 p-3 text-center hover:border-blue-500 hover:text-blue-600"
                >
                  {searchDomain || "example"}
                  {tld}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
