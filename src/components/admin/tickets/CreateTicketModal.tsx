// src/components/admin/tickets/CreateTicketModal.tsx
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

const ticketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  category: z.enum(["technical", "billing", "sales", "general"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  userId: z.string().min(1, "User is required"),
  message: z.string().min(1, "Message is required"),
  assignTo: z.string().optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => void;
}

export default function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTicketModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      category: "general",
      priority: "medium",
    },
  });

  const handleFormSubmit = (data: TicketFormData) => {
    onSubmit(data);
    reset();
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
                  Create New Support Ticket
                </DialogTitle>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="mt-4"
                >
                  <div className="space-y-4">
                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <input
                        type="text"
                        {...register("subject")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Brief description of the issue"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        {...register("category")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing</option>
                        <option value="sales">Sales</option>
                        <option value="general">General Inquiry</option>
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        {...register("priority")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      {errors.priority && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.priority.message}
                        </p>
                      )}
                    </div>

                    {/* User */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        User
                      </label>
                      <select
                        {...register("userId")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Select User</option>
                        <option value="user1">John Doe</option>
                        <option value="user2">Jane Smith</option>
                      </select>
                      {errors.userId && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.userId.message}
                        </p>
                      )}
                    </div>

                    {/* Assign To */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Assign To (Optional)
                      </label>
                      <select
                        {...register("assignTo")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Select Agent</option>
                        <option value="agent1">Support Agent 1</option>
                        <option value="agent2">Support Agent 2</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        {...register("message")}
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Detailed description of the issue..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose} type="button">
                      Cancel
                    </Button>
                    <Button type="submit">Create Ticket</Button>
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
