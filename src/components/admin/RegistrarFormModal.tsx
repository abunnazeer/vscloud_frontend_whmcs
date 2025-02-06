// src/components/admin/RegistrarFormModal.tsx
"use client";

import { useState, Fragment } from "react";
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

const registrarSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["namecheap", "resellerclub", "godaddy", "cloudflare"]),
  username: z.string().min(1, "Username is required"),
  apiKey: z.string().min(1, "API key is required"),
  sandboxMode: z.boolean().optional(),
  customEndpoint: z.string().url().optional().or(z.literal("")),
  webhookUrl: z.string().url().optional().or(z.literal("")),
});

type RegistrarFormValues = z.infer<typeof registrarSchema>;

interface RegistrarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrar?: any;
  onSubmit: (data: RegistrarFormValues) => void;
}

export default function RegistrarFormModal({
  isOpen,
  onClose,
  registrar,
  onSubmit,
}: RegistrarFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<RegistrarFormValues>({
    resolver: zodResolver(registrarSchema),
    defaultValues: registrar || {
      type: "namecheap",
      sandboxMode: true,
    },
  });

  const selectedType = watch("type");

  const handleFormSubmit = async (data: RegistrarFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestStatus("testing");
    try {
      // TODO: Implement actual connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestStatus("success");
    } catch (error) {
      setTestStatus("error");
    }
  };

  const getApiFields = (type: string) => {
    switch (type) {
      case "namecheap":
        return ["API Key", "Username"];
      case "resellerclub":
        return ["Reseller ID", "API Token"];
      case "godaddy":
        return ["API Key", "API Secret"];
      case "cloudflare":
        return ["API Token", "Account ID"];
      default:
        return ["API Key"];
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
                  {registrar ? "Edit Registrar" : "Add New Registrar"}
                </DialogTitle>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registrar Name
                    </label>
                    <Input
                      {...register("name")}
                      placeholder="My Namecheap Account"
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registrar Type
                    </label>
                    <select
                      {...register("type")}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="namecheap">Namecheap</option>
                      <option value="resellerclub">ResellerClub</option>
                      <option value="godaddy">GoDaddy</option>
                      <option value="cloudflare">Cloudflare</option>
                    </select>
                    {errors.type?.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  {getApiFields(selectedType).map((field, index) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700">
                        {field}
                      </label>
                      <Input
                        type="password"
                        {...register(index === 0 ? "apiKey" : "username")}
                        error={
                          errors[index === 0 ? "apiKey" : "username"]?.message
                        }
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Custom API Endpoint (Optional)
                    </label>
                    <Input
                      {...register("customEndpoint")}
                      placeholder="https://api.example.com"
                      error={errors.customEndpoint?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Webhook URL (Optional)
                    </label>
                    <Input
                      {...register("webhookUrl")}
                      placeholder="https://your-webhook.com"
                      error={errors.webhookUrl?.message}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("sandboxMode")}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Enable Sandbox/Test Mode
                    </label>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTestConnection}
                      disabled={isLoading || testStatus === "testing"}
                    >
                      {testStatus === "testing"
                        ? "Testing..."
                        : testStatus === "success"
                        ? "Connection Successful"
                        : testStatus === "error"
                        ? "Connection Failed"
                        : "Test Connection"}
                    </Button>
                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" loading={isLoading}>
                        {registrar ? "Update" : "Add"} Registrar
                      </Button>
                    </div>
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
