import { MdOutlineTaskAlt } from "react-icons/md";

export default function Milestone({ milestone }) {
  const { title, status } = milestone;
  return (
    <div className="flex py-0.5 items-center flex-row gap-2 border-t-1 border-gray-200">
      <div>
        <MdOutlineTaskAlt
          className={`${
            status === "completed" ? "fill-green-400" : "fill-gray-500"
          }`}
        />
      </div>
      <div className="text-sm text-gray-500 truncate overflow-hidden">
        {title}
      </div>
    </div>
  );
}
