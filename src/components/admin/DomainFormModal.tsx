// src/components/admin/DomainFormModal.tsx
"use client";

import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  Transition,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DomainFormData } from "@/types/domain";

const domainSchema = z.object({
  name: z.string().min(1, "Domain name is required"),
  registrar: z.string().optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  autoRenew: z.boolean(),
  nameservers: z.array(z.string()),
  hostingServer: z.string().optional(),
  sslStatus: z.enum(["active", "expired", "none"]).optional(),
});

interface DomainFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain?: DomainFormData;
  onSubmit: (data: DomainFormData) => void;
}

export default function DomainFormModal({
  isOpen,
  onClose,
  domain,
  onSubmit,
}: DomainFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DomainFormData>({
    resolver: zodResolver(domainSchema),
    defaultValues: domain || {
      autoRenew: true,
      nameservers: ["", ""],
      sslStatus: "none",
    },
  });

  const onSubmitForm = async (data: DomainFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
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
              <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  {domain ? "Edit Domain" : "Add New Domain"}
                </DialogTitle>

                <form
                  onSubmit={handleSubmit(onSubmitForm)}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Domain Name
                    </label>
                    <Input
                      {...register("name")}
                      placeholder="example.com"
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registrar
                    </label>
                    <Input
                      {...register("registrar")}
                      placeholder="GoDaddy, Namecheap, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <Input
                      type="date"
                      {...register("expiryDate")}
                      error={errors.expiryDate?.message}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("autoRenew")}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Auto Renew
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nameservers
                    </label>
                    <div className="space-y-2">
                      {[0, 1].map(index => (
                        <Input
                          key={index}
                          {...register(`nameservers.${index}`)}
                          placeholder={`ns${index + 1}.example.com`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hosting Server
                    </label>
                    <Input
                      {...register("hostingServer")}
                      placeholder="Select hosting server"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      SSL Status
                    </label>
                    <select
                      {...register("sslStatus")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {domain ? "Save Changes" : "Add Domain"}
                    </Button>
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
