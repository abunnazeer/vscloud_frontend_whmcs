// src/components/settings/SecuritySettings.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface SecuritySettingsProps {
  onChangePassword: (data: PasswordFormValues) => Promise<void>;
  onToggle2FA: (enabled: boolean) => Promise<void>;
  onGenerateBackupCodes: () => Promise<void>;
  is2FAEnabled?: boolean;
  lastLoginAttempts?: {
    timestamp: string;
    status: "success" | "failed";
    ipAddress: string;
    device: string;
  }[];
}

export default function SecuritySettings({
  onChangePassword,
  onToggle2FA,
  onGenerateBackupCodes,
  is2FAEnabled = false,
  lastLoginAttempts = [],
}: SecuritySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const handlePasswordChange = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      await onChangePassword(data);
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle2FA(!is2FAEnabled);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBackupCodes = async () => {
    setIsLoading(true);
    try {
      await onGenerateBackupCodes();
      setShowBackupCodes(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Password Change Section */}
      <div>
        <div className="flex items-center">
          <KeyIcon className="h-6 w-6 text-gray-400" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">
            Change Password
          </h3>
        </div>
        <form onSubmit={handleSubmit(handlePasswordChange)} className="mt-4">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <Input
                type="password"
                {...register("currentPassword")}
                error={errors.currentPassword?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                type="password"
                {...register("newPassword")}
                error={errors.newPassword?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input
                type="password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button type="submit" loading={isLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border-t pt-8">
        <div className="flex items-center">
          <DevicePhoneMobileIcon className="h-6 w-6 text-gray-400" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">
            Two-Factor Authentication
          </h3>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account by enabling
                two-factor authentication.
              </p>
              {is2FAEnabled && (
                <p className="mt-1 text-sm text-green-600">
                  Two-factor authentication is enabled
                </p>
              )}
            </div>
            <Button
              variant={is2FAEnabled ? "outline" : "default"}
              onClick={handle2FAToggle}
              loading={isLoading}
            >
              {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>

          {is2FAEnabled && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={handleGenerateBackupCodes}
                loading={isLoading}
              >
                Generate Backup Codes
              </Button>
              {showBackupCodes && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900">
                    Backup Codes
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Save these backup codes in a secure place. You can use them
                    to access your account if you lose your two-factor
                    authentication device.
                  </p>
                  <div className="mt-2 font-mono text-sm">
                    {/* Backup codes would be displayed here */}
                    1234-5678-9012-3456
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Login Activity */}
      <div className="border-t pt-8">
        <div className="flex items-center">
          <ClockIcon className="h-6 w-6 text-gray-400" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">
            Recent Login Activity
          </h3>
        </div>
        <div className="mt-4">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Device
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {lastLoginAttempts.map((attempt, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {new Date(attempt.timestamp).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          attempt.status === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {attempt.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {attempt.ipAddress}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {attempt.device}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
