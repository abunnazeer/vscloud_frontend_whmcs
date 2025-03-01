// src/app/(admin)/admin/billing/page.tsx
"use client";

import { useState } from "react";
import {
  BanknotesIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import InvoiceFormModal from "@/components/admin/invoices/InvoiceFormModal";
import InvoiceDetailsModal from "@/components/admin/invoices/InvoiceDetailsModal";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  userName: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue" | "cancelled";
  dueDate: string;
  createdAt: string;
  items: InvoiceItem[];
  notes?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    userId: "user1",
    userName: "John Doe",
    amount: 299.99,
    status: "paid",
    dueDate: "2024-02-15",
    createdAt: "2024-02-01",
    items: [
      {
        description: "Standard Hosting Plan - Monthly",
        quantity: 1,
        unitPrice: 299.99,
        total: 299.99,
      },
    ],
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    userId: "user2",
    userName: "Jane Smith",
    amount: 599.99,
    status: "unpaid",
    dueDate: "2024-02-20",
    createdAt: "2024-02-05",
    items: [
      {
        description: "Premium Hosting Plan - Monthly",
        quantity: 1,
        unitPrice: 599.99,
        total: 599.99,
      },
    ],
  },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredInvoices = invoices.filter(
    invoice =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "unpaid":
        return <ClockIcon className="h-4 w-4" />;
      case "overdue":
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case "cancelled":
        return <ExclamationCircleIcon className="h-4 w-4" />;
    }
  };

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setIsFormModalOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFormModalOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitInvoice = async (data: any) => {
    if (selectedInvoice) {
      // Update existing invoice
      setInvoices(
        invoices.map(invoice =>
          invoice.id === selectedInvoice.id ? { ...invoice, ...data } : invoice
        )
      );
    } else {
      // Create new invoice
      const newInvoice = {
        ...data,
        id: Date.now().toString(),
        invoiceNumber: `INV-2024-${(invoices.length + 1)
          .toString()
          .padStart(3, "0")}`,
        createdAt: new Date().toISOString(),
        status: "unpaid",
      };
      setInvoices([...invoices, newInvoice]);
    }
    setIsFormModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedInvoice) {
      setInvoices(
        invoices.filter(invoice => invoice.id !== selectedInvoice.id)
      );
    }
    setIsDeleteModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleMarkAsPaid = () => {
    if (selectedInvoice) {
      setInvoices(
        invoices.map(invoice =>
          invoice.id === selectedInvoice.id
            ? { ...invoice, status: "paid" }
            : invoice
        )
      );
      setIsDetailsModalOpen(false);
      setSelectedInvoice(null);
    }
  };

  const handleSendReminder = () => {
    // TODO: Implement send reminder functionality
    console.log("Send reminder for invoice:", selectedInvoice?.invoiceNumber);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const calculateStats = () => {
    return {
      totalRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
      totalInvoices: invoices.length,
      pendingInvoices: invoices.filter(inv => inv.status === "unpaid").length,
      overdueInvoices: invoices.filter(inv => inv.status === "overdue").length,
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage invoices and payment history
        </p>
      </div>

      {/* Stats Overview */}
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
              <DocumentTextIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Total Invoices
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalInvoices}
              </p>
              <p className="text-sm text-green-600">+5% from last month</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Pending</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pendingInvoices}
              </p>
              <p className="text-sm text-red-600">
                {stats.overdueInvoices} overdue
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Growth</h3>
              <p className="text-2xl font-semibold text-gray-900">8.5%</p>
              <p className="text-sm text-green-600">+2.5% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline">
          <FunnelIcon className="mr-2 h-5 w-5" />
          Filter
        </Button>
        <Button onClick={handleCreateInvoice}>
          <PlusIcon className="mr-2 h-5 w-5" />
          Create Invoice
        </Button>
      </div>

      {/* Invoices List */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredInvoices.map(invoice => (
            <div key={invoice.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <DocumentTextIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      {invoice.invoiceNumber}
                    </button>
                    <p className="text-sm text-gray-500">{invoice.userName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1 capitalize">{invoice.status}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditInvoice(invoice)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteInvoice(invoice)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Invoice Actions */}
              <div className="mt-4 border-t pt-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleViewInvoice(invoice)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    View Details
                  </button>
                  {invoice.status !== "paid" && (
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        handleMarkAsPaid();
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Mark as Paid
                    </button>
                  )}
                  {(invoice.status === "unpaid" ||
                    invoice.status === "overdue") && (
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        handleSendReminder();
                      }}
                      // ... [previous code remains the same until the last action button]

                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Send Reminder
                    </button>
                  )}
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4 inline" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <InvoiceFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedInvoice(null);
        }}
        onSubmit={handleSubmitInvoice}
        invoice={selectedInvoice || undefined}
      />

      <InvoiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice!}
        onMarkAsPaid={handleMarkAsPaid}
        onSendReminder={handleSendReminder}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedInvoice(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${selectedInvoice?.invoiceNumber}? This action cannot be undone.`}
      />
    </div>
  );
}
