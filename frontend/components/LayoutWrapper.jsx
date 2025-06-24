"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navigation";

export function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideNavbar = [
    "/auth/login",
    "/auth/register",
    "/verify-reminder",
    "/verify-email",
  ].includes(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
}
