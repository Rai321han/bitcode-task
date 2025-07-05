"use client";
import { useAuth } from "@/app/providers/AuthProvider";
import RegisterForm from "@/components/auth_components/RegisterForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/roadmaps");
    }
  }, [user, router]);
  return (
    <div className="w-full flex flex-row min-h-[90vh] items-center justify-center bg-light-bg dark:bg-dark-bg">
      <div className="flex flex-col items-center">
        <RegisterForm />
        <div className="text-sm flex flex-row gap-2">
          <span className="text-light-body dark:text-dark-body">
            Already have an account?
          </span>
          <Link
            href={"/auth/login"}
            className="text-primary hover:underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
