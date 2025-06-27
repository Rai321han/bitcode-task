"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useLogout } from "@/hooks/useLogout";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const firstletter = !isLoading && user.username.split("")[0];
  return (
    <nav className="p-2 md:p-4 bg-gray-100 shadow">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center">
        <h1 className="text-sm sm:text-lg font-bold text-gray-500">
          BitCodeTask
        </h1>
        {isLoading === false && (
          <div className="flex flex-row gap-3 items-center">
            <div>
              <Link
                href="/roadmaps"
                className="text-orange-700  cursor-pointer"
              >
                Roadmaps
              </Link>
            </div>
            <div className="text-md flex flex-row items-center justify-center text-gray-500 p-2 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] bg-emerald-400 rounded-[100%]">
              <div className="text-sm text-white">{firstletter}</div>
            </div>
            <div>
              {user && (
                <button
                  disabled={isPending}
                  onClick={logout}
                  className="cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed px-2 py-1 sm:px-3 sm:py-2 bg-orange-600 text-white rounded-md text-md"
                >
                  {isPending ? "loggin out..." : "logout"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
