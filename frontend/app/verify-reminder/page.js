import { Suspense } from "react";
import VerifyReminderPageClient from "./VerifyEmailPageClient"; // Move your code to this file

export default function VerifyReminderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyReminderPageClient />
    </Suspense>
  );
}
