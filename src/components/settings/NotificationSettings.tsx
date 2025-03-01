// src/components/settings/NotificationSettings.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BellIcon,
  EnvelopeIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

const notificationSettingsSchema = z.object({
  // Email Notifications
  emailNotifications: z.boolean().default(true),
  emailBilling: z.boolean().default(true),
  emailSecurity: z.boolean().default(true),
  emailUpdates: z.boolean().default(true),
  emailMarketing: z.boolean().default(false),

  // Browser Notifications
  browserNotifications: z.boolean().default(true),
  browserAlerts: z.boolean().default(true),
  browserMaintenance: z.boolean().default(true),
  browserStatusUpdates: z.boolean().default(true),

  // Mobile Notifications
  mobileNotifications: z.boolean().default(true),
  mobileBilling: z.boolean().default(true),
  mobileAlerts: z.boolean().default(true),
  mobileStatusUpdates: z.boolean().default(true),

  // Notification Schedule
  notifyDuringQuietHours: z.boolean().default(false),
  quietHoursStart: z.string().default("22:00"),
  quietHoursEnd: z.string().default("07:00"),
  timezone: z.string(),
});

type NotificationSettingsFormValues = z.infer<
  typeof notificationSettingsSchema
>;

interface NotificationSettingsProps {
  settings?: NotificationSettingsFormValues;
  onSubmit: (data: NotificationSettingsFormValues) => Promise<void>;
  timezones: Array<{ id: string; name: string }>;
}

export default function NotificationSettings({
  settings,
  onSubmit,
  timezones = [],
}: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: settings || {
      emailNotifications: true,
      emailBilling: true,
      emailSecurity: true,
      emailUpdates: true,
      emailMarketing: false,
      browserNotifications: true,
      browserAlerts: true,
      browserMaintenance: true,
      browserStatusUpdates: true,
      mobileNotifications: true,
      mobileBilling: true,
      mobileAlerts: true,
      mobileStatusUpdates: true,
      notifyDuringQuietHours: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
      timezone: "UTC",
    },
  });

  const handleFormSubmit = async (data: NotificationSettingsFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  const notifyDuringQuietHours = watch("notifyDuringQuietHours");

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Email Notifications */}
        <div className="space-y-6">
          <div className="flex items-center">
            <EnvelopeIcon className="h-6 w-6 text-gray-400" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              Email Notifications
            </h3>
          </div>
          <div className="ml-8 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  {...register("emailNotifications")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-700">
                  Enable Email Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive important updates via email
                </p>
              </div>
            </div>

            <div className="ml-8 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("emailBilling")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Billing and invoice notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("emailSecurity")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Security alerts and warnings
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("emailUpdates")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Service updates and maintenance
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("emailMarketing")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Marketing and promotional emails
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Browser Notifications */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center">
            <ComputerDesktopIcon className="h-6 w-6 text-gray-400" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              Browser Notifications
            </h3>
          </div>
          <div className="ml-8 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  {...register("browserNotifications")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-700">
                  Enable Browser Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Get real-time notifications in your browser
                </p>
              </div>
            </div>

            <div className="ml-8 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("browserAlerts")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Critical alerts and warnings
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("browserMaintenance")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Maintenance notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("browserStatusUpdates")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Service status updates
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Notifications */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center">
            <DevicePhoneMobileIcon className="h-6 w-6 text-gray-400" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              Mobile Notifications
            </h3>
          </div>
          <div className="ml-8 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  {...register("mobileNotifications")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-700">
                  Enable Mobile Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive notifications on your mobile device
                </p>
              </div>
            </div>

            <div className="ml-8 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("mobileBilling")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Billing notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("mobileAlerts")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Critical alerts
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("mobileStatusUpdates")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Status updates
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Schedule */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center">
            <BellIcon className="h-6 w-6 text-gray-400" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              Notification Schedule
            </h3>
          </div>
          <div className="ml-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                {...register("timezone")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {timezones.map(timezone => (
                  <option key={timezone.id} value={timezone.id}>
                    {timezone.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  {...register("notifyDuringQuietHours")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-700">
                  Enable Quiet Hours
                </label>
                <p className="text-sm text-gray-500">
                  Only receive critical notifications during quiet hours
                </p>
              </div>
            </div>

            {notifyDuringQuietHours && (
              <div className="ml-8 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    {...register("quietHoursStart")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    {...register("quietHoursEnd")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
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
  );
}
