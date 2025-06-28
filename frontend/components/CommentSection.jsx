"use client";
import { BiComment, BiUpvote } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import { LuCornerUpRight } from "react-icons/lu";
import CommentBox from "@/components/CommentBox";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments } from "@/actions/comments";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import useLikeComment from "@/hooks/useLikeComment";
import useUnlikeComment from "@/hooks/useUnlikeComment";
import useMakeComment from "@/hooks/useMakeComment";
import { useAuth } from "@/app/providers/AuthProvider";
import socket from "@/libs/socket";
import useSocket from "@/hooks/useSocket";

export default function CommentSection({ roadmap }) {
  const [selectComment, setSelectComment] = useState(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  useSocket(roadmap._id);
  const { likeComment } = useLikeComment();
  const { unlikeComment } = useUnlikeComment();
  const { makeComment } = useMakeComment();
  const {
    data: comments,
    status,
    isError,
  } = useQuery({
    queryKey: ["comments", roadmap._id],
    queryFn: () =>
      getComments({ roadmapId: roadmap._id, parentCommentId: null }),
  });

  useEffect(() => {
    if (!roadmap?._id) return;

    const handleNewComment = (comment) => {
      console.log("📥 Received new_comment via socket:", comment);
      const key = comment.parentCommentId
        ? ["comments", comment.parentCommentId]
        : ["comments", roadmap._id];

      console.log("Socket received new comment for key:", key);
      console.log("Old comments:", queryClient.getQueryData(key));

      queryClient.setQueryData(key, (old = []) => {
        if (old.some((c) => c._id === comment._id)) return old;
        const newComments = [...old, comment];
        console.log("New comments after adding:", newComments);
        return newComments;
      });

      // Update individual comment cache
      queryClient.setQueryData(["comment", comment._id], comment);
    };

    socket.on("new_comment", handleNewComment);

    return () => {
      socket.off("new_comment", handleNewComment);
    };
  }, [roadmap._id, queryClient]);

  useEffect(() => {
    if (status === "success" && comments) {
      comments.forEach((comment) => {
        queryClient.setQueryData(["comment", comment._id], comment);
      });
    }
  }, [status, comments, queryClient]);

  if (isError) {
    return (
      <div className="p-3 bg-red-200 text-red-700 text-sm rounded-md">
        Error while getting comment data
      </div>
    );
  }

  let totalComments = 0;
  let rootComments = [];
  if (comments) {
    totalComments = comments.length;
    rootComments = comments ?? [];
  }

  function handleCommentLike(commentId) {
    likeComment(commentId);
  }

  function handleCommentUnlike(commentId) {
    unlikeComment(commentId);
  }

  function handleCommentUnlike(commentId) {
    unlikeComment(commentId);
  }

  function handleCommentSubmit(text) {
    makeComment(
      {
        roadmapId: roadmap._id,
        content: text,
        parentCommentId: selectComment?._id || null,
      },
      {
        onSuccess: (savedComment) => {
          socket.emit("new_comment", {
            roadmapId: savedComment.roadmapId,
            comment: savedComment,
          });
          setSelectComment(null);
        },
      }
    );
  }

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
            {rootComments?.map((comment) => (
              <Comment
                key={comment._id}
                commentId={comment._id}
                onLike={handleCommentLike}
                onUnlike={handleCommentUnlike}
                onReply={setSelectComment}
              />
            ))}
          </div>
          <div
            // ref={commentBoxRef}
            className="mt-auto  w-full rounded-xl"
            id="comment"
          >
            <div className="flex flex-row gap-1 items-center px-2 py-1 bg-white -mb-1 rounded-md">
              {selectComment && (
                <>
                  <div>
                    <LuCornerUpRight />
                  </div>
                  <div className="text-sm text-gray-600  w-fit">
                    Replying to{" "}
                    <span className="text-gray-700 font-bold">
                      {user.id === selectComment.commenterId
                        ? "Myself"
                        : selectComment.commenterName}
                    </span>
                  </div>
                  <div
                    className="p-2 rounded-md hover:bg-amber-100"
                    onClick={() => setSelectComment(null)}
                  >
                    <RxCross1 />
                  </div>
                </>
              )}
            </div>
            <CommentBox onSubmit={handleCommentSubmit} />
          </div>
          {/* {isOpen && (
          
          )} */}
        </div>
      </div>
    </>
  );
}
