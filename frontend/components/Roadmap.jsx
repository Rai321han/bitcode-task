//  {
//     feature: "User authentication",
//     status: "In progress",
//     upvotes: 5,
//     comments: 2,
//     milestones: [
//       { title: "Identify auth approach", status: "completed" },
//       { title: "Implement registration", status: "incompleted" },
//       { title: "Implement login", status: "incompleted" },
//       { title: "Test auth", status: "incompleted" },
//     ],
//   },
import { BiComment, BiUpvote } from "react-icons/bi";
import Badge from "./Badge";
import Milestone from "./Milestone";
import Link from "next/link";

export default function Roadmap({ data }) {
  const { feature, status, upvotes, comments, milestones } = data;
  return (
    <Link
      href={"#"}
      className="border hover:outline hover:outline-blue-300 p-4 border-gray-200 gap-2 w-[350px] bg-white flex flex-col items-start shadow-md rounded-md"
    >
      {/* <div > */}
      <div className="rounded-sm">
        <p className="text-gray-600 text-md">{feature}</p>
      </div>
      <Badge type={status} />
      <div className="flex flex-row justify-between w-full">
        <div className="text-gray-400 text-sm">
          {milestones.length === 0
            ? "No milestones"
            : `${milestones.length} milestones`}
        </div>
        <div className="flex flex-row gap-1 text-gray-500">
          <div className="flex flex-row text-sm items-center">
            {upvotes} <BiUpvote />
          </div>
          <div className="flex flex-row text-sm items-center">
            {comments} <BiComment />
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
