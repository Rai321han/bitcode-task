export default async function loginAction({ formData }) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/login`;
    const res = await fetch(loginUrl, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Login Failed" };
    }

    // save access token

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}
