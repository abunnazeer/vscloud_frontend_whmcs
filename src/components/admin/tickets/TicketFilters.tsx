// src/components/admin/tickets/TicketFilters.tsx
"use client";

import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const filterSchema = z.object({
  status: z
    .array(z.enum(["open", "in_progress", "resolved", "closed"]))
    .optional(),
  priority: z.array(z.enum(["low", "medium", "high", "urgent"])).optional(),
  category: z
    .array(z.enum(["technical", "billing", "sales", "general"]))
    .optional(),
  dateRange: z.enum(["today", "week", "month", "custom"]).optional(),
  customDateStart: z.string().optional(),
  customDateEnd: z.string().optional(),
  assignedTo: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface TicketFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterFormData) => void;
  currentFilters?: FilterFormData;
}

export default function TicketFilters({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}: TicketFiltersProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: currentFilters,
  });

  const dateRange = watch("dateRange");

  const handleFormSubmit = (data: FilterFormData) => {
    onApplyFilters(data);
    onClose();
  };

  const handleReset = () => {
    reset();
    onApplyFilters({});
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

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
                  Filter Tickets
                </DialogTitle>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="mt-4"
                >
                  <div className="space-y-4">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="mt-2 space-y-2">
                        {["open", "in_progress", "resolved", "closed"].map(
                          status => (
                            <label
                              key={status}
                              className="inline-flex items-center mr-4"
                            >
                              <input
                                type="checkbox"
                                {...register("status")}
                                value={status}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {status.replace("_", " ")}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <div className="mt-2 space-y-2">
                        {["low", "medium", "high", "urgent"].map(priority => (
                          <label
                            key={priority}
                            className="inline-flex items-center mr-4"
                          >
                            <input
                              type="checkbox"
                              {...register("priority")}
                              value={priority}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">
                              {priority}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <div className="mt-2 space-y-2">
                        {["technical", "billing", "sales", "general"].map(
                          category => (
                            <label
                              key={category}
                              className="inline-flex items-center mr-4"
                            >
                              <input
                                type="checkbox"
                                {...register("category")}
                                value={category}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {category}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    {/* Date Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date Range
                      </label>
                      <select
                        {...register("dateRange")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>

                    {/* Custom Date Range */}
                    {dateRange === "custom" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            type="date"
                            {...register("customDateStart")}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            type="date"
                            {...register("customDateEnd")}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Assigned To */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Assigned To
                      </label>
                      <select
                        {...register("assignedTo")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Any Agent</option>
                        <option value="agent1">Support Agent 1</option>
                        <option value="agent2">Support Agent 2</option>
                        <option value="unassigned">Unassigned</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit">Apply Filters</Button>
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
