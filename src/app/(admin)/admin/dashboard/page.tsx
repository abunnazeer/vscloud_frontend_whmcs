// src/app/(admin)/admin/dashboard/page.tsx
"use client";

import { useState } from "react";
import {
  UserGroupIcon,
  ServerIcon,
  GlobeAltIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface SystemStatus {
  service: string;
  status: "operational" | "degraded" | "down";
  uptime: string;
}

interface RecentActivity {
  id: string;
  type: "order" | "registration" | "ticket" | "payment";
  description: string;
  time: string;
  customer?: string;
}

const mockSystemStatus: SystemStatus[] = [
  { service: "Hosting Servers", status: "operational", uptime: "99.99%" },
  { service: "Domain Registration", status: "operational", uptime: "99.95%" },
  { service: "Billing System", status: "operational", uptime: "100%" },
  { service: "Customer Portal", status: "degraded", uptime: "98.50%" },
];

const mockActivities: RecentActivity[] = [
  {
    id: "1",
    type: "order",
    description: "New hosting order placed",
    time: "5 minutes ago",
    customer: "John Doe",
  },
  {
    id: "2",
    type: "registration",
    description: "Domain example.com registered",
    time: "15 minutes ago",
    customer: "Jane Smith",
  },
];

export default function AdminDashboard() {
  const [systemStatus] = useState<SystemStatus[]>(mockSystemStatus);
  const [recentActivities] = useState<RecentActivity[]>(mockActivities);

  const getStatusColor = (status: SystemStatus["status"]) => {
    switch (status) {
      case "operational":
        return "text-green-400";
      case "degraded":
        return "text-yellow-400";
      case "down":
        return "text-red-400";
    }
  };

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCartIcon className="h-5 w-5 text-blue-500" />;
      case "registration":
        return <GlobeAltIcon className="h-5 w-5 text-purple-500" />;
      case "ticket":
        return <DocumentTextIcon className="h-5 w-5 text-orange-500" />;
      case "payment":
        return <BanknotesIcon className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of your hosting business
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Total Customers
              </h3>
              <p className="text-2xl font-semibold text-gray-900">256</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <ServerIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Active Hosting
              </h3>
              <p className="text-2xl font-semibold text-gray-900">189</p>
              <p className="text-sm text-green-600">+5% from last month</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <GlobeAltIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Active Domains
              </h3>
              <p className="text-2xl font-semibold text-gray-900">312</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-orange-100 p-3">
              <BanknotesIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Monthly Revenue
              </h3>
              <p className="text-2xl font-semibold text-gray-900">$15,890</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Status */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">System Status</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {systemStatus.map(service => (
              <div
                key={service.service}
                className="flex items-center justify-between p-6"
              >
                <div className="flex items-center">
                  {service.status === "operational" ? (
                    <CheckCircleIcon
                      className={`h-5 w-5 ${getStatusColor(service.status)}`}
                    />
                  ) : (
                    <ExclamationTriangleIcon
                      className={`h-5 w-5 ${getStatusColor(service.status)}`}
                    />
                  )}
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {service.service}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {service.uptime} uptime
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      service.status === "operational"
                        ? "bg-green-100 text-green-800"
                        : service.status === "degraded"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map(activity => (
              <div key={activity.id} className="p-6">
                <div className="flex items-center">
                  {getActivityIcon(activity.type)}
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                      {activity.customer && (
                        <>
                          <span className="text-gray-300">•</span>
                          <p className="text-sm text-gray-500">
                            {activity.customer}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
