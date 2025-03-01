// src/components/settings/DomainSettings.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobeAltIcon, ServerIcon } from "@heroicons/react/24/outline";

const domainSettingsSchema = z.object({
  defaultNameserver1: z.string().min(1, "Primary nameserver is required"),
  defaultNameserver2: z.string().min(1, "Secondary nameserver is required"),
  defaultNameserver3: z.string().optional(),
  defaultNameserver4: z.string().optional(),
  autoRenew: z.boolean().default(true),
  privacyProtection: z.boolean().default(true),
  defaultRegistrar: z.string(),
  dnsTemplate: z.string().optional(),
});

type DomainSettingsFormValues = z.infer<typeof domainSettingsSchema>;

interface DomainSettingsProps {
  settings?: DomainSettingsFormValues;
  onSubmit: (data: DomainSettingsFormValues) => Promise<void>;
  registrars: Array<{ id: string; name: string }>;
  dnsTemplates: Array<{ id: string; name: string }>;
}

export default function DomainSettings({
  settings,
  onSubmit,
  registrars = [],
  dnsTemplates = [],
}: DomainSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DomainSettingsFormValues>({
    resolver: zodResolver(domainSettingsSchema),
    defaultValues: settings || {
      autoRenew: true,
      privacyProtection: true,
    },
  });

  const handleFormSubmit = async (data: DomainSettingsFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Nameserver Settings */}
      <div>
        <div className="flex items-center">
          <ServerIcon className="h-6 w-6 text-gray-400" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">
            Default Nameservers
          </h3>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Set the default nameservers for newly registered domains.
        </p>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Primary Nameserver
              </label>
              <Input
                {...register("defaultNameserver1")}
                placeholder="ns1.example.com"
                error={errors.defaultNameserver1?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Secondary Nameserver
              </label>
              <Input
                {...register("defaultNameserver2")}
                placeholder="ns2.example.com"
                error={errors.defaultNameserver2?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Nameserver (Optional)
              </label>
              <Input
                {...register("defaultNameserver3")}
                placeholder="ns3.example.com"
                error={errors.defaultNameserver3?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Nameserver (Optional)
              </label>
              <Input
                {...register("defaultNameserver4")}
                placeholder="ns4.example.com"
                error={errors.defaultNameserver4?.message}
              />
            </div>
          </div>

          {/* Domain Registration Preferences */}
          <div className="mt-8">
            <div className="flex items-center">
              <GlobeAltIcon className="h-6 w-6 text-gray-400" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                Registration Preferences
              </h3>
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Default Registrar
                </label>
                <select
                  {...register("defaultRegistrar")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a registrar</option>
                  {registrars.map(registrar => (
                    <option key={registrar.id} value={registrar.id}>
                      {registrar.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  DNS Template
                </label>
                <select
                  {...register("dnsTemplate")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a template</option>
                  {dnsTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("autoRenew")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Enable automatic renewal for new domains
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("privacyProtection")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Enable WHOIS privacy protection by default
                  </label>
                </div>
              </div>
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
