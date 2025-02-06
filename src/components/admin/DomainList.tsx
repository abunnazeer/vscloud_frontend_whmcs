// src/components/admin/DomainList.tsx
import { Domain } from "@/types/domain";
import { Button } from "@/components/ui/button";
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface DomainListProps {
  domains: Domain[];
  onEdit: (domain: Domain) => void;
  onDelete: (domain: Domain) => void;
}

export default function DomainList({
  domains,
  onEdit,
  onDelete,
}: DomainListProps) {
  const getStatusIcon = (status: Domain["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case "expired":
      case "pending":
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-900">
          Registered Domains
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {domains.map(domain => (
          <div key={domain.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {domain.name}
                  </h3>
                  <p className="text-sm text-gray-500">{domain.registrar}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(domain.status)}
                  <span className="text-sm capitalize text-gray-500">
                    {domain.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(domain)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(domain)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Expiry Date</p>
                <p className="font-medium">
                  {new Date(domain.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Auto Renew</p>
                <p className="font-medium">{domain.autoRenew ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-gray-500">SSL Status</p>
                <p className="font-medium capitalize">{domain.sslStatus}</p>
              </div>
              <div>
                <p className="text-gray-500">Hosting Server</p>
                <p className="font-medium">{domain.hostingServer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
