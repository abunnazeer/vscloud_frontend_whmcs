import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TLDPricingFormData {
  tld: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  annualPrice: number;
  registrarCost: number;
  status: "active" | "inactive";
  minYears: number;
  maxYears: number;
  featured: boolean;
  registrarId: string;
}

interface TLDPricingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TLDPricingFormData) => Promise<void>;
  initialData?: Partial<TLDPricingFormData>;
  registrars: Array<{ id: string; name: string }>;
}

export default function TLDPricingFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  registrars,
}: TLDPricingFormModalProps) {
  const [formData, setFormData] = React.useState<TLDPricingFormData>({
    tld: "",
    monthlyPrice: 0,
    quarterlyPrice: 0,
    annualPrice: 0,
    registrarCost: 0,
    status: "active",
    minYears: 1,
    maxYears: 10,
    featured: false,
    registrarId: "",
    ...initialData,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const calculateMargin = (price: number, cost: number) => {
    if (cost === 0) return 0;
    return ((price - cost) / cost) * 100;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  {initialData ? "Edit TLD Pricing" : "Add New TLD Pricing"}
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        TLD
                      </label>
                      <Input
                        name="tld"
                        value={formData.tld}
                        onChange={handleInputChange}
                        placeholder=".com"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Monthly Price
                      </label>
                      <Input
                        name="monthlyPrice"
                        type="number"
                        step="0.01"
                        value={formData.monthlyPrice}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quarterly Price
                      </label>
                      <Input
                        name="quarterlyPrice"
                        type="number"
                        step="0.01"
                        value={formData.quarterlyPrice}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Annual Price
                      </label>
                      <Input
                        name="annualPrice"
                        type="number"
                        step="0.01"
                        value={formData.annualPrice}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Registrar Cost
                      </label>
                      <Input
                        name="registrarCost"
                        type="number"
                        step="0.01"
                        value={formData.registrarCost}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Minimum Years
                      </label>
                      <Input
                        name="minYears"
                        type="number"
                        min="1"
                        value={formData.minYears}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Maximum Years
                      </label>
                      <Input
                        name="maxYears"
                        type="number"
                        min="1"
                        value={formData.maxYears}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Registrar
                      </label>
                      <select
                        name="registrarId"
                        value={formData.registrarId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Registrar</option>
                        {registrars.map(registrar => (
                          <option key={registrar.id} value={registrar.id}>
                            {registrar.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="text-sm text-gray-700">
                      Featured TLD
                    </label>
                  </div>

                  {/* Margin Calculations */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Calculated Margins
                    </h4>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Monthly</p>
                        <p className="font-medium">
                          {calculateMargin(
                            formData.monthlyPrice,
                            formData.registrarCost
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Quarterly</p>
                        <p className="font-medium">
                          {calculateMargin(
                            formData.quarterlyPrice,
                            formData.registrarCost
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Annual</p>
                        <p className="font-medium">
                          {calculateMargin(
                            formData.annualPrice,
                            formData.registrarCost
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" loading={isLoading}>
                      {initialData ? "Update" : "Add"} TLD Pricing
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
