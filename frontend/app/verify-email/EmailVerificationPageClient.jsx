"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmailVerificationPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/verify-email?token=${token}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);

          alert("Email verification failed: " + data.message);
          router.push("/error");
          return;
        }

        // Give cookies time to register in browser
        setTimeout(() => {
          router.push("/roadmap");
        }, 200);
      } catch (err) {
        console.error("Error: ", err);
      }
    }

    verify();
  }, [token, router]);

  return (
    <div className="bg-light-bg dark:bg-dark-bg flex flex-row items-center justify-center py-10 text-light-body dark:text-dark-body w-screen h-screen">
      <h1 className="text-xl font-bold">Verifying your email...</h1>
    </div>
  );
}
