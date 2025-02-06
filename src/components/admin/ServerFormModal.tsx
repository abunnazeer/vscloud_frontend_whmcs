// src/components/admin/ServerFormModal.tsx
"use client";

import { Fragment, useState } from "react";
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
  type: z.enum(["cpanel", "plesk", "directadmin"]),
  url: z.string().url("Must be a valid URL"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
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
  } = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: server || {
      type: "cpanel",
    },
  });

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
                      <option value="directadmin">DirectAdmin</option>
                    </select>
                    {errors.type?.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Server URL
                    </label>
                    <Input
                      {...register("url")}
                      placeholder="https://server.example.com:2087"
                      error={errors.url?.message}
                    />
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
