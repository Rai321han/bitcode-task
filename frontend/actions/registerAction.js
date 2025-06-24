"use server";

import { redirect } from "next/navigation";

export async function registerAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  try {
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

    if (data.redirectTo) {
      redirect(data.redirectTo);
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong",
      errors: [],
    };
  }
}
