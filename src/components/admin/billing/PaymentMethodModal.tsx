// src/components/admin/billing/PaymentMethodModal.tsx
"use client";

import { Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const paymentMethodSchema = z.object({
  type: z.enum(["credit_card", "bank_account", "paypal"]),
  name: z.string().min(1, "Name is required"),
  cardNumber: z.string().min(1, "Card number is required").optional(),
  expiryDate: z.string().min(1, "Expiry date is required").optional(),
  cvv: z.string().min(1, "CVV is required").optional(),
  accountNumber: z.string().min(1, "Account number is required").optional(),
  routingNumber: z.string().min(1, "Routing number is required").optional(),
  isDefault: z.boolean().optional(),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentMethodFormData) => void;
  paymentMethod?: PaymentMethodFormData;
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onSubmit,
  paymentMethod,
}: PaymentMethodModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: paymentMethod || {
      type: "credit_card",
      isDefault: false,
    },
  });

  const paymentType = watch("type");

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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  {paymentMethod ? "Edit Payment Method" : "Add Payment Method"}
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                  <div className="space-y-4">
                    {/* Payment Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Payment Type
                      </label>
                      <select
                        {...register("type")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="credit_card">Credit Card</option>
                        <option value="bank_account">Bank Account</option>
                        <option value="paypal">PayPal</option>
                      </select>
                      {errors.type && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.type.message}
                        </p>
                      )}
                    </div>

                    {/* Payment Method Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., Business Card"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Credit Card Fields */}
                    {paymentType === "credit_card" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Card Number
                          </label>
                          <input
                            type="text"
                            {...register("cardNumber")}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                            placeholder="•••• •••• •••• ••••"
                          />
                          {errors.cardNumber && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.cardNumber.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              {...register("expiryDate")}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                              placeholder="MM/YY"
                            />
                            {errors.expiryDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.expiryDate.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              CVV
                            </label>
                            <input
                              type="text"
                              {...register("cvv")}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                              placeholder="•••"
                            />
                            {errors.cvv && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.cvv.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Bank Account Fields */}
                    {paymentType === "bank_account" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Account Number
                          </label>
                          <input
                            type="text"
                            {...register("accountNumber")}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Enter account number"
                          />
                          {errors.accountNumber && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.accountNumber.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Routing Number
                          </label>
                          <input
                            type="text"
                            {...register("routingNumber")}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Enter routing number"
                          />
                          {errors.routingNumber && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.routingNumber.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Set as Default */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("isDefault")}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Set as default payment method
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose} type="button">
                      Cancel
                    </Button>
                    <Button type="submit">
                      {paymentMethod ? "Update" : "Add"} Payment Method
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
