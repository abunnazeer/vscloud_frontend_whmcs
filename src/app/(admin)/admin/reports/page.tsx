// src/app/(admin)/admin/reports/page.tsx
"use client";

import { useState } from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentChartBarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BanknotesIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface RevenueData {
  month: string;
  revenue: number;
  profit: number;
  customers: number;
}

interface TopService {
  name: string;
  revenue: number;
  growth: number;
  customers: number;
}

const mockRevenueData: RevenueData[] = [
  { month: "Jan", revenue: 15000, profit: 4500, customers: 120 },
  { month: "Feb", revenue: 18000, profit: 5400, customers: 145 },
  { month: "Mar", revenue: 22000, profit: 6600, customers: 170 },
  { month: "Apr", revenue: 21000, profit: 6300, customers: 165 },
  { month: "May", revenue: 25000, profit: 7500, customers: 190 },
  { month: "Jun", revenue: 28000, profit: 8400, customers: 210 },
];

const mockTopServices: TopService[] = [
  {
    name: "Premium Hosting",
    revenue: 12500,
    growth: 15.5,
    customers: 85,
  },
  {
    name: "Standard Hosting",
    revenue: 8500,
    growth: 8.2,
    customers: 120,
  },
  {
    name: "Domain Registration",
    revenue: 4500,
    growth: 5.7,
    customers: 150,
  },
  {
    name: "SSL Certificates",
    revenue: 2500,
    growth: 12.3,
    customers: 95,
  },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("monthly");

  const calculateTotalStats = () => {
    return {
      totalRevenue: mockRevenueData.reduce(
        (sum, data) => sum + data.revenue,
        0
      ),
      totalProfit: mockRevenueData.reduce((sum, data) => sum + data.profit, 0),
      totalCustomers: mockRevenueData.reduce(
        (sum, data) => sum + data.customers,
        0
      ),
      averageRevenue:
        mockRevenueData.reduce((sum, data) => sum + data.revenue, 0) /
        mockRevenueData.length,
    };
  };

  const stats = calculateTotalStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="mt-2 text-sm text-gray-700">
          View detailed analytics and performance metrics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Total Revenue
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <DocumentChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Total Profit
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalProfit)}
              </p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Total Customers
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalCustomers}
              </p>
              <p className="text-sm text-green-600">+5% from last month</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-orange-100 p-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Average Revenue
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.averageRevenue)}
              </p>
              <p className="text-sm text-green-600">+10% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Button variant="outline">
            <FunnelIcon className="mr-2 h-5 w-5" />
            Filter
          </Button>
        </div>
        <Button variant="outline">
          <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
          Export Report
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">
            Revenue Overview
          </h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customers Chart */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Customer Growth</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="customers"
                  name="Customers"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Top Services</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockTopServices.map(service => (
            <div key={service.name} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <GlobeAltIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {service.customers} customers
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">
                    {formatCurrency(service.revenue)}
                  </p>
                  <div className="flex items-center space-x-1">
                    {service.growth >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                    )}
                    <p
                      className={`text-sm ${
                        service.growth >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {service.growth}% growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
