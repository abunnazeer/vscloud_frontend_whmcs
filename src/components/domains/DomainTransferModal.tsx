// src/components/domains/DomainTransferModal.tsx
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
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface DomainTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
}

type TransferStep = "epp" | "confirmation" | "processing" | "complete";

export default function DomainTransferModal({
  isOpen,
  onClose,
  domain,
}: DomainTransferModalProps) {
  const [currentStep, setCurrentStep] = useState<TransferStep>("epp");
  const [eppCode, setEppCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransferInitiate = async () => {
    if (!eppCode) {
      setError("EPP code is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement actual transfer initiation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep("confirmation");
    } catch (err) {
      setError("Failed to initiate transfer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTransfer = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual transfer confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep("processing");

      // Simulate transfer completion after 3 seconds
      setTimeout(() => {
        setCurrentStep("complete");
      }, 3000);
    } catch (err) {
      setError("Failed to confirm transfer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "epp":
        return (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              To transfer your domain, please enter the EPP (Authorization) code
              from your current registrar.
            </p>
            <div className="mt-4">
              <label
                htmlFor="epp"
                className="block text-sm font-medium text-gray-700"
              >
                EPP Code
              </label>
              <Input
                id="epp"
                type="text"
                value={eppCode}
                onChange={e => setEppCode(e.target.value)}
                placeholder="Enter EPP code"
                className="mt-1"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleTransferInitiate} loading={isLoading}>
                Continue
              </Button>
            </div>
          </div>
        );

      case "confirmation":
        return (
          <div className="mt-4">
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Please confirm the transfer
                  </h3>
                  <p className="mt-2 text-sm text-yellow-700">
                    This will initiate the transfer process for {domain}. The
                    process typically takes 5-7 days to complete.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirmTransfer} loading={isLoading}>
                Confirm Transfer
              </Button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="mt-4 text-center">
            <ArrowPathIcon className="mx-auto h-12 w-12 animate-spin text-blue-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Transfer in Progress
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              We've initiated the transfer for {domain}. This process may take
              5-7 days to complete.
            </p>
            <Button className="mt-6" onClick={onClose}>
              Close
            </Button>
          </div>
        );

      case "complete":
        return (
          <div className="mt-4 text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Transfer Initiated Successfully
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              The transfer process has been initiated for {domain}. You'll
              receive email updates about the transfer status.
            </p>
            <Button className="mt-6" onClick={onClose}>
              Close
            </Button>
          </div>
        );
    }
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
              <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  Transfer Domain - {domain}
                </DialogTitle>
                {renderStepContent()}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
