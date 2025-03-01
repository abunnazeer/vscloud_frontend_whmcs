// src/components/hosting/HostingUpgradeModal.tsx
"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

interface UpgradePlan {
  id: string;
  name: string;
  price: number;
  storage: string;
  bandwidth: string;
  features: string[];
}

interface HostingUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  availableUpgrades: UpgradePlan[];
}

export function HostingUpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  availableUpgrades,
}: HostingUpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement actual upgrade logic
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
        <Dialog.Panel className="mx-auto max-w-2xl rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            Upgrade Hosting Plan
          </Dialog.Title>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Current Plan: <span className="font-medium">{currentPlan}</span>
            </p>

            <div className="mt-4 space-y-4">
              {availableUpgrades.map(plan => (
                <div
                  key={plan.id}
                  className={`rounded-lg border p-4 ${
                    selectedPlan === plan.id
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <label className="flex items-center space-x-4">
                    <input
                      type="radio"
                      name="upgrade-plan"
                      value={plan.id}
                      checked={selectedPlan === plan.id}
                      onChange={e => setSelectedPlan(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{plan.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${plan.price}/month
                      </p>
                      <ul className="mt-2 space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleUpgrade}
                loading={isProcessing}
                disabled={!selectedPlan}
              >
                Upgrade Plan
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
