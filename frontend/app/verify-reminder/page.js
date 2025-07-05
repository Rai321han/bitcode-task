import { Suspense } from "react";
import VerifyReminderPageClient from "./VerifyEmailPageClient"; // Move your code to this file
import { VscLoading } from "react-icons/vsc";

export default function VerifyReminderPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center w-[100vw] h-[100vh] flex flex-row items-center justify-center">
          <VscLoading className="w-[100px] h-[100px] animate-spin fill-amber-600" />
        </div>
      }
    >
      <VerifyReminderPageClient />
    </Suspense>
  );
}
