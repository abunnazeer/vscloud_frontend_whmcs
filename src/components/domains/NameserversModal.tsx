// src/components/domains/NameserversModal.tsx
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
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface NameserversModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
}

// Default nameservers for quick selection
const defaultNameservers = {
  "Default VSCloud": ["ns1.vscloud.com", "ns2.vscloud.com"],
  Cloudflare: ["ned.ns.cloudflare.com", "nia.ns.cloudflare.com"],
  "Google Cloud": [
    "ns-cloud-a1.googledomains.com",
    "ns-cloud-a2.googledomains.com",
  ],
};

export default function NameserversModal({
  isOpen,
  onClose,
  domain,
}: NameserversModalProps) {
  const [nameservers, setNameservers] = useState<string[]>([
    "ns1.vscloud.com",
    "ns2.vscloud.com",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddNameserver = () => {
    if (nameservers.length < 4) {
      setNameservers([...nameservers, ""]);
    }
  };

  const handleRemoveNameserver = (index: number) => {
    setNameservers(nameservers.filter((_, i) => i !== index));
  };

  const handleUpdateNameserver = (index: number, value: string) => {
    const newNameservers = [...nameservers];
    newNameservers[index] = value;
    setNameservers(newNameservers);
  };

  const handleQuickSelect = (provider: keyof typeof defaultNameservers) => {
    setNameservers([...defaultNameservers[provider]]);
  };

  const validateNameservers = () => {
    // Basic nameserver validation
    const nsPattern =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return nameservers.every(ns => nsPattern.test(ns));
  };

  const handleSave = async () => {
    if (!validateNameservers()) {
      setError("Please enter valid nameserver addresses");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement actual nameserver update API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (err) {
      setError("Failed to update nameservers. Please try again.");
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
                    Nameservers Updated Successfully
                  </DialogTitle>
                  <p className="mt-2 text-sm text-gray-500">
                    The nameservers for {domain} have been updated. Changes may
                    take 24-48 hours to propagate.
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
                  Manage Nameservers - {domain}
                </DialogTitle>

                <div className="mt-4">
                  {/* Quick Select Section */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700">
                      Quick Select
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.keys(defaultNameservers).map(provider => (
                        <Button
                          key={provider}
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuickSelect(
                              provider as keyof typeof defaultNameservers
                            )
                          }
                        >
                          {provider}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Warning Message */}
                  <div className="mb-6 rounded-lg bg-yellow-50 p-4">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Changes to nameservers may take 24-48 hours to
                          propagate globally.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Nameservers List */}
                  <div className="space-y-4">
                    {nameservers.map((ns, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={ns}
                          onChange={e =>
                            handleUpdateNameserver(index, e.target.value)
                          }
                          placeholder={`Nameserver ${index + 1}`}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveNameserver(index)}
                          className="shrink-0"
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {nameservers.length < 4 && (
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={handleAddNameserver}
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Nameserver
                    </Button>
                  )}

                  {error && (
                    <p className="mt-4 text-sm text-red-600">{error}</p>
                  )}

                  <div className="mt-6 flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} loading={isLoading}>
                      Save Changes
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
