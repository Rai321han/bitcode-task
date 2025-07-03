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

export default function CommentSection({ roadmap, socket }) {
  const [selectComment, setSelectComment] = useState(null);
  // const socket = useSocketComment(roadmap._id);
  const { user } = useAuth();
  const { likeComment } = useLikeComment();
  const { unlikeComment } = useUnlikeComment();
  const { makeComment } = useMakeComment();
  const { editComment } = useEditComment();

  const {
    data: comments = [],
    status,
    isError,
  } = useQuery({
    queryKey: ["comments", roadmap._id],
    queryFn: async () =>
      await getComments({ roadmapId: roadmap._id, parentCommentId: null }),
    retry: 2,
    enabled: !!roadmap._id,
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
            roadmapId: roadmap._id,
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
            roadmapId: roadmap._id,
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
            roadmapId: savedComment.roadmapId,
            comment: savedComment,
          });
          setSelectComment(null);
        },
      }
    );
  }, 300);

  return (
    <>
      <div className="relative w-full flex flex-col gap-3 mb-5">
        <div className="border-t-2 border-t-gray-400 mt-3"></div>
        <div className="h-[70vh] flex flex-col w-full">
          <div
            className="px-2 [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-white
  [&::-webkit-scrollbar-thumb]:bg-gray-200 w-full pb-5 flex flex-col gap-3 rounded-md lg:max-w-[500px]  overflow-scroll overflow-x-auto"
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
                  isOptimistic={comment?.isOptimistic || false}
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
            <CommentBox onSubmit={handleCommentSubmit} buttonName="Comment" />
          </div>
        </div>
      </div>
    </>
  );
}
