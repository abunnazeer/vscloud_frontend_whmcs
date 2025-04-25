// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Helper to get auth token (works in both browser and server environments)
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  }
  return null;
};

// API client with methods for each endpoint
export const api = {
  // Auth endpoints
  auth: {
    login: async (
      email: string,
      password: string,
      rememberMe: boolean = false
    ) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }

      return res.json();
    },

    register: async (
      name: string,
      email: string,
      password: string,
      confirmPassword: string
    ) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      console.log(res);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }

      return res.json();
    },

    forgotPassword: async (email: string) => {
      const res = await fetch(`${API_URL}/auth/reset-password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Password reset request failed");
      }

      return res.json();
    },

    resetPassword: async (
      token: string,
      password: string,
      confirmPassword: string
    ) => {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Password reset failed");
      }

      return res.json();
    },

    getCurrentUser: async () => {
      const token = getAuthToken();
      if (!token) return null;

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          throw new Error("Session expired");
        }
        const error = await res.json();
        throw new Error(error.message || "Failed to get user data");
      }

      return res.json();
    },

    // Logout function - just clears storage
    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    },
  },

  // Server endpoints
  servers: {
    testConnection: async (serverData: {
      type: "cpanel" | "plesk" | "DIRECTADMIN";
      hostname: string;
      port: number;
      username: string;
      password: string;
      useSSL: boolean;
    }) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/servers/test-connection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serverData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Connection test failed");
      }

      return res.json();
    },

    createServer: async (serverData: any) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/servers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serverData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create server");
      }

      return res.json();
    },

    listServers: async () => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/servers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch servers");
      }

      return res.json();
    },

    getServer: async (id: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/servers/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch server");
      }

      return res.json();
    },

    updateServer: async (id: string, serverData: any) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/servers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serverData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update server");
      }

      return res.json();
    },

    deleteServer: async (id: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/servers/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete server");
      }

      return res.json();
    },
  },

  // DirectAdmin User endpoints
  daUsers: {
    listUsers: async (serverId: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${API_URL}/hosting/users/da?serverId=${serverId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch DirectAdmin users");
      }

      return res.json();
    },

    getUser: async (serverId: string, username: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${API_URL}/hosting/users/da/${username}?serverId=${serverId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch user details");
      }

      return res.json();
    },

    createUser: async (serverId: string, userData: any) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/users/da`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...userData, serverId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create user");
      }

      return res.json();
    },

    updateUser: async (serverId: string, username: string, userData: any) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/users/da/${username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...userData, serverId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update user");
      }

      return res.json();
    },

    deleteUser: async (serverId: string, username: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${API_URL}/hosting/users/da/${username}?serverId=${serverId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete user");
      }

      return res.json();
    },

    suspendUser: async (serverId: string, username: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${API_URL}/hosting/users/da/${username}/suspend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ serverId }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to suspend user");
      }

      return res.json();
    },

    unsuspendUser: async (serverId: string, username: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${API_URL}/hosting/users/da/${username}/unsuspend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ serverId }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to unsuspend user");
      }

      return res.json();
    },
  },

  // DirectAdmin Package endpoints
  daPackages: {
    listPackages: async (serverId: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${API_URL}/hosting/packages/da?serverId=${serverId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch packages");
      }

      return res.json();
    },

    getPackage: async (serverId: string, name: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${API_URL}/hosting/packages/da/${name}?serverId=${serverId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch package details");
      }

      return res.json();
    },

    createPackage: async (serverId: string, packageData: any) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/packages/da`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...packageData, serverId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create package");
      }

      return res.json();
    },

    updatePackage: async (serverId: string, name: string, packageData: any) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/packages/da/${name}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...packageData, serverId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update package");
      }

      return res.json();
    },

    renamePackage: async (
      serverId: string,
      oldName: string,
      newName: string,
      packageData: any = {}
    ) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${API_URL}/hosting/packages/da/rename/${oldName}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...packageData, serverId, newName }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to rename package");
      }

      return res.json();
    },

    deletePackage: async (serverId: string, name: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${API_URL}/hosting/packages/da/${name}?serverId=${serverId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete package");
      }

      return res.json();
    },
  },

  // Add these methods to the existing packages object in api.ts

  // Complete the packages API methods
  packages: {
    createPackage: async (packageData: any) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(packageData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create package");
      }

      return res.json();
    },

    listPackages: async () => {
      // Note: this endpoint doesn't require authentication based on the routes file
      const res = await fetch(`${API_URL}/hosting/packages`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch packages");
      }

      return res.json();
    },

    getPackage: async (id: string) => {
      // Note: this endpoint doesn't require authentication based on the routes file
      const res = await fetch(`${API_URL}/hosting/packages/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch package details");
      }

      return res.json();
    },

    updatePackage: async (id: string, packageData: any) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/packages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(packageData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update package");
      }

      return res.json();
    },

    deletePackage: async (id: string) => {
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/hosting/packages/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete package");
      }

      return res.json();
    },

    // Uncomment when the route is enabled
    // getPackageUsageStats: async (id: string) => {
    //   const token = getAuthToken();
    //   if (!token) throw new Error("Not authenticated");
    //
    //   const res = await fetch(`${API_URL}/hosting/packages/${id}/stats`, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //
    //   if (!res.ok) {
    //     const error = await res.json();
    //     throw new Error(error.message || "Failed to fetch package usage stats");
    //   }
    //
    //   return res.json();
    // },
  },
};
