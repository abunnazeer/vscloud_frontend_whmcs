// "use client";

// import { useState, useEffect } from "react";
// import {
//   ServerIcon,
//   PlusIcon,
//   CheckCircleIcon,
//   ExclamationCircleIcon,
//   TrashIcon,
//   PencilIcon,
//   ArrowPathIcon,
//   CubeIcon,
// } from "@heroicons/react/24/outline";
// import { Button } from "@/components/ui/button";
// import ServerFormModal from "@/components/admin/ServerFormModal";
// import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
// import Link from "next/link";
// import { api } from "@/lib/api";
// import { toast } from "react-hot-toast";

// interface HostingServer {
//   id: string;
//   name: string;
//   hostname: string;
//   ipAddress: string;
//   port: number;
//   username: string;
//   password: string;
//   useSSL: boolean;
//   type: "cpanel" | "plesk" | "DIRECTADMIN";
//   status: "active" | "error" | "maintenance";
//   lastSync?: string;
//   packageCount?: number;
//   accountCount?: number;
// }

// export default function HostingPage() {
//   const [servers, setServers] = useState<HostingServer[]>([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedServer, setSelectedServer] = useState<HostingServer | null>(
//     null
//   );
//   const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchServerCounts = async (serverId: string) => {
//     try {
//       const [packagesResponse, usersResponse] = await Promise.all([
//         api.daPackages.listPackages(serverId),
//         api.daUsers.listUsers(serverId),
//       ]);

//       return {
//         packageCount: packagesResponse.data?.length || 0,
//         accountCount: usersResponse.data?.length || 0,
//       };
//     } catch (error) {
//       console.error(`Failed to fetch counts for server ${serverId}:`, error);
//       return {
//         packageCount: 0,
//         accountCount: 0,
//       };
//     }
//   };

//   useEffect(() => {
//     const fetchServers = async () => {
//       try {
//         setIsLoading(true);
//         const response = await api.servers.listServers();

//         // First set the servers with basic data
//         setServers(response.data.servers);

//         // Then update each server with counts
//         const updatedServers = await Promise.all(
//           response.data.servers.map(async (server: HostingServer) => {
//             const counts = await fetchServerCounts(server.id);
//             return {
//               ...server,
//               ...counts,
//             };
//           })
//         );

//         setServers(updatedServers);
//       } catch (error) {
//         toast.error(
//           error instanceof Error ? error.message : "Failed to load servers"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchServers();
//   }, []);

//   const getStatusColor = (status: HostingServer["status"]) => {
//     switch (status) {
//       case "active":
//         return "text-green-500";
//       case "error":
//         return "text-red-500";
//       case "maintenance":
//         return "text-yellow-500";
//       default:
//         return "text-gray-500";
//     }
//   };

//   const getStatusIcon = (status: HostingServer["status"]) => {
//     const className = `h-5 w-5 ${getStatusColor(status)}`;
//     switch (status) {
//       case "active":
//         return <CheckCircleIcon className={className} />;
//       case "error":
//       case "maintenance":
//         return <ExclamationCircleIcon className={className} />;
//       default:
//         return null;
//     }
//   };

"use client";

import { useState, useEffect } from "react";
import {
  ServerIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import ServerFormModal from "@/components/admin/ServerFormModal";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface HostingServer {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  port: number;
  username: string;
  password: string;
  useSSL: boolean;
  type: "cpanel" | "plesk" | "DIRECTADMIN";
  status: "active" | "error" | "maintenance";
  lastSync?: string;
  packageCount?: number;
  accountCount?: number;
}

export default function HostingPage() {
  const [servers, setServers] = useState<HostingServer[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<HostingServer | null>(
    null
  );
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchServerCounts = async (serverId: string) => {
    console.log(
      `[fetchServerCounts] Starting to fetch counts for server ${serverId}`
    );
    try {
      const [packagesResponse, usersResponse] = await Promise.all([
        api.daPackages.listPackages(serverId),
        api.daUsers.listUsers(serverId),
      ]);

      const packageCount = packagesResponse.data?.packages
        ? Object.keys(packagesResponse.data.packages).length
        : 0;

      const accountCount = usersResponse.data?.users
        ? Array.isArray(usersResponse.data.users)
          ? usersResponse.data.users.length
          : Object.keys(usersResponse.data.users).length
        : 0;

      console.log(
        `[fetchServerCounts] Counts for server ${serverId}: packages=${packageCount}, accounts=${accountCount}`
      );
      return { packageCount, accountCount };
    } catch (error) {
      console.error(
        `[fetchServerCounts] Failed to fetch counts for server ${serverId}:`,
        error
      );
      return { packageCount: 0, accountCount: 0 };
    }
  };
  useEffect(() => {
    const fetchServers = async () => {
      console.log("[fetchServers] Starting to fetch servers");
      try {
        setIsLoading(true);
        console.log("[fetchServers] Calling api.servers.listServers()");
        const response = await api.servers.listServers();
        console.log("[fetchServers] Server list response:", response);

        // First set the servers with basic data
        const initialServers = response.data.servers;
        console.log("[fetchServers] Initial servers data:", initialServers);
        setServers(initialServers);

        // Then update each server with counts
        console.log("[fetchServers] Starting to fetch counts for each server");
        const updatedServers = await Promise.all(
          initialServers.map(async (server: HostingServer) => {
            console.log(
              `[fetchServers] Processing server ${server.id} (${server.name})`
            );
            const counts = await fetchServerCounts(server.id);
            return {
              ...server,
              ...counts,
            };
          })
        );

        console.log(
          "[fetchServers] Updated servers with counts:",
          updatedServers
        );
        setServers(updatedServers);
      } catch (error) {
        console.error("[fetchServers] Error fetching servers:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load servers"
        );
      } finally {
        console.log("[fetchServers] Finished loading servers");
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  const normalizeStatus = (status: string) => {
    return status.toLowerCase() as HostingServer["status"];
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = normalizeStatus(status);
    switch (normalizedStatus) {
      case "active":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "maintenance":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };
  const getStatusIcon = (status: HostingServer["status"]) => {
    const normalizedStatus = normalizeStatus(status);
    const className = `h-5 w-5 ${getStatusColor(status)}`;
    console.log(`[getStatusIcon] Status: ${status}, ClassName: ${className}`);

    switch (status) {
      case "active":
        return <CheckCircleIcon className={className} />;
      case "error":
      case "maintenance":
        return <ExclamationCircleIcon className={className} />;
      default:
        return null;
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
    // First, check if we have the server
    const server = servers.find(s => s.id === serverId);
    if (!server) {
      toast.error("Server not found");
      return;
    }

    // Show a password prompt modal or input
    const password = prompt(
      "Please enter the server password to test connection:"
    );
    if (!password) {
      toast.error("Password is required to test connection");
      return;
    }

    setIsSyncing(prev => ({ ...prev, [serverId]: true }));
    try {
      const { type, hostname, port, username, useSSL } = server;

      // Make sure we have all other required data
      if (!type || !hostname || !port || !username) {
        toast.error("Missing required connection parameters");
        return;
      }

      await api.servers.testConnection({
        type,
        hostname,
        port,
        username,
        password, // Use the password provided by the user
        useSSL,
      });

      toast.success("Connection successful!");
    } catch (error) {
      let errorMessage = "Connection failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        errorMessage = String(error);
      }
      toast.error(errorMessage);
      console.error("Connection test error:", error);
    } finally {
      setIsSyncing(prev => ({ ...prev, [serverId]: false }));
    }
  };

  //   setIsSyncing(prev => ({ ...prev, [serverId]: true }));
  //   try {
  //     // TODO: Implement actual server sync
  //     await new Promise(resolve => setTimeout(resolve, 2000));
  //     toast.success("Server synchronized successfully");
  //   } catch (error) {
  //     toast.error(error instanceof Error ? error.message : "Sync failed");
  //   } finally {
  //     setIsSyncing(prev => ({ ...prev, [serverId]: false }));
  //   }
  // };

  // Update the handleSyncServer function to refresh counts after sync
  // const handleSyncServer = async (serverId: string) => {
  //   setIsSyncing(prev => ({ ...prev, [serverId]: true }));
  //   try {
  //     // Simulate sync delay
  //     await new Promise(resolve => setTimeout(resolve, 1000));

  //     // Fetch updated counts after sync
  //     const counts = await fetchServerCounts(serverId);

  //     setServers(prevServers =>
  //       prevServers.map(server =>
  //         server.id === serverId
  //           ? {
  //               ...server,
  //               ...counts,
  //               lastSync: new Date().toISOString(),
  //             }
  //           : server
  //       )
  //     );

  //     toast.success("Server synchronized successfully");
  //   } catch (error) {
  //     toast.error(error instanceof Error ? error.message : "Sync failed");
  //   } finally {
  //     setIsSyncing(prev => ({ ...prev, [serverId]: false }));
  //   }
  // };

  const handleSyncServer = async (serverId: string) => {
    console.log(`[handleSyncServer] Starting sync for server ${serverId}`);
    setIsSyncing(prev => ({ ...prev, [serverId]: true }));

    try {
      console.log(
        `[handleSyncServer] Simulating sync delay for server ${serverId}`
      );
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(
        `[handleSyncServer] Fetching updated counts for server ${serverId}`
      );
      const counts = await fetchServerCounts(serverId);

      console.log(
        `[handleSyncServer] Updating server ${serverId} with counts:`,
        counts
      );
      setServers(prevServers => {
        const updated = prevServers.map(server =>
          server.id === serverId
            ? {
                ...server,
                ...counts,
                lastSync: new Date().toISOString(),
              }
            : server
        );
        console.log(`[handleSyncServer] Updated servers list:`, updated);
        return updated;
      });

      toast.success("Server synchronized successfully");
      console.log(
        `[handleSyncServer] Sync completed successfully for server ${serverId}`
      );
    } catch (error) {
      console.error(
        `[handleSyncServer] Sync failed for server ${serverId}:`,
        error
      );
      toast.error(error instanceof Error ? error.message : "Sync failed");
    } finally {
      console.log(`[handleSyncServer] Finalizing sync for server ${serverId}`);
      setIsSyncing(prev => ({ ...prev, [serverId]: false }));
    }
  };
  const handleSubmitServer = async (serverData: any) => {
    try {
      if (selectedServer) {
        // Update existing server
        const response = await api.servers.updateServer(
          selectedServer.id,
          serverData
        );
        setServers(
          servers.map(s =>
            s.id === selectedServer.id ? response.data.server : s
          )
        );
        toast.success("Server updated successfully");
      } else {
        // Create new server
        const response = await api.servers.createServer(serverData);
        setServers([...servers, response.data.server]);
        toast.success("Server created successfully");
      }
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Server operation failed"
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedServer) return;

    try {
      await api.servers.deleteServer(selectedServer.id);
      setServers(servers.filter(s => s.id !== selectedServer.id));
      toast.success("Server deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete server"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading servers...
      </div>
    );
  }

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
          <Link href="/admin/packages">
            <Button variant="outline">
              <CubeIcon className="mr-2 h-5 w-5" />
              Manage Packages
            </Button>
          </Link>
        </div>

        {/* Servers List */}

        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Connected Servers
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {servers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No servers found
              </div>
            ) : (
              servers.map(server => {
                console.log(`[Render] Rendering server ${server.id}`, {
                  name: server.name,
                  status: server.status,
                  packageCount: server.packageCount,
                  accountCount: server.accountCount,
                  statusColor: getStatusColor(server.status),
                  statusIcon: getStatusIcon(server.status),
                });

                return (
                  <div key={server.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <ServerIcon className="h-8 w-8 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {server.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {server.hostname}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(normalizeStatus(server.status))}
                          <span
                            className={`text-sm capitalize ${getStatusColor(
                              server.status
                            )}`}
                          >
                            {normalizeStatus(server.status)}
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
                        <p className="font-medium capitalize">
                          {server.type.toLowerCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Username</p>
                        <p className="font-medium">{server.username}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Sync</p>
                        <p className="font-medium">
                          {server.lastSync
                            ? new Date(server.lastSync).toLocaleString()
                            : "Never"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Hosting Packages</p>
                        <p className="font-medium">
                          {server.packageCount ?? 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Active Accounts</p>
                        <p className="font-medium">
                          {server.accountCount ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Server Modal */}
      <ServerFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        server={selectedServer}
        onSubmit={handleSubmitServer}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Server"
        message={`Are you sure you want to delete ${selectedServer?.name}? This action cannot be undone.`}
      />
    </>
  );
}
