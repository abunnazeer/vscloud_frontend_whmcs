// src/components/admin/DAPackageFormModal.tsx
"use client";

import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const daPackageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bandwidth: z.string().min(1, "Bandwidth is required"),
  quota: z.string().min(1, "Quota is required"),
  domainptr: z.string().min(1, "Domain pointers are required"),
  ftp: z.string().min(1, "FTP accounts are required"),
  mysql: z.string().min(1, "MySQL databases are required"),
  nemailf: z.string().min(1, "Email forwards are required"),
  nemailml: z.string().min(1, "Mailing lists are required"),
  nemailr: z.string().min(1, "Email autoresponders are required"),
  nsubdomains: z.string().min(1, "Subdomains are required"),
  cgi: z.enum(["ON", "OFF"]),
  php: z.enum(["ON", "OFF"]),
  ssl: z.enum(["ON", "OFF"]),
  dns: z.enum(["ON", "OFF"]),
});

type DAPackageFormData = z.infer<typeof daPackageSchema>;

interface DAPackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DAPackageFormData) => Promise<void>;
}

export default function DAPackageFormModal({
  isOpen,
  onClose,
  onSubmit,
}: DAPackageFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DAPackageFormData>({
    resolver: zodResolver(daPackageSchema),
    defaultValues: {
      name: "",
      bandwidth: "unlimited",
      quota: "unlimited",
      domainptr: "unlimited",
      ftp: "unlimited",
      mysql: "unlimited",
      nemailf: "unlimited",
      nemailml: "unlimited",
      nemailr: "unlimited",
      nsubdomains: "unlimited",
      cgi: "ON",
      php: "ON",
      ssl: "ON",
      dns: "ON",
    },
  });

  const onSubmitForm = async (data: DAPackageFormData) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      toast.error("Failed to create DirectAdmin package");
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
              <DialogPanel className="w-full max-w-2xl rounded-lg bg-white p-6">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  Add DirectAdmin Package
                </DialogTitle>

                <form
                  onSubmit={handleSubmit(onSubmitForm)}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Package Name
                    </label>
                    <Input
                      {...register("name")}
                      placeholder="e.g., premium_package"
                      error={errors.name?.message}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bandwidth
                      </label>
                      <Input
                        {...register("bandwidth")}
                        placeholder="e.g., unlimited or 1000"
                        error={errors.bandwidth?.message}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Disk Quota
                      </label>
                      <Input
                        {...register("quota")}
                        placeholder="e.g., unlimited or 5000"
                        error={errors.quota?.message}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Domain Pointers
                      </label>
                      <Input
                        {...register("domainptr")}
                        placeholder="e.g., unlimited or 10"
                        error={errors.domainptr?.message}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        FTP Accounts
                      </label>
                      <Input
                        {...register("ftp")}
                        placeholder="e.g., unlimited or 5"
                        error={errors.ftp?.message}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        MySQL Databases
                      </label>
                      <Input
                        {...register("mysql")}
                        placeholder="e.g., unlimited or 10"
                        error={errors.mysql?.message}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Forwards
                      </label>
                      <Input
                        {...register("nemailf")}
                        placeholder="e.g., unlimited or 20"
                        error={errors.nemailf?.message}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mailing Lists
                      </label>
                      <Input
                        {...register("nemailml")}
                        placeholder="e.g., unlimited or 5"
                        error={errors.nemailml?.message}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Autoresponders
                      </label>
                      <Input
                        {...register("nemailr")}
                        placeholder="e.g., unlimited or 5"
                        error={errors.nemailr?.message}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subdomains
                      </label>
                      <Input
                        {...register("nsubdomains")}
                        placeholder="e.g., unlimited or 10"
                        error={errors.nsubdomains?.message}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Features</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CGI Access
                        </label>
                        <select
                          {...register("cgi")}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="ON">Enabled</option>
                          <option value="OFF">Disabled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          PHP
                        </label>
                        <select
                          {...register("php")}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="ON">Enabled</option>
                          <option value="OFF">Disabled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          SSL
                        </label>
                        <select
                          {...register("ssl")}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="ON">Enabled</option>
                          <option value="OFF">Disabled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          DNS
                        </label>
                        <select
                          {...register("dns")}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="ON">Enabled</option>
                          <option value="OFF">Disabled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Package"}
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
