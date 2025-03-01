// src/components/settings/EmailSettings.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const emailSettingsSchema = z.object({
  defaultEmailService: z.string(),
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUsername: z.string().optional(),
  smtpPassword: z.string().optional(),
  smtpEncryption: z.enum(["none", "ssl", "tls"]).default("tls"),
  catchAllEmail: z.string().email().optional(),
  spamProtection: z.boolean().default(true),
  autoResponder: z.boolean().default(false),
  autoResponderMessage: z.string().optional(),
  emailForwarders: z
    .array(
      z.object({
        source: z.string(),
        destination: z.string().email(),
      })
    )
    .default([]),
});

type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;

interface EmailSettingsProps {
  settings?: EmailSettingsFormValues;
  onSubmit: (data: EmailSettingsFormValues) => Promise<void>;
  emailServices: Array<{ id: string; name: string }>;
}

export default function EmailSettings({
  settings,
  onSubmit,
  emailServices = [],
}: EmailSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [forwarders, setForwarders] = useState(settings?.emailForwarders || []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: settings || {
      smtpEncryption: "tls",
      spamProtection: true,
      autoResponder: false,
      emailForwarders: [],
    },
  });

  const autoResponderEnabled = watch("autoResponder");
  const selectedEmailService = watch("defaultEmailService");

  const handleFormSubmit = async (data: EmailSettingsFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit({
        ...data,
        emailForwarders: forwarders,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addForwarder = () => {
    setForwarders([...forwarders, { source: "", destination: "" }]);
  };

  const removeForwarder = (index: number) => {
    setForwarders(forwarders.filter((_, i) => i !== index));
  };

  const updateForwarder = (
    index: number,
    field: "source" | "destination",
    value: string
  ) => {
    const updatedForwarders = [...forwarders];
    updatedForwarders[index] = {
      ...updatedForwarders[index],
      [field]: value,
    };
    setForwarders(updatedForwarders);
  };

  return (
    <div className="space-y-8">
      {/* Email Service Settings */}
      <div>
        <div className="flex items-center">
          <EnvelopeIcon className="h-6 w-6 text-gray-400" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">
            Email Service Configuration
          </h3>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Configure your email service and SMTP settings.
        </p>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Default Email Service
              </label>
              <select
                {...register("defaultEmailService")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select an email service</option>
                {emailServices.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedEmailService === "custom" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SMTP Host
                  </label>
                  <Input
                    {...register("smtpHost")}
                    placeholder="smtp.example.com"
                    error={errors.smtpHost?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SMTP Port
                  </label>
                  <Input
                    {...register("smtpPort")}
                    placeholder="587"
                    error={errors.smtpPort?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SMTP Username
                  </label>
                  <Input
                    {...register("smtpUsername")}
                    error={errors.smtpUsername?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SMTP Password
                  </label>
                  <Input
                    type="password"
                    {...register("smtpPassword")}
                    error={errors.smtpPassword?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Encryption
                  </label>
                  <select
                    {...register("smtpEncryption")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="ssl">SSL</option>
                    <option value="tls">TLS</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Email Forwarding */}
          <div className="mt-8">
            <div className="flex items-center">
              <PaperAirplaneIcon className="h-6 w-6 text-gray-400" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                Email Forwarding
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              {forwarders.map((forwarder, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Input
                    value={forwarder.source}
                    onChange={e =>
                      updateForwarder(index, "source", e.target.value)
                    }
                    placeholder="source@yourdomain.com"
                    className="flex-1"
                  />
                  <span className="text-gray-500">→</span>
                  <Input
                    value={forwarder.destination}
                    onChange={e =>
                      updateForwarder(index, "destination", e.target.value)
                    }
                    placeholder="destination@example.com"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeForwarder(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addForwarder}>
                Add Forwarder
              </Button>
            </div>
          </div>

          {/* Email Protection */}
          <div className="mt-8">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                Email Protection
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Catch-all Email Address
                </label>
                <Input
                  {...register("catchAllEmail")}
                  placeholder="catchall@yourdomain.com"
                  error={errors.catchAllEmail?.message}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("spamProtection")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Enable spam protection
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("autoResponder")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Enable auto-responder
                </label>
              </div>

              {autoResponderEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Auto-responder Message
                  </label>
                  <textarea
                    {...register("autoResponderMessage")}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your auto-response message..."
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
