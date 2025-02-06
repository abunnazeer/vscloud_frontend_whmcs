// src/components/admin/ApiSettingsModal.tsx
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
import {
  EyeIcon,
  EyeSlashIcon,
  ClipboardIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const apiSettingsSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  apiSecret: z.string().optional(),
  customEndpoint: z.string().url().optional().or(z.literal("")),
  webhookUrl: z.string().url().optional().or(z.literal("")),
  ipWhitelist: z.string().optional(),
  sandboxMode: z.boolean().optional(),
});

type ApiSettingsFormValues = z.infer<typeof apiSettingsSchema>;

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrar: {
    id: string;
    name: string;
    type: string;
    apiKey?: string;
    customEndpoint?: string;
    webhookUrl?: string;
  };
  onSubmit: (data: ApiSettingsFormValues) => Promise<void>;
}

export default function ApiSettingsModal({
  isOpen,
  onClose,
  registrar,
  onSubmit,
}: ApiSettingsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApiSettingsFormValues>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      apiKey: registrar.apiKey,
      customEndpoint: registrar.customEndpoint,
      webhookUrl: registrar.webhookUrl,
      sandboxMode: false,
    },
  });

  const handleFormSubmit = async (data: ApiSettingsFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNewKey = () => {
    // TODO: Implement API key generation
    console.log("Generate new API key");
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
                  API Settings - {registrar.name}
                </DialogTitle>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="mt-6 space-y-6"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        API Key
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateNewKey}
                      >
                        <KeyIcon className="mr-2 h-4 w-4" />
                        Generate New
                      </Button>
                    </div>
                    <div className="mt-1 relative">
                      <Input
                        type={showSecrets ? "text" : "password"}
                        {...register("apiKey")}
                        error={errors.apiKey?.message}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() => setShowSecrets(!showSecrets)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          {showSecrets ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {registrar.type === "godaddy" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        API Secret
                      </label>
                      <Input
                        type={showSecrets ? "text" : "password"}
                        {...register("apiSecret")}
                        error={errors.apiSecret?.message}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Custom API Endpoint
                    </label>
                    <Input
                      {...register("customEndpoint")}
                      placeholder="https://api.example.com"
                      error={errors.customEndpoint?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Webhook URL
                    </label>
                    <Input
                      {...register("webhookUrl")}
                      placeholder="https://your-webhook.com"
                      error={errors.webhookUrl?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      IP Whitelist
                    </label>
                    <Input
                      {...register("ipWhitelist")}
                      placeholder="Comma-separated IP addresses"
                      error={errors.ipWhitelist?.message}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Leave empty to allow all IPs
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("sandboxMode")}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Enable Sandbox Mode
                    </label>
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
                      Save Changes
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
