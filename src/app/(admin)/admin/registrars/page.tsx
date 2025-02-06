// // src/app/(admin)/admin/registrars/page.tsx
// "use client";

// import { useState } from "react";
// import {
//   GlobeAltIcon,
//   PlusIcon,
//   CheckCircleIcon,
//   ExclamationCircleIcon,
//   TrashIcon,
//   PencilIcon,
//   ArrowPathIcon,
// } from "@heroicons/react/24/outline";
// import { Button } from "@/components/ui/button";

// interface Registrar {
//   id: string;
//   name: string;
//   type: "namecheap" | "resellerclub" | "godaddy" | "cloudflare";
//   username: string;
//   status: "active" | "error" | "maintenance";
//   lastSync: string;
//   domainCount?: number;
//   balance?: number;
// }

// const mockRegistrars: Registrar[] = [
//   {
//     id: "1",
//     name: "Namecheap Reseller",
//     type: "namecheap",
//     username: "reselleraccount",
//     status: "active",
//     lastSync: "2024-02-06T10:30:00",
//     domainCount: 156,
//     balance: 2500.0,
//   },
//   {
//     id: "2",
//     name: "ResellerClub",
//     type: "resellerclub",
//     username: "vscloud",
//     status: "active",
//     lastSync: "2024-02-06T10:30:00",
//     domainCount: 89,
//     balance: 1200.5,
//   },
// ];

// export default function RegistrarsPage() {
//   const [registrars] = useState<Registrar[]>(mockRegistrars);
//   const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});

//   const getStatusColor = (status: Registrar["status"]) => {
//     switch (status) {
//       case "active":
//         return "text-green-400";
//       case "error":
//         return "text-red-400";
//       case "maintenance":
//         return "text-yellow-400";
//       default:
//         return "text-gray-400";
//     }
//   };

//   const getStatusIcon = (status: Registrar["status"]) => {
//     switch (status) {
//       case "active":
//         return (
//           <CheckCircleIcon className={`h-5 w-5 ${getStatusColor(status)}`} />
//         );
//       case "error":
//       case "maintenance":
//         return (
//           <ExclamationCircleIcon
//             className={`h-5 w-5 ${getStatusColor(status)}`}
//           />
//         );
//     }
//   };

//   const getRegistrarLogo = (type: Registrar["type"]) => {
//     // TODO: Replace with actual registrar logos
//     return <GlobeAltIcon className="h-8 w-8 text-gray-400" />;
//   };

//   const handleAddRegistrar = () => {
//     // TODO: Implement add registrar modal
//     console.log("Add registrar");
//   };

//   const handleEditRegistrar = (registrarId: string) => {
//     // TODO: Implement edit registrar modal
//     console.log("Edit registrar:", registrarId);
//   };

//   const handleDeleteRegistrar = (registrarId: string) => {
//     // TODO: Implement delete registrar confirmation
//     console.log("Delete registrar:", registrarId);
//   };

//   const handleSync = async (registrarId: string) => {
//     setIsSyncing({ ...isSyncing, [registrarId]: true });
//     try {
//       // TODO: Implement sync with registrar API
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       console.log("Syncing registrar:", registrarId);
//     } finally {
//       setIsSyncing({ ...isSyncing, [registrarId]: false });
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(amount);
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold text-gray-900">
//           Domain Registrars
//         </h1>
//         <p className="mt-2 text-sm text-gray-700">
//           Manage your domain registrar integrations
//         </p>
//       </div>

//       {/* Quick Actions */}
//       <div className="flex space-x-4">
//         <Button onClick={handleAddRegistrar}>
//           <PlusIcon className="mr-2 h-5 w-5" />
//           Add Registrar
//         </Button>
//       </div>

//       {/* Registrars List */}
//       <div className="rounded-lg bg-white shadow">
//         <div className="border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-medium text-gray-900">
//             Connected Registrars
//           </h2>
//         </div>
//         <div className="divide-y divide-gray-200">
//           {registrars.map(registrar => (
//             <div key={registrar.id} className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   {getRegistrarLogo(registrar.type)}
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-900">
//                       {registrar.name}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       {registrar.username}
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {getStatusIcon(registrar.status)}
//                     <span className="text-sm capitalize text-gray-500">
//                       {registrar.status}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleSync(registrar.id)}
//                     loading={isSyncing[registrar.id]}
//                   >
//                     <ArrowPathIcon className="mr-2 h-4 w-4" />
//                     Sync
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleEditRegistrar(registrar.id)}
//                   >
//                     <PencilIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleDeleteRegistrar(registrar.id)}
//                     className="text-red-600 hover:text-red-700"
//                   >
//                     <TrashIcon className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Registrar Details */}
//               <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
//                 <div>
//                   <p className="text-gray-500">Type</p>
//                   <p className="font-medium capitalize">{registrar.type}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Domains</p>
//                   <p className="font-medium">{registrar.domainCount}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Balance</p>
//                   <p className="font-medium">
//                     {formatCurrency(registrar.balance || 0)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Last Sync</p>
//                   <p className="font-medium">
//                     {new Date(registrar.lastSync).toLocaleString()}
//                   </p>
//                 </div>
//               </div>

//               {/* Additional Options */}
//               <div className="mt-4 border-t pt-4">
//                 <div className="flex space-x-4">
//                   <button className="text-sm text-gray-600 hover:text-gray-900">
//                     View TLD Pricing
//                   </button>
//                   <button className="text-sm text-gray-600 hover:text-gray-900">
//                     Add Funds
//                   </button>
//                   <button className="text-sm text-gray-600 hover:text-gray-900">
//                     API Settings
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/(admin)/admin/registrars/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GlobeAltIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import RegistrarFormModal from "@/components/admin/RegistrarFormModal";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import { Registrar } from "@/types/index";
import ApiSettingsModal from "@/components/admin/ApiSettingsModal";
import AddFundsModal from "@/components/admin/AddFundsModal";

const mockRegistrars: Registrar[] = [
  {
    id: "1",
    name: "Namecheap Reseller",
    type: "namecheap",
    username: "reselleraccount",
    status: "active",
    lastSync: "2024-02-06T10:30:00",
    domainCount: 156,
    balance: 2500.0,
  },
  {
    id: "2",
    name: "ResellerClub",
    type: "resellerclub",
    username: "vscloud",
    status: "active",
    lastSync: "2024-02-06T10:30:00",
    domainCount: 89,
    balance: 1200.5,
  },
];

export default function RegistrarsPage() {
  const router = useRouter();
  const [registrars, setRegistrars] = useState<Registrar[]>(mockRegistrars);
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});
  const [selectedRegistrar, setSelectedRegistrar] = useState<Registrar | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);

  const [isApiSettingsModalOpen, setIsApiSettingsModalOpen] = useState(false);

  const getStatusColor = (status: Registrar["status"]) => {
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

  const getStatusIcon = (status: Registrar["status"]) => {
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

  const handleAddFunds = (registrar: Registrar) => {
    setSelectedRegistrar(registrar);
    setIsAddFundsModalOpen(true);
  };

  const handleApiSettings = (registrar: Registrar) => {
    setSelectedRegistrar(registrar);
    setIsApiSettingsModalOpen(true);
  };

  const handleAddRegistrar = () => {
    setSelectedRegistrar(null);
    setIsAddModalOpen(true);
  };

  const handleEditRegistrar = (registrar: Registrar) => {
    setSelectedRegistrar(registrar);
    setIsEditModalOpen(true);
  };

  const handleDeleteRegistrar = (registrar: Registrar) => {
    setSelectedRegistrar(registrar);
    setIsDeleteModalOpen(true);
  };

  const handleSync = async (registrarId: string) => {
    setIsSyncing({ ...isSyncing, [registrarId]: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsSyncing({ ...isSyncing, [registrarId]: false });
    }
  };

  const handleSubmitRegistrar = async (data: any) => {
    if (selectedRegistrar) {
      // Update existing registrar
      setRegistrars(
        registrars.map(r =>
          r.id === selectedRegistrar.id ? { ...r, ...data } : r
        )
      );
    } else {
      // Add new registrar
      const newRegistrar = {
        ...data,
        id: Date.now().toString(),
        status: "active",
        lastSync: new Date().toISOString(),
      };
      setRegistrars([...registrars, newRegistrar]);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedRegistrar) {
      setRegistrars(registrars.filter(r => r.id !== selectedRegistrar.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedRegistrar(null);
  };

  const handleViewPricing = (registrarId: string) => {
    router.push(`/admin/registrars/${registrarId}/pricing`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Domain Registrars
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your domain registrar integrations
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4">
          <Button onClick={handleAddRegistrar}>
            <PlusIcon className="mr-2 h-5 w-5" />
            Add Registrar
          </Button>
        </div>

        {/* Registrars List */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Connected Registrars
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {registrars.map(registrar => (
              <div key={registrar.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <GlobeAltIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {registrar.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {registrar.username}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(registrar.status)}
                      <span className="text-sm capitalize text-gray-500">
                        {registrar.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(registrar.id)}
                      loading={isSyncing[registrar.id]}
                    >
                      <ArrowPathIcon className="mr-2 h-4 w-4" />
                      Sync
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRegistrar(registrar)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRegistrar(registrar)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Registrar Details */}
                <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium capitalize">{registrar.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Domains</p>
                    <p className="font-medium">{registrar.domainCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Balance</p>
                    <p className="font-medium">
                      {formatCurrency(registrar.balance || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Sync</p>
                    <p className="font-medium">
                      {new Date(registrar.lastSync).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="mt-4 border-t pt-4">
                  <div className="flex space-x-4">
                    <button
                      className="text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => handleViewPricing(registrar.id)}
                    >
                      View TLD Pricing
                    </button>
                    <button
                      className="text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => handleAddFunds(registrar)}
                    >
                      Add Funds
                    </button>
                    <button
                      className="text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => handleApiSettings(registrar)}
                    >
                      API Settings
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RegistrarFormModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedRegistrar(null);
        }}
        registrar={selectedRegistrar}
        onSubmit={handleSubmitRegistrar}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRegistrar(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Registrar"
        message={`Are you sure you want to delete ${selectedRegistrar?.name}? This action cannot be undone.`}
      />

      <AddFundsModal
        isOpen={isAddFundsModalOpen}
        onClose={() => {
          setIsAddFundsModalOpen(false);
          setSelectedRegistrar(null);
        }}
        registrar={selectedRegistrar}
        onSubmit={async data => {
          // TODO: Implement add funds logic
          console.log("Add funds:", data);
          setIsAddFundsModalOpen(false);
          setSelectedRegistrar(null);
        }}
      />

      {selectedRegistrar && (
        <ApiSettingsModal
          isOpen={isApiSettingsModalOpen}
          onClose={() => {
            setIsApiSettingsModalOpen(false);
            setSelectedRegistrar(null);
          }}
          registrar={selectedRegistrar}
          onSubmit={async data => {
            // TODO: Implement API settings update
            console.log("Update API settings:", data);
            setIsApiSettingsModalOpen(false);
            setSelectedRegistrar(null);
          }}
        />
      )}
    </>
  );
}
