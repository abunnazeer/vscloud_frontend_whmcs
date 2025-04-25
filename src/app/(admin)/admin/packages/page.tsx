// src/app/(admin)/admin/packages/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  CubeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckBadgeIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import PackageFormModal from "@/components/admin/PackageFormModal";
import DAPackageFormModal from "@/components/admin/DAPackageFormModal"; // We'll create this
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";

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

interface Server {
  id: string;
  name: string;
  type: string;
  hostname: string;
}

interface DAPackage {
  name: string;
  bandwidth: string;
  quota: string;
  domainptr: string;
  ftp: string;
  mysql: string;
  nemailf: string;
  nemailml: string;
  nemailr: string;
  nsubdomains: string;
  cgi: string;
  php: string;
  ssl: string;
  dns: string;
}

interface SourcePackage {
  id: string | number;
  name: string;
  type: string;
  description: string;
  status: string;
  monthlyPrice: string | number;
  quarterlyPrice: string | number;
  annualPrice: string | number;
  diskSpace?: string;
  bandwidth?: string;
  domains?: string | number;
  databases?: string | number;
  emailAccounts?: string | number;
  sslCertificate?: boolean;
  backups?: boolean;
  dedicatedIp?: boolean;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<HostingPackage[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [daPackages, setDaPackages] = useState<DAPackage[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDaFormModalOpen, setIsDaFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<HostingPackage | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
    fetchServers();
  }, []);

  useEffect(() => {
    if (selectedServer) {
      fetchDaPackages(selectedServer);
    }
  }, [selectedServer]);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await api.packages.listPackages();

      let packageData = [];

      // Determine where the packages array is in the response
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.packages)
      ) {
        packageData = response.data.data.packages;
      } else if (response.data && Array.isArray(response.data.packages)) {
        packageData = response.data.packages;
      } else if (Array.isArray(response.data)) {
        packageData = response.data;
      } else {
        console.error("Unexpected packages response format:", response);
        setPackages([]);
        return;
      }

      const transformedPackages = packageData.map((pkg: SourcePackage) => ({
        id: pkg.id,
        name: pkg.name,
        type: pkg.type,
        description: pkg.description,
        status: pkg.status,
        // Transform pricing structure
        pricing: {
          monthly: parseFloat(String(pkg.monthlyPrice)) || 0,
          quarterly: parseFloat(String(pkg.quarterlyPrice)) || 0,
          annual: parseFloat(String(pkg.annualPrice)) || 0,
        },
        // Transform features structure
        features: {
          diskSpace: pkg.diskSpace || "0",
          bandwidth: pkg.bandwidth || "0",
          domains: parseInt(String(pkg.domains)) || 0,
          databases: parseInt(String(pkg.databases)) || 0,
          emailAccounts: parseInt(String(pkg.emailAccounts)) || 0,
          sslCertificate: pkg.sslCertificate || false,
          backups: pkg.backups || false,
          dedicatedIp: pkg.dedicatedIp || false,
        },
      }));

      setPackages(transformedPackages);
    } catch (error) {
      toast.error("Failed to fetch packages");
      console.error("Error fetching packages:", error);
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServers = async () => {
    try {
      const response = await api.servers.listServers();
      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        setServers(response.data);
      }
      // Check if response.data contains an array of servers under a property
      else if (response.data && Array.isArray(response.data.servers)) {
        setServers(response.data.servers);
      }
      // Fallback to empty array
      else {
        console.error("Unexpected servers response format:", response);
        setServers([]);
      }

      // Set selected server only if we have servers
      if (
        response.data.length > 0 ||
        (response.data.servers && response.data.servers.length > 0)
      ) {
        setSelectedServer(
          Array.isArray(response.data)
            ? response.data[0].id
            : response.data.servers[0].id
        );
      }
    } catch (error) {
      toast.error("Failed to fetch servers");
      console.error("Error fetching servers:", error);
      setServers([]);
    }
  };

  const fetchDaPackages = async (serverId: string) => {
    try {
      const response = await api.daPackages.listPackages(serverId);
      // Check if response.data.packages is an array
      if (response.data && Array.isArray(response.data.packages)) {
        setDaPackages(response.data.packages);
      }
      // Check if response.data itself is an array
      else if (Array.isArray(response.data)) {
        setDaPackages(response.data);
      }
      // Fallback to empty array
      else {
        // console.error("Unexpected DA packages response format:", response);
        setDaPackages([]);
      }
    } catch (error) {
      toast.error("Failed to fetch DirectAdmin packages");
      console.error("Error fetching DA packages:", error);
      setDaPackages([]);
    }
  };
  const handleAddPackage = () => {
    setSelectedPackage(null);
    setIsFormModalOpen(true);
  };

  const handleAddDaPackage = () => {
    setIsDaFormModalOpen(true);
  };

  const handleEditPackage = (pkg: HostingPackage) => {
    setSelectedPackage(pkg);
    setIsFormModalOpen(true);
  };

  const handleDeletePackage = (pkg: HostingPackage) => {
    setSelectedPackage(pkg);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitPackage = async (data: Omit<HostingPackage, "id">) => {
    try {
      if (selectedPackage?.id) {
        await api.packages.updatePackage(selectedPackage.id, data);
        toast.success("Package updated successfully");
      } else {
        await api.packages.createPackage(data);
        toast.success("Package created successfully");
      }
      fetchPackages();
    } catch (error) {
      toast.error("Failed to save package");
      console.error("Error saving package:", error);
    }
  };

  const handleSubmitDaPackage = async (data: any) => {
    try {
      await api.daPackages.createPackage(selectedServer, data);
      toast.success("DirectAdmin package created successfully");
      fetchDaPackages(selectedServer);
    } catch (error) {
      toast.error("Failed to create DirectAdmin package");
      console.error("Error creating DA package:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPackage) return;

    try {
      await api.packages.deletePackage(selectedPackage.id);
      toast.success("Package deleted successfully");
      fetchPackages();
    } catch (error) {
      toast.error("Failed to delete package");
      console.error("Error deleting package:", error);
    } finally {
      setIsDeleteModalOpen(false);
    }
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

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading packages...</div>;
  }

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
          <Button variant="outline" onClick={handleAddDaPackage}>
            <ServerIcon className="mr-2 h-5 w-5" />
            Add DirectAdmin Package
          </Button>
          <div className="ml-auto">
            <select
              value={selectedServer}
              onChange={e => setSelectedServer(e.target.value)}
              className="rounded-md border border-gray-300 p-2 text-sm"
            >
              {servers.map(server => (
                <option key={server.id} value={server.id}>
                  {server.name} ({server.hostname})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Packages List */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Available Packages
            </h2>
          </div>
          {packages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No packages found. Create one to get started.
            </div>
          ) : (
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
                        <p className="text-sm text-gray-500">
                          {pkg.description}
                        </p>
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
                    {/* Pricing */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Pricing</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Monthly</p>
                          <p className="font-medium">
                            $
                            {pkg.pricing && pkg.pricing.monthly
                              ? pkg.pricing.monthly.toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Quarterly</p>
                          <p className="font-medium">
                            $
                            {pkg.pricing && pkg.pricing.quarterly
                              ? pkg.pricing.quarterly.toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Annual</p>
                          <p className="font-medium">
                            $
                            {pkg.pricing && pkg.pricing.annual
                              ? pkg.pricing.annual.toFixed(2)
                              : "0.00"}
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
                          <p className="font-medium">
                            {pkg.features?.diskSpace || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Bandwidth</p>
                          <p className="font-medium">
                            {pkg.features?.bandwidth || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Domains</p>
                          <p className="font-medium">
                            {pkg.features?.domains || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Email Accounts
                          </p>
                          <p className="font-medium">
                            {pkg.features?.emailAccounts || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pkg.features?.sslCertificate && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckBadgeIcon className="h-3 w-3 mr-1" />
                            SSL Certificate
                          </span>
                        )}
                        {pkg.features?.backups && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckBadgeIcon className="h-3 w-3 mr-1" />
                            Daily Backups
                          </span>
                        )}
                        {pkg.features?.dedicatedIp && (
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
          )}
        </div>

        {/* DirectAdmin Packages Section */}
        {/* <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              DirectAdmin Packages on{" "}
              {servers.find(s => s.id === selectedServer)?.name ||
                "Selected Server"}
            </h2>
          </div>
          {daPackages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No DirectAdmin packages found on this server.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {daPackages.map((pkg, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <ServerIcon className="h-8 w-8 text-purple-500" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {pkg.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-sm text-gray-500">Bandwidth</p>
                            <p className="font-medium">{pkg.bandwidth}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Disk Quota</p>
                            <p className="font-medium">{pkg.quota}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Domains</p>
                            <p className="font-medium">{pkg.domainptr}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              FTP Accounts
                            </p>
                            <p className="font-medium">{pkg.ftp}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>

      {/* Add/Edit Package Modal */}
      <PackageFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        package={selectedPackage}
        onSubmit={handleSubmitPackage}
      />

      {/* Add DirectAdmin Package Modal */}
      <DAPackageFormModal
        isOpen={isDaFormModalOpen}
        onClose={() => setIsDaFormModalOpen(false)}
        onSubmit={handleSubmitDaPackage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Package"
        message={`Are you sure you want to delete ${selectedPackage?.name}? This action cannot be undone.`}
      />
    </>
  );
}
