"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";

export default function EmailVerificationPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      if (!token) return;

      try {
        const res = await fetch(
          `http://localhost:5100/api/verify-email?token=${token}`
        );
        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);
          console.error(data.message);
          alert("Email verification failed: " + data.message);
          router.push("/error");
          return;
        }


        router.push("/roadmaps");
      } catch (err) {
        console.log("Error: ", err);
      }
    }

    verify();
  }, [token]);

  return (
    <div className="text-center py-10">
      <h1 className="text-xl font-bold">Verifying your email...</h1>
    </div>
  );
}
