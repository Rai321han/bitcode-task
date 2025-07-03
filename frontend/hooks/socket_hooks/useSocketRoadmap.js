import socket from "@/libs/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useSocketRoadmap(roadmapId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!roadmapId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const join = () => socket.emit("join_roadmap", roadmapId);
    const leave = () => socket.emit("leave_roadmap", roadmapId);

    ////// COMMENT EVENT ///////

    // getting new comment
    const handleNewComment = (comment) => {
      const key = comment.parentCommentId
        ? ["comments", comment.parentCommentId]
        : ["comments", roadmapId];

      const roadmapKey = ["roadmap", comment.roadmapId];

      // updating the list
      queryClient.setQueryData(key, (old = []) => {
        if (old.some((c) => c._id === comment._id)) {
          return old;
        }
        const newComments = [...old, { ...comment }];
        return newComments;
      });

      queryClient.setQueryData(roadmapKey, (old) => {
        return {
          ...old,
          comments: old.comments + 1,
        };
      });

      // updating the single comment cache
      queryClient.setQueryData(["comment", comment._id], comment);

      // for reply
      if (comment.parentCommentId) {
        queryClient.setQueryData(
          ["comment", comment.parentCommentId],
          (parentComment) =>
            parentComment
              ? {
                  ...parentComment,
                  hasChild: true,
                }
              : parentComment
        );
      }
    };

    // getting comment edit
    const handleEditComment = (updatedComment) => {
      const key = updatedComment?.parentCommentId
        ? ["comments", updatedComment.parentCommentId]
        : ["comments", updatedComment.roadmapId];

      queryClient.setQueryData(key, (old = []) =>
        old.map((c) => (c._id === updatedComment._id ? updatedComment : c))
      );

      queryClient.setQueryData(["comment", updatedComment._id], updatedComment);
    };

    // TODO - getting comment delete
    const handleDeleteComment = (comment) => {};

    // getting comment like
    const handleLikeComment = ({ commentId, likerId }) => {
      const key = ["comment", commentId];
      queryClient.setQueryData(key, (comment) => {
        if (!comment) return comment;

        return {
          ...comment,
          likes: comment.likes + 1,
          likers: [...comment.likers, likerId],
        };
      });
    };

    const handleUnlikeComment = ({ commentId, unlikerId }) => {
      const commentKey = ["comment", commentId];
      queryClient.setQueryData(commentKey, (comment) => {
        if (!comment) return comment;
        return {
          ...comment,
          likes: Math.max(comment.likes - 1, 0),
          likers: comment.likers.filter((id) => id !== unlikerId),
        };
      });
    };

    // getting roadmap upvote
    const handleUpvoteRoadmap = ({ roadmapId, upvoterId }) => {
      const key = ["roadmap", roadmapId];
      queryClient.setQueryData(key, (roadmap) => {
        if (!roadmap || !upvoterId) return roadmap;
        const hasUpvoted = roadmap.likers.includes(upvoterId);
        return {
          ...roadmap,
          upvotes: hasUpvoted ? roadmap.upvotes - 1 : roadmap.upvotes + 1,
          likers: hasUpvoted
            ? roadmap.likers.filter((u) => u !== upvoterId)
            : [...roadmap.likers, upvoterId],
        };
      });
    };

    // getting roadmap upvote
    const handleRemoveUpvoteRoadmap = ({ roadmapId, upvoterId }) => {
      const key = ["roadmap", roadmapId];
      queryClient.setQueryData(key, (roadmap) => {
        if (!roadmap || !upvoterId) return roadmap;
        return {
          ...roadmap,
          upvotes: Math.max(roadmap.upvotes - 1, 0),
          likers: roadmap.likers.filter((u) => u !== upvoterId),
        };
      });
    };

    // If already connected, join room immediately
    if (socket.connected) join();
    else socket.on("connect", join);

    socket.on("new_comment", handleNewComment);
    socket.on("edit_comment", handleEditComment);
    socket.on("delete_comment", handleDeleteComment);
    socket.on("like_comment", handleLikeComment);
    socket.on("unlike_comment", handleUnlikeComment);
    socket.on("upvote_roadmap", handleUpvoteRoadmap);
    socket.on("remove_upvote_roadmap", handleRemoveUpvoteRoadmap);

    return () => {
      socket.off("connect", join);
      socket.off("new_comment", handleNewComment);
      socket.off("edit_comment", handleEditComment);
      socket.off("delete_comment", handleDeleteComment);
      socket.off("like_comment", handleLikeComment);
      socket.off("unlike_comment", handleUnlikeComment);
      socket.off("upvote_roadmap", handleUpvoteRoadmap);
      socket.off("remove_upvote_roadmap", handleRemoveUpvoteRoadmap);

      leave();
    };
  }, [roadmapId, queryClient]);

  return socket;
}
