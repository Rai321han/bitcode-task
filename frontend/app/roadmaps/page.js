import Roadmap from "@/components/Roadmap";
import FilterSort from "@/components/FilterSort";
import getRoadmaps from "@/libs/getRoadmaps";

export default async function RoadmapsPage({ searchParams }) {
  const awaitedSearchParams = await searchParams;
  const filterArray = awaitedSearchParams.filter?.split(",") || [];
  const sortArray = awaitedSearchParams.sort?.split(",") || [];
  const data = await getRoadmaps({
    filter: filterArray,
    sort: sortArray,
  });

  const roadmapData = data?.roadmaps;


  return (
    <div className="mt-5 mx-16">
      <div className="flex flex-col gap-5">
        <div className="mb-5">
          <h1 className="text-2xl text-gray-500 font-extrabold capitalize">
            ROADMAPS
          </h1>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <FilterSort filter={filterArray} sort={sortArray} />
        </div>
        <div className="flex flex-row flex-wrap gap-3.5 bg-gray-100 rounded-lg p-5">
          {roadmapData?.map((roadmap) => (
            <Roadmap key={roadmap._id} data={roadmap} />
          ))}
        </div>
      </div>
    </div>
  );
}
