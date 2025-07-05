import socket from "@/libs/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

function dfsNestedDelete(commentId, queryClient) {
  const replies = queryClient.getQueryData(["comments", commentId]);
  const hasChild = Array.isArray(replies) && replies.length > 0;

  let res = 1;
  if (hasChild) {
    for (const comment of replies) {
      res = res + dfsNestedDelete(comment._id, queryClient);
    }

    queryClient.removeQueries({
      queryKey: ["comments", commentId],
      exact: true,
    });
  }

  queryClient.removeQueries({ queryKey: ["comment", commentId], exact: true });
  return res;
}

export default function useSocketFeature(featureId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!featureId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const join = () => socket.emit("join_feature", featureId);
    const leave = () => socket.emit("leave_feature", featureId);

    ////// COMMENT EVENT ///////

    // getting new comment
    const handleNewComment = (comment) => {
      const key = comment.parentCommentId
        ? ["comments", comment.parentCommentId]
        : ["comments", featureId];

      const featureKey = ["feature", comment.featureId];

      // updating the list
      queryClient.setQueryData(key, (old = []) => {
        if (old.some((c) => c._id === comment._id)) {
          return old;
        }
        const newComments = [...old, { ...comment }];
        return newComments;
      });

      queryClient.setQueryData(featureKey, (old) => {
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
        : ["comments", updatedComment.featureId];

      queryClient.setQueryData(key, (old = []) =>
        old.map((c) => (c._id === updatedComment._id ? updatedComment : c))
      );

      queryClient.setQueryData(["comment", updatedComment._id], updatedComment);
    };

    // TODO - getting comment delete
    const handleDeleteComment = ({ comment }) => {
      const deletionsCount = dfsNestedDelete(comment._id, queryClient);
      const featureKey = ["feature", comment.featureId];
      const parentCommentId = comment.parentCommentId;
      queryClient.setQueryData(featureKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: Math.max(0, old.comments - deletionsCount),
        };
      });

      if (parentCommentId) {
        queryClient.setQueryData(["comments", parentCommentId], (old) => {
          if (!old) return old;
          return old.filter((c) => c._id !== comment._id);
        });

        const remainingReplies = queryClient.getQueryData([
          "comments",
          parentCommentId,
        ]);

        const stillHasChildren =
          Array.isArray(remainingReplies) && remainingReplies.length > 0;

        if (!stillHasChildren) {
          queryClient.setQueryData(["comment", parentCommentId], (old) => {
            return old ? { ...old, hasChild: false } : old;
          });
        }
      } else {
        queryClient.setQueryData(["comments", comment.featureId], (old) => {
          if (!old) return old;
          return old.filter((c) => c._id !== comment._id);
        });
      }
    };

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

    // getting feature upvote
    const handleUpvoteFeature = ({ featureId, upvoterId }) => {
      const key = ["feature", featureId];
      queryClient.setQueryData(key, (feature) => {
        if (!feature || !upvoterId) return feature;
        const hasUpvoted = feature.likers.includes(upvoterId);
        return {
          ...feature,
          upvotes: hasUpvoted ? feature.upvotes - 1 : feature.upvotes + 1,
          likers: hasUpvoted
            ? feature.likers.filter((u) => u !== upvoterId)
            : [...feature.likers, upvoterId],
        };
      });
    };

    // getting feature upvote
    const handleRemoveUpvoteFeature = ({ featureId, upvoterId }) => {
      const key = ["feature", featureId];
      queryClient.setQueryData(key, (feature) => {
        if (!feature || !upvoterId) return feature;
        return {
          ...feature,
          upvotes: Math.max(feature.upvotes - 1, 0),
          likers: feature.likers.filter((u) => u !== upvoterId),
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
    socket.on("upvote_feature", handleUpvoteFeature);
    socket.on("remove_upvote_feature", handleRemoveUpvoteFeature);

    return () => {
      socket.off("connect", join);
      socket.off("new_comment", handleNewComment);
      socket.off("edit_comment", handleEditComment);
      socket.off("delete_comment", handleDeleteComment);
      socket.off("like_comment", handleLikeComment);
      socket.off("unlike_comment", handleUnlikeComment);
      socket.off("upvote_feature", handleUpvoteFeature);
      socket.off("remove_upvote_feature", handleRemoveUpvoteFeature);

      leave();
    };
  }, [featureId, queryClient]);

  return socket;
}
