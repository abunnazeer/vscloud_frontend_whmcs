// src/components/admin/settings/NotificationSettings.tsx
"use client";

import { Fragment } from "react";
import { Switch } from "@headlessui/react";
import { Button } from "@/components/ui/button";

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: "email" | "sms" | "system";
  variables: string[];
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    events: {
      newOrder: boolean;
      orderStatus: boolean;
      invoice: boolean;
      ticketUpdate: boolean;
      domainExpiry: boolean;
      serverStatus: boolean;
    };
  };
  sms: {
    enabled: boolean;
    events: {
      serverDown: boolean;
      criticalError: boolean;
      securityAlert: boolean;
    };
  };
  system: {
    enabled: boolean;
    events: {
      newTicket: boolean;
      ticketAssigned: boolean;
      maintenance: boolean;
    };
  };
  templates: NotificationTemplate[];
}

const mockTemplates: NotificationTemplate[] = [
  {
    id: "1",
    name: "New Order",
    subject: "New Order Confirmation - #{order_id}",
    content: "Dear #{customer_name},\n\nThank you for your order...",
    type: "email",
    variables: ["order_id", "customer_name", "order_details"],
  },
  {
    id: "2",
    name: "Ticket Update",
    subject: "Update on Ticket #{ticket_id}",
    content: "Your ticket has been updated...",
    type: "email",
    variables: ["ticket_id", "ticket_status", "update_message"],
  },
];

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

export default function NotificationSettings({
  settings,
  onSave,
}: NotificationSettingsProps) {
  const handleToggleEmail = (event: string, enabled: boolean) => {
    const newSettings = {
      ...settings,
      email: {
        ...settings.email,
        events: {
          ...settings.email.events,
          [event]: enabled,
        },
      },
    };
    onSave(newSettings);
  };

  const handleToggleSMS = (event: string, enabled: boolean) => {
    const newSettings = {
      ...settings,
      sms: {
        ...settings.sms,
        events: {
          ...settings.sms.events,
          [event]: enabled,
        },
      },
    };
    onSave(newSettings);
  };

  const handleToggleSystem = (event: string, enabled: boolean) => {
    const newSettings = {
      ...settings,
      system: {
        ...settings.system,
        events: {
          ...settings.system.events,
          [event]: enabled,
        },
      },
    };
    onSave(newSettings);
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Email Notifications
        </h3>
        <div className="mt-4 space-y-4">
          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="mr-4">
                Enable Email Notifications
              </Switch.Label>
              <Switch
                checked={settings.email.enabled}
                onChange={checked =>
                  onSave({
                    ...settings,
                    email: { ...settings.email, enabled: checked },
                  })
                }
                className={`${
                  settings.email.enabled ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.email.enabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </Switch.Group>

          {settings.email.enabled && (
            <div className="ml-4 space-y-4">
              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    New Order Notifications
                  </Switch.Label>
                  <Switch
                    checked={settings.email.events.newOrder}
                    onChange={checked => handleToggleEmail("newOrder", checked)}
                    className={`${
                      settings.email.events.newOrder
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.email.events.newOrder
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>

              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    Order Status Updates
                  </Switch.Label>
                  <Switch
                    checked={settings.email.events.orderStatus}
                    onChange={checked =>
                      handleToggleEmail("orderStatus", checked)
                    }
                    className={`${
                      settings.email.events.orderStatus
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.email.events.orderStatus
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>

              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    Invoice Notifications
                  </Switch.Label>
                  <Switch
                    checked={settings.email.events.invoice}
                    onChange={checked => handleToggleEmail("invoice", checked)}
                    className={`${
                      settings.email.events.invoice
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.email.events.invoice
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>

              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    Support Ticket Updates
                  </Switch.Label>
                  <Switch
                    checked={settings.email.events.ticketUpdate}
                    onChange={checked =>
                      handleToggleEmail("ticketUpdate", checked)
                    }
                    className={`${
                      settings.email.events.ticketUpdate
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.email.events.ticketUpdate
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>

              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    Domain Expiry Notifications
                  </Switch.Label>
                  <Switch
                    checked={settings.email.events.domainExpiry}
                    onChange={checked =>
                      handleToggleEmail("domainExpiry", checked)
                    }
                    className={`${
                      settings.email.events.domainExpiry
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.email.events.domainExpiry
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>

              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    Server Status Alerts
                  </Switch.Label>
                  <Switch
                    checked={settings.email.events.serverStatus}
                    onChange={checked =>
                      handleToggleEmail("serverStatus", checked)
                    }
                    className={`${
                      settings.email.events.serverStatus
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.email.events.serverStatus
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>
            </div>
          )}
        </div>
      </div>

      {/* SMS Notifications */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
        <div className="mt-4 space-y-4">
          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="mr-4">
                Enable SMS Notifications
              </Switch.Label>
              <Switch
                checked={settings.sms.enabled}
                onChange={checked =>
                  onSave({
                    ...settings,
                    sms: { ...settings.sms, enabled: checked },
                  })
                }
                className={`${
                  settings.sms.enabled ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.sms.enabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </Switch.Group>

          {settings.sms.enabled && (
            <div className="ml-4 space-y-4">
              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    Server Down Alerts
                  </Switch.Label>
                  <Switch
                    checked={settings.sms.events.serverDown}
                    onChange={checked => handleToggleSMS("serverDown", checked)}
                    className={`${
                      settings.sms.events.serverDown
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.sms.events.serverDown
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>

              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    Critical Error Alerts
                  </Switch.Label>
                  <Switch
                    checked={settings.sms.events.criticalError}
                    onChange={checked =>
                      handleToggleSMS("criticalError", checked)
                    }
                    className={`${
                      settings.sms.events.criticalError
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.sms.events.criticalError
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>

              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">Security Alerts</Switch.Label>
                  <Switch
                    checked={settings.sms.events.securityAlert}
                    onChange={checked =>
                      handleToggleSMS("securityAlert", checked)
                    }
                    className={`${
                      settings.sms.events.securityAlert
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.sms.events.securityAlert
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>
            </div>
          )}
        </div>
      </div>

      {/* System Notifications */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          System Notifications
        </h3>
        <div className="mt-4 space-y-4">
          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="mr-4">
                Enable System Notifications
              </Switch.Label>
              <Switch
                checked={settings.system.enabled}
                onChange={checked =>
                  onSave({
                    ...settings,
                    system: { ...settings.system, enabled: checked },
                  })
                }
                className={`${
                  settings.system.enabled ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.system.enabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </Switch.Group>

          {settings.system.enabled && (
            <div className="ml-4 space-y-4">
              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    New Ticket Notifications
                  </Switch.Label>
                  <Switch
                    checked={settings.system.events.newTicket}
                    onChange={checked =>
                      handleToggleSystem("newTicket", checked)
                    }
                    className={`${
                      settings.system.events.newTicket
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.system.events.newTicket
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>

              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    Ticket Assignment Notifications
                  </Switch.Label>
                  <Switch
                    checked={settings.system.events.ticketAssigned}
                    onChange={checked =>
                      handleToggleSystem("ticketAssigned", checked)
                    }
                    className={`${
                      settings.system.events.ticketAssigned
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.system.events.ticketAssigned
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>

              <Switch.Group>
                <div className="flex items-center justify-between">
                  <Switch.Label className="mr-4">
                    Maintenance Notifications
                  </Switch.Label>
                  <Switch
                    checked={settings.system.events.maintenance}
                    onChange={checked =>
                      handleToggleSystem("maintenance", checked)
                    }
                    className={`${
                      settings.system.events.maintenance
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        settings.system.events.maintenance
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>
            </div>
          )}
        </div>
      </div>

      {/* Notification Templates */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900">
          Notification Templates
        </h3>
        <div className="mt-4">
          {mockTemplates.map(template => (
            <div
              key={template.id}
              className="mb-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {template.type}
                </span>
              </div>
              <p className="mb-2 text-sm text-gray-500">{template.subject}</p>
              <pre className="mb-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-2 text-sm text-gray-700">
                {template.content}
              </pre>
              <div className="flex flex-wrap gap-2">
                {template.variables.map(variable => (
                  <span
                    key={variable}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                  >
                    #{variable}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
