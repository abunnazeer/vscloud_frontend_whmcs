// First, create a shared types file (src/types/hosting.ts)
export interface HostingServer {
  id: string;
  name: string;
  type: "cpanel" | "plesk" | "directadmin";
  url: string;
  username: string;
  password?: string;
  apiToken?: string;
  status: "active" | "error" | "maintenance";
  lastSync: string;
  packageCount?: number;
  accountCount?: number;
}

export type ServerFormData = Omit<
  HostingServer,
  "id" | "status" | "lastSync" | "packageCount" | "accountCount"
>;
