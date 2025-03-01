// src/app/(dashboard)/dashboard/domains/page.tsx
"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  CloudArrowUpIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DnsManagementModal from "@/components/domains/DnsManagementModal";
import DomainTransferModal from "@/components/domains/DomainTransferModal";
import DomainRenewalModal from "@/components/domains/DomainRenewalModal";
import NameserversModal from "@/components/domains/NameserversModal";
import ContactInfoModal from "@/components/domains/ContactInfoModal";
import DomainSearch from "@/components/domains/DomainSearch";

interface Domain {
  id: number;
  name: string;
  registrationDate: string;
  expiryDate: string;
  autoRenew: boolean;
  status: "active" | "expired" | "pending";
}

interface DomainResult {
  name: string;
  price: number;
  available: boolean;
}

// Generate more mock data for pagination
const generateMockDomains = () => {
  const domains: Domain[] = [];
  for (let i = 1; i <= 15; i++) {
    domains.push({
      id: i,
      name: `example${i}.com`,
      registrationDate: "2024-01-15",
      expiryDate: "2025-01-15",
      autoRenew: i % 2 === 0,
      status: i % 3 === 0 ? "pending" : i % 5 === 0 ? "expired" : "active",
    });
  }
  return domains;
};

const mockDomains = generateMockDomains();

export default function DomainsPage() {
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [domainsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals state
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [isDnsModalOpen, setIsDnsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedDomainForTransfer, setSelectedDomainForTransfer] = useState<
    string | null
  >(null);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [selectedDomainForRenewal, setSelectedDomainForRenewal] =
    useState<Domain | null>(null);
  const [isNameserversModalOpen, setIsNameserversModalOpen] = useState(false);
  const [selectedDomainForNameservers, setSelectedDomainForNameservers] =
    useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedDomainForContact, setSelectedDomainForContact] = useState<
    string | null
  >(null);

  // Filter domains based on search and status
  const filteredDomains = mockDomains.filter(domain => {
    const matchesFilter = domain.name
      .toLowerCase()
      .includes(filterValue.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || domain.status === statusFilter;
    return matchesFilter && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastDomain = currentPage * domainsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
  const currentDomains = filteredDomains.slice(
    indexOfFirstDomain,
    indexOfLastDomain
  );
  const totalPages = Math.ceil(filteredDomains.length / domainsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDomainRegistration = async (domain: DomainResult) => {
    try {
      console.log("Registering domain:", domain);
      // TODO: Implement actual domain registration logic
    } catch (error) {
      console.error("Error registering domain:", error);
    }
  };

  const handleDnsManagement = (domainName: string) => {
    setSelectedDomain(domainName);
    setIsDnsModalOpen(true);
  };

  const handleTransferDomain = (domainName: string) => {
    setSelectedDomainForTransfer(domainName);
    setIsTransferModalOpen(true);
  };

  const handleManageNameservers = (domainName: string) => {
    setSelectedDomainForNameservers(domainName);
    setIsNameserversModalOpen(true);
  };

  const handleRenewDomain = (domain: Domain) => {
    setSelectedDomainForRenewal(domain);
    setIsRenewalModalOpen(true);
  };

  const handleEditContactInfo = (domainName: string) => {
    setSelectedDomainForContact(domainName);
    setIsContactModalOpen(true);
  };

  const getStatusBadgeClass = (status: Domain["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Domain Management
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Search, register, and manage your domains
        </p>
      </div>

      {/* Domain Search Component */}
      <DomainSearch onDomainSelect={handleDomainRegistration} />

      {/* Filters */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-sm">
            <Input
              type="text"
              placeholder="Filter your domains..."
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="ml-4">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Domains List */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Your Domains</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {currentDomains.map(domain => (
            <div key={domain.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <GlobeAltIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {domain.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Expires:{" "}
                      {new Date(domain.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                      domain.status
                    )}`}
                  >
                    {domain.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDnsManagement(domain.name)}
                  >
                    <CogIcon className="mr-2 h-4 w-4" />
                    Manage DNS
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTransferDomain(domain.name)}
                  >
                    <CloudArrowUpIcon className="mr-2 h-4 w-4" />
                    Transfer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRenewDomain(domain)}
                  >
                    <ArrowPathIcon className="mr-2 h-4 w-4" />
                    Renew
                  </Button>
                </div>
              </div>

              {/* Domain Details */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Registration Date</p>
                  <p className="font-medium">
                    {new Date(domain.registrationDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Auto-Renew</p>
                  <p className="font-medium">
                    {domain.autoRenew ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium capitalize">{domain.status}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 border-t pt-4">
                <div className="flex space-x-4">
                  <button
                    className="text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => handleManageNameservers(domain.name)}
                  >
                    Edit Nameservers
                  </button>
                  <button
                    className="text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => handleEditContactInfo(domain.name)}
                  >
                    Edit Contact Info
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    Domain Lock
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{indexOfFirstDomain + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastDomain, filteredDomains.length)}
            </span>{" "}
            of <span className="font-medium">{filteredDomains.length}</span>{" "}
            domains
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <Button
                key={number}
                variant={currentPage === number ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(number)}
              >
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedDomainForTransfer && (
        <DomainTransferModal
          isOpen={isTransferModalOpen}
          onClose={() => {
            setIsTransferModalOpen(false);
            setSelectedDomainForTransfer(null);
          }}
          domain={selectedDomainForTransfer}
        />
      )}

      {selectedDomain && (
        <DnsManagementModal
          isOpen={isDnsModalOpen}
          onClose={() => {
            setIsDnsModalOpen(false);
            setSelectedDomain(null);
          }}
          domain={selectedDomain}
        />
      )}

      {selectedDomainForRenewal && (
        <DomainRenewalModal
          isOpen={isRenewalModalOpen}
          onClose={() => {
            setIsRenewalModalOpen(false);
            setSelectedDomainForRenewal(null);
          }}
          domain={selectedDomainForRenewal.name}
          expiryDate={selectedDomainForRenewal.expiryDate}
        />
      )}

      {selectedDomainForNameservers && (
        <NameserversModal
          isOpen={isNameserversModalOpen}
          onClose={() => {
            setIsNameserversModalOpen(false);
            setSelectedDomainForNameservers(null);
          }}
          domain={selectedDomainForNameservers}
        />
      )}

      {selectedDomainForContact && (
        <ContactInfoModal
          isOpen={isContactModalOpen}
          onClose={() => {
            setIsContactModalOpen(false);
            setSelectedDomainForContact(null);
          }}
          domain={selectedDomainForContact}
        />
      )}
    </div>
  );
}
