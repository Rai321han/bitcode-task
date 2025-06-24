"use client";

import Loginform from "@/components/Loginform";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full flex flex-row min-h-[90vh] items-center justify-center">
      <div className="flex flex-col items-center">
        <Loginform /> 
        <div className="text-sm flex flex-row gap-2">
          <span className="text-gray-500">Not an user?</span>
          <Link
            href={"/auth/register"}
            className="text-orange-800 hover:underline-offset-2 hover:underline"
          >
            Create acoount
          </Link>
        </div>
      </div>
    </div>
  );
}
