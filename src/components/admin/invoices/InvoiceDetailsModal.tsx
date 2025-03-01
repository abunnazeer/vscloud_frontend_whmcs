// src/components/admin/invoices/InvoiceDetailsModal.tsx
"use client";

import { Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

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

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice; // Make invoice optional
  onMarkAsPaid?: () => void;
  onSendReminder?: () => void;
}

export default function InvoiceDetailsModal({
  isOpen,
  onClose,
  invoice,
  onMarkAsPaid,
  onSendReminder,
}: InvoiceDetailsModalProps) {
  // If no invoice is provided, don't render the modal
  if (!invoice) return null;

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <DocumentTextIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <DialogTitle
                        as="h3"
                        className="text-lg font-medium text-gray-900"
                      >
                        Invoice {invoice.invoiceNumber}
                      </DialogTitle>
                      <p className="text-sm text-gray-500">
                        {invoice.userName}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {getStatusIcon(invoice.status)}
                    <span className="ml-1 capitalize">{invoice.status}</span>
                  </span>
                </div>

                {/* Invoice Details */}
                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Invoice Details
                    </h4>
                    <dl className="mt-2 space-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">Created Date</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatDate(invoice.createdAt)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Due Date</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatDate(invoice.dueDate)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Customer Details
                    </h4>
                    <dl className="mt-2 space-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">Name</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {invoice.userName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Customer ID</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {invoice.userId}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">
                    Invoice Items
                  </h4>
                  <div className="mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Description
                          </th>
                          <th className="py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                            Quantity
                          </th>
                          <th className="py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                            Unit Price
                          </th>
                          <th className="py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {invoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="py-4 text-sm text-gray-900">
                              {item.description}
                            </td>
                            <td className="py-4 text-right text-sm text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="py-4 text-right text-sm text-gray-900">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="py-4 text-right text-sm text-gray-900">
                              {formatCurrency(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            colSpan={3}
                            className="py-4 text-right text-sm font-medium text-gray-900"
                          >
                            Total
                          </td>
                          <td className="py-4 text-right text-sm font-medium text-gray-900">
                            {formatCurrency(invoice.amount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900">Notes</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      {invoice.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex justify-between">
                  <div className="flex space-x-3">
                    {invoice.status !== "paid" && onMarkAsPaid && (
                      <Button onClick={onMarkAsPaid}>Mark as Paid</Button>
                    )}
                    {(invoice.status === "unpaid" ||
                      invoice.status === "overdue") &&
                      onSendReminder && (
                        <Button variant="outline" onClick={onSendReminder}>
                          Send Reminder
                        </Button>
                      )}
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                    <Button variant="outline">
                      <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
