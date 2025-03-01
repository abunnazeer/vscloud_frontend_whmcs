// src/components/hosting/ManageMenu.tsx
"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  CogIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ChartBarIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface ManageMenuProps {
  onRenew: () => void;
  onUpgrade: () => void;
  onAccessCPanel: () => void;
  onViewStatistics: () => void;
}

export function ManageMenu({
  onRenew,
  onUpgrade,
  onAccessCPanel,
  onViewStatistics,
}: ManageMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button as={Fragment}>
          <Button variant="outline" size="sm">
            <CogIcon className="mr-2 h-4 w-4" />
            Manage
          </Button>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onRenew}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <ArrowPathIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Renew Plan
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onUpgrade}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <ArrowUpIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Upgrade Plan
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onAccessCPanel}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <ComputerDesktopIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Access cPanel
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onViewStatistics}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <ChartBarIcon className="mr-3 h-5 w-5 text-gray-400" />
                  View Statistics
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
