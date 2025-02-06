// src/components/admin/PricingModal.tsx
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const pricingSchema = z.object({
  register: z.object({
    price: z.number().min(0, "Price must be positive"),
    cost: z.number().min(0, "Cost must be positive"),
  }),
  renew: z.object({
    price: z.number().min(0, "Price must be positive"),
    cost: z.number().min(0, "Cost must be positive"),
  }),
  transfer: z.object({
    price: z.number().min(0, "Price must be positive"),
    cost: z.number().min(0, "Cost must be positive"),
  }),
  featured: z.boolean(),
  promotionalPrice: z
    .object({
      price: z.number().min(0, "Price must be positive"),
      endDate: z.string(),
    })
    .optional(),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tld: any;
  onSubmit: (data: PricingFormValues) => void;
}

export default function PricingModal({
  isOpen,
  onClose,
  tld,
  onSubmit,
}: PricingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPromo, setHasPromo] = useState(!!tld.promotionalPrice);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues: tld,
  });

  const handleFormSubmit = async (data: PricingFormValues) => {
    setIsLoading(true);
    try {
      if (!hasPromo) {
        delete data.promotionalPrice;
      }
      await onSubmit(data);
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMargin = (cost: number, price: number) => {
    return (((price - cost) / cost) * 100).toFixed(2) + "%";
  };

  const watchRegisterPrice = watch("register.price");
  const watchRegisterCost = watch("register.cost");
  const watchRenewPrice = watch("renew.price");
  const watchRenewCost = watch("renew.cost");
  const watchTransferPrice = watch("transfer.price");
  const watchTransferCost = watch("transfer.cost");

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
                  Edit Pricing - {tld.tld}
                </DialogTitle>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="mt-4 space-y-4"
                >
                  {/* Registration Pricing */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Registration
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500">
                          Cost
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("register.cost", {
                            valueAsNumber: true,
                          })}
                          error={errors.register?.cost?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
                          Price
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("register.price", {
                            valueAsNumber: true,
                          })}
                          error={errors.register?.price?.message}
                        />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Margin:{" "}
                      {calculateMargin(
                        watchRegisterCost || 0,
                        watchRegisterPrice || 0
                      )}
                    </p>
                  </div>

                  {/* Renewal Pricing */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Renewal
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500">
                          Cost
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("renew.cost", { valueAsNumber: true })}
                          error={errors.renew?.cost?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
                          Price
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("renew.price", { valueAsNumber: true })}
                          error={errors.renew?.price?.message}
                        />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Margin:{" "}
                      {calculateMargin(
                        watchRenewCost || 0,
                        watchRenewPrice || 0
                      )}
                    </p>
                  </div>

                  {/* Transfer Pricing */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Transfer
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500">
                          Cost
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("transfer.cost", {
                            valueAsNumber: true,
                          })}
                          error={errors.transfer?.cost?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">
                          Price
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("transfer.price", {
                            valueAsNumber: true,
                          })}
                          error={errors.transfer?.price?.message}
                        />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Margin:{" "}
                      {calculateMargin(
                        watchTransferCost || 0,
                        watchTransferPrice || 0
                      )}
                    </p>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("featured")}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Featured TLD
                    </label>
                  </div>

                  {/* Promotional Pricing */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        Promotional Price
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setHasPromo(!hasPromo)}
                      >
                        {hasPromo ? "Remove Promo" : "Add Promo"}
                      </Button>
                    </div>
                    {hasPromo && (
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-500">
                            Price
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register("promotionalPrice.price", {
                              valueAsNumber: true,
                            })}
                            error={errors.promotionalPrice?.price?.message}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500">
                            End Date
                          </label>
                          <Input
                            type="date"
                            {...register("promotionalPrice.endDate")}
                            error={errors.promotionalPrice?.endDate?.message}
                          />
                        </div>
                      </div>
                    )}
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
                      Save Changes
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
