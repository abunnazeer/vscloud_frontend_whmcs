// src/components/domains/DomainRenewalModal.tsx
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
  CheckIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface RenewalOption {
  years: number;
  pricePerYear: number;
  savings?: number;
}

interface DomainRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  expiryDate: string;
}

const renewalOptions: RenewalOption[] = [
  { years: 1, pricePerYear: 12.99 },
  { years: 2, pricePerYear: 11.99, savings: 2 },
  { years: 5, pricePerYear: 10.99, savings: 10 },
  { years: 10, pricePerYear: 9.99, savings: 20 },
];

export default function DomainRenewalModal({
  isOpen,
  onClose,
  domain,
  expiryDate,
}: DomainRenewalModalProps) {
  const [selectedOption, setSelectedOption] = useState<RenewalOption>(
    renewalOptions[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotal = (option: RenewalOption) => {
    return option.years * option.pricePerYear;
  };

  const handleRenewal = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement actual renewal API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (err) {
      setError("Failed to process renewal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNewExpiryDate = (years: number) => {
    const date = new Date(expiryDate);
    date.setFullYear(date.getFullYear() + years);
    return formatDate(date.toISOString());
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
                    Renewal Successful!
                  </DialogTitle>
                  <p className="mt-2 text-sm text-gray-500">
                    {domain} has been renewed for {selectedOption.years} year
                    {selectedOption.years > 1 ? "s" : ""}. New expiry date:{" "}
                    {calculateNewExpiryDate(selectedOption.years)}
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
                  Renew Domain - {domain}
                </DialogTitle>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Current expiry date: {formatDate(expiryDate)}
                  </p>

                  <div className="mt-6 space-y-4">
                    {renewalOptions.map(option => (
                      <div
                        key={option.years}
                        className={`relative rounded-lg border p-4 cursor-pointer hover:border-blue-500 ${
                          selectedOption === option
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedOption(option)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {option.years} Year{option.years > 1 ? "s" : ""}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              ${option.pricePerYear}/year
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-medium text-gray-900">
                              ${calculateTotal(option)}
                            </p>
                            {option.savings && (
                              <p className="text-sm text-green-600">
                                Save {option.savings}%
                              </p>
                            )}
                          </div>
                          {selectedOption === option && (
                            <CheckIcon className="absolute right-4 h-5 w-5 text-blue-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                  )}

                  <div className="mt-6">
                    <p className="text-sm text-gray-500">
                      New expiry date:{" "}
                      {calculateNewExpiryDate(selectedOption.years)}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleRenewal} loading={isLoading}>
                      <CreditCardIcon className="mr-2 h-5 w-5" />
                      Pay ${calculateTotal(selectedOption)}
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
