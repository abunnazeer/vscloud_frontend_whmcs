// src/components/domains/DnsManagementModal.tsx
"use client";

import { useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DNSRecord {
  id: number;
  type: "A" | "CNAME" | "MX" | "TXT";
  name: string;
  value: string;
  ttl: number;
}

interface DnsManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
}

const defaultRecords: DNSRecord[] = [
  { id: 1, type: "A", name: "@", value: "192.168.1.1", ttl: 3600 },
  { id: 2, type: "CNAME", name: "www", value: "@", ttl: 3600 },
  { id: 3, type: "MX", name: "@", value: "mail.example.com", ttl: 3600 },
];

export default function DnsManagementModal({
  isOpen,
  onClose,
  domain,
}: DnsManagementModalProps) {
  const [records, setRecords] = useState<DNSRecord[]>(defaultRecords);
  const [newRecord, setNewRecord] = useState<Partial<DNSRecord>>({
    type: "A",
    name: "",
    value: "",
    ttl: 3600,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRecord = () => {
    if (!newRecord.name || !newRecord.value) return;

    setRecords([
      ...records,
      {
        id: Date.now(),
        type: newRecord.type as "A",
        name: newRecord.name,
        value: newRecord.value,
        ttl: newRecord.ttl || 3600,
      },
    ]);

    setNewRecord({
      type: "A",
      name: "",
      value: "",
      ttl: 3600,
    });
  };

  const handleDeleteRecord = (id: number) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call to save DNS records
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onClose();
    } catch (error) {
      console.error("Failed to save DNS records:", error);
    } finally {
      setIsLoading(false);
    }
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
              <DialogPanel className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  DNS Management - {domain}
                </DialogTitle>

                {/* Add New Record Form */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700">
                    Add DNS Record
                  </h4>
                  <div className="mt-2 grid grid-cols-6 gap-4">
                    <div>
                      <select
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={newRecord.type}
                        onChange={e =>
                          setNewRecord({
                            ...newRecord,
                            type: e.target.value as "A",
                          })
                        }
                      >
                        <option value="A">A</option>
                        <option value="CNAME">CNAME</option>
                        <option value="MX">MX</option>
                        <option value="TXT">TXT</option>
                      </select>
                    </div>
                    <div>
                      <Input
                        placeholder="Name"
                        value={newRecord.name}
                        onChange={e =>
                          setNewRecord({ ...newRecord, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Value"
                        value={newRecord.value}
                        onChange={e =>
                          setNewRecord({ ...newRecord, value: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="TTL"
                        value={newRecord.ttl}
                        onChange={e =>
                          setNewRecord({
                            ...newRecord,
                            ttl: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Button onClick={handleAddRecord} className="w-full">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* DNS Records List */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700">
                    DNS Records
                  </h4>
                  <div className="mt-2 rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Value
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            TTL
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {records.map(record => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {record.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.ttl}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteRecord(record.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges} loading={isLoading}>
                    Save Changes
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
