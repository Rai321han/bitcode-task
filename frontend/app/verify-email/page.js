import { Suspense } from "react";
import EmailVerificationPage from "./EmailVerificationPageClient";
import { VscLoading } from "react-icons/vsc";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center w-[100vw] h-[100vh] flex flex-row items-center justify-center bg-light-bg dark:bg-dark-bg">
          <VscLoading className="w-[100px] h-[100px] animate-spin fill-amber-600" />
        </div>
      }
    >
      <EmailVerificationPage />
    </Suspense>
  );
}
