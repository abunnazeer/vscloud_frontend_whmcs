// src/app/(admin)/admin/billing/payment-methods/page.tsx
"use client";

import { useState } from "react";
import {
  CreditCardIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import PaymentMethodModal from "@/components/admin/billing/PaymentMethodModal";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";

interface PaymentMethod {
  id: string;
  type: "credit_card" | "bank_account" | "paypal";
  name: string;
  status: "active" | "expired" | "failed";
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
  brand?: string;
  createdAt: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "credit_card",
    name: "Business Card",
    status: "active",
    last4: "4242",
    expiryDate: "12/25",
    isDefault: true,
    brand: "visa",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    type: "bank_account",
    name: "Company Bank Account",
    status: "active",
    last4: "1234",
    isDefault: false,
    createdAt: "2024-01-10",
  },
];

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(mockPaymentMethods);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getStatusColor = (status: PaymentMethod["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusIcon = (status: PaymentMethod["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "expired":
      case "failed":
        return <XCircleIcon className="h-4 w-4" />;
    }
  };

  const getMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "credit_card":
        return <CreditCardIcon className="h-6 w-6 text-gray-500" />;
      case "bank_account":
        return <BuildingLibraryIcon className="h-6 w-6 text-gray-500" />;
      default:
        return <CreditCardIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleAddPaymentMethod = () => {
    setSelectedMethod(null);
    setIsModalOpen(true);
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsModalOpen(true);
  };

  const handleDeletePaymentMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitPaymentMethod = async (data: any) => {
    try {
      if (selectedMethod) {
        // Update existing payment method
        setPaymentMethods(methods =>
          methods.map(method =>
            method.id === selectedMethod.id
              ? {
                  ...method,
                  ...data,
                  status: "active",
                  last4: data.cardNumber
                    ? data.cardNumber.slice(-4)
                    : data.accountNumber.slice(-4),
                }
              : method
          )
        );
      } else {
        // Add new payment method
        const newMethod = {
          ...data,
          id: Date.now().toString(),
          status: "active",
          last4: data.cardNumber
            ? data.cardNumber.slice(-4)
            : data.accountNumber?.slice(-4) || "0000",
          createdAt: new Date().toISOString(),
        };
        setPaymentMethods(methods => [...methods, newMethod]);
      }
      setIsModalOpen(false);
      setSelectedMethod(null);
    } catch (error) {
      console.error("Error saving payment method:", error);
    }
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
  };

  const handleDeleteConfirm = () => {
    if (selectedMethod) {
      setPaymentMethods(methods =>
        methods.filter(method => method.id !== selectedMethod.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedMethod(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment Methods
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your payment methods and billing preferences
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-end">
        <Button onClick={handleAddPaymentMethod}>
          <PlusIcon className="mr-2 h-5 w-5" />
          Add Payment Method
        </Button>
      </div>

      {/* Payment Methods List */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">
            Saved Payment Methods
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {paymentMethods.map(method => (
            <div key={method.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    {getMethodIcon(method.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {method.name}
                      </h3>
                      {method.isDefault && (
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {method.type === "credit_card"
                        ? `${method.brand} •••• ${method.last4}`
                        : `Account ending in ${method.last4}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        method.status
                      )}`}
                    >
                      {getStatusIcon(method.status)}
                      <span className="ml-1 capitalize">{method.status}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {method.type === "credit_card" && (
                    <p className="text-sm text-gray-500">
                      Expires {method.expiryDate}
                    </p>
                  )}
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPaymentMethod(method)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePaymentMethod(method)}
                    className="text-red-600 hover:text-red-700"
                    disabled={method.isDefault}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Added On</p>
                  <p className="font-medium">
                    {new Date(method.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium capitalize">
                    {method.type.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMethod(null);
        }}
        onSubmit={handleSubmitPaymentMethod}
        paymentMethod={selectedMethod || undefined}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMethod(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Payment Method"
        message={`Are you sure you want to delete ${selectedMethod?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
