// src/components/hosting/ActiveHostingList.tsx
"use client";

import { useState } from "react";
import {
  ServerIcon,
  ArrowPathIcon,
  CogIcon,
  ChartBarIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

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

const mockHostingPlans: HostingPlan[] = [
  {
    id: "hosting_1",
    name: "Professional Hosting",
    domain: "example.com",
    startDate: "2024-01-15",
    renewalDate: "2025-01-15",
    status: "active",
    type: "Professional",
    resources: {
      diskUsage: 5.2,
      diskLimit: 10,
      bandwidthUsage: 45,
      bandwidthLimit: 100,
    },
  },
  {
    id: "hosting_2",
    name: "Starter Package",
    domain: "mysite.net",
    startDate: "2023-12-01",
    renewalDate: "2024-12-01",
    status: "active",
    type: "Starter",
    resources: {
      diskUsage: 1.5,
      diskLimit: 2,
      bandwidthUsage: 7,
      bandwidthLimit: 10,
    },
  },
];

interface ActiveHostingListProps {
  onManageResources?: (planId: string) => void;
  onViewStatistics?: (planId: string) => void;
  onAccessCPanel?: (planId: string) => void;
  onUpgrade?: (planId: string) => void;
  onCancel?: (planId: string) => void;
}

export default function ActiveHostingList({
  onManageResources,
  onViewStatistics,
  onAccessCPanel,
  onUpgrade,
  onCancel,
}: ActiveHostingListProps) {
  const [plans] = useState<HostingPlan[]>(mockHostingPlans);

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
    <div className="rounded-lg bg-white shadow mb-8">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-900">
          Active Hosting Plans
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {plans.map(plan => {
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAccessCPanel?.(plan.id)}
                  >
                    <ArrowTopRightOnSquareIcon className="mr-2 h-4 w-4" />
                    Access cPanel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManageResources?.(plan.id)}
                  >
                    <CogIcon className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewStatistics?.(plan.id)}
                  >
                    <ChartBarIcon className="mr-2 h-4 w-4" />
                    Statistics
                  </Button>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Disk Usage</span>
                    <span className="text-gray-900">
                      {plan.resources.diskUsage}GB / {plan.resources.diskLimit}
                      GB
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
                      {plan.resources.bandwidthUsage}GB /{" "}
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

              {/* Quick Actions */}
              <div className="mt-4 border-t pt-4">
                <div className="flex space-x-4">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-700"
                    onClick={() => onUpgrade?.(plan.id)}
                  >
                    Upgrade Plan
                  </button>
                  <button
                    className="text-sm text-red-600 hover:text-red-700"
                    onClick={() => onCancel?.(plan.id)}
                  >
                    Cancel Plan
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
