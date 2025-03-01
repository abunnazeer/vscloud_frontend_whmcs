// src/components/admin/PackageFormModal.tsx
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

const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["shared", "reseller", "vps", "dedicated"]),
  description: z.string().min(1, "Description is required"),
  pricing: z.object({
    monthly: z.number().min(0),
    quarterly: z.number().min(0),
    annual: z.number().min(0),
  }),
  features: z.object({
    diskSpace: z.string().min(1),
    bandwidth: z.string().min(1),
    domains: z.number().min(1),
    databases: z.number().min(0),
    emailAccounts: z.number().min(0),
    sslCertificate: z.boolean(),
    backups: z.boolean(),
    dedicatedIp: z.boolean(),
  }),
  status: z.enum(["active", "draft", "archived"]),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: PackageFormData | null;
  onSubmit: (data: PackageFormData) => void;
}

export default function PackageFormModal({
  isOpen,
  onClose,
  package: pkg,
  onSubmit,
}: PackageFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: pkg || {
      type: "shared",
      pricing: {
        monthly: 0,
        quarterly: 0,
        annual: 0,
      },
      features: {
        diskSpace: "",
        bandwidth: "",
        domains: 1,
        databases: 0,
        emailAccounts: 0,
        sslCertificate: false,
        backups: false,
        dedicatedIp: false,
      },
      status: "draft",
    },
  });

  const onSubmitForm = async (data: PackageFormData) => {
    try {
      await onSubmit(data);
      reset();
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
              <DialogPanel className="w-full max-w-2xl rounded-lg bg-white p-6">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  {pkg ? "Edit Package" : "Add New Package"}
                </DialogTitle>

                <form
                  onSubmit={handleSubmit(onSubmitForm)}
                  className="mt-4 space-y-4"
                >
                  {/* Basic Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Package Name
                    </label>
                    <Input
                      {...register("name")}
                      placeholder="Business Starter Pack"
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      {...register("type")}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="shared">Shared Hosting</option>
                      <option value="reseller">Reseller Hosting</option>
                      <option value="vps">VPS Hosting</option>
                      <option value="dedicated">Dedicated Server</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Perfect for small to medium businesses..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Pricing</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700">
                          Monthly ($)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("pricing.monthly", {
                            valueAsNumber: true,
                          })}
                          error={errors.pricing?.monthly?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">
                          Quarterly ($)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("pricing.quarterly", {
                            valueAsNumber: true,
                          })}
                          error={errors.pricing?.quarterly?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">
                          Annual ($)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("pricing.annual", {
                            valueAsNumber: true,
                          })}
                          error={errors.pricing?.annual?.message}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Features</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700">
                          Disk Space
                        </label>
                        <Input
                          {...register("features.diskSpace")}
                          placeholder="e.g., 10GB"
                          error={errors.features?.diskSpace?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">
                          Bandwidth
                        </label>
                        <Input
                          {...register("features.bandwidth")}
                          placeholder="e.g., 100GB"
                          error={errors.features?.bandwidth?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">
                          Domains
                        </label>
                        <Input
                          type="number"
                          {...register("features.domains", {
                            valueAsNumber: true,
                          })}
                          error={errors.features?.domains?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">
                          Email Accounts
                        </label>
                        <Input
                          type="number"
                          {...register("features.emailAccounts", {
                            valueAsNumber: true,
                          })}
                          error={errors.features?.emailAccounts?.message}
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          {...register("features.sslCertificate")}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Free SSL Certificate
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          {...register("features.backups")}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Daily Backups
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          {...register("features.dedicatedIp")}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Dedicated IP
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      {...register("status")}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
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
                      {isSubmitting
                        ? "Saving..."
                        : pkg
                        ? "Update Package"
                        : "Add Package"}
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
