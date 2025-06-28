"use client";

import { getCommentById, getComments, LikeComment } from "@/actions/comments";
import { useAuth } from "@/app/providers/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Comment({ commentId, onReply, onLike, onUnlike }) {
  const [showReplies, setShowReplies] = useState(false);
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { data: comment, status: commentStatus } = useQuery({
    queryKey: ["comment", commentId],
    queryFn: () => getCommentById({ commentId }),
    enabled: !!commentId,
  });

  const {
    data: replies,
    status: replyStatus,
    isPending: repliesPending,
  } = useQuery({
    queryKey: ["comments", commentId],
    queryFn: () =>
      getComments({
        roadmapId: comment?.roadmapId,
        parentCommentId: commentId,
      }),
    enabled: showReplies && !!comment?.roadmapId, // only run when button is clicked and roadmapId is available
  });

  useEffect(() => {
    if (replyStatus === "success" && replies) {
      replies.forEach((reply) => {
        queryClient.setQueryData(["comment", reply._id], reply);
      });
    }
  }, [replyStatus, replies, queryClient]);

  if (commentStatus === "pending") {
    return (
      <div className="text-sm text-gray-400 italic">Loading comment...</div>
    );
  }

  if (commentStatus === "error") {
    return (
      <div>
        <div className="text-sm text-red-400 italic">
          Failed to load comment
        </div>
      </div>
    );
  }

  const hasLiked = comment?.likers?.includes(user.id);

  function handleOnClick() {
    if (comment.likers.includes(user.id)) onUnlike(commentId);
    else onLike(commentId);
  }

  if (!comment) {
    return (
      <div className="w-full rounded-md bg-gray-300 p-10 animate-pulse"></div>
    );
  }

  return (
    <div className={`flex flex-col justify-end ${!comment.hasChild && "mb-3"}`}>
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
          <button onClick={() => onReply(comment)} className="cursor-pointer">
            Reply
          </button>
          <button
            className={`flex flex-row gap-1 cursor-pointer ${
              hasLiked && "text-blue-500"
            }`}
            onClick={handleOnClick}
          >
            <div className="font-semibold">{comment.likes}</div>
            <div>Likes</div>
          </button>
        </div>
      </div>
      {comment.hasChild && (
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
          {repliesPending ? (
            <p className="text-xs text-gray-400">Loading replies...</p>
          ) : (
            replies.map((reply) => (
              <Comment
                key={reply._id}
                commentId={reply._id}
                onLike={onLike}
                onUnlike={onUnlike}
                onReply={onReply}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
