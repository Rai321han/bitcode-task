"use client";
import { useSearchParams } from "next/navigation";

export default function VerifyReminderPageClient() {
  const params = useSearchParams();
  const email = params.get("email");

  return (
    <div className="text-center py-10 bg-light-bd dark:bg-dark-bg w-screen h-screen">
      <div className="rounded-md bg-text-fg dark:bg-dark-fg p-5 flex flex-col items-center justify-center max-w-[900px]">
        <h1 className="text-2xl font-bold text-light-title dark:text-dark-title">
          Verify Your Email
        </h1>
        <p className="text-light-opacity dark:text-dark-opacity mt-4">
          A verification email has been sent to{" "}
          <span className="font-semibold text-light-body dark:text-dark-body">
            {email}
          </span>
          . <br />
          Please check your inbox and click the link to activate your account.
        </p>
      </div>
    </div>
  );
}
