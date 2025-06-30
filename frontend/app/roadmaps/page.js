import Roadmap from "@/components/Roadmap";
import FilterSort from "@/components/FilterSort";
import { getRoadmaps } from "@/actions/roadmaps";

export default async function RoadmapsPage({ searchParams }) {
  const awaitedSearchParams = await searchParams;
  const filterArray = awaitedSearchParams?.filter?.split(",") || [];
  const sortArray = awaitedSearchParams?.sort?.split(",") || [];
  const data = await getRoadmaps({
    filter: filterArray,
    sort: sortArray,
  });

  if (data?.error) {
    return (
      <div className="md:mt-5 md:mx-16 min-h-[90vh]">
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div className="flex flex-row justify-end gap-4">
              <FilterSort filter={filterArray} sort={sortArray} />
            </div>
            <div className="mx-auto">
              <div className="bg-primary px-4 tracking-wide py-2 text-white rounded-t-2xl">
                <h1 className="text-xl font-bold capitalize">ROADMAPS</h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-[#f4f4f4] rounded-lg p-5">
            <p className="text-red-500">Error: {data.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const roadmapData = Array.isArray(data) ? data : [];

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
          {roadmapData.length === 0 ? (
            <p>No roadmaps available</p>
          ) : (
            roadmapData.map((roadmap) => (
              <Roadmap key={roadmap._id} data={roadmap} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
