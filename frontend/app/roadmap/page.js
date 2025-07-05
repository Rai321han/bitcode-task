"use client";

import FilterSort from "@/components/FilterSort";
import { Suspense, use } from "react";
import FeatureList from "@/components/feature_component/FeatureList";
import FeatureFallback from "@/components/feature_component/FeatureFallback";
import { useFeatures } from "@/hooks/feature_hooks/useFeatures";
import { useSearchParams } from "next/navigation";

export default function RoadmapPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "";
  const sort = searchParams.get("sort") || "";
  const filterArray = filter?.split(",").filter(Boolean) || [];
  const sortArray = sort?.split(",").filter(Boolean) || [];

  const query = useFeatures({ filter: filterArray, sort: sortArray });

  return (
    <div className="min-h-dvh p-5 md:p-20 bg-light-bg dark:bg-dark-bg">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <div className="flex flex-row justify-end gap-4">
            <FilterSort filter={filterArray} sort={sortArray} />
          </div>
        </div>

        <Suspense fallback={<FeatureFallback />}>
          <FeatureList query={query} />
        </Suspense>
      </div>
    </div>
  );
}
