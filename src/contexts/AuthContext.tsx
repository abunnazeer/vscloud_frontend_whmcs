// src/contexts/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "ADMIN"; // Add role field
  // Add other user properties
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is already logged in
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check for token
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        if (!token) {
          setLoading(false);
          return;
        }

        // Try to get current user
        const result = await api.auth.getCurrentUser();
        setUser(result.data.user);
      } catch (error) {
        console.error("Failed to load user:", error);
        // If error, clear any invalid tokens
        api.auth.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Handle authentication routes
  useEffect(() => {
    // If we're on an auth page and already logged in, redirect to dashboard
    if (!loading && user) {
      const authPages = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
      ];
      if (authPages.some(page => pathname?.startsWith(page))) {
        router.push("/dashboard");
      }
    }
  }, [loading, user, pathname, router]);

  // const login = async (
  //   email: string,
  //   password: string,
  //   rememberMe: boolean = false
  // ) => {
  //   try {
  //     setLoading(true);
  //     const result = await api.auth.login(email, password, rememberMe);

  //     // Store token based on rememberMe preference
  //     if (rememberMe) {
  //       localStorage.setItem("authToken", result.data.token);
  //     } else {
  //       sessionStorage.setItem("authToken", result.data.token);
  //     }

  //     // Store user data
  //     setUser(result.data.user);
  //     toast.success("Login successful");
      
  //     // Force the redirect with a small delay to ensure state updates
  //     setTimeout(() => {
  //       router.push("/dashboard");
  //     }, 100);
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     toast.error(error instanceof Error ? error.message : "Login failed");
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };


//  const login = async (
//    email: string,
//    password: string,
//    rememberMe: boolean = false
//  ) => {
//    try {
//      setLoading(true);
//      const result = await api.auth.login(email, password, rememberMe);

//      // Store token based on rememberMe preference
//      const storage = rememberMe ? localStorage : sessionStorage;
//      storage.setItem("authToken", result.data.token);

//      // Store user data
//      setUser(result.data.user);
//      toast.success("Login successful");


//      window.location.href = "/dashboard";
//    } catch (error) {
//      console.error("Login error:", error);
//      toast.error(error instanceof Error ? error.message : "Login failed");
//      throw error;
//    } finally {
//      setLoading(false);
//    }
//  };
  
  
  
  
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    try {
      setLoading(true);
      const result = await api.auth.login(email, password, rememberMe);
      console.log(result)
      // Store token based on rememberMe preference
      if (rememberMe) {
        localStorage.setItem("authToken", result.data.token);
      } else {
        sessionStorage.setItem("authToken", result.data.token);
      }

      // Store user data
      setUser(result.data.user);
      toast.success("Login successful");

      // Redirect based on role
      const redirectPath =
        result.data.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

      window.location.href = redirectPath;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setLoading(true);
      await api.auth.register(name, email, password, confirmPassword);
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    // Force router navigation after logout
    setTimeout(() => {
      router.push("/login");
      toast.success("Logged out successfully");
    }, 100);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};