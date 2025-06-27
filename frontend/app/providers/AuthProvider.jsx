"use client";

import { fetchInClient } from "@/libs/fetchInClient";
import { useQuery } from "@tanstack/react-query";
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

    if (!res.ok) {
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
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
