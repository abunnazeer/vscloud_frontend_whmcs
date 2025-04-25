"use client";

import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const serverSchema = z.object({
  name: z.string().min(1, "Server name is required"),
  hostname: z.string().min(1, "Hostname is required"),
  ipAddress: z.string().optional(),
  port: z.number().int().positive("Port must be a positive number"),
  username: z.string().min(1, "Username is required"),
  location: z.string().min(1, "location is required"),
  password: z.string().min(1, "Password is required"),
  useSSL: z.boolean().default(true),
  type: z.enum(["cpanel", "plesk", "DIRECTADMIN"]),
  apiToken: z.string().optional(),
});

type ServerFormValues = z.infer<typeof serverSchema>;

interface ServerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  server?: any;
  onSubmit: (data: ServerFormValues) => void;
}

export default function ServerFormModal({
  isOpen,
  onClose,
  server,
  onSubmit,
}: ServerFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      type: "cpanel",
      port: 2222,
      useSSL: true,
    },
  });

  // Update form when server prop changes
  useEffect(() => {
    if (server) {
      // Set each field value from the server object
      Object.entries(server).forEach(([key, value]) => {
        if (key in serverSchema.shape) {
          setValue(key as any, value);
        }
      });
    } else {
      // Reset to defaults when adding a new server
      reset({
        type: "cpanel",
        port: 2087,
        useSSL: true,
      });
    }
  }, [server, setValue, reset]);

  const onSubmitForm = async (data: ServerFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
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
              <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  {server ? "Edit Server" : "Add New Server"}
                </DialogTitle>

                <form
                  onSubmit={handleSubmit(onSubmitForm)}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Server Name
                    </label>
                    <Input
                      {...register("name")}
                      placeholder="Production Server"
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Control Panel Type
                    </label>
                    <select
                      {...register("type")}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="cpanel">cPanel/WHM</option>
                      <option value="plesk">Plesk</option>
                      <option value="DIRECTADMIN">DIRECTADMIN</option>
                    </select>
                    {errors.type?.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hostname
                    </label>
                    <Input
                      {...register("hostname")}
                      placeholder="server.example.com"
                      error={errors.hostname?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <Input
                      {...register("location")}
                      placeholder="US East"
                      error={errors.location?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      IP Address (Optional)
                    </label>
                    <Input
                      {...register("ipAddress")}
                      placeholder="123.456.789.0"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Port
                      </label>
                      <Input
                        type="number"
                        {...register("port", { valueAsNumber: true })}
                        defaultValue={2087}
                        error={errors.port?.message}
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register("useSSL")}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Use SSL
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <Input
                      {...register("username")}
                      placeholder="root or admin"
                      error={errors.username?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Input
                      type="password"
                      {...register("password")}
                      error={errors.password?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      API Token (Optional)
                    </label>
                    <Input
                      {...register("apiToken")}
                      placeholder="Enter API token if available"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" loading={isLoading}>
                      {server ? "Update Server" : "Add Server"}
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
