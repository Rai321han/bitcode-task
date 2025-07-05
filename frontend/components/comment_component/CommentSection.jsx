"use client";
import { BiComment, BiUpvote } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import { LuCornerUpRight } from "react-icons/lu";
import CommentBox from "@/components/comment_component/CommentBox";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";

import Comment from "./Comment";
import { useState } from "react";
import useLikeComment from "@/hooks/comment_hooks/useLikeComment";
import useUnlikeComment from "@/hooks/comment_hooks/useUnlikeComment";
import useMakeComment from "@/hooks/comment_hooks/useMakeComment";
import { useAuth } from "@/app/providers/AuthProvider";
// import useSocketComment from "@/hooks/useSocketComment";
import { getComments } from "@/actions/comments";
import useEditComment from "@/hooks/comment_hooks/useEditComment";
import useDeleteComment from "@/hooks/comment_hooks/useDeleteComment";

export default function CommentSection({ feature, socket }) {
  const [selectComment, setSelectComment] = useState(null);
  // const socket = useSocketComment(feature._id);
  const { user } = useAuth();
  const { likeComment } = useLikeComment();
  const { unlikeComment } = useUnlikeComment();
  const { makeComment } = useMakeComment();
  const { editComment } = useEditComment();
  const { deleteComment } = useDeleteComment();

  const {
    data: comments = [],
    status,
    isError,
  } = useQuery({
    queryKey: ["comments", feature._id],
    queryFn: async () =>
      await getComments({ featureId: feature._id, parentCommentId: null }),
    retry: 2,
    enabled: !!feature._id,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return (
      <div className="p-3 bg-red-200 text-red-700 text-sm rounded-md">
        Error while getting comment data
      </div>
    );
  }

  let rootComments = comments || [];

  const handleCommentLike = debounce((commentId) => {
    likeComment(
      {
        commentId,
        likerId: user.id,
      },
      {
        onSuccess: ({ commentId, likerId }) => {
          socket.emit("like_comment", {
            featureId: feature._id,
            commentId,
            likerId,
          });
        },
      }
    );
  }, 200);

  const handleCommentUnlike = debounce((commentId) => {
    unlikeComment(
      {
        commentId,
        unlikerId: user.id,
      },
      {
        onSuccess: ({ commentId, unlikerId }) => {
          socket.emit("unlike_comment", {
            featureId: feature._id,
            commentId,
            unlikerId,
          });
        },
      }
    );
  }, 200);

  const handleCommentSubmit = debounce((text) => {
    makeComment(
      {
        featureId: feature._id,
        content: text,
        parentComment: selectComment || null,
      },
      {
        onSuccess: (savedComment) => {
          socket.emit("new_comment", {
            featureId: savedComment.featureId,
            comment: savedComment,
          });
          setSelectComment(null);
        },
      }
    );
  }, 300);

  const handleEditComment = debounce((comment, content) => {
    editComment(
      {
        comment,
        content,
      },
      {
        onSuccess: (savedComment) => {
          socket.emit("new_comment", {
            featureId: savedComment.featureId,
            comment: savedComment,
          });
          setSelectComment(null);
        },
      }
    );
  }, 300);

  const handleDeleteComment = debounce((comment) => {
    deleteComment(
      {
        comment,
      },
      {
        onSuccess: (comment) => {
          socket.emit("delete_comment", {
            comment,
            featureId: comment.featureId,
          });
        },
      }
    );
  });

  return (
    <>
      <div className=" w-full flex flex-col gap-3 pt-2 bg-light-comment-container  dark:bg-dark-fg rounded-t-md rounded-b-lg">
        <div className="h-[70vh] flex flex-col w-full rounded-b-lg">
          <div
            className="px-2 [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-light-icon dark:[&::-webkit-scrollbar-track]:bg-dark-icon
  [&::-webkit-scrollbar-thumb]:bg-light-fg dark:[&::-webkit-scrollbar-thumb]:bg-dark-fg w-full pb-5 flex flex-col gap-3 rounded-md lg:max-w-[500px]  overflow-scroll overflow-x-auto"
          >
            {status === "success" &&
              rootComments?.map((comment) => (
                <Comment
                  nested={1}
                  key={comment._id}
                  commentId={comment._id}
                  onLike={handleCommentLike}
                  onUnlike={handleCommentUnlike}
                  onReply={setSelectComment}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  isOptimistic={comment?.isOptimistic || false}
                />
              ))}
          </div>
          <div
            // ref={commentBoxRef}
            className="mt-auto  w-full rounded-xl"
            id="comment"
          >
            <div className="flex flex-row gap-1 items-center px-2 py-1  -mb-1 rounded-md">
              {selectComment && (
                <>
                  <div>
                    <LuCornerUpRight />
                  </div>
                  <div className="text-sm text-light-opacity dark:text-dark-opacity w-fit">
                    Replying to{" "}
                    <span className="text-light-body dark:text-dark-opacity font-bold">
                      {user.id === selectComment.commenterId
                        ? "Myself"
                        : selectComment.commenterName}
                    </span>
                  </div>
                  <div
                    className="p-2 rounded-md"
                    onClick={() => setSelectComment(null)}
                  >
                    <RxCross1 />
                  </div>
                </>
              )}
            </div>
            <CommentBox onSubmit={handleCommentSubmit} buttonName="Comment" />
          </div>
        </div>
      </div>
    </>
  );
}
