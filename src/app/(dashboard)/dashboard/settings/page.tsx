// src/app/(client)/settings/page.tsx
"use client";

import { useState } from "react";
import {
  UserIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import BillingSettings from "@/components/settings/BillingSettings";
import DomainSettings from "@/components/settings/DomainSettings";
import EmailSettings from "@/components/settings/EmailSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";

// Mock data - replace with real data from your API
const mockData = {
  registrars: [
    { id: "namecheap", name: "Namecheap" },
    { id: "godaddy", name: "GoDaddy" },
    { id: "cloudflare", name: "Cloudflare" },
  ],
  dnsTemplates: [
    { id: "default", name: "Default Template" },
    { id: "custom", name: "Custom Template" },
  ],
  currencies: [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
  ],
  emailServices: [
    { id: "gmail", name: "Gmail SMTP" },
    { id: "custom", name: "Custom SMTP" },
  ],
  timezones: [
    { id: "UTC", name: "UTC" },
    { id: "America/New_York", name: "Eastern Time" },
    { id: "America/Chicago", name: "Central Time" },
    { id: "America/Denver", name: "Mountain Time" },
    { id: "America/Los_Angeles", name: "Pacific Time" },
    { id: "Europe/London", name: "London" },
    { id: "Asia/Tokyo", name: "Tokyo" },
  ],
};

type TabType =
  | "profile"
  | "security"
  | "billing"
  | "domains"
  | "email"
  | "notifications"
  | "api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabConfig = [
    {
      id: "profile" as TabType,
      name: "Profile Settings",
      icon: UserIcon,
      description: "Manage your personal information and account details",
    },
    {
      id: "security" as TabType,
      name: "Security",
      icon: ShieldCheckIcon,
      description: "Password, two-factor authentication, and security settings",
    },
    {
      id: "billing" as TabType,
      name: "Billing & Payments",
      icon: CreditCardIcon,
      description: "Manage payment methods and billing preferences",
    },
    {
      id: "domains" as TabType,
      name: "Domain Settings",
      icon: GlobeAltIcon,
      description: "Default nameservers and domain preferences",
    },
    {
      id: "email" as TabType,
      name: "Email Settings",
      icon: EnvelopeIcon,
      description: "Email forwarding and email service settings",
    },
    {
      id: "notifications" as TabType,
      name: "Notifications",
      icon: BellIcon,
      description: "Configure email and system notification preferences",
    },
    {
      id: "api" as TabType,
      name: "API Access",
      icon: KeyIcon,
      description: "Manage API keys and access tokens",
    },
  ];

  const handleSubmit = async (data: any) => {
    console.log("Submitting data:", data);
    // Implement your submit logic here
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabConfig.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="rounded-lg bg-white p-6 shadow">
        {activeTab === "profile" && <ProfileSettings onSubmit={handleSubmit} />}

        {activeTab === "security" && (
          <SecuritySettings
            onChangePassword={handleSubmit}
            onToggle2FA={handleSubmit}
            onGenerateBackupCodes={handleSubmit}
            lastLoginAttempts={[
              {
                timestamp: new Date().toISOString(),
                status: "success",
                ipAddress: "192.168.1.1",
                device: "Chrome on Windows",
              },
            ]}
          />
        )}

        {activeTab === "billing" && (
          <BillingSettings
            onSubmit={handleSubmit}
            currencies={mockData.currencies}
            savedCards={[
              {
                id: "card_1",
                last4: "4242",
                brand: "Visa",
                expMonth: 12,
                expYear: 2024,
              },
            ]}
          />
        )}

        {activeTab === "domains" && (
          <DomainSettings
            onSubmit={handleSubmit}
            registrars={mockData.registrars}
            dnsTemplates={mockData.dnsTemplates}
          />
        )}

        {activeTab === "email" && (
          <EmailSettings
            onSubmit={handleSubmit}
            emailServices={mockData.emailServices}
          />
        )}
        {activeTab === "notifications" && (
          <NotificationSettings
            onSubmit={handleSubmit}
            timezones={mockData.timezones}
          />
        )}

        {activeTab === "api" && (
          <div>
            <h2 className="text-lg font-medium text-gray-900">API Access</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your API keys and access tokens
            </p>
            {/* Add API settings component here */}
          </div>
        )}
      </div>
    </div>
  );
}
