// src/contexts/RegistrarContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface Registrar {
  id: string;
  name: string;
  type: "namecheap" | "resellerclub" | "godaddy" | "cloudflare";
  username: string;
  status: "active" | "error" | "maintenance";
  lastSync: string;
  domainCount?: number;
  balance?: number;
}

interface TLDPricing {
  tld: string;
  register: { cost: number; price: number; margin: number };
  renew: { cost: number; price: number; margin: number };
  transfer: { cost: number; price: number; margin: number };
  minYears: number;
  maxYears: number;
  featured: boolean;
  promotionalPrice?: { price: number; endDate: string };
}

interface RegistrarContextType {
  registrars: Registrar[];
  tldPricing: Record<string, TLDPricing[]>;
  addRegistrar: (data: any) => Promise<void>;
  updateRegistrar: (id: string, data: any) => Promise<void>;
  deleteRegistrar: (id: string) => Promise<void>;
  syncRegistrar: (id: string) => Promise<void>;
  updateTLDPricing: (
    registrarId: string,
    tld: string,
    data: any
  ) => Promise<void>;
  syncTLDPricing: (registrarId: string) => Promise<void>;
  loading: boolean;
}

const RegistrarContext = createContext<RegistrarContextType | undefined>(
  undefined
);

export function RegistrarProvider({ children }: { children: React.ReactNode }) {
  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [tldPricing, setTLDPricing] = useState<Record<string, TLDPricing[]>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const addRegistrar = useCallback(async (data: any) => {
    setLoading(true);
    try {
      // TODO: Implement API call
      const response = await fetch("/api/registrars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add registrar");

      const newRegistrar = await response.json();
      setRegistrars(prev => [...prev, newRegistrar]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRegistrar = useCallback(async (id: string, data: any) => {
    setLoading(true);
    try {
      // TODO: Implement API call
      const response = await fetch(`/api/registrars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update registrar");

      const updatedRegistrar = await response.json();
      setRegistrars(prev =>
        prev.map(reg => (reg.id === id ? updatedRegistrar : reg))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRegistrar = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // TODO: Implement API call
      const response = await fetch(`/api/registrars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete registrar");

      setRegistrars(prev => prev.filter(reg => reg.id !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  const syncRegistrar = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // TODO: Implement API call
      const response = await fetch(`/api/registrars/${id}/sync`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to sync registrar");

      const updatedRegistrar = await response.json();
      setRegistrars(prev =>
        prev.map(reg => (reg.id === id ? updatedRegistrar : reg))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTLDPricing = useCallback(
    async (registrarId: string, tld: string, data: any) => {
      setLoading(true);
      try {
        // TODO: Implement API call
        const response = await fetch(
          `/api/registrars/${registrarId}/pricing/${tld}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) throw new Error("Failed to update TLD pricing");

        const updatedPricing = await response.json();
        setTLDPricing(prev => ({
          ...prev,
          [registrarId]: prev[registrarId].map(p =>
            p.tld === tld ? updatedPricing : p
          ),
        }));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const syncTLDPricing = useCallback(async (registrarId: string) => {
    setLoading(true);
    try {
      // TODO: Implement API call
      const response = await fetch(
        `/api/registrars/${registrarId}/pricing/sync`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to sync TLD pricing");

      const updatedPricing = await response.json();
      setTLDPricing(prev => ({
        ...prev,
        [registrarId]: updatedPricing,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    registrars,
    tldPricing,
    addRegistrar,
    updateRegistrar,
    deleteRegistrar,
    syncRegistrar,
    updateTLDPricing,
    syncTLDPricing,
    loading,
  };

  return (
    <RegistrarContext.Provider value={value}>
      {children}
    </RegistrarContext.Provider>
  );
}

export function useRegistrar() {
  const context = useContext(RegistrarContext);
  if (context === undefined) {
    throw new Error("useRegistrar must be used within a RegistrarProvider");
  }
  return context;
}
