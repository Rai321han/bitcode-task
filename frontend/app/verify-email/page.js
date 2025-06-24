import { Suspense } from "react";
import EmailVerificationPage from "./EmailVerificationPageClient";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <EmailVerificationPage />
    </Suspense>
  );
}
