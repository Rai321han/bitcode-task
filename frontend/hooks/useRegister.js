const useRegister = async ({ email, password, username }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};
