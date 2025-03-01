// src/components/admin/tickets/BulkAssignmentModal.tsx
"use client";

import { Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const bulkAssignmentSchema = z.object({
  agentId: z.string().min(1, "Agent is required"),
  note: z.string().optional(),
  sendNotification: z.boolean().optional(),
  assignmentStrategy: z.enum(["equal", "sequential", "random"]),
});

type BulkAssignmentFormData = z.infer<typeof bulkAssignmentSchema>;

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "available" | "busy" | "offline";
  activeTickets: number;
}

interface BulkAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: BulkAssignmentFormData) => void;
  selectedTickets: string[];
  agents: Agent[];
}

export default function BulkAssignmentModal({
  isOpen,
  onClose,
  onAssign,
  selectedTickets,
  agents,
}: BulkAssignmentModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BulkAssignmentFormData>({
    resolver: zodResolver(bulkAssignmentSchema),
    defaultValues: {
      assignmentStrategy: "equal",
      sendNotification: true,
    },
  });

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "available":
        return "text-green-600";
      case "busy":
        return "text-yellow-600";
      case "offline":
        return "text-gray-600";
    }
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
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  Bulk Assign Tickets ({selectedTickets.length} selected)
                </DialogTitle>

                <form onSubmit={handleSubmit(onAssign)} className="mt-4">
                  <div className="space-y-4">
                    {/* Assignment Strategy */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Assignment Strategy
                      </label>
                      <select
                        {...register("assignmentStrategy")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="equal">Equal Distribution</option>
                        <option value="sequential">
                          Sequential Assignment
                        </option>
                        <option value="random">Random Assignment</option>
                      </select>
                      {errors.assignmentStrategy && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.assignmentStrategy.message}
                        </p>
                      )}
                    </div>

                    {/* Agent Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Select Agents
                      </label>
                      <div className="mt-2 space-y-2">
                        {agents.map(agent => (
                          <label
                            key={agent.id}
                            className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              {...register("agentId")}
                              value={agent.id}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex flex-1 items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {agent.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {agent.role}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`text-sm font-medium ${getStatusColor(
                                    agent.status
                                  )}`}
                                >
                                  {agent.status}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {agent.activeTickets} active tickets
                                </p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.agentId && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.agentId.message}
                        </p>
                      )}
                    </div>

                    {/* Assignment Note */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Assignment Note (Optional)
                      </label>
                      <textarea
                        {...register("note")}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Add a note about this bulk assignment..."
                      />
                    </div>

                    {/* Notification Option */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("sendNotification")}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Send notifications to assigned agents
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose} type="button">
                      Cancel
                    </Button>
                    <Button type="submit">Assign Tickets</Button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
