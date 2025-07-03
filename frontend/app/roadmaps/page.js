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
    <div className="md:mt-5 md:mx-16 min-h-[90vh]">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex flex-row justify-end gap-4">
            <FilterSort filter={filterArray} sort={sortArray} />
          </div>
          <div className="mx-auto">
            <div className="bg-primary px-4 tracking-wide py-2 text-white rounded-t-2xl">
              <h1 className="text-xl  font-bold capitalize">ROADMAPS</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-3.5 bg-[#f4f4f4] rounded-lg p-5">
          <Suspense fallback={<RoadmapFallback />}>
            <RoadmapList query={query} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
