// src/components/hosting/CPanelRedirectModal.tsx
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface CPanelRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    domain: string;
    type: string;
    resources: {
      diskUsage: number;
      diskLimit: number;
      bandwidthUsage: number;
      bandwidthLimit: number;
    };
  } | null;
}

export function CPanelRedirectModal({
  isOpen,
  onClose,
  plan,
}: CPanelRedirectModalProps) {
  if (!plan) return null;

  const handleRedirect = () => {
    // Replace with your actual cPanel URL generation logic
    const cpanelUrl = `https://cpanel.${plan.domain}:2083`;
    window.open(cpanelUrl, "_blank");
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  Access cPanel
                </Dialog.Title>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    You will be redirected to the cPanel login page for{" "}
                    {plan.domain}. Please ensure you have your login credentials
                    ready.
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleRedirect}>Continue to cPanel</Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
