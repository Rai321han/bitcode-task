import { BiComment, BiUpvote } from "react-icons/bi";
import Badge from "../Badge";
import Milestone from "./Milestone";
import Link from "next/link";

export default function Feature({ data }) {
  const { feature, status, upvotes, comments, milestones } = data;
  return (
    <Link
      href={`/roadmap/features/${data._id}`}
      className="hover:outline hover:outline-blue-300 p-4  gap-2 w-full max-w-[400px] bg-light-bg dark:bg-dark-bg flex flex-col items-start  rounded-md"
    >
      {/* <div > */}
      <div className="rounded-sm">
        <p className="text-light-title dark:text-dark-title text-md">
          {feature}
        </p>
      </div>
      <Badge type={status} />
      <div className="flex flex-row justify-between w-full">
        <div className="text-light-opacity dark:text-dark-opacity text-sm">
          {milestones.length === 0
            ? "No milestones"
            : `${milestones.length} milestones`}
        </div>
        <div className="flex flex-row gap-2 text-light-icon dark:text-dark-icon">
          <div className="flex flex-row gap-0.5 text-sm items-center">
            <p>{upvotes}</p>
            <BiUpvote className="fill-light-icon dark:fill-dark-icon" />
          </div>
          <div className="flex flex-row gap-0.5 text-sm items-center">
            <p>{comments}</p>
            <BiComment className="fill-light-icon dark:fill-dark-icon" />
          </div>
        </div>
      </div>
      <div className="mt-3">
        {milestones.map((milestone) => (
          <Milestone key={milestone.title} milestone={milestone} />
        ))}
      </div>
      {/* </div> */}
    </Link>
  );
}
