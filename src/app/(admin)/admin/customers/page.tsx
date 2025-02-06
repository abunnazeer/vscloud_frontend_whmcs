// src/app/(admin)/admin/customers/page.tsx
"use client";

import { useState } from "react";
import {
  UsersIcon,
  ArrowPathIcon,
  UserPlusIcon,
  EyeIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "pending";
  joinDate: string;
  totalSpent: number;
  activeServices: {
    hosting: number;
    domains: number;
  };
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    joinDate: "2024-01-15",
    totalSpent: 549.99,
    activeServices: {
      hosting: 2,
      domains: 3,
    },
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    joinDate: "2024-01-20",
    totalSpent: 299.99,
    activeServices: {
      hosting: 1,
      domains: 2,
    },
  },
];

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState("");

  const getStatusColor = (status: Customer["status"]) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status];
  };

  const handleViewCustomer = (customerId: string) => {
    // Navigate to customer details
    console.log("View customer:", customerId);
  };

  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your customer accounts and their services
        </p>
      </div>

      <div className="flex justify-between">
        <div className="w-64">
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button>
          <UserPlusIcon className="mr-2 h-5 w-5" />
          Add Customer
        </Button>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Services
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UsersIcon className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.activeServices.hosting} Hosting
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.activeServices.domains} Domains
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCustomer(customer.id)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <BanknotesIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
