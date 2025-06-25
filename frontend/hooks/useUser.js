import { useQueries, useQuery } from "@tanstack/react-query";

const fetchMe = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/me`, {
    credentials: "include",
  });

  if (!res.ok) console.error("Not authenticated");

  const data = await res.json();
  return data.user;
};

export function useUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });
}
