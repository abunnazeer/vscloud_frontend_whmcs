// src/components/billing/PaymentMethodModal.tsx
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
import { Input } from "@/components/ui/input";
import {
  CreditCardIcon,
  PlusIcon,
  CheckCircleIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockPaymentMethods: PaymentMethod[] = [
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

export default function PaymentMethodModal({
  isOpen,
  onClose,
}: PaymentMethodModalProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(mockPaymentMethods);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    name: "",
  });

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement card addition with payment gateway
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock new card addition
      const newCard: PaymentMethod = {
        id: Date.now().toString(),
        type: "visa",
        last4: formData.cardNumber.slice(-4),
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        isDefault: false,
      };

      setPaymentMethods([...paymentMethods, newCard]);
      setIsAddingNew(false);
      setFormData({
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        name: "",
      });
    } catch (error) {
      console.error("Failed to add card:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement card removal with payment gateway
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPaymentMethods(paymentMethods.filter(card => card.id !== cardId));
    } catch (error) {
      console.error("Failed to remove card:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (cardId: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement set default card with payment gateway
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPaymentMethods(
        paymentMethods.map(card => ({
          ...card,
          isDefault: card.id === cardId,
        }))
      );
    } catch (error) {
      console.error("Failed to set default card:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCardIcon = (type: PaymentMethod["type"]) => {
    // TODO: Replace with actual card brand icons
    return <CreditCardIcon className="h-6 w-6" />;
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
              <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  Payment Methods
                </DialogTitle>

                {/* Existing Payment Methods */}
                {!isAddingNew && (
                  <>
                    <div className="mt-4 space-y-4">
                      {paymentMethods.map(method => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center space-x-4">
                            {getCardIcon(method.type)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                •••• {method.last4}
                              </p>
                              <p className="text-sm text-gray-500">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </p>
                            </div>
                            {method.isDefault && (
                              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {!method.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefault(method.id)}
                                disabled={isLoading}
                              >
                                <CheckIcon className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveCard(method.id)}
                              disabled={isLoading || method.isDefault}
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="mt-6 w-full"
                      onClick={() => setIsAddingNew(true)}
                    >
                      <PlusIcon className="mr-2 h-5 w-5" />
                      Add Payment Method
                    </Button>
                  </>
                )}

                {/* Add New Card Form */}
                {isAddingNew && (
                  <form onSubmit={handleAddCard} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Card Number
                      </label>
                      <Input
                        type="text"
                        value={formData.cardNumber}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            cardNumber: e.target.value,
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Month
                        </label>
                        <Input
                          type="text"
                          value={formData.expiryMonth}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              expiryMonth: e.target.value,
                            })
                          }
                          placeholder="MM"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Year
                        </label>
                        <Input
                          type="text"
                          value={formData.expiryYear}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              expiryYear: e.target.value,
                            })
                          }
                          placeholder="YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <Input
                          type="text"
                          value={formData.cvv}
                          onChange={e =>
                            setFormData({ ...formData, cvv: e.target.value })
                          }
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name on Card
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={e =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingNew(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" loading={isLoading}>
                        Add Card
                      </Button>
                    </div>
                  </form>
                )}

                {!isAddingNew && (
                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
