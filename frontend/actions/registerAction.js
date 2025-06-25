"use server";

import { redirect } from "next/navigation";

export async function registerAction(currentState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/register`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    }
  );
  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Registration failed",
      errors: data.errors ?? [],
    };
  }
  redirect("/roadmaps");
}
