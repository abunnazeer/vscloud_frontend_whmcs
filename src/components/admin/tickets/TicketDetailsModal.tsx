// src/components/admin/tickets/TicketDetailsModal.tsx
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
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  senderName: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "technical" | "billing" | "sales" | "general";
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  lastReply?: string;
  messages: Message[];
}

const replySchema = z.object({
  content: z.string().min(1, "Reply content is required"),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  internal: z.boolean().optional(),
});

type ReplyFormData = z.infer<typeof replySchema>;

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onReply: (data: ReplyFormData) => void;
  onStatusChange: (status: Ticket["status"]) => void;
}

export default function TicketDetailsModal({
  isOpen,
  onClose,
  ticket,
  onReply,
  onStatusChange,
}: TicketDetailsModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      internal: false,
    },
  });

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-yellow-100 text-yellow-800";
      case "urgent":
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusIcon = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case "in_progress":
        return <ClockIcon className="h-4 w-4" />;
      case "resolved":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "closed":
        return <ExclamationTriangleIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const handleReplySubmit = (data: ReplyFormData) => {
    onReply(data);
    reset();
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
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium text-gray-900"
                    >
                      Ticket #{ticket.id}: {ticket.subject}
                    </DialogTitle>
                    <p className="mt-1 text-sm text-gray-500">
                      Opened by {ticket.userName} on{" "}
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1 capitalize">
                        {ticket.status.replace("_", " ")}
                      </span>
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>

                {/* Message Thread */}
                <div className="mt-6 space-y-6">
                  {ticket.messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "agent"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg p-4 ${
                          message.sender === "agent"
                            ? "bg-blue-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {message.senderName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={handleSubmit(handleReplySubmit)}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reply
                    </label>
                    <textarea
                      {...register("content")}
                      rows={4}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                      placeholder="Type your reply..."
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.content.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <select
                        {...register("status")}
                        className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                        onChange={e =>
                          onStatusChange(e.target.value as Ticket["status"])
                        }
                      >
                        <option value="">Update Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register("internal")}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Internal Note
                        </span>
                      </label>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline" onClick={onClose} type="button">
                        Close
                      </Button>
                      <Button type="submit">Send Reply</Button>
                    </div>
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
