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

  // Add other API endpoints here (users, posts, etc.)
};
