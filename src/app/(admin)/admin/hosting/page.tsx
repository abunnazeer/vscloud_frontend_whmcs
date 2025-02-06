// src/app/(admin)/admin/hosting/page.tsx
"use client";

import { useState } from "react";
import {
  ServerIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import ServerFormModal from "@/components/admin/ServerFormModal";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";

interface HostingServer {
  id: string;
  name: string;
  type: "cpanel" | "plesk" | "directadmin";
  url: string;
  username: string;
  status: "active" | "error" | "maintenance";
  lastSync: string;
  packageCount?: number;
  accountCount?: number;
}

const mockServers: HostingServer[] = [
  {
    id: "1",
    name: "Main Production Server",
    type: "cpanel",
    url: "https://cp1.vscloud.com:2087",
    username: "admin",
    status: "active",
    lastSync: "2024-02-06T10:30:00",
    packageCount: 15,
    accountCount: 156,
  },
  {
    id: "2",
    name: "Backup Server",
    type: "plesk",
    url: "https://plesk.vscloud.com:8443",
    username: "admin",
    status: "active",
    lastSync: "2024-02-06T10:30:00",
    packageCount: 8,
    accountCount: 43,
  },
];

export default function HostingPage() {
  const [servers, setServers] = useState<HostingServer[]>(mockServers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<HostingServer | null>(
    null
  );
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});

  const getStatusColor = (status: HostingServer["status"]) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "maintenance":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: HostingServer["status"]) => {
    switch (status) {
      case "active":
        return (
          <CheckCircleIcon className={`h-5 w-5 ${getStatusColor(status)}`} />
        );
      case "error":
      case "maintenance":
        return (
          <ExclamationCircleIcon
            className={`h-5 w-5 ${getStatusColor(status)}`}
          />
        );
    }
  };

  const handleAddServer = () => {
    setSelectedServer(null);
    setIsAddModalOpen(true);
  };

  const handleEditServer = (server: HostingServer) => {
    setSelectedServer(server);
    setIsAddModalOpen(true);
  };

  const handleDeleteServer = (server: HostingServer) => {
    setSelectedServer(server);
    setIsDeleteModalOpen(true);
  };

  const handleTestConnection = async (serverId: string) => {
    setIsSyncing({ ...isSyncing, [serverId]: true });
    try {
      // TODO: Implement actual connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Testing connection:", serverId);
    } finally {
      setIsSyncing({ ...isSyncing, [serverId]: false });
    }
  };

  const handleSyncServer = async (serverId: string) => {
    setIsSyncing({ ...isSyncing, [serverId]: true });
    try {
      // TODO: Implement actual server sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Syncing server:", serverId);
    } finally {
      setIsSyncing({ ...isSyncing, [serverId]: false });
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Hosting Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your hosting control panel integrations
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4">
          <Button onClick={handleAddServer}>
            <PlusIcon className="mr-2 h-5 w-5" />
            Add Server
          </Button>
        </div>

        {/* Servers List */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Connected Servers
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {servers.map(server => (
              <div key={server.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <ServerIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {server.name}
                      </h3>
                      <p className="text-sm text-gray-500">{server.url}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(server.status)}
                      <span className="text-sm capitalize text-gray-500">
                        {server.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(server.id)}
                      loading={isSyncing[server.id]}
                    >
                      Test Connection
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSyncServer(server.id)}
                      loading={isSyncing[server.id]}
                    >
                      <ArrowPathIcon className="mr-2 h-4 w-4" />
                      Sync
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditServer(server)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteServer(server)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Server Details */}
                <div className="mt-4 grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium capitalize">{server.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Username</p>
                    <p className="font-medium">{server.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Sync</p>
                    <p className="font-medium">
                      {new Date(server.lastSync).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Hosting Packages</p>
                    <p className="font-medium">{server.packageCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Active Accounts</p>
                    <p className="font-medium">{server.accountCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Server Modal */}
      <ServerFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        server={selectedServer}
        onSubmit={data => {
          if (selectedServer) {
            setServers(
              servers.map(s =>
                s.id === selectedServer.id ? { ...s, ...data } : s
              )
            );
          } else {
            setServers([
              ...servers,
              {
                ...data,
                id: Date.now().toString(),
                status: "active",
                lastSync: new Date().toISOString(),
              },
            ]);
          }
          setIsAddModalOpen(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (selectedServer) {
            setServers(servers.filter(s => s.id !== selectedServer.id));
          }
          setIsDeleteModalOpen(false);
        }}
        title="Delete Server"
        message={`Are you sure you want to delete ${selectedServer?.name}? This action cannot be undone.`}
      />
    </>
  );
}
