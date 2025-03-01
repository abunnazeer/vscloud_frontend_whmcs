// src/app/(admin)/admin/settings/page.tsx
"use client";

import { useState } from "react";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
  vatNumber?: string;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
}

interface LocalizationSettings {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
    requireUppercase: boolean;
  };
  sessionTimeout: number;
  ipWhitelist: string[];
}

const mockSettings = {
  company: {
    name: "VSCloud Hosting",
    address: "123 Tech Street, Silicon Valley",
    phone: "+1 234 567 890",
    email: "contact@vscloud.com",
    website: "https://vscloud.com",
    vatNumber: "GB123456789",
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "noreply@vscloud.com",
    smtpPassword: "********",
    fromEmail: "support@vscloud.com",
    fromName: "VSCloud Support",
    replyToEmail: "support@vscloud.com",
  },
  localization: {
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "24h",
    currency: "USD",
    language: "en-US",
  },
  security: {
    twoFactorAuth: true,
    passwordPolicy: {
      minLength: 8,
      requireNumbers: true,
      requireSymbols: true,
      requireUppercase: true,
    },
    sessionTimeout: 30,
    ipWhitelist: ["192.168.1.1"],
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [activeTab, setActiveTab] = useState<
    "company" | "email" | "localization" | "security"
  >("company");
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log("Save company settings:", settings.company);
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log("Save email settings:", settings.email);
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    try {
      // TODO: Implement email test
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Test email sent");
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleSaveLocalization = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log("Save localization settings:", settings.localization);
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log("Save security settings:", settings.security);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your system settings and preferences
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("company")}
            className={`${
              activeTab === "company"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            <BuildingOfficeIcon className="mr-2 h-5 w-5" />
            Company Profile
          </button>

          <button
            onClick={() => setActiveTab("email")}
            className={`${
              activeTab === "email"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            <EnvelopeIcon className="mr-2 h-5 w-5" />
            Email Settings
          </button>

          <button
            onClick={() => setActiveTab("localization")}
            className={`${
              activeTab === "localization"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            <GlobeAltIcon className="mr-2 h-5 w-5" />
            Localization
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`${
              activeTab === "security"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            <ShieldCheckIcon className="mr-2 h-5 w-5" />
            Security
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="rounded-lg bg-white shadow">
        {/* Company Settings */}
        {activeTab === "company" && (
          <form onSubmit={handleSaveCompany} className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Company Profile
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your company information and branding
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.company.name}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, name: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.company.email}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, email: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.company.phone}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, phone: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  value={settings.company.website}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, website: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  value={settings.company.address}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, address: e.target.value },
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  VAT Number
                </label>
                <input
                  type="text"
                  value={settings.company.vatNumber}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      company: {
                        ...settings.company,
                        vatNumber: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}

        {/* Email Settings */}
        {activeTab === "email" && (
          <form onSubmit={handleSaveEmail} className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Email Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure your email server settings
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={settings.email.smtpHost}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, smtpHost: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        smtpPort: Number(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={settings.email.smtpUser}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, smtpUser: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={settings.email.smtpPassword}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        smtpPassword: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  From Email
                </label>
                <input
                  type="email"
                  value={settings.email.fromEmail}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, fromEmail: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  From Name
                </label>
                <input
                  type="text"
                  value={settings.email.fromName}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, fromName: e.target.value },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reply-To Email
                </label>
                <input
                  type="email"
                  value={settings.email.replyToEmail}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        replyToEmail: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestEmail}
                disabled={isTestingEmail}
              >
                {isTestingEmail ? "Sending..." : "Test Email"}
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}

        {/* Localization Settings */}
        {activeTab === "localization" && (
          <form onSubmit={handleSaveLocalization} className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Localization
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure regional and formatting preferences
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Timezone
                </label>
                <select
                  value={settings.localization.timezone}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      localization: {
                        ...settings.localization,
                        timezone: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Format
                </label>
                <select
                  value={settings.localization.dateFormat}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      localization: {
                        ...settings.localization,
                        dateFormat: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time Format
                </label>
                <select
                  value={settings.localization.timeFormat}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      localization: {
                        ...settings.localization,
                        timeFormat: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="12h">12-hour</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  value={settings.localization.currency}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      localization: {
                        ...settings.localization,
                        currency: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  value={settings.localization.language}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      localization: {
                        ...settings.localization,
                        language: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <form onSubmit={handleSaveSecurity} className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure security and authentication settings
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          twoFactorAuth: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Enable Two-Factor Authentication
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Require 2FA for all admin accounts
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Password Policy
                </h4>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="6"
                      max="32"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: {
                              ...settings.security.passwordPolicy,
                              minLength: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="block w-20 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Minimum password length
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: {
                              ...settings.security.passwordPolicy,
                              requireNumbers: e.target.checked,
                            },
                          },
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Require numbers
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.passwordPolicy.requireSymbols}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: {
                              ...settings.security.passwordPolicy,
                              requireSymbols: e.target.checked,
                            },
                          },
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Require symbols
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        settings.security.passwordPolicy.requireUppercase
                      }
                      onChange={e =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordPolicy: {
                              ...settings.security.passwordPolicy,
                              requireUppercase: e.target.checked,
                            },
                          },
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Require uppercase letters
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Session Settings
                </h4>
                <div className="mt-2">
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.security.sessionTimeout}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            sessionTimeout: Number(e.target.value),
                          },
                        })
                      }
                      className="block w-20 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Session timeout (minutes)
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  IP Whitelist
                </h4>
                <div className="mt-2">
                  <textarea
                    value={settings.security.ipWhitelist.join("\n")}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          ipWhitelist: e.target.value
                            .split("\n")
                            .filter(Boolean),
                        },
                      })
                    }
                    rows={3}
                    placeholder="Enter one IP address per line"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter one IP address per line. Leave empty to allow all IPs.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
