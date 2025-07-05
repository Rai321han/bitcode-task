// hooks/useRoadmaps.js
import { fetchInClient } from "@/libs/fetchInClient";
import { useQuery } from "@tanstack/react-query";

export function useRoadmaps({ filter, sort }) {
  const params = new URLSearchParams();
  filter.forEach((f) => params.append("filter", f));
  sort.forEach((s) => params.append("sort", s));

  console.log({
    filter,
    sort,
  });
  return useQuery({
    queryKey: ["roadmaps", filter, sort],
    queryFn: async () => {
      const res = await fetchInClient(
        `${
          process.env.NEXT_PUBLIC_BASE_API_URL
        }/api/roadmaps?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to fetch roadmaps: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      return data.roadmaps || [];
    },
    refetchOnWindowFocus: false,
  });
}
