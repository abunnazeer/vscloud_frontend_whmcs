// src/components/domains/ContactInfoModal.tsx
"use client";

import { useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Tab } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
}

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  company: z.string().optional(),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const contactTypes = ["Registrant", "Administrative", "Technical"];

export default function ContactInfoModal({
  isOpen,
  onClose,
  domain,
}: ContactInfoModalProps) {
  const [selectedContact, setSelectedContact] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      company: "Example Corp",
      address1: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual contact update API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to update contact:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToAll = () => {
    // TODO: Implement copying current contact to all types
    console.log("Copy to all contacts");
  };

  if (isSuccess) {
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
                <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 text-center">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                  <DialogTitle
                    as="h3"
                    className="mt-4 text-lg font-medium text-gray-900"
                  >
                    Contact Information Updated
                  </DialogTitle>
                  <p className="mt-2 text-sm text-gray-500">
                    The contact information for {domain} has been successfully
                    updated.
                  </p>
                  <Button className="mt-6" onClick={onClose}>
                    Close
                  </Button>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

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
              <DialogPanel className="w-full max-w-2xl rounded-lg bg-white p-6">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-gray-900"
                >
                  Contact Information - {domain}
                </DialogTitle>

                <div className="mt-4">
                  <Tab.Group
                    selectedIndex={selectedContact}
                    onChange={setSelectedContact}
                  >
                    <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                      {contactTypes.map(type => (
                        <Tab
                          key={type}
                          className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                            ${
                              selected
                                ? "bg-white text-blue-600 shadow"
                                : "text-gray-600 hover:text-gray-900"
                            }`
                          }
                        >
                          {type}
                        </Tab>
                      ))}
                    </Tab.List>

                    <Tab.Panels className="mt-4">
                      {contactTypes.map((type, idx) => (
                        <Tab.Panel key={idx} className={`rounded-lg bg-white`}>
                          <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  First Name
                                </label>
                                <Input
                                  {...register("firstName")}
                                  error={errors.firstName?.message}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Last Name
                                </label>
                                <Input
                                  {...register("lastName")}
                                  error={errors.lastName?.message}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Email
                                </label>
                                <Input
                                  type="email"
                                  {...register("email")}
                                  error={errors.email?.message}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Phone
                                </label>
                                <Input
                                  {...register("phone")}
                                  error={errors.phone?.message}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Company (Optional)
                              </label>
                              <Input {...register("company")} />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Address Line 1
                              </label>
                              <Input
                                {...register("address1")}
                                error={errors.address1?.message}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Address Line 2 (Optional)
                              </label>
                              <Input {...register("address2")} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  City
                                </label>
                                <Input
                                  {...register("city")}
                                  error={errors.city?.message}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  State/Province
                                </label>
                                <Input
                                  {...register("state")}
                                  error={errors.state?.message}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Postal Code
                                </label>
                                <Input
                                  {...register("postalCode")}
                                  error={errors.postalCode?.message}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Country
                                </label>
                                <Input
                                  {...register("country")}
                                  error={errors.country?.message}
                                />
                              </div>
                            </div>

                            <div className="mt-6 flex justify-between">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={copyToAll}
                              >
                                Copy to All Contacts
                              </Button>
                              <div className="space-x-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={onClose}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" loading={isLoading}>
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </form>
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
