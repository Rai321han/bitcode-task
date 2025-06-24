"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useLogout } from "@/hooks/useLogout";

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const firstletter = !isLoading && user.username.split("")[0];
  return (
    <nav className="p-4 bg-gray-100 shadow">
      <div className="max-w-7xl mx-auto flex justify-between">
        <h1 className="text-lg font-bold text-gray-500">BitCodeTask</h1>
        {isLoading === false && (
          <div className="flex flex-row gap-3 items-center">
            <div className="text-md flex flex-row items-center justify-center text-gray-500 p-2 w-[40px] h-[40px] bg-emerald-400 rounded-[100%]">
              <div className="text-sm text-white">{firstletter}</div>
            </div>
            <div>
              {user && (
                <button
                  disabled={isPending}
                  onClick={logout}
                  className="cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed px-3 py-2 bg-orange-600 text-white rounded-md text-md"
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
