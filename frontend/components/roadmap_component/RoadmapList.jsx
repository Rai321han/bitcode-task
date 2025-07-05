import { use } from "react";
import Roadmap from "./Roadmap";

export default function RoadmapList({ query }) {
  const roadmapData = use(query.promise);
  4;
  return (
    <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr] xl:grid-cols-[1fr_1fr_1fr_1fr] gap-3.5 bg-light-fg dark:bg-dark-fg rounded-lg p-5 md:p-10">
      {roadmapData.length === 0 ? (
        <p>No roadmaps available</p>
      ) : (
        roadmapData.map((roadmap) => (
          <Roadmap key={roadmap._id} data={roadmap} />
        ))
      )}
    </div>
  );
}
