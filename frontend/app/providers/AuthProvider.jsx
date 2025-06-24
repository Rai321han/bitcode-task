"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";
const AuthContext = createContext();

const fetchMe = async () => {
  try {
    let res = await fetch("http://localhost:5100/api/me", {
      credentials: "include",
    });

    // here I am getting user data

    if (res.status === 401) {
      const refreshRes = await fetch("http://localhost:5100/api/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!refreshRes.ok) {
        // Refresh token invalid or missing
        return null;
      }
      res = await fetch("http://localhost:5100/api/me", {
        credentials: "include",
      });
    }

    if (!res.ok) {
      // Instead of throwing, return null to indicate no user
      return null;
    }

    const data = await res.json();
    return data?.user ?? null;
  } catch (error) {
    console.error("fetchMe error:", error);
    return null;
  }
};

export function AuthProvider({ children }) {
  const pathname = usePathname();

  const shouldSkipAuth = [
    "/auth/login",
    "/auth/register",
    "/verify-reminder",
    "/verify-email",
  ].includes(pathname);
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    enabled: !shouldSkipAuth,
  });

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
