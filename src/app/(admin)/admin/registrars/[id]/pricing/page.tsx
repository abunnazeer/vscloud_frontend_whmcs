// src/app/(admin)/admin/registrars/[id]/pricing/page.tsx
"use client";
import React, { useState } from "react";
import TLDPricingFormModal from "@/components/admin/TLDPricingFormModal";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TLDPricing {
  id: string;
  tld: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  annualPrice: number;
  registrarCost: number;
  margin: number;
  status: "active" | "inactive";
  registrarId: string;
  minYears: number;
  maxYears: number;
  featured: boolean;
}

const mockTldPricing: TLDPricing[] = [
  {
    id: "1",
    tld: ".com",
    monthlyPrice: 12.99,
    quarterlyPrice: 35.99,
    annualPrice: 129.99,
    registrarCost: 8.99,
    margin: 44.49,
    status: "active",
    registrarId: "1",
    minYears: 1,
    maxYears: 10,
    featured: true,
  },
  {
    id: "2",
    tld: ".net",
    monthlyPrice: 10.99,
    quarterlyPrice: 29.99,
    annualPrice: 109.99,
    registrarCost: 7.99,
    margin: 37.55,
    status: "active",
    registrarId: "1",
    minYears: 1,
    maxYears: 10,
    featured: false,
  },
];

export default function TLDPricingManagement() {
  const [tldPricing, setTldPricing] = useState<TLDPricing[]>(mockTldPricing);
  const [sortField, setSortField] = useState<keyof TLDPricing>("tld");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTLD, setSelectedTLD] = useState<TLDPricing | null>(null);

  const handleSort = (field: keyof TLDPricing) => {
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
    let filtered = tldPricing;

    if (filter) {
      filtered = tldPricing.filter(p =>
        p.tld.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  };

  const handleSyncPricing = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Failed to sync pricing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (tld: TLDPricing | null = null) => {
    setSelectedTLD(tld);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTLD(null);
  };

  const handleSubmitPricing = async (data: TLDPricing) => {
    try {
      if (selectedTLD) {
        // Update existing TLD pricing
        const updatedPricing = tldPricing.map(tld =>
          tld.id === selectedTLD.id ? { ...tld, ...data } : tld
        );
        setTldPricing(updatedPricing);
      } else {
        // Add new TLD pricing
        const newTLD = {
          id: String(Date.now()),
          ...data,
        };
        setTldPricing([...tldPricing, newTLD]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving TLD pricing:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          TLD Pricing Management
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Configure and manage domain pricing for all TLDs
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Input
            type="text"
            placeholder="Filter TLDs..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-64"
          />
          <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none">
            <option value="all">All Registrars</option>
            <option value="namecheap">Namecheap</option>
            <option value="resellerclub">ResellerClub</option>
          </select>
        </div>
        <div className="flex space-x-4">
          <Button onClick={handleSyncPricing} disabled={isLoading}>
            <ArrowPathIcon className="mr-2 h-5 w-5" />
            {isLoading ? "Syncing..." : "Sync Pricing"}
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <PlusIcon className="mr-2 h-5 w-5" />
            Add TLD Pricing
          </Button>
        </div>
      </div>

      {/* Pricing Table */}
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
                  Monthly
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quarterly
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost & Margin
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getSortedAndFilteredPricing().map(tld => (
                <tr key={tld.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-sm font-semibold text-blue-600">
                          {tld.tld}
                        </span>
                      </div>
                      <div className="ml-4">
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
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tld.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tld.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(tld.monthlyPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(tld.quarterlyPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(tld.annualPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Cost: {formatCurrency(tld.registrarCost)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Margin: {formatPercentage(tld.margin)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tld.minYears} - {tld.maxYears} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(tld)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <TLDPricingFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPricing}
        initialData={selectedTLD}
        registrars={[
          { id: "1", name: "Namecheap" },
          { id: "2", name: "ResellerClub" },
        ]}
      />
    </div>
  );
}