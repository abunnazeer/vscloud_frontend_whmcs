// src/app/(admin)/admin/customers/[id]/page.tsx
"use client";

import { useState } from "react";
import {
  UsersIcon,
  ServerIcon,
  GlobeAltIcon,
  CreditCardIcon,
  BanknotesIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "suspended" | "pending";
  joinDate: string;
  totalSpent: number;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  billing: {
    method: string;
    last4: string;
    expiry: string;
  };
  services: {
    hosting: Array<{
      id: string;
      name: string;
      price: number;
      nextDue: string;
      status: string;
    }>;
    domains: Array<{
      id: string;
      name: string;
      expiryDate: string;
      autoRenew: boolean;
    }>;
  };
  recentInvoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: "paid" | "unpaid" | "overdue";
  }>;
}

const mockCustomerData: CustomerDetails = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 234-567-8900",
  status: "active",
  joinDate: "2024-01-15",
  totalSpent: 549.99,
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    country: "USA",
    zip: "10001",
  },
  billing: {
    method: "Visa",
    last4: "4242",
    expiry: "12/25",
  },
  services: {
    hosting: [
      {
        id: "h1",
        name: "Basic Hosting",
        price: 9.99,
        nextDue: "2024-03-15",
        status: "active",
      },
      {
        id: "h2",
        name: "Premium Hosting",
        price: 29.99,
        nextDue: "2024-03-20",
        status: "active",
      },
    ],
    domains: [
      {
        id: "d1",
        name: "example.com",
        expiryDate: "2025-01-15",
        autoRenew: true,
      },
      {
        id: "d2",
        name: "example.net",
        expiryDate: "2025-02-20",
        autoRenew: true,
      },
    ],
  },
  recentInvoices: [
    {
      id: "inv1",
      date: "2024-02-01",
      amount: 39.98,
      status: "paid",
    },
    {
      id: "inv2",
      date: "2024-01-01",
      amount: 39.98,
      status: "paid",
    },
  ],
};

export default function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [customer] = useState<CustomerDetails>(mockCustomerData);

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      unpaid: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/admin/customers">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            {customer.name}
          </h1>
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
              customer.status
            )}`}
          >
            {customer.status}
          </span>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">Suspend Account</Button>
          <Button>Edit Details</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{customer.phone}</span>
              </div>
              <div className="col-span-2 flex items-start space-x-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  {customer.address.street}, {customer.address.city},{" "}
                  {customer.address.state} {customer.address.zip},{" "}
                  {customer.address.country}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Hosting Services
              </h2>
              <Button variant="outline" size="sm">
                Add Service
              </Button>
            </div>
            <div className="space-y-4">
              {customer.services.hosting.map(service => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <ServerIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {service.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Next due:{" "}
                        {new Date(service.nextDue).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        service.status
                      )}`}
                    >
                      {service.status}
                    </span>
                    <p className="font-medium text-gray-900">
                      ${service.price}/mo
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Domains</h2>
              <Button variant="outline" size="sm">
                Register Domain
              </Button>
            </div>
            <div className="space-y-4">
              {customer.services.domains.map(domain => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <GlobeAltIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{domain.name}</p>
                      <p className="text-sm text-gray-500">
                        Expires:{" "}
                        {new Date(domain.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {domain.autoRenew && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Auto-renew
                      </span>
                    )}
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Billing Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Payment Method</span>
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    {customer.billing.method} •••• {customer.billing.last4}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total Spent</span>
                <span className="text-gray-900">${customer.totalSpent}</span>
              </div>
              <Button variant="outline" className="w-full">
                Update Payment Method
              </Button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Invoices
            </h2>
            <div className="space-y-4">
              {customer.recentInvoices.map(invoice => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ${invoice.amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Invoices
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
