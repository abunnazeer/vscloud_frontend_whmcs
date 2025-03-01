// src/components/settings/BillingSettings.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCardIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const billingSettingsSchema = z.object({
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  billingEmail: z.string().email("Invalid email address"),
  billingAddress: z.string().min(1, "Billing address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  currency: z.string().min(1, "Currency is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  autoPayEnabled: z.boolean().default(true),
  invoiceGeneration: z.enum(["monthly", "quarterly", "annually"]),
  paymentTerms: z.number().min(0).default(30),
});

type BillingSettingsFormValues = z.infer<typeof billingSettingsSchema>;

interface BillingSettingsProps {
  settings?: BillingSettingsFormValues;
  onSubmit: (data: BillingSettingsFormValues) => Promise<void>;
  savedCards?: Array<{
    id: string;
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  }>;
  currencies: Array<{ code: string; name: string }>;
}

export default function BillingSettings({
  settings,
  onSubmit,
  savedCards = [],
  currencies = [],
}: BillingSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BillingSettingsFormValues>({
    resolver: zodResolver(billingSettingsSchema),
    defaultValues: settings || {
      autoPayEnabled: true,
      invoiceGeneration: "monthly",
      paymentTerms: 30,
    },
  });

  const handleFormSubmit = async (data: BillingSettingsFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Company Information */}
      <div>
        <div className="flex items-center">
          <BuildingLibraryIcon className="h-6 w-6 text-gray-400" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">
            Company Information
          </h3>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Company Name (Optional)
              </label>
              <Input
                {...register("companyName")}
                error={errors.companyName?.message}
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Tax ID (Optional)
              </label>
              <Input {...register("taxId")} error={errors.taxId?.message} />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Billing Email
              </label>
              <Input
                type="email"
                {...register("billingEmail")}
                error={errors.billingEmail?.message}
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Billing Address
              </label>
              <Input
                {...register("billingAddress")}
                error={errors.billingAddress?.message}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <Input {...register("city")} error={errors.city?.message} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                State / Province
              </label>
              <Input {...register("state")} error={errors.state?.message} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <Input
                {...register("postalCode")}
                error={errors.postalCode?.message}
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                {...register("country")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                {/* Add more countries */}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                {...register("currency")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a currency</option>
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-8">
            <div className="flex items-center">
              <CreditCardIcon className="h-6 w-6 text-gray-400" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                Payment Methods
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              {savedCards.map(card => (
                <div
                  key={card.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      {...register("paymentMethod")}
                      value={card.id}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {card.brand} ending in {card.last4}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {card.expMonth}/{card.expYear}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              ))}

              {!showAddCard ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddCard(true)}
                >
                  Add Payment Method
                </Button>
              ) : (
                <div className="rounded-lg border p-4">
                  {/* Add card form would go here */}
                  <p className="text-sm text-gray-500">
                    Card addition form placeholder
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Billing Preferences */}
          <div className="mt-8">
            <div className="flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                Billing Preferences
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Invoice Generation
                </label>
                <select
                  {...register("invoiceGeneration")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Terms (Days)
                </label>
                <Input
                  type="number"
                  {...register("paymentTerms", { valueAsNumber: true })}
                  error={errors.paymentTerms?.message}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("autoPayEnabled")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Enable automatic payments
                </label>
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
