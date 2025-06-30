import { use } from "react";
import Roadmap from "./Roadmap";

// const { useRoadmaps } = require("@/hooks/useRoadmaps");

export default function RoadmapList({ query }) {
  const roadmapData = use(query.promise);

  //   if (error) {
  //     return (
  //       <div className="flex flex-col items-center bg-[#f4f4f4] rounded-lg p-5">
  //         <p className="text-red-500">Error: {error.message}</p>
  //       </div>
  //     );
  //   }

  //   const roadmapData = Array.isArray(data) ? data : [];

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
