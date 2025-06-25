import { useMutation, useQueryClient } from "@tanstack/react-query";

const login = async ({ email, password }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(data.message || "Login failed");
  }

  return data;
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
