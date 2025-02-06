// src/types/domain.ts
export interface Domain {
  id: string;
  name: string;
  registrar?: string;
  expiryDate: string;
  autoRenew: boolean;
  status: "active" | "expired" | "transferring" | "pending";
  nameservers: string[];
  hostingServer?: string;
  sslStatus?: "active" | "expired" | "none";
  lastChecked: string;
}

export type DomainFormData = Omit<Domain, "id" | "lastChecked" | "status">;
