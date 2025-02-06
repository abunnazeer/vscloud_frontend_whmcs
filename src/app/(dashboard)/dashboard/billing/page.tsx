// src/app/(dashboard)/dashboard/billing/page.tsx
"use client";

import { useState } from "react";
import {
  CreditCardIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import PaymentMethodModal from "@/components/billing/PaymentMethodModal";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
}

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    amount: 29.99,
    status: "paid",
    dueDate: "2024-01-15",
    items: [{ description: "Basic Hosting Plan - Monthly", amount: 29.99 }],
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    amount: 49.99,
    status: "pending",
    dueDate: "2024-02-15",
    items: [
      { description: "Professional Hosting Plan - Monthly", amount: 49.99 },
    ],
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    amount: 15.99,
    status: "overdue",
    dueDate: "2024-01-30",
    items: [{ description: "Domain Renewal - example.com", amount: 15.99 }],
  },
];

export default function BillingPage() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // TODO: Implement invoice download
    console.log("Download invoice:", invoiceId);
  };

  const handlePayInvoice = (invoiceId: string) => {
    // TODO: Implement payment flow
    console.log("Pay invoice:", invoiceId);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Billing & Invoices
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your billing information and view invoice history
          </p>
        </div>

        {/* Billing Overview */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <BanknotesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Current Balance
                </h3>
                <p className="text-2xl font-semibold text-gray-900">$65.98</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Next Invoice
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  Feb 15, 2024
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3">
                <CreditCardIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-sm font-medium text-gray-900">
                  Payment Method
                </h3>
                <p className="text-sm text-gray-500">Visa ending in 4242</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaymentModalOpen(true)}
              >
                Manage
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 p-3">
                <ExclamationCircleIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Due Payments
                </h3>
                <p className="text-2xl font-semibold text-red-600">$15.99</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4">
          <Button onClick={() => setIsPaymentModalOpen(true)}>
            <CreditCardIcon className="mr-2 h-5 w-5" />
            Add Payment Method
          </Button>
          <Button variant="outline">View Payment History</Button>
        </div>

        {/* Invoices List */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Invoices
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {invoices.map(invoice => (
              <div key={invoice.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      {invoice.items.map((item, index) => (
                        <p key={index} className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                    <p className="text-lg font-medium text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </Button>
                      {invoice.status !== "paid" && (
                        <Button
                          size="sm"
                          onClick={() => handlePayInvoice(invoice.id)}
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </>
  );
}
