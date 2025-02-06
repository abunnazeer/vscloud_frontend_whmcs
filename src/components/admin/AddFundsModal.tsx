// src/components/admin/AddFundsModal.tsx
"use client";

import { useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BanknotesIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Registrar } from "@/types";

const fundsSchema = z.object({
  amount: z.number().min(10, "Minimum amount is $10"),
  paymentMethod: z.enum(["credit_card", "bank_transfer"]),
  reference: z.string().optional(),
});

type FundsFormValues = z.infer<typeof fundsSchema>;

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrar?: Registrar | null;
  onSubmit: (data: FundsFormValues) => Promise<void>;
}

export default function AddFundsModal({
  isOpen,
  onClose,
  registrar,
  onSubmit,
}: AddFundsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FundsFormValues>({
    resolver: zodResolver(fundsSchema),
    defaultValues: {
      paymentMethod: "credit_card",
    },
  });

  const handleFormSubmit = async (data: FundsFormValues) => {
    if (!registrar) return;

    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the modal if there's no registrar
  if (!registrar) return null;

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
              <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  Add Funds - {registrar.name}
                </DialogTitle>

                <div className="mt-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">Current Balance</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${registrar.balance?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="mt-6 space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount to Add
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <Input
                        type="number"
                        className="pl-7"
                        placeholder="0.00"
                        {...register("amount", { valueAsNumber: true })}
                        error={errors.amount?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div
                        className={`relative rounded-lg border p-4 cursor-pointer ${
                          watch("paymentMethod") === "credit_card"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => setValue("paymentMethod", "credit_card")}
                      >
                        <div className="flex items-center">
                          <CreditCardIcon className="h-5 w-5 text-gray-400" />
                          <span className="ml-2 text-sm font-medium">
                            Credit Card
                          </span>
                        </div>
                      </div>

                      <div
                        className={`relative rounded-lg border p-4 cursor-pointer ${
                          watch("paymentMethod") === "bank_transfer"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                        onClick={() =>
                          setValue("paymentMethod", "bank_transfer")
                        }
                      >
                        <div className="flex items-center">
                          <BanknotesIcon className="h-5 w-5 text-gray-400" />
                          <span className="ml-2 text-sm font-medium">
                            Bank Transfer
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reference (Optional)
                    </label>
                    <Input
                      {...register("reference")}
                      placeholder="Enter reference for this transaction"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" loading={isLoading}>
                      Add Funds
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
