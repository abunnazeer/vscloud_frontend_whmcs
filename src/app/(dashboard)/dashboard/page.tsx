// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ServerIcon,
  GlobeAltIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

const stats = [
  {
    name: "Active Services",
    value: "3",
    icon: ServerIcon,
    change: "+2",
    changeType: "increase",
  },
  {
    name: "Active Domains",
    value: "5",
    icon: GlobeAltIcon,
    change: "+1",
    changeType: "increase",
  },
  {
    name: "Monthly Spending",
    value: "$149.00",
    icon: CreditCardIcon,
    change: "+$49.00",
    changeType: "increase",
  },
  {
    name: "Storage Used",
    value: "45%",
    icon: CircleStackIcon,
    change: "+5%",
    changeType: "increase",
  },
];

const quickActions = [
  {
    name: "Order Hosting",
    href: "/dashboard/hosting",
    icon: CloudArrowUpIcon,
    description: "Browse and order new hosting plans",
  },
  {
    name: "Register Domain",
    href: "/dashboard/domains",
    icon: GlobeAltIcon,
    description: "Search and register domain names",
  },
  {
    name: "View Invoices",
    href: "/dashboard/billing",
    icon: CreditCardIcon,
    description: "View and pay your invoices",
  },
  {
    name: "Usage Statistics",
    href: "/dashboard/statistics",
    icon: ArrowTrendingUpIcon,
    description: "Monitor your resource usage",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back! Here's an overview of your hosting services.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white p-6 shadow"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === "increase"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(action => (
            <Link
              key={action.name}
              href={action.href}
              className="relative flex flex-col rounded-lg border p-6 hover:border-blue-500 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <action.icon
                  className="h-6 w-6 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity (placeholder) */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <Button variant="outline" size="sm">
            View all
          </Button>
        </div>
        <div className="mt-4 rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">
            No recent activity to display.
          </p>
        </div>
      </div>
    </div>
  );
}
