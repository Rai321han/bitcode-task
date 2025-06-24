import { useQueries, useQuery } from "@tanstack/react-query";

const fetchMe = async () => {
  const res = await fetch("http://localhost:5100/api/me", {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Not authenticated");

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
