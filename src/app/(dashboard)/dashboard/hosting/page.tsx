// src/app/(dashboard)/dashboard/hosting/page.tsx
"use client";

import { useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";

const billingOptions = [
  { id: "monthly", name: "Monthly", multiplier: 1 },
  { id: "annually", name: "Annually", multiplier: 0.9 }, // 10% discount
];

const plans = [
  {
    name: "Starter",
    basePrice: 29,
    description: "Perfect for personal websites and blogs",
    features: [
      "2GB SSD Storage",
      "10GB Bandwidth",
      "5 Email Accounts",
      "Free SSL Certificate",
      "Daily Backups",
      "24/7 Support",
    ],
    recommended: false,
  },
  {
    name: "Professional",
    basePrice: 59,
    description: "Ideal for growing businesses",
    features: [
      "10GB SSD Storage",
      "Unlimited Bandwidth",
      "Unlimited Email Accounts",
      "Free SSL Certificate",
      "Daily Backups",
      "Priority Support",
      "Free Domain",
      "SSH Access",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    basePrice: 99,
    description: "For large-scale applications",
    features: [
      "50GB SSD Storage",
      "Unlimited Bandwidth",
      "Unlimited Email Accounts",
      "Free SSL Certificate",
      "Daily Backups",
      "Priority Support",
      "Free Domain",
      "SSH Access",
      "Dedicated IP",
      "Custom Server Config",
    ],
    recommended: false,
  },
];

export default function HostingPlansPage() {
  const [billingInterval, setBillingInterval] = useState(billingOptions[0].id);

  const getPrice = (basePrice: number) => {
    const multiplier =
      billingOptions.find(option => option.id === billingInterval)
        ?.multiplier || 1;
    return (basePrice * multiplier).toFixed(2);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Hosting Plans</h1>
        <p className="mt-2 text-sm text-gray-700">
          Choose the perfect hosting plan for your needs
        </p>
      </div>

      {/* Billing Interval Toggle */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-px rounded-lg bg-gray-200 p-0.5">
          {billingOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setBillingInterval(option.id)}
              className={`
                relative px-6 py-2 text-sm font-medium whitespace-nowrap rounded-md
                ${
                  billingInterval === option.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }
              `}
            >
              {option.name}
              {option.id === "annually" && (
                <span className="absolute -top-2 -right-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                  Save 10%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map(plan => (
          <div
            key={plan.name}
            className={`
              relative rounded-2xl bg-white p-8 shadow-lg
              ${
                plan.recommended
                  ? "ring-2 ring-blue-600"
                  : "ring-1 ring-gray-200"
              }
            `}
          >
            {plan.recommended && (
              <span className="absolute -top-4 right-8 inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-medium text-blue-600">
                Recommended
              </span>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
              <p className="mt-2 text-gray-500">{plan.description}</p>
            </div>

            <div className="mb-6">
              <p>
                <span className="text-4xl font-bold text-gray-900">
                  ${getPrice(plan.basePrice)}
                </span>
                <span className="text-gray-500">/{billingInterval}</span>
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-start">
                  <CheckIcon className="h-6 w-6 flex-shrink-0 text-green-500" />
                  <span className="ml-3 text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.recommended ? "default" : "outline"}
              onClick={() => {
                // TODO: Implement order flow
                console.log(`Selected plan: ${plan.name}`);
              }}
            >
              Get Started
            </Button>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Compare Plans
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-4 pr-4 text-gray-500">Features</th>
                {plans.map(plan => (
                  <th key={plan.name} className="px-4 py-4 text-gray-900">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4 pr-4 text-gray-500">Storage</td>
                <td className="px-4 py-4">2GB SSD</td>
                <td className="px-4 py-4">10GB SSD</td>
                <td className="px-4 py-4">50GB SSD</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 pr-4 text-gray-500">Bandwidth</td>
                <td className="px-4 py-4">10GB</td>
                <td className="px-4 py-4">Unlimited</td>
                <td className="px-4 py-4">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 pr-4 text-gray-500">Email Accounts</td>
                <td className="px-4 py-4">5</td>
                <td className="px-4 py-4">Unlimited</td>
                <td className="px-4 py-4">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 pr-4 text-gray-500">Free Domain</td>
                <td className="px-4 py-4">✖</td>
                <td className="px-4 py-4">✓</td>
                <td className="px-4 py-4">✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 pr-4 text-gray-500">SSL Certificate</td>
                <td className="px-4 py-4">✓</td>
                <td className="px-4 py-4">✓</td>
                <td className="px-4 py-4">✓</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 text-gray-500">Dedicated IP</td>
                <td className="px-4 py-4">✖</td>
                <td className="px-4 py-4">✖</td>
                <td className="px-4 py-4">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
