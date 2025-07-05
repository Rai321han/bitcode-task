"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import Loginform from "@/components/auth_components/Loginform";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/roadmaps");
    }
  }, [isLoading, user, router]);
  return (
    <div className="w-full flex flex-row min-h-[90vh] items-center justify-center bg-light-bg dark:bg-dark-bg">
      <div className="flex flex-col items-center">
        <Loginform />
        <div className="text-sm flex flex-row gap-2">
          <span className="text-light-body dark:text-dark-body">
            Not an user?
          </span>
          <Link
            href={"/auth/register"}
            className="text-primary hover:underline-offset-2 hover:underline"
          >
            Create acoount
          </Link>
        </div>
      </div>
    </div>
  );
}
