// src/components/hosting/StatisticsModal.tsx
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ManageHostingModalProps {
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

// Generate mock historical data
const generateHistoricalData = () => {
  const data = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i < 12; i++) {
    data.push({
      name: months[i],
      diskUsage: Math.floor(Math.random() * 8) + 2,
      bandwidthUsage: Math.floor(Math.random() * 60) + 20,
    });
  }
  return data;
};

export function StatisticsModal({
  isOpen,
  onClose,
  plan,
}: ManageHostingModalProps) {
  if (!plan) return null;

  const historicalData = generateHistoricalData();

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    Statistics - {plan.name}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  {/* Resource Usage */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Resource Usage</h4>
                    <div className="mt-4 space-y-4">
                      {/* Disk Usage */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Disk Usage</span>
                          <span>
                            {plan.resources.diskUsage.toFixed(1)}GB /{" "}
                            {plan.resources.diskLimit}GB
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                (plan.resources.diskUsage /
                                  plan.resources.diskLimit) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Bandwidth Usage */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Bandwidth</span>
                          <span>
                            {plan.resources.bandwidthUsage.toFixed(1)}GB /{" "}
                            {plan.resources.bandwidthLimit}GB
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                (plan.resources.bandwidthUsage /
                                  plan.resources.bandwidthLimit) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Usage History */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Usage History</h4>
                    <div className="mt-4">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={historicalData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="diskUsage"
                              name="Disk Usage (GB)"
                              stroke="#3b82f6"
                              strokeWidth={2}
                            />
                            <Line
                              type="monotone"
                              dataKey="bandwidthUsage"
                              name="Bandwidth Usage (GB)"
                              stroke="#10b981"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
