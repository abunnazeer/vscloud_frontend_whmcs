// src/app/(dashboard)/dashboard/my-hosting/page.tsx
"use client";

import { useState } from "react";
import {
  ServerIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { ManageMenu } from "@/components/hosting/ManageMenu";
import { StatisticsModal } from "@/components/hosting/StatisticsModal";
import { CPanelRedirectModal } from "@/components/hosting/CPanelRedirectModal";
import { HostingRenewalModal } from "@/components/hosting/HostingRenewalModal";
import { HostingUpgradeModal } from "@/components/hosting/HostingUpgradeModal";

interface HostingPlan {
  id: string;
  name: string;
  domain: string;
  startDate: string;
  renewalDate: string;
  status: "active" | "suspended" | "pending";
  type: "Starter" | "Professional" | "Enterprise";
  resources: {
    diskUsage: number;
    diskLimit: number;
    bandwidthUsage: number;
    bandwidthLimit: number;
  };
}

// Generate mock data for pagination
const generateMockHostingPlans = () => {
  const plans: HostingPlan[] = [];
  for (let i = 1; i <= 15; i++) {
    plans.push({
      id: `hosting_${i}`,
      name: `Hosting Plan ${i}`,
      domain: `example${i}.com`,
      startDate: "2024-01-15",
      renewalDate: "2025-01-15",
      status: i % 3 === 0 ? "pending" : i % 5 === 0 ? "suspended" : "active",
      type:
        i % 3 === 0 ? "Starter" : i % 2 === 0 ? "Professional" : "Enterprise",
      resources: {
        diskUsage: Math.random() * 8 + 2,
        diskLimit: 10,
        bandwidthUsage: Math.random() * 80 + 20,
        bandwidthLimit: 100,
      },
    });
  }
  return plans;
};

const mockHostingPlans = generateMockHostingPlans();

export default function MyHostingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [plansPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [selectedPlan, setSelectedPlan] = useState<HostingPlan | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isCPanelModalOpen, setIsCPanelModalOpen] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Filter plans based on search and status
  const filteredPlans = mockHostingPlans.filter(plan => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Modal handlers
  const handleStats = (plan: HostingPlan) => {
    setSelectedPlan(plan);
    setIsStatsModalOpen(true);
  };

  const handleCPanel = (plan: HostingPlan) => {
    setSelectedPlan(plan);
    setIsCPanelModalOpen(true);
  };

  const handleRenew = (plan: HostingPlan) => {
    setSelectedPlan(plan);
    setIsRenewalModalOpen(true);
  };

  const handleUpgrade = (plan: HostingPlan) => {
    setSelectedPlan(plan);
    setIsUpgradeModalOpen(true);
  };

  // Mock upgrade plans
  const availableUpgrades = [
    {
      id: "pro",
      name: "Professional Plan",
      price: 29.99,
      storage: "50GB",
      bandwidth: "500GB",
      features: ["Unlimited Databases", "Free SSL", "Daily Backups"],
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: 49.99,
      storage: "100GB",
      bandwidth: "1TB",
      features: ["Dedicated IP", "Premium SSL", "Priority Support"],
    },
  ];

  const getStatusBadgeClass = (status: HostingPlan["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResourcePercentage = (used: number, limit: number) => {
    return (used / limit) * 100;
  };

  const getResourceBarColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Hosting</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your active hosting plans and services
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hosting Plans List */}
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {currentPlans.map(plan => {
            const diskPercentage = getResourcePercentage(
              plan.resources.diskUsage,
              plan.resources.diskLimit
            );
            const bandwidthPercentage = getResourcePercentage(
              plan.resources.bandwidthUsage,
              plan.resources.bandwidthLimit
            );

            return (
              <div key={plan.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <ServerIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-gray-500">{plan.domain}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                        plan.status
                      )}`}
                    >
                      {plan.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <ManageMenu
                      onRenew={() => handleRenew(plan)}
                      onUpgrade={() => handleUpgrade(plan)}
                      onAccessCPanel={() => handleCPanel(plan)}
                      onViewStatistics={() => handleStats(plan)}
                    />
                  </div>
                </div>

                {/* Resource Usage */}
                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Disk Usage</span>
                      <span className="text-gray-900">
                        {plan.resources.diskUsage.toFixed(1)}GB /{" "}
                        {plan.resources.diskLimit}GB
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getResourceBarColor(
                          diskPercentage
                        )}`}
                        style={{ width: `${diskPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Bandwidth</span>
                      <span className="text-gray-900">
                        {plan.resources.bandwidthUsage.toFixed(1)}GB /{" "}
                        {plan.resources.bandwidthLimit}GB
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${getResourceBarColor(
                          bandwidthPercentage
                        )}`}
                        style={{ width: `${bandwidthPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-medium">
                      {new Date(plan.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Renewal Date</p>
                    <p className="font-medium">
                      {new Date(plan.renewalDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Plan Type</p>
                    <p className="font-medium">{plan.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium capitalize">{plan.status}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstPlan + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastPlan, filteredPlans.length)}
            </span>{" "}
            of <span className="font-medium">{filteredPlans.length}</span>{" "}
            results
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
      <StatisticsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        plan={selectedPlan}
      />
      <CPanelRedirectModal
        isOpen={isCPanelModalOpen}
        onClose={() => setIsCPanelModalOpen(false)}
        plan={selectedPlan}
      />
      <HostingRenewalModal
        isOpen={isRenewalModalOpen}
        onClose={() => setIsRenewalModalOpen(false)}
        planName={selectedPlan?.name || ""}
        expiryDate={selectedPlan?.renewalDate || ""}
        currentPrice={29.99} // Replace with actual plan price
      />
      <HostingUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlan={selectedPlan?.type || ""}
        availableUpgrades={availableUpgrades}
      />
    </div>
  );
}
