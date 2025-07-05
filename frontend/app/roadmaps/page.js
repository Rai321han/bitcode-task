"use client";

import FilterSort from "@/components/FilterSort";
import { Suspense, use } from "react";
import RoadmapList from "@/components/roadmap_component/RoadmapList";
import RoadmapFallback from "@/components/roadmap_component/RoadmapFallback";
import { useRoadmaps } from "@/hooks/roadmap_hooks/useRoadmaps";
import { useSearchParams } from "next/navigation";

export default function RoadmapsPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "";
  const sort = searchParams.get("sort") || "";
  const filterArray = filter?.split(",").filter(Boolean) || [];
  const sortArray = sort?.split(",").filter(Boolean) || [];

  const query = useRoadmaps({ filter: filterArray, sort: sortArray });

  return (
    <div className="min-h-dvh p-5 md:p-20 bg-light-bg dark:bg-dark-bg">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <div className="flex flex-row justify-end gap-4">
            <FilterSort filter={filterArray} sort={sortArray} />
          </div>
        </div>

        <Suspense fallback={<RoadmapFallback />}>
          <RoadmapList query={query} />
        </Suspense>
      </div>
    </div>
  );
}
