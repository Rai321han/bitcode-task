import { MdOutlineTaskAlt } from "react-icons/md";

export default function MiletoneDetail({ milestones }) {
  let remains = 0;
  if (milestones.length > 0) {
    milestones.map((milestone) => {
      if (milestone.status === "incompleted") remains += 1;
    });
  }
  return (
    <>
      <div className="font-semibold text-gray-600">
        {milestones.length > 0
          ? `Milestone (${remains} / ${milestones.length})`
          : "No milestones"}
      </div>
      <div className="flex flex-col">
        {milestones.map((milestone) => (
          <div
            key={milestone.title}
            className={`cursor-pointer py-1.5 border-l-2 ${
              milestone.status === "completed"
                ? "border-green-300"
                : "border-gray-500"
            } relative  pl-5 flex flex-row`}
          >
            <p
              className={`${
                milestone.status === "completed"
                  ? "text-gray-800"
                  : "text-gray-500"
              }`}
            >
              {milestone.title}
            </p>
            <div className="absolute -translate-x-1/2 bg-white rounded-full left-0 top-1/2 -translate-y-1/2">
              <MdOutlineTaskAlt
                className={`${
                  milestone.status === "completed"
                    ? "fill-green-400"
                    : "fill-gray-500"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
