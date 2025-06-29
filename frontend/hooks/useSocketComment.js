import socket from "@/libs/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useSocketComment(roadmapId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!roadmapId) return;

    if (!socket.connected) {
      socket.connect();
    }

    // Wait for connection before joining room
    const handleConnect = () => {
      socket.emit("join_roadmap", roadmapId);
    };

    // Join roadmap room
    socket.emit("join_roadmap", roadmapId);

    const handleNewComment = (comment) => {
      const key = comment.parentCommentId
        ? ["comments", comment.parentCommentId]
        : ["comments", roadmapId];

      // updating the list
      queryClient.setQueryData(key, (old = []) => {
        if (old.some((c) => c._id === comment._id)) {
          return old;
        }
        const newComments = [...old, { ...comment }];
        return newComments;
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

    socket.on("connect", handleConnect);
    socket.on("new_comment", handleNewComment);

    // If already connected, join room immediately
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect");
      socket.off("new_comment", handleNewComment);
      socket.emit("leave_roadmap", roadmapId);
    };
  }, [roadmapId, queryClient]);

  return socket;
}
