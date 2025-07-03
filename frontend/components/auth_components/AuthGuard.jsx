"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { VscLoading } from "react-icons/vsc";

export default function AuthGuard({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="text-center w-[100vw] h-[100vh] flex flex-row items-center justify-center">
        <VscLoading className="w-[100px] h-[100px] animate-spin fill-amber-600" />
      </div>
    );
  }

  return children;
}
