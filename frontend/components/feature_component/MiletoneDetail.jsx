import { MdOutlineTaskAlt } from "react-icons/md";

export default function MiletoneDetail({ milestones }) {
  let completed = 0;
  if (milestones.length > 0) {
    milestones.map((milestone) => {
      if (milestone.status === "completed") completed += 1;
    });
  }
  return (
    <>
      <div className="font-semibold text-light-title dark:text-dark-title">
        {milestones.length > 0
          ? `Milestone (${completed} / ${milestones.length})`
          : "No milestones"}
      </div>
      <div className="flex flex-col">
        {milestones.map((milestone) => (
          <div
            key={milestone.title}
            className={`cursor-pointer pt-3 pb-0 border-l-2 ${
              milestone.status === "completed"
                ? "border-green-300"
                : "border-light-line dark:border-dark-line"
            } relative  pl-5 flex flex-row `}
          >
            <p
              className={`${
                milestone.status === "completed"
                  ? "text-light-body dark:text-dark-body"
                  : "text-light-opacity dark:text-dark-opacity"
              } -mb-1.5`}
            >
              {milestone.title}
            </p>
            <div className="absolute -translate-x-1/2 bg-light-fg dark:bg-dark-fg rounded-full left-0 top-1/2 ">
              <MdOutlineTaskAlt
                className={`${
                  milestone.status === "completed"
                    ? "fill-green-400"
                    : "fill-light-icon dark:fill-dark-icon"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
