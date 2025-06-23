"use client";
import { BiComment, BiUpvote } from "react-icons/bi";
import CommentBox from "@/components/CommentBox";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/actions/comments";
import { VscLoading } from "react-icons/vsc";
import Comment from "./Comment";
export default function CommentSection({ roadmap }) {
  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ["comments", roadmap._id],
    queryFn: () =>
      getComments({ roadmapId: roadmap._id, parentCommentId: null }),
  });

  if (isPending) {
    return (
      <div className="flex flex-row justify-center items-center">
        <VscLoading className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-3 bg-red-200 text-red-700 text-sm rounded-md">
        Error while getting comment data
      </div>
    );
  }

  let rootComments = [];

  if (isSuccess) {
    const comments = data;
    comments.forEach((comment) => {
      if (comment.parentCommentId === null) rootComments.push(comment);
    });
  }

  const totalComments = data.length;
  return (
    <>
      <div className="w-full mt-10 md:mt-0 rounded-sm  justify-between gap-3 ">
        <div className="grid grid-cols-[1fr_2fr_1fr] justify-between w-full">
          <button className="hover:bg-gray-50 cursor-pointer flex flex-row items-center gap-1 border-1 border-gray-300 p-3 rounded-l-md">
            <BiUpvote className="fill-gray-500" />
            <p className="text-gray-500">{roadmap.upvotes}</p>
          </button>
          <Link
            href="#comment"
            className="hover:bg-gray-50 cursor-pointer text-center font-semibold text-gray-600 border-1 border-gray-300 p-3 "
          >
            Comments
          </Link>
          <button className="hover:bg-gray-50 cursor-pointer flex flex-row items-center gap-1 border-1 border-gray-300 p-3 rounded-r-md">
            <BiComment className="fill-gray-500" />
            <p className="text-gray-500">{totalComments}</p>
          </button>
        </div>
      </div>
      <div className="relative w-full flex flex-col gap-3 mb-5">
        <div className="border-t-2 border-t-gray-400 mt-3"></div>
        <div className="h-[70vh] flex flex-col w-full">
          <div
            className="px-2 [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-white
  [&::-webkit-scrollbar-thumb]:bg-gray-200 w-full pb-5 flex flex-col gap-3 rounded-md lg:max-w-[500px]  overflow-scroll overflow-x-auto"
          >
            {rootComments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>
          <div
            // ref={commentBoxRef}
            className="mt-auto  w-full rounded-xl"
            id="comment"
          >
            <CommentBox />
          </div>
          {/* {isOpen && (
          
          )} */}
        </div>
      </div>
    </>
  );
}
