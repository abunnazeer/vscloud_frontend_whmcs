// // src/app/(dashboard)/dashboard/domains/page.tsx
// "use client";

// import { useState } from "react";
// import {
//   MagnifyingGlassIcon,
//   ArrowPathIcon,
//   GlobeAltIcon,
//   CloudArrowUpIcon,
//   CogIcon,
//   TrashIcon,
// } from "@heroicons/react/24/outline";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// // Mock data for domains
// const domains = [
//   {
//     id: 1,
//     name: "example.com",
//     registrationDate: "2024-01-15",
//     expiryDate: "2025-01-15",
//     autoRenew: true,
//     status: "active",
//   },
//   {
//     id: 2,
//     name: "mysite.net",
//     registrationDate: "2023-12-01",
//     expiryDate: "2024-12-01",
//     autoRenew: false,
//     status: "active",
//   },
// ];

// export default function DomainsPage() {
//   const [searchDomain, setSearchDomain] = useState("");
//   const [isSearching, setIsSearching] = useState(false);

//   const handleDomainSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchDomain) return;

//     setIsSearching(true);
//     try {
//       // TODO: Implement actual domain search
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       console.log("Searching for domain:", searchDomain);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold text-gray-900">
//           Domain Management
//         </h1>
//         <p className="mt-2 text-sm text-gray-700">
//           Search, register, and manage your domains
//         </p>
//       </div>

//       {/* Domain Search */}
//       <div className="rounded-lg bg-white p-6 shadow">
//         <h2 className="text-lg font-medium text-gray-900">Search Domain</h2>
//         <form onSubmit={handleDomainSearch} className="mt-4">
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <Input
//                 type="text"
//                 placeholder="Enter domain name..."
//                 value={searchDomain}
//                 onChange={e => setSearchDomain(e.target.value)}
//                 className="w-full"
//               />
//             </div>
//             <Button type="submit" loading={isSearching}>
//               <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
//               Search
//             </Button>
//           </div>
//         </form>
//       </div>

//       {/* Domains List */}
//       <div className="rounded-lg bg-white shadow">
//         <div className="border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-medium text-gray-900">Your Domains</h2>
//         </div>
//         <div className="divide-y divide-gray-200">
//           {domains.map(domain => (
//             <div key={domain.id} className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <GlobeAltIcon className="h-8 w-8 text-blue-500" />
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-900">
//                       {domain.name}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       Expires:{" "}
//                       {new Date(domain.expiryDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <Button variant="outline" size="sm">
//                     <CogIcon className="mr-2 h-4 w-4" />
//                     Manage DNS
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     <CloudArrowUpIcon className="mr-2 h-4 w-4" />
//                     Transfer
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     <ArrowPathIcon className="mr-2 h-4 w-4" />
//                     Renew
//                   </Button>
//                 </div>
//               </div>

//               {/* Domain Details */}
//               <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <p className="text-gray-500">Registration Date</p>
//                   <p className="font-medium">
//                     {new Date(domain.registrationDate).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Auto-Renew</p>
//                   <p className="font-medium">
//                     {domain.autoRenew ? "Enabled" : "Disabled"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Status</p>
//                   <p className="font-medium capitalize">{domain.status}</p>
//                 </div>
//               </div>

//               {/* Quick Actions */}
//               <div className="mt-4 border-t pt-4">
//                 <div className="flex space-x-4">
//                   <button className="text-sm text-gray-600 hover:text-gray-900">
//                     Edit Nameservers
//                   </button>
//                   <button className="text-sm text-gray-600 hover:text-gray-900">
//                     Edit Contact Info
//                   </button>
//                   <button className="text-sm text-gray-600 hover:text-gray-900">
//                     Domain Lock
//                   </button>
//                   <button className="text-sm text-red-600 hover:text-red-700">
//                     Delete Domain
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/(dashboard)/dashboard/domains/page.tsx
"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  CloudArrowUpIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DnsManagementModal from "@/components/domains/DnsManagementModal";
import DomainTransferModal from "@/components/domains/DomainTransferModal";
import DomainRenewalModal from "@/components/domains/DomainRenewalModal";
import NameserversModal from "@/components/domains/NameserversModal";
import ContactInfoModal from "@/components/domains/ContactInfoModal";

interface Domain {
  id: number;
  name: string;
  registrationDate: string;
  expiryDate: string;
  autoRenew: boolean;
  status: "active" | "expired" | "pending";
}

// Mock data for domains
const mockDomains: Domain[] = [
  {
    id: 1,
    name: "example.com",
    registrationDate: "2024-01-15",
    expiryDate: "2025-01-15",
    autoRenew: true,
    status: "active",
  },
  {
    id: 2,
    name: "mysite.net",
    registrationDate: "2023-12-01",
    expiryDate: "2024-12-01",
    autoRenew: false,
    status: "active",
  },
];

export default function DomainsPage() {
  const [searchDomain, setSearchDomain] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [domains] = useState<Domain[]>(mockDomains);
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
  const handleDomainSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDomain) return;

    setIsSearching(true);
    try {
      // TODO: Implement actual domain search
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Searching for domain:", searchDomain);
    } finally {
      setIsSearching(false);
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

      {/* Domain Search */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Domain Search</h2>
        <form onSubmit={handleDomainSearch} className="mt-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search for a domain name..."
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
      </div>

      {/* Domains List */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Your Domains</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {domains.map(domain => (
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
      </div>

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

      {/* DNS Management Modal */}
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
