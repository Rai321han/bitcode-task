import { fetchInClient } from "@/libs/fetchInClient";
import { useQuery } from "@tanstack/react-query";

export function useFeatures({ filter, sort }) {
  const params = new URLSearchParams();
  filter.forEach((f) => params.append("filter", f));
  sort.forEach((s) => params.append("sort", s));

  return useQuery({
    queryKey: ["features", filter, sort],
    queryFn: async () => {
      const res = await fetchInClient(
        `${
          process.env.NEXT_PUBLIC_BASE_API_URL
        }/api/roadmap?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to fetch features: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      return data.features || [];
    },
    refetchOnWindowFocus: false,
  });
}
