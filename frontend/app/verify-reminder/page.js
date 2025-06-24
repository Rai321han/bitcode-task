"use client";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const email = params.get("email");

  return (
    <div className="text-center py-10">
      <h1 className="text-2xl font-bold">Verify Your Email</h1>
      <p className="text-gray-600 mt-4">
        A verification email has been sent to{" "}
        <span className="font-semibold">{email}</span>. <br />
        Please check your inbox and click the link to activate your account.
      </p>
    </div>
  );
}
