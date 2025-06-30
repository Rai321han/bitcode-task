"use client";

import { fetchInClient } from "@/libs/fetchInClient";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext } from "react";
const AuthContext = createContext();

const fetchMe = async () => {
  try {
    let res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/me`,
      {
        credentials: "include",
      }
    );

    if (!res || !res.ok) {
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
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = ["/", "/auth/login", "/auth/register"].includes(
    pathname
  );
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    enabled: !isPublicRoute, // Skip fetch on public routes
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    onError: () => {
      // Optionally trigger logout or redirect to login
      router.push("/auth/login");
    },
  });

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
