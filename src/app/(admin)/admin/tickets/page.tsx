// src/app/(admin)/admin/tickets/page.tsx
"use client";

import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import TicketDetailsModal from "@/components/admin/tickets/TicketDetailsModal";
import TicketAssignmentModal from "@/components/admin/tickets/TicketAssignmentModal";
import BulkAssignmentModal from "@/components/admin/tickets/BulkAssignmentModal";
import CreateTicketModal from "@/components/admin/tickets/CreateTicketModal";
import TicketFilters from "@/components/admin/tickets/TicketFilters";

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
  assignedTo?: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "available" | "busy" | "offline";
  activeTickets: number;
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "John Support",
    role: "Support Agent",
    status: "available",
    activeTickets: 3,
  },
  {
    id: "2",
    name: "Jane Tech",
    role: "Technical Support",
    status: "busy",
    activeTickets: 5,
  },
];

const mockTickets: Ticket[] = [
  {
    id: "1",
    subject: "Server downtime issue",
    status: "open",
    priority: "high",
    category: "technical",
    userId: "user1",
    userName: "John Doe",
    createdAt: "2024-02-07T10:30:00",
    updatedAt: "2024-02-07T10:30:00",
    messages: [
      {
        id: "msg1",
        content: "My server has been down for the last hour. Need urgent help!",
        sender: "user",
        senderName: "John Doe",
        createdAt: "2024-02-07T10:30:00",
      },
    ],
  },
  {
    id: "2",
    subject: "Billing inquiry",
    status: "in_progress",
    priority: "medium",
    category: "billing",
    userId: "user2",
    userName: "Jane Smith",
    createdAt: "2024-02-07T09:15:00",
    updatedAt: "2024-02-07T11:30:00",
    lastReply: "2024-02-07T11:30:00",
    assignedTo: "1",
    messages: [
      {
        id: "msg2",
        content: "I have a question about my last invoice.",
        sender: "user",
        senderName: "Jane Smith",
        createdAt: "2024-02-07T09:15:00",
      },
      {
        id: "msg3",
        content:
          "I'll be happy to help you with your billing inquiry. Could you please provide your invoice number?",
        sender: "agent",
        senderName: "Support Agent",
        createdAt: "2024-02-07T11:30:00",
      },
    ],
  },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

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

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsModalOpen(true);
  };

  const handleAssignTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsAssignModalOpen(true);
  };

  const handleBulkAssign = () => {
    if (selectedTickets.length > 0) {
      setIsBulkAssignModalOpen(true);
    }
  };

  const handleStatusChange = (
    ticketId: string,
    newStatus: Ticket["status"]
  ) => {
    setTickets(
      tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const handleTicketReply = (ticketId: string, replyData: any) => {
    setTickets(
      tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            messages: [
              ...ticket.messages,
              {
                id: Date.now().toString(),
                content: replyData.content,
                sender: "agent",
                senderName: "Support Agent",
                createdAt: new Date().toISOString(),
              },
            ],
            status: replyData.status || ticket.status,
            lastReply: new Date().toISOString(),
          };
        }
        return ticket;
      })
    );
  };

  const handleCreateTicket = (data: any) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "open",
      messages: [],
    };
    setTickets([newTicket, ...tickets]);
    setIsCreateModalOpen(false);
  };

  const handleAssignment = (data: any) => {
    if (selectedTicket) {
      setTickets(
        tickets.map(ticket =>
          ticket.id === selectedTicket.id
            ? { ...ticket, assignedTo: data.agentId }
            : ticket
        )
      );
      setIsAssignModalOpen(false);
      setSelectedTicket(null);
    }
  };

  const handleBulkAssignment = (data: any) => {
    setTickets(
      tickets.map(ticket =>
        selectedTickets.includes(ticket.id)
          ? { ...ticket, assignedTo: data.agentId }
          : ticket
      )
    );
    setIsBulkAssignModalOpen(false);
    setSelectedTickets([]);
  };

  const handleApplyFilters = (filters: any) => {
    // TODO: Implement filter logic
    console.log("Applied filters:", filters);
    setIsFiltersModalOpen(false);
  };

  const calculateStats = () => {
    return {
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === "open").length,
      inProgressTickets: tickets.filter(t => t.status === "in_progress").length,
      resolvedTickets: tickets.filter(t => t.status === "resolved").length,
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Support Tickets
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage and respond to customer support tickets
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* ... [Stats cards - same as before] ... */}
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsFiltersModalOpen(true)}>
          <FunnelIcon className="mr-2 h-5 w-5" />
          Filter
        </Button>
        {selectedTickets.length > 0 && (
          <Button onClick={handleBulkAssign}>
            Assign Selected ({selectedTickets.length})
          </Button>
        )}
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="mr-2 h-5 w-5" />
          Create Ticket
        </Button>
      </div>

      {/* Tickets List */}
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Tickets</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {tickets.map(ticket => (
            <div key={ticket.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedTickets.includes(ticket.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedTickets([...selectedTickets, ticket.id]);
                      } else {
                        setSelectedTickets(
                          selectedTickets.filter(id => id !== ticket.id)
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <button
                      onClick={() => handleViewTicket(ticket)}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      {ticket.subject}
                    </button>
                    <p className="text-sm text-gray-500">
                      {ticket.userName} • #{ticket.id}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
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
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Created {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                    {ticket.lastReply && (
                      <p className="text-sm text-gray-500">
                        Last reply{" "}
                        {new Date(ticket.lastReply).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignTicket(ticket)}
                  >
                    {ticket.assignedTo ? "Reassign" : "Assign"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedTicket && (
        <TicketDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
          onStatusChange={status =>
            handleStatusChange(selectedTicket.id, status)
          }
          onReply={data => handleTicketReply(selectedTicket.id, data)}
        />
      )}

      {selectedTicket && (
        <TicketAssignmentModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedTicket(null);
          }}
          onAssign={handleAssignment}
          ticketId={selectedTicket.id}
          currentAssignee={selectedTicket.assignedTo}
          agents={mockAgents}
        />
      )}

      <BulkAssignmentModal
        isOpen={isBulkAssignModalOpen}
        onClose={() => setIsBulkAssignModalOpen(false)}
        onAssign={handleBulkAssignment}
        selectedTickets={selectedTickets}
        agents={mockAgents}
      />

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
      />

      <TicketFilters
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={{}}
      />

      {/* Stats Overview Content */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Total Tickets
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalTickets}
              </p>
              <p className="text-sm text-green-600">All time</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Open</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.openTickets}
              </p>
              <p className="text-sm text-yellow-600">Needs attention</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">In Progress</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.inProgressTickets}
              </p>
              <p className="text-sm text-blue-600">Being handled</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Resolved</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.resolvedTickets}
              </p>
              <p className="text-sm text-green-600">This week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
