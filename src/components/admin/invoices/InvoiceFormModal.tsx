// src/components/admin/invoices/InvoiceFormModal.tsx
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
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
});

const invoiceSchema = z.object({
  userId: z.string().min(1, "User is required"),
  dueDate: z.string().min(1, "Due date is required"),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => void;
  invoice?: InvoiceFormData;
}

export default function InvoiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  invoice,
}: InvoiceFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoice || {
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const items = watch("items", []);

  const addItem = () => {
    const currentItems = getValues("items") || [];
    setValue("items", [
      ...currentItems,
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = getValues("items") || [];
    setValue(
      "items",
      currentItems.filter((_, i) => i !== index)
    );
  };

  const calculateTotal = () => {
    return items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
      0
    );
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
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {invoice ? "Edit Invoice" : "Create New Invoice"}
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                  <div className="space-y-4">
                    {/* Basic Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          User
                        </label>
                        <select
                          {...register("userId")}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Select User</option>
                          <option value="user1">John Doe</option>
                          <option value="user2">Jane Smith</option>
                        </select>
                        {errors.userId && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.userId.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Due Date
                        </label>
                        <input
                          type="date"
                          {...register("dueDate")}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                        />
                        {errors.dueDate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.dueDate.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Invoice Items */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          Invoice Items
                        </h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addItem}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Item
                        </Button>
                      </div>

                      <div className="mt-4 space-y-4">
                        {items.map((_, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-4 items-start"
                          >
                            <div className="col-span-6">
                              <input
                                {...register(`items.${index}.description`)}
                                placeholder="Description"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                type="number"
                                {...register(`items.${index}.quantity`, {
                                  valueAsNumber: true,
                                })}
                                placeholder="Qty"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                type="number"
                                step="0.01"
                                {...register(`items.${index}.unitPrice`, {
                                  valueAsNumber: true,
                                })}
                                placeholder="Price"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                              />
                            </div>
                            <div className="col-span-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(index)}
                                className="text-red-600 hover:text-red-700"
                                disabled={items.length === 1}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        {...register("notes")}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-end text-lg font-medium">
                        <span className="mr-4">Total:</span>
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose} type="button">
                      Cancel
                    </Button>
                    <Button type="submit">
                      {invoice ? "Update Invoice" : "Create Invoice"}
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
