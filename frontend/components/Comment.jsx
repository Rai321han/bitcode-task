"use client";

import { getComments } from "@/actions/comments";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Comment({ comment }) {
  const [showReplies, setShowReplies] = useState(false);

  const { data: replies = [], isPending } = useQuery({
    queryKey: ["comments", comment.roadmapId, comment._id],
    queryFn: () =>
      getComments({
        roadmapId: comment.roadmapId,
        parentCommentId: comment._id,
      }),
    enabled: showReplies, // Only fetch when expanded
  });

  return (
    <div className="flex flex-col justify-end">
      <div
        key={comment._id}
        className="p-3 text-gray-700 text-sm flex flex-col gap-1 justify-start bg-gray-100 rounded-md"
      >
        <div className="flex flex-row gap-1.5">
          <div className="w-[20px] h-[20px] bg-gray-300 rounded-full"></div>
          <div className="text-sm font-semibold">{comment.commenterName}</div>
        </div>
        <div>{comment.content}</div>
        <div className="flex flex-row text-xs justify-end gap-3">
          <button
            // onClick={() => setIsOpen(true)}
            className="cursor-pointer"
          >
            Reply
          </button>
          <button className="flex flex-row gap-1 cursor-pointer">
            <div className="font-semibold">{comment.likes}</div>
            <div>Likes</div>
          </button>
        </div>
      </div>
      {comment.children.length > 0 && (
        <div className="text-right">
          <button
            onClick={() => setShowReplies((prev) => !prev)}
            className="text-sm text-right cursor-pointer  px-2 text-gray-600"
          >
            {showReplies ? "Hide replies" : "View replies"}
          </button>
        </div>
      )}
      {showReplies && (
        <div className="ml-4 mt-2 pl-2 relative border-l-1 border-gray-300">
          {isPending ? (
            <p className="text-xs text-gray-400">Loading replies...</p>
          ) : (
            replies.map((reply) => <Comment key={reply._id} comment={reply} />)
          )}
        </div>
      )}
    </div>
  );
}
