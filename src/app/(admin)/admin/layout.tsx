// src/app/(admin)/admin/layout.tsx
"use client";
import AdminProtectedRoute from "@/lib/admin-protected-route";
import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import {
  Squares2X2Icon,
  ServerIcon,
  GlobeAltIcon,
  UsersIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Squares2X2Icon },
  { name: "Hosting Management", href: "/admin/hosting", icon: ServerIcon },
  { name: "Domain Registrars", href: "/admin/registrars", icon: GlobeAltIcon },
  { name: "Users", href: "/admin/users", icon: UsersIcon },
  { name: "Billing", href: "/admin/billing", icon: CreditCardIcon },
  { name: "Reports", href: "/admin/reports", icon: ChartBarIcon },
  { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <AdminProtectedRoute>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center space-x-2"
                      >
                        <ServerIcon className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold">VSCloud Admin</span>
                      </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map(item => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={`
                                  group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                                  ${
                                    pathname === item.href
                                      ? "bg-gray-50 text-blue-600"
                                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                  }
                                `}
                                >
                                  <item.icon
                                    className={`h-6 w-6 shrink-0 ${
                                      pathname === item.href
                                        ? "text-blue-600"
                                        : "text-gray-400 group-hover:text-blue-600"
                                    }`}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-2"
              >
                <ServerIcon className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold">VSCloud Admin</span>
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map(item => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                          group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                          ${
                            pathname === item.href
                              ? "bg-gray-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          }
                        `}
                        >
                          <item.icon
                            className={`h-6 w-6 shrink-0 ${
                              pathname === item.href
                                ? "text-blue-600"
                                : "text-gray-400 group-hover:text-blue-600"
                            }`}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Profile dropdown can be added here */}
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
