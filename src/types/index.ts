// src/types/index.ts

export interface Domain {
  id: string;
  name: string;
  registrar: string;
  status: "active" | "expired" | "pending";
  expiryDate: string;
  autoRenew: boolean;
  sslStatus: string;
  hostingServer: string;
}

export interface Registrar {
  id: string;
  name: string;
  type: "namecheap" | "resellerclub" | "godaddy" | "cloudflare";
  username: string;
  status: "active" | "error" | "maintenance";
  lastSync: string;
  domainCount?: number;
  balance?: number;
  apiKey?: string;
  sandboxMode?: boolean;
  customEndpoint?: string;
  webhookUrl?: string;
}

export interface TLDPricing {
  tld: string;
  register: {
    cost: number;
    price: number;
    margin: number;
  };
  renew: {
    cost: number;
    price: number;
    margin: number;
  };
  transfer: {
    cost: number;
    price: number;
    margin: number;
  };
  minYears: number;
  maxYears: number;
  featured: boolean;
}
