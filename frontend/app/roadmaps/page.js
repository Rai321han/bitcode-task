"use client";

import FilterSort from "@/components/FilterSort";
import { Suspense, use } from "react";
import RoadmapList from "@/components/roadmap_component/RoadmapList";
import RoadmapFallback from "@/components/roadmap_component/RoadmapFallback";
import { useRoadmaps } from "@/hooks/roadmap_hooks/useRoadmaps";

export default function RoadmapsPage({ searchParams }) {
  const { filter, sort } = use(searchParams);
  const filterArray = filter?.split(",") || [];
  const sortArray = sort?.split(",") || [];

  const query = useRoadmaps({ filter: filterArray, sort: sortArray });

  return (
    <div className="min-h-dvh p-5 md:p-20 bg-light-bg dark:bg-dark-bg">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <div className="flex flex-row justify-end gap-4">
            <FilterSort filter={filterArray} sort={sortArray} />
          </div>
        </div>

        {/* <div className="grid col-auto bg-light-fg dark:bg-dark-fg rounded-lg p-5"> */}
        <Suspense fallback={<RoadmapFallback />}>
          <RoadmapList query={query} />
        </Suspense>
        {/* </div> */}
      </div>
    </div>
  );
}
