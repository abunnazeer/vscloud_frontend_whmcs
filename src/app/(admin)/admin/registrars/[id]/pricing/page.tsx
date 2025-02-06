// src/app/(admin)/admin/registrars/[id]/pricing/page.tsx
"use client";

import { useState } from "react";
import {
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TLDPricing {
  tld: string;
  register: {
    cost: number;
    price: number;
    margin: number;
  };
  renew: {
    cost: number;
    price: number;
    margin: number;
  };
  transfer: {
    cost: number;
    price: number;
    margin: number;
  };
  minYears: number;
  maxYears: number;
  featured: boolean;
}

const mockPricing: TLDPricing[] = [
  {
    tld: ".com",
    register: { cost: 8.99, price: 12.99, margin: 44.49 },
    renew: { cost: 8.99, price: 13.99, margin: 55.62 },
    transfer: { cost: 8.99, price: 11.99, margin: 33.37 },
    minYears: 1,
    maxYears: 10,
    featured: true,
  },
  {
    tld: ".net",
    register: { cost: 9.99, price: 13.99, margin: 40.04 },
    renew: { cost: 9.99, price: 14.99, margin: 50.05 },
    transfer: { cost: 9.99, price: 12.99, margin: 30.03 },
    minYears: 1,
    maxYears: 10,
    featured: true,
  },
];

export default function TLDPricingPage({ params }: { params: { id: string } }) {
  const [pricing, setPricing] = useState<TLDPricing[]>(mockPricing);
  const [sortField, setSortField] = useState<string>("tld");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getSortedAndFilteredPricing = () => {
    let filtered = pricing;

    if (filter) {
      filtered = pricing.filter(p =>
        p.tld.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      let aValue = a[sortField as keyof TLDPricing];
      let bValue = b[sortField as keyof TLDPricing];

      if (typeof aValue === "object") {
        aValue = (aValue as any).price;
        bValue = (bValue as any).price;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">TLD Pricing</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage domain pricing for all TLDs
        </p>
      </div>

      <div className="flex justify-between">
        <div className="w-64">
          <Input
            placeholder="Filter TLDs..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <Button>
          <ArrowPathIcon className="mr-2 h-5 w-5" />
          Sync Pricing
        </Button>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort("tld")}
                  >
                    <span>TLD</span>
                    {sortField === "tld" &&
                      (sortDirection === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Register
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renew
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getSortedAndFilteredPricing().map(tld => (
                <tr key={tld.tld}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {tld.tld}
                      </span>
                      {tld.featured && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(tld.register.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Cost: {formatCurrency(tld.register.cost)} | Margin:{" "}
                      {formatPercentage(tld.register.margin)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(tld.renew.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Cost: {formatCurrency(tld.renew.cost)} | Margin:{" "}
                      {formatPercentage(tld.renew.margin)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(tld.transfer.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Cost: {formatCurrency(tld.transfer.cost)} | Margin:{" "}
                      {formatPercentage(tld.transfer.margin)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tld.minYears} - {tld.maxYears} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="sm">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
