// src/components/hosting/HostingRenewalModal.tsx
"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface HostingRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  expiryDate: string;
  currentPrice: number;
}

export function HostingRenewalModal({
  isOpen,
  onClose,
  planName,
  expiryDate,
  currentPrice,
}: HostingRenewalModalProps) {
  const [renewalPeriod, setRenewalPeriod] = useState(12); // months
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRenewal = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement actual renewal logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            Renew Hosting Plan
          </Dialog.Title>

          <div className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <p className="font-medium">{planName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Current Expiry Date</p>
                <p className="font-medium">
                  {new Date(expiryDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Renewal Period
                </label>
                <select
                  value={renewalPeriod}
                  onChange={e => setRenewalPeriod(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value={12}>1 Year (${currentPrice})</option>
                  <option value={24}>2 Years (${currentPrice * 1.9})</option>
                  <option value={36}>3 Years (${currentPrice * 2.7})</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleRenewal} loading={isProcessing}>
                Renew Plan
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
