"use client";

import Link from "next/link";

export default function error() {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-row justify-center items-center">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-2">
          <p className="font-black text-2xl text-orange-900">404</p>
          <p className="text-2xl font-bold">Page not found</p>
        </div>
        <div className="flex flex-row gap-1">
          <p className="text-gray-700">You may try going to</p>
          <Link
            href={"/roadmaps"}
            className="text-orange-700 hover:underline hover:underline-offset-2"
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
