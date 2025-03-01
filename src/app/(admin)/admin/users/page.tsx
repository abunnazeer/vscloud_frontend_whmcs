// src/app/(admin)/admin/users/page.tsx
"use client";

import { useState } from "react";
import {
  UserIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import UserModal from "@/components/admin/users/UserModal";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "inactive";
  role: "admin" | "client";
  joinedDate: string;
  lastLogin: string;
  phone?: string;
  company?: string;
  subscriptionStatus?: "trial" | "active" | "expired";
  totalOrders?: number;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "client",
    joinedDate: "2024-01-15",
    lastLogin: "2024-02-07",
    phone: "+1234567890",
    company: "Tech Corp",
    subscriptionStatus: "active",
    totalOrders: 5,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    role: "admin",
    joinedDate: "2023-12-01",
    lastLogin: "2024-02-06",
    phone: "+1987654321",
    subscriptionStatus: "trial",
    totalOrders: 0,
  },
];

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    setModalMode("create");
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    setModalMode("view");
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(
      users.map(user =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "suspended" ? "active" : "suspended",
            }
          : user
      )
    );
  };

  const handleSubmitUser = async (data: any) => {
    if (selectedUser) {
      // Update existing user
      setUsers(
        users.map(user =>
          user.id === selectedUser.id ? { ...user, ...data } : user
        )
      );
    } else {
      // Add new user
      const newUser = {
        ...data,
        id: Date.now().toString(),
        joinedDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
    }
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
    }
  };

  const getSubscriptionColor = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "trial":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your system users and their permissions
          </p>
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
                placeholder="Search users..."
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline">
            <FunnelIcon className="mr-2 h-5 w-5" />
            Filter
          </Button>
          <Button onClick={handleCreateUser}>
            <PlusIcon className="mr-2 h-5 w-5" />
            Add User
          </Button>
        </div>

        {/* Users List */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">System Users</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <div key={user.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <UserIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600"
                      >
                        {user.name}
                      </button>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status === "active" ? (
                          <CheckCircleIcon className="mr-1 h-4 w-4" />
                        ) : (
                          <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                        )}
                        {user.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* User Details */}
                <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Role</p>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Subscription</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSubscriptionColor(
                        user.subscriptionStatus
                      )}`}
                    >
                      {user.subscriptionStatus || "none"}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">Orders</p>
                    <p className="font-medium">{user.totalOrders || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Joined Date</p>
                    <p className="font-medium">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="mt-4 border-t pt-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleSuspendUser(user.id)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {user.status === "suspended"
                        ? "Unsuspend User"
                        : "Suspend User"}
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      View Activity Log
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Manage Permissions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser || undefined}
        mode={modalMode}
        onSubmit={handleSubmitUser}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
      />
    </>
  );
}
