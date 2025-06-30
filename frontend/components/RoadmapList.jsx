import { use } from "react";
import Roadmap from "./Roadmap";


export default function RoadmapList({ query }) {
  const roadmapData = use(query.promise);
4
  return (
    <div className="flex flex-row flex-wrap gap-3.5 bg-[#f4f4f4] rounded-lg p-5">
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
