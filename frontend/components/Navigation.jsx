"use client";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLogout } from "@/hooks/auth_hooks/useLogout";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  let firstletter;
  if (user) firstletter = user.username.split("")[0];
  return (
    <>
      <nav className=" bg-light-fg dark:bg-dark-fg sticky top-0 z-1000">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3 items-center">
            <div className="p-2 px-4 font-extrabold text-primary bg-light-bg  dark:bg-dark">
              bitcode.
            </div>
            {
              <div className="hidden md:block h-full border-x-1 border-x-light-line dark:border-dark-line">
                <Link
                  href="/roadmap"
                  className="h-full cursor-pointer hover:brightness-105 disabled:cursor-not-allowed px-3 py-1 sm:px-4 sm:py-2  text-normal-text hover:text-primary text-md"
                >
                  Roadmap
                </Link>
              </div>
            }
          </div>
          {isLoading === false && user && (
            <div className="hidden md:flex md:flex-row md:gap-3 items-center ">
              <div className="ml-4 text-md flex flex-row items-center justify-center text-gray-500 p-2 w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] bg-emerald-400 rounded-[100%]">
                <div className="text-sm text-white">{firstletter}</div>
              </div>
              <div>
                {user && (
                  <button
                    disabled={isPending}
                    onClick={logout}
                    className="cursor-pointer hover:brightness-105 disabled:cursor-not-allowed px-3 py-1 sm:px-4 sm:py-2 bg-primary text-white text-md"
                  >
                    {isPending ? "loggin out..." : "Logout"}
                  </button>
                )}
              </div>
            </div>
          )}
          {!user && (
            <div className="md:flex md:flex-row items-center hidden">
              <div className="px-4">
                <Link
                  href={"/auth/login"}
                  className="hover:underline hover:underline-offset-4 hover:text-primary cursor-pointer "
                >
                  Sign in
                </Link>
              </div>
              <Link
                href={"/auth/register"}
                className="cursor-pointer hover:brightness-105 disabled:cursor-not-allowed px-3 py-1 sm:px-4 sm:py-2 bg-primary text-white text-md"
              >
                Sign up
              </Link>
            </div>
          )}
          <div className="block md:hidden mr-5 cursor-pointer">
            <RxHamburgerMenu
              className="fill-gray-700"
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </div>
        </div>
      </nav>
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed z-[1001] bg-black opacity-[0.4] backdrop-blur-3xl w-full h-full top-0"
          ></div>
          <div className="fixed top-0 h-full md:hidden bg-light-fg dark:bg-dark-fg z-[1100] border-r-1 border-r-light-line dark:border-r-dark-line shadow-md">
            <div className="flex flex-col text-light-opacity dark:text-dark-opacity">
              {user && (
                <>
                  <div className="flex flex-row items-center gap-3 justify-center py-2 ">
                    <div className="text-md flex flex-row items-center justify-center  p-2 w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] bg-emerald-400 rounded-[100%]">
                      <div className="text-sm text-white">{firstletter}</div>
                    </div>
                    <div>{user.username}</div>
                  </div>
                  <Link
                    href={"/roadmap"}
                    className="px-10 py-2 hover:bg-primary hover:text-white"
                  >
                    Roadmap
                  </Link>

                  <button
                    disabled={isPending}
                    onClick={logout}
                    className="text-left  hover:brightness-110 cursor-pointer disabled:cursor-not-allowed px-10 py-2 bg-btn text-white text-md"
                  >
                    {isPending ? "loggin out..." : "Logout"}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
