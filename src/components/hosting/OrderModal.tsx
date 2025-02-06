// src/components/hosting/OrderModal.tsx
"use client";

import { useState, Fragment } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon } from "@heroicons/react/24/outline";

const orderSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  email: z.string().email("Please enter a valid email"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: number;
    billingInterval: string;
  };
}

export default function OrderModal({ isOpen, onClose, plan }: OrderModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setIsLoading(true);
      // TODO: Implement order submission
      console.log("Order data:", { ...data, plan });
      setStep(2);
    } catch (error) {
      console.error("Order error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
              <DialogPanel className="relative mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  {step === 1 ? "Complete Your Order" : "Order Confirmation"}
                </DialogTitle>

                {step === 1 ? (
                  <>
                    <div className="mt-4">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="font-medium text-gray-900">
                          {plan.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ${plan.price}/{plan.billingInterval}
                        </p>
                      </div>

                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-6 space-y-6"
                      >
                        <div>
                          <label
                            htmlFor="domain"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Domain Name
                          </label>
                          <Input
                            id="domain"
                            type="text"
                            placeholder="example.com"
                            {...register("domain")}
                            error={errors.domain?.message}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Contact Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            {...register("email")}
                            error={errors.email?.message}
                          />
                        </div>

                        <div className="flex justify-end space-x-4">
                          <Button variant="outline" onClick={onClose}>
                            Cancel
                          </Button>
                          <Button type="submit" loading={isLoading}>
                            Continue to Payment
                          </Button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 p-2">
                      <CheckIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order Successful!
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Thank you for your order. You will receive a confirmation
                      email shortly.
                    </p>
                    <Button className="mt-6" onClick={onClose}>
                      Close
                    </Button>
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
