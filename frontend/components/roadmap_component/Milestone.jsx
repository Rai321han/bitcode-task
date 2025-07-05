import { MdOutlineTaskAlt } from "react-icons/md";

export default function Milestone({ milestone }) {
  const { title, status } = milestone;
  return (
    <div className="flex py-0.5 items-center flex-row gap-2 border-t-1 border-light-line dark:border-dark-line">
      <div>
        <MdOutlineTaskAlt
          className={`${
            status === "completed"
              ? "fill-green-400"
              : "fill-light-icon dark:fill-dark-icon"
          }`}
        />
      </div>
      <div className="text-sm text-light-opacity dark:text-dark-opacity truncate overflow-hidden">
        {title}
      </div>
    </div>
  );
}
