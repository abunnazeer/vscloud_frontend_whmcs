// src/components/admin/tickets/TicketAssignmentModal.tsx
"use client";

import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const assignmentSchema = z.object({
  agentId: z.string().min(1, "Agent is required"),
  note: z.string().optional(),
  sendNotification: z.boolean().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "available" | "busy" | "offline";
  activeTickets: number;
}

interface TicketAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: AssignmentFormData) => void;
  ticketId: string;
  currentAssignee?: string;
  agents: Agent[];
}

export default function TicketAssignmentModal({
  isOpen,
  onClose,
  onAssign,
  ticketId,
  currentAssignee,
  agents,
}: TicketAssignmentModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      agentId: currentAssignee,
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
            <Transition.Child
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
                  Assign Ticket #{ticketId}
                </DialogTitle>

                <form onSubmit={handleSubmit(onAssign)} className="mt-4">
                  <div className="space-y-4">
                    {/* Agent Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Select Agent
                      </label>
                      <div className="mt-2 space-y-2">
                        {agents.map(agent => (
                          <label
                            key={agent.id}
                            className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50"
                          >
                            <input
                              type="radio"
                              {...register("agentId")}
                              value={agent.id}
                              className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
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
                        placeholder="Add a note about this assignment..."
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
                        Send notification to assigned agent
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose} type="button">
                      Cancel
                    </Button>
                    <Button type="submit">Assign Ticket</Button>
                  </div>
                </form>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
