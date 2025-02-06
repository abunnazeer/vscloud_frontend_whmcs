// src/components/billing/InvoicePaymentModal.tsx
"use client";

import { useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import {
  CreditCardIcon,
  CheckCircleIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

interface SavedCard {
  id: string;
  type: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface InvoicePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    items: Array<{
      description: string;
      amount: number;
    }>;
  };
}

// Mock saved cards data
const mockSavedCards: SavedCard[] = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2025",
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: "03",
    expiryYear: "2024",
    isDefault: false,
  },
];

export default function InvoicePaymentModal({
  isOpen,
  onClose,
  invoice,
}: InvoicePaymentModalProps) {
  const [selectedCard, setSelectedCard] = useState<string>(
    mockSavedCards[0].id
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement actual payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
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
                <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 text-center">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                  <DialogTitle
                    as="h3"
                    className="mt-4 text-lg font-medium text-gray-900"
                  >
                    Payment Successful!
                  </DialogTitle>
                  <p className="mt-2 text-sm text-gray-500">
                    Your payment of ${invoice.amount.toFixed(2)} for invoice{" "}
                    {invoice.invoiceNumber} has been processed successfully.
                  </p>
                  <Button className="mt-6" onClick={onClose}>
                    Close
                  </Button>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

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
              <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  Pay Invoice {invoice.invoiceNumber}
                </DialogTitle>

                {/* Invoice Summary */}
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Amount Due</span>
                    <span className="text-lg font-medium text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Due Date</span>
                    <span className="text-sm text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">
                    Select Payment Method
                  </h4>
                  <div className="mt-2 space-y-3">
                    {mockSavedCards.map(card => (
                      <div
                        key={card.id}
                        className={`
                          flex cursor-pointer items-center rounded-lg border p-4
                          ${
                            selectedCard === card.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200"
                          }
                        `}
                        onClick={() => setSelectedCard(card.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCardIcon className="h-6 w-6 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {card.type.charAt(0).toUpperCase() +
                                card.type.slice(1)}{" "}
                              ending in {card.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires {card.expiryMonth}/{card.expiryYear}
                            </p>
                          </div>
                        </div>
                        {card.isDefault && (
                          <span className="ml-auto rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Line Items */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">
                    Invoice Items
                  </h4>
                  <div className="mt-2 space-y-2">
                    {invoice.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {item.description}
                        </span>
                        <span className="font-medium text-gray-900">
                          ${item.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handlePayment} loading={isLoading}>
                    <BanknotesIcon className="mr-2 h-5 w-5" />
                    Pay ${invoice.amount.toFixed(2)}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
