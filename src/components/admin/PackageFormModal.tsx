"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";

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
  directAdminPackageName: z.string().optional(),
  serverMappings: z
    .array(
      z.object({
        serverId: z.string(),
        directAdminPackageName: z.string(),
      })
    )
    .optional(),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: PackageFormData | null;
  onSubmit: (data: PackageFormData) => Promise<void>;
}

// Interface for DirectAdmin package data
interface DirectAdminPackage {
  aftp: string;
  bandwidth: string;
  quota: string;
  mysql: string;
  nemails: string;
  vdomains: string;
  ssl: string;
  [key: string]: string;
}

interface Server {
  id: string;
  name: string;
  hostname: string;
}

export default function PackageFormModal({
  isOpen,
  onClose,
  package: pkg,
  onSubmit,
}: PackageFormModalProps) {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [daPackages, setDaPackages] = useState<
    { name: string; data: DirectAdminPackage }[]
  >([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isLoadingServers, setIsLoadingServers] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      type: "shared",
      description: "",
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
      directAdminPackageName: "",
      serverMappings: [],
    },
  });

  const watchDirectAdminPackageName = watch("directAdminPackageName");

  useEffect(() => {
    async function fetchServers() {
      setIsLoadingServers(true);
      try {
        const result = await api.servers.listServers();

        // Access the servers data from the correct path in the response
        if (result.status === "success" && result.data && result.data.servers) {
          setServers(result.data.servers);

          // Set the first server as selected by default if available
          if (result.data.servers.length > 0 && !selectedServer) {
            setSelectedServer(result.data.servers[0].id);
          }
        } else {
          console.error("Invalid server data structure:", result);
          toast.error("Failed to parse server data");
          setServers([]);
        }
      } catch (error) {
        console.error("Failed to fetch servers:", error);
        toast.error("Failed to load servers");
        setServers([]);
      } finally {
        setIsLoadingServers(false);
      }
    }

    fetchServers();
  }, []);

  useEffect(() => {
    async function fetchDaPackages() {
      if (!selectedServer) return;

      setIsLoadingPackages(true);
      try {
        const result = await api.daPackages.listPackages(selectedServer);

        // Handle the API response properly - it returns an object with package names
        if (
          result.status === "success" &&
          result.data &&
          result.data.packages
        ) {
          // Convert the object of package names to an array of names
          const packageNames = Object.keys(result.data.packages);

          // Store just the package names for now
          setDaPackages(
            packageNames.map(name => ({ name, data: {} as DirectAdminPackage }))
          );
        } else {
          // console.error("Invalid package data structure:", result);
          toast.error("Failed to parse package data");
          setDaPackages([]);
        }
      } catch (error) {
        console.error("Failed to fetch DirectAdmin packages:", error);
        toast.error("Failed to load DirectAdmin packages");
        setDaPackages([]);
      } finally {
        setIsLoadingPackages(false);
      }
    }

    if (selectedServer) {
      fetchDaPackages();
    }
  }, [selectedServer]);

  // Fetch package details when a package is selected
  useEffect(() => {
    async function fetchPackageDetails() {
      if (!selectedServer || !watchDirectAdminPackageName) return;

      try {
        // Add API call to fetch specific package details
        const result = await api.daPackages.getPackage(
          selectedServer,
          watchDirectAdminPackageName
        );
        console.log("this is package details", result);

        if (result.status === "success" && result.data && result.data.package) {
          const packageData = result.data.package;

          // Set the package name to match the DirectAdmin package name if the user hasn't entered one
          if (!watch("name") || watch("name") === "") {
            setValue("name", watchDirectAdminPackageName);
          }

          const quota = parseInt(packageData.quota) || 0;
          const bandwidth = parseInt(packageData.bandwidth) || 0;
          const domains = parseInt(packageData.vdomains) || 1;
          const databases = parseInt(packageData.mysql) || 0;
          const emails = parseInt(packageData.nemails) || 0;

          setValue("features.diskSpace", `${quota / 1024}`); // Convert MB to GB
          setValue("features.bandwidth", `${bandwidth / 1024}`); // Convert MB to GB
          setValue("features.domains", domains);
          setValue("features.databases", databases);
          setValue("features.emailAccounts", emails);
          setValue("features.sslCertificate", packageData.ssl === "ON");

          // Update server mappings
          if (selectedServer) {
            setValue("serverMappings", [
              {
                serverId: selectedServer,
                directAdminPackageName: watchDirectAdminPackageName,
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch package details:", error);
        toast.error("Failed to fetch package details");
      }
    }

    if (watchDirectAdminPackageName) {
      fetchPackageDetails();
    }
  }, [watchDirectAdminPackageName, selectedServer, setValue, watch]);
  useEffect(() => {
    if (pkg) {
      Object.entries(pkg).forEach(([key, value]) => {
        if (key === "pricing" || key === "features") {
          Object.entries(value).forEach(([subKey, subValue]) => {
            setValue(`${key}.${subKey}` as any, subValue);
          });
        } else {
          setValue(key as any, value);
        }
      });

      // Set the server if there's a serverMapping
      if (pkg.serverMappings && pkg.serverMappings.length > 0) {
        setSelectedServer(pkg.serverMappings[0].serverId);
      }
    } else {
      reset();
    }
  }, [pkg, reset, setValue]);

  const onSubmitForm = async (data: PackageFormData) => {
    try {
      // Ensure the directAdminPackageName is included
      if (watchDirectAdminPackageName) {
        data.directAdminPackageName = watchDirectAdminPackageName;

        // Only add serverMappings if we have a selected server
        if (selectedServer) {
          data.serverMappings = [
            {
              serverId: selectedServer,
              directAdminPackageName: watchDirectAdminPackageName,
            },
          ];
        }
      }

      await onSubmit(data);
      onClose();
    } catch (error) {
      toast.error("Failed to save package");
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
                  {/* DirectAdmin Server Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      DirectAdmin Server
                    </label>
                    <select
                      value={selectedServer}
                      onChange={e => setSelectedServer(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isLoadingServers}
                    >
                      <option value="">
                        {isLoadingServers
                          ? "Loading servers..."
                          : "Select a server"}
                      </option>
                      {Array.isArray(servers) &&
                        servers.map(server => (
                          <option key={server.id} value={server.id}>
                            {server.name} ({server.hostname})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      DirectAdmin Package
                    </label>
                    <select
                      {...register("directAdminPackageName")}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isLoadingPackages || !selectedServer}
                    >
                      <option value="">
                        {isLoadingPackages
                          ? "Loading packages..."
                          : !selectedServer
                          ? "Select a server first"
                          : "Select a package"}
                      </option>
                      {daPackages.map(pkg => (
                        <option key={pkg.name} value={pkg.name}>
                          {pkg.name}
                        </option>
                      ))}
                    </select>
                    {watchDirectAdminPackageName && (
                      <p className="mt-1 text-xs text-gray-500">
                        DirectAdmin package features will be applied
                        automatically
                      </p>
                    )}
                  </div>

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

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Features</h4>
                    <p className="text-xs text-gray-500">
                      Features below are auto-filled based on DirectAdmin
                      package selection and cannot be modified
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700">
                          Disk Space (GB)
                        </label>
                        <Input
                          {...register("features.diskSpace")}
                          placeholder="e.g., 10"
                          readOnly={!!watchDirectAdminPackageName}
                          className={
                            watchDirectAdminPackageName ? "bg-gray-100" : ""
                          }
                          error={errors.features?.diskSpace?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">
                          Bandwidth (GB)
                        </label>
                        <Input
                          {...register("features.bandwidth")}
                          placeholder="e.g., 100"
                          readOnly={!!watchDirectAdminPackageName}
                          className={
                            watchDirectAdminPackageName ? "bg-gray-100" : ""
                          }
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
                          readOnly={!!watchDirectAdminPackageName}
                          className={
                            watchDirectAdminPackageName ? "bg-gray-100" : ""
                          }
                          error={errors.features?.domains?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">
                          Databases
                        </label>
                        <Input
                          type="number"
                          {...register("features.databases", {
                            valueAsNumber: true,
                          })}
                          readOnly={!!watchDirectAdminPackageName}
                          className={
                            watchDirectAdminPackageName ? "bg-gray-100" : ""
                          }
                          error={errors.features?.databases?.message}
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
                          readOnly={!!watchDirectAdminPackageName}
                          className={
                            watchDirectAdminPackageName ? "bg-gray-100" : ""
                          }
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
                          disabled={!!watchDirectAdminPackageName}
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
