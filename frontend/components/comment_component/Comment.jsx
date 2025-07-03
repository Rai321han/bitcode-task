"use client";

import { getCommentById, getComments, LikeComment } from "@/actions/comments";
import { useAuth } from "@/app/providers/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import CommentBox from "./CommentBox";

export default function Comment({
  nested,
  commentId,
  onReply,
  onLike,
  onUnlike,
  onEdit,
  isOptimistic = false,
}) {
  const [showReplies, setShowReplies] = useState(false);
  const queryClient = useQueryClient();
  const optionMenuRef = useRef(null);
  const optionDotRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isOptionOpen, setisOptionOpen] = useState(false);

  const { user } = useAuth();

  const { data: comment, status: commentStatus } = useQuery({
    queryKey: ["comment", commentId],
    queryFn: async () => await getCommentById({ commentId }),
    enabled: !!commentId && !isOptimistic,
    refetchOnWindowFocus: false,
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
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (replyStatus === "success" && replies) {
      replies.forEach((reply) => {
        queryClient.setQueryData(["comment", reply._id], reply);
      });
    }
  }, [replyStatus, replies]);

  useEffect(() => {
    function handleClickOutsideOption(e) {
      if (
        optionMenuRef.current &&
        !optionMenuRef.current.contains(e.target) &&
        optionDotRef.current &&
        !optionDotRef.current.contains(e.target)
      ) {
        setisOptionOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutsideOption);

    return () =>
      document.removeEventListener("mousedown", handleClickOutsideOption);
  }, []);

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

  function handleSubmit(text) {
    onEdit(comment, text);
    setIsEditMode(false);
    setisOptionOpen(false);
  }

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
      {isEditMode === false && (
        <div
          key={comment._id}
          className={`p-3 text-gray-700 text-sm flex flex-col gap-1 justify-start  bg-gray-100 rounded-md`}
        >
          <div className="flex flex-row gap-1.5 justify-between">
            <div className="flex flex-row gap-1.5">
              <div className="w-[20px] h-[20px] bg-gray-300 rounded-full"></div>
              <div className="text-sm font-semibold">
                {comment.commenterName}
              </div>
            </div>
            {user.id === comment.commenterId && (
              <div className="rounded-full relative">
                <div
                  ref={optionDotRef}
                  className="p-1"
                  onClick={() => setisOptionOpen((prev) => !prev)}
                >
                  <HiOutlineDotsHorizontal className="fill-gray-500 cursor-pointer" />
                </div>
                {isOptionOpen && (
                  <div
                    ref={optionMenuRef}
                    className="bg-transparent flex flex-col absolute top-6 right-0 shadow-md rounded-md text-gray-700"
                  >
                    <div
                      onClick={() => setIsEditMode(true)}
                      className="text-xs md:text-sm hover:bg-gray-100 bg-white cursor-pointer px-2 py-1 rounded-t-md"
                    >
                      edit
                    </div>
                    <div className="text-xs md:text-sm hover:bg-gray-100 cursor-pointer bg-white px-2 py-1 rounded-b-md">
                      delete
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="break-all">{comment.content}</div>
          <div className="flex flex-row text-xs justify-end gap-3">
            {nested < 3 && (
              <button
                onClick={() => onReply(comment)}
                className="cursor-pointer"
              >
                Reply
              </button>
            )}
            <button
              className={`flex flex-row gap-1 cursor-pointer ${
                hasLiked && "text-blue-500"
              }`}
              onClick={handleOnClick}
            >
              <div className="font-semibold">{comment.likes}</div>
              <div>{comment.likes > 1 ? "Likes" : "Like"}</div>
            </button>
          </div>
        </div>
      )}

      {isEditMode && (
        <div className="flex flex-col">
          <CommentBox onSubmit={handleSubmit} prefill={comment.content} />
          <div className="">
            <button
              className="text-sm mr-auto p-1 text-orange-500 cursor-pointer"
              onClick={() => {
                setIsEditMode(false);
                setisOptionOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
                nested={nested + 1}
                key={reply._id}
                commentId={reply._id}
                onLike={onLike}
                onUnlike={onUnlike}
                onEdit={onEdit}
                onReply={onReply}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
