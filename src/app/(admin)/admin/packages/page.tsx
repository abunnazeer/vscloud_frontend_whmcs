// src/app/(admin)/admin/packages/page.tsx
"use client";

import { useState } from "react";
import {
  CubeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import PackageFormModal from "@/components/admin/PackageFormModal";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";

interface HostingPackage {
  id: string;
  name: string;
  type: "shared" | "reseller" | "vps" | "dedicated";
  description: string;
  pricing: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  features: {
    diskSpace: string;
    bandwidth: string;
    domains: number;
    databases: number;
    emailAccounts: number;
    sslCertificate: boolean;
    backups: boolean;
    dedicatedIp: boolean;
  };
  status: "active" | "draft" | "archived";
}

const mockPackages: HostingPackage[] = [
  {
    id: "1",
    name: "Starter Hosting",
    type: "shared",
    description: "Perfect for personal websites and small businesses",
    pricing: {
      monthly: 9.99,
      quarterly: 27.99,
      annual: 99.99,
    },
    features: {
      diskSpace: "10GB",
      bandwidth: "100GB",
      domains: 1,
      databases: 5,
      emailAccounts: 10,
      sslCertificate: true,
      backups: false,
      dedicatedIp: false,
    },
    status: "active",
  },
  {
    id: "2",
    name: "Business Pro",
    type: "shared",
    description: "Ideal for growing businesses and e-commerce",
    pricing: {
      monthly: 24.99,
      quarterly: 69.99,
      annual: 249.99,
    },
    features: {
      diskSpace: "50GB",
      bandwidth: "500GB",
      domains: 5,
      databases: 20,
      emailAccounts: 50,
      sslCertificate: true,
      backups: true,
      dedicatedIp: true,
    },
    status: "active",
  },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<HostingPackage[]>(mockPackages);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<HostingPackage | null>(
    null
  );

  const handleAddPackage = () => {
    setSelectedPackage(null);
    setIsFormModalOpen(true);
  };

  const handleEditPackage = (pkg: HostingPackage) => {
    setSelectedPackage(pkg);
    setIsFormModalOpen(true);
  };

  const handleDeletePackage = (pkg: HostingPackage) => {
    setSelectedPackage(pkg);
    setIsDeleteModalOpen(true);
  };

  const getStatusBadgeClass = (status: HostingPackage["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Hosting Packages
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your hosting packages and pricing
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4">
          <Button onClick={handleAddPackage}>
            <PlusIcon className="mr-2 h-5 w-5" />
            Add Package
          </Button>
        </div>

        {/* Packages List */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Available Packages
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {packages.map(pkg => (
              <div key={pkg.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CubeIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {pkg.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                            pkg.status
                          )}`}
                        >
                          {pkg.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{pkg.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPackage(pkg)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePackage(pkg)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Package Details */}
                <div className="mt-4 grid grid-cols-2 gap-6">
                  {/* Pricing */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Pricing</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Monthly</p>
                        <p className="font-medium">
                          ${pkg.pricing.monthly.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quarterly</p>
                        <p className="font-medium">
                          ${pkg.pricing.quarterly.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Annual</p>
                        <p className="font-medium">
                          ${pkg.pricing.annual.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Features</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Disk Space</p>
                        <p className="font-medium">{pkg.features.diskSpace}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bandwidth</p>
                        <p className="font-medium">{pkg.features.bandwidth}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Domains</p>
                        <p className="font-medium">{pkg.features.domains}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Accounts</p>
                        <p className="font-medium">
                          {pkg.features.emailAccounts}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pkg.features.sslCertificate && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckBadgeIcon className="h-3 w-3 mr-1" />
                          SSL Certificate
                        </span>
                      )}
                      {pkg.features.backups && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckBadgeIcon className="h-3 w-3 mr-1" />
                          Daily Backups
                        </span>
                      )}
                      {pkg.features.dedicatedIp && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckBadgeIcon className="h-3 w-3 mr-1" />
                          Dedicated IP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Package Modal */}
      <PackageFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        package={selectedPackage}
        onSubmit={data => {
          if (selectedPackage) {
            setPackages(
              packages.map(p =>
                p.id === selectedPackage.id ? { ...p, ...data } : p
              )
            );
          } else {
            setPackages([
              ...packages,
              {
                ...data,
                id: Date.now().toString(),
                status: "draft",
              },
            ]);
          }
          setIsFormModalOpen(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (selectedPackage) {
            setPackages(packages.filter(p => p.id !== selectedPackage.id));
          }
          setIsDeleteModalOpen(false);
        }}
        title="Delete Package"
        message={`Are you sure you want to delete ${selectedPackage?.name}? This action cannot be undone.`}
      />
    </>
  );
}
